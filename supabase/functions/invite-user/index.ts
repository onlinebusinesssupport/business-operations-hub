import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_ROLES = ["admin", "client"];

function validateInput(body: Record<string, unknown>): string | null {
  const { email, full_name, role, company_name, services } = body;

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim()) || email.length > 255) {
    return "A valid email is required (max 255 characters).";
  }
  if (!full_name || typeof full_name !== "string" || full_name.trim().length === 0 || full_name.length > 200) {
    return "full_name is required (max 200 characters).";
  }
  if (role !== undefined && (typeof role !== "string" || !ALLOWED_ROLES.includes(role))) {
    return `role must be one of: ${ALLOWED_ROLES.join(", ")}`;
  }
  if (company_name !== undefined && (typeof company_name !== "string" || company_name.length > 200)) {
    return "company_name must be a string (max 200 characters).";
  }
  if (services !== undefined && (!Array.isArray(services) || services.length > 20 || services.some((s: unknown) => typeof s !== "string" || (s as string).length > 100))) {
    return "services must be an array of strings (max 20 items, each max 100 chars).";
  }
  return null;
}

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

    const body = await req.json();
    const validationError = validateInput(body);
    if (validationError) {
      return new Response(JSON.stringify({ error: validationError }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const email = (body.email as string).trim();
    const full_name = (body.full_name as string).trim();
    const company_name = body.company_name ? (body.company_name as string).trim() : "";
    const role = (body.role as string) || "client";
    const services = (body.services as string[]) || [];

    // Invite user
    const { data: inviteData, error: inviteError } =
      await adminClient.auth.admin.inviteUserByEmail(email, {
        data: { full_name, company_name },
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
      await adminClient.from("user_roles").upsert({
        user_id: userId,
        role,
      }, { onConflict: "user_id,role" });

      // If client role, create client record
      if (role === "client" && profileId) {
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
            services,
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
