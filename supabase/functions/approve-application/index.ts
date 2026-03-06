import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ONBOARDING_TASKS = [
  { title: "Complete your profile setup", description: "Fill in your personal and business details so your team can get started.", priority: "high" },
  { title: "Review your active studios", description: "Explore the studios assigned to your workspace and understand what's included.", priority: "medium" },
  { title: "Submit your first request", description: "Use the Requests module to tell your team what you need first.", priority: "medium" },
  { title: "Upload key brand assets", description: "Share logos, brand guidelines, or any files your team will need.", priority: "low" },
];

const STUDIO_MAP: Record<string, string> = {
  "Digital Presence": "digital-presence",
  "Lead Engine": "lead-engine",
  "Automation": "automation",
  "Operations": "operations",
  "Travel & Activities": "travel-activities",
  "Grants & Awards": "grants-awards",
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
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: roleData } = await adminClient
      .from("user_roles").select("role")
      .eq("user_id", callerUser.id).eq("role", "admin").maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { application_id, tier, monthly_rate } = body;

    if (!application_id || typeof application_id !== "string" || !UUID_REGEX.test(application_id)) {
      return new Response(JSON.stringify({ error: "A valid application_id (UUID) is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch the application
    const { data: application, error: appError } = await adminClient
      .from("applications").select("*").eq("id", application_id).single();

    if (appError || !application) {
      return new Response(JSON.stringify({ error: "Application not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (application.status === "approved") {
      return new Response(JSON.stringify({ error: "Application already approved" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!application.email || !EMAIL_REGEX.test(application.email)) {
      return new Response(JSON.stringify({ error: "Application has an invalid email address" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 1: Invite user
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
      if (!inviteError.message?.includes("already been registered")) {
        return new Response(JSON.stringify({ error: inviteError.message }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const userId = inviteData?.user?.id;
    let clientId: string | null = null;
    let tasksCreated = 0;
    const enabledStudios: string[] = [];

    // Step 2: Create client record and full infrastructure
    if (userId) {
      // Wait for profile to be created by the trigger
      let profileId: string | null = null;
      for (let i = 0; i < 5; i++) {
        const { data: profile } = await adminClient
          .from("profiles").select("id")
          .eq("user_id", userId).maybeSingle();
        if (profile) { profileId = profile.id; break; }
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (profileId) {
        // Ensure onboarding_completed is false
        await adminClient.from("profiles")
          .update({ onboarding_completed: false })
          .eq("id", profileId);

        // Determine enabled studios from areas_of_support
        const services = application.areas_of_support || [];
        services.forEach((s: string) => {
          if (!enabledStudios.includes(s)) enabledStudios.push(s);
        });

        // Create client workspace with tier and rate
        const selectedTier = tier || "standard";
        const selectedRate = monthly_rate || 0;
        const retainerLimits: Record<string, number> = {
          starter: 20, standard: 40, growth: 60, enterprise: 100,
        };

        const { data: clientRecord, error: clientError } = await adminClient
          .from("clients")
          .insert({
            name: `${application.business_name} Workspace`,
            contact_profile_id: profileId,
            status: "active",
            subscription_status: "active",
            tier: selectedTier,
            monthly_rate: selectedRate,
            retainer_limit: retainerLimits[selectedTier] || 40,
            retainer_used: 0,
            services: enabledStudios,
          })
          .select("id")
          .single();

        if (clientError) {
          console.error("Client creation error:", clientError);
        }

        clientId = clientRecord?.id || null;

        // Assign client role
        await adminClient.from("user_roles").insert({ user_id: userId, role: "client" });

        // Step 3: Create onboarding work items
        if (clientId) {
          const workItemInserts = ONBOARDING_TASKS.map((task) => ({
            client_id: clientId!,
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: "queued",
          }));

          const { data: createdItems } = await adminClient
            .from("work_items").insert(workItemInserts).select("id");
          tasksCreated = createdItems?.length || 0;

          // Step 4: Welcome update
          await adminClient.from("updates").insert({
            client_id: clientId,
            content: `Welcome to THE BUSINESS SUPPORT STUDIO™! Your workspace is live and your team is ready. Start by completing your profile and exploring your studios.`,
            update_type: "milestone",
            posted_by: callerUser.id,
          });

          // Step 5: Seed a welcome document
          await adminClient.from("documents").insert({
            client_id: clientId,
            name: "Welcome to SUPPORT STUDIO™ — Getting Started Guide",
            category: "shared",
            uploaded_by: callerUser.id,
          });

          // Step 6: Activity log
          await adminClient.from("activity_log").insert({
            client_id: clientId,
            actor_id: callerUser.id,
            action: "approved_application",
            entity_type: "application",
            entity_id: application_id,
            details: {
              summary: `Approved "${application.business_name}" — workspace created`,
              business_name: application.business_name,
              email: application.email,
              tasks_created: tasksCreated,
              tier: selectedTier,
              studios: enabledStudios,
            },
          });
        }
      }
    }

    // Step 7: Update application status
    await adminClient.from("applications")
      .update({ status: "approved" }).eq("id", application_id);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Application approved. Workspace created with ${tasksCreated} onboarding tasks.`,
        client_id: clientId,
        tasks_created: tasksCreated,
        enabled_studios: enabledStudios,
        tier: tier || "standard",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
