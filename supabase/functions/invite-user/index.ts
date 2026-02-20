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

    // Verify caller is admin
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: callerUser } } = await callerClient.auth.getUser();
    if (!callerUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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

    const { email, full_name, company_name, role, services } = await req.json();

    if (!email || !full_name) {
      return new Response(JSON.stringify({ error: "email and full_name required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Invite user
    const { data: inviteData, error: inviteError } =
      await adminClient.auth.admin.inviteUserByEmail(email, {
        data: {
          full_name,
          company_name: company_name || "",
        },
      });

    if (inviteError && !inviteError.message?.includes("already been registered")) {
      return new Response(JSON.stringify({ error: inviteError.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = inviteData?.user?.id;

    if (userId) {
      // Wait for profile trigger
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
        await new Promise((r) => setTimeout(r, 500));
      }

      // Assign role
      const assignRole = role || "client";
      await adminClient.from("user_roles").upsert({
        user_id: userId,
        role: assignRole,
      }, { onConflict: "user_id,role" });

      // If client role, create client record
      if (assignRole === "client" && profileId) {
        const { data: existingClient } = await adminClient
          .from("clients")
          .select("id")
          .eq("contact_profile_id", profileId)
          .maybeSingle();

        if (!existingClient) {
          await adminClient.from("clients").insert({
            name: company_name || `${full_name}'s Workspace`,
            contact_profile_id: profileId,
            status: "onboarding",
            services: services || [],
          });
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: `Invite sent to ${email}` }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
