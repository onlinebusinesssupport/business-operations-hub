import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the caller is an admin
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify caller is admin using their JWT
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user: callerUser },
    } = await callerClient.auth.getUser();

    if (!callerUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check admin role using service role client
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", callerUser.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get and validate the application ID from request body
    const body = await req.json();
    const { application_id } = body;

    if (!application_id || typeof application_id !== "string" || !UUID_REGEX.test(application_id)) {
      return new Response(
        JSON.stringify({ error: "A valid application_id (UUID) is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Fetch the application
    const { data: application, error: appError } = await adminClient
      .from("applications")
      .select("*")
      .eq("id", application_id)
      .single();

    if (appError || !application) {
      return new Response(
        JSON.stringify({ error: "Application not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (application.status === "approved") {
      return new Response(
        JSON.stringify({ error: "Application already approved" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate email from application before using it
    if (!application.email || !EMAIL_REGEX.test(application.email)) {
      return new Response(
        JSON.stringify({ error: "Application has an invalid email address" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Step 1: Create the auth user with invite (sends magic link email)
    const { data: inviteData, error: inviteError } =
      await adminClient.auth.admin.inviteUserByEmail(application.email, {
        data: {
          full_name: application.full_name || "",
          company_name: application.business_name || "",
          industry: application.industry || "",
          referral_source: "",
        },
      });

    if (inviteError) {
      // If user already exists, that's OK - just continue
      if (!inviteError.message?.includes("already been registered")) {
        return new Response(
          JSON.stringify({ error: inviteError.message }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    const userId = inviteData?.user?.id;

    // Step 2: If we got a user ID, create the client record
    if (userId) {
      let profileId: string | null = null;
      for (let i = 0; i < 5; i++) {
        const { data: profile } = await adminClient
          .from("profiles")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();

        if (profile) {
          profileId = profile.id;
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (profileId) {
        const { error: clientError } = await adminClient
          .from("clients")
          .insert({
            name: `${application.business_name} Workspace`,
            contact_profile_id: profileId,
            status: "active",
            services: application.areas_of_support || [],
          });

        if (clientError) {
          console.error("Client creation error:", clientError);
        }

        const { error: roleError } = await adminClient
          .from("user_roles")
          .insert({
            user_id: userId,
            role: "client",
          });

        if (roleError) {
          console.error("Role assignment error:", roleError);
        }
      }
    }

    // Step 3: Update application status to approved
    await adminClient
      .from("applications")
      .update({ status: "approved" })
      .eq("id", application_id);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Application approved successfully.",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
