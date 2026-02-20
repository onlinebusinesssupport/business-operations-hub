import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

    // Get the application ID from request body
    const { application_id } = await req.json();
    if (!application_id) {
      return new Response(
        JSON.stringify({ error: "application_id is required" }),
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

    // Step 1: Create the auth user with invite (sends magic link email)
    const { data: inviteData, error: inviteError } =
      await adminClient.auth.admin.inviteUserByEmail(application.email, {
        data: {
          full_name: application.full_name,
          company_name: application.business_name,
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
      // The handle_new_user trigger already creates a profile.
      // Wait a moment for the trigger to fire, then fetch the profile.
      // We'll use a small delay approach with retries.
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
        // Wait 500ms before retrying
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (profileId) {
        // Create the client record linked to the profile
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

        // Assign the 'client' role
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
        message: "Application approved. Invite sent to " + application.email,
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
