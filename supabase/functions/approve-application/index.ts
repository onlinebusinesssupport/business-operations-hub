import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_ONBOARDING_TASKS = [
  { title: "Complete your profile setup", description: "Fill in your personal and business details so your team can get started.", priority: "high" },
  { title: "Review your active studios", description: "Explore the studios assigned to your workspace and understand what's included.", priority: "medium" },
  { title: "Submit your first request", description: "Use the Requests module to tell your team what you need first.", priority: "medium" },
  { title: "Upload key brand assets", description: "Share logos, brand guidelines, or any files your team will need.", priority: "low" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

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

    // Load onboarding tasks from template (if customized) or use defaults
    let onboardingTasks = DEFAULT_ONBOARDING_TASKS;
    const { data: templateRow } = await adminClient
      .from("onboarding_templates")
      .select("tasks, brand_name, va_mode")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (templateRow && Array.isArray(templateRow.tasks) && templateRow.tasks.length > 0) {
      onboardingTasks = templateRow.tasks as typeof DEFAULT_ONBOARDING_TASKS;
    }

    // Step 1: Invite user with rich metadata
    const { data: inviteData, error: inviteError } =
      await adminClient.auth.admin.inviteUserByEmail(application.email, {
        data: {
          full_name: application.full_name || "",
          company_name: application.business_name || "",
          industry: application.industry || "",
          referral_source: "",
          phone: "",
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
    const preFilledFields: string[] = [];
    const missingFields: string[] = [];

    if (userId) {
      let profileId: string | null = null;
      for (let i = 0; i < 5; i++) {
        const { data: profile } = await adminClient
          .from("profiles").select("id")
          .eq("user_id", userId).maybeSingle();
        if (profile) { profileId = profile.id; break; }
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      if (profileId) {
        // Pre-populate profile from application data
        const profileUpdate: Record<string, any> = { first_login: true };

        if (application.full_name) {
          profileUpdate.full_name = application.full_name;
          preFilledFields.push("full_name");
        } else { missingFields.push("full_name"); }

        if (application.email) {
          profileUpdate.email = application.email;
          preFilledFields.push("email");
        } else { missingFields.push("email"); }

        if (application.business_name) {
          profileUpdate.company_name = application.business_name;
          preFilledFields.push("company_name");
        } else { missingFields.push("company_name"); }

        if (application.industry) {
          profileUpdate.industry = application.industry;
          preFilledFields.push("industry");
        } else { missingFields.push("industry"); }

        const essentialsComplete = !!application.full_name && !!application.business_name && !!application.industry;
        profileUpdate.onboarding_completed = essentialsComplete;

        await adminClient.from("profiles")
          .update(profileUpdate)
          .eq("id", profileId);

        const services = application.areas_of_support || [];
        services.forEach((s: string) => {
          if (!enabledStudios.includes(s)) enabledStudios.push(s);
        });

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

        if (clientError) console.error("Client creation error:", clientError);

        clientId = clientRecord?.id || null;
        await adminClient.from("user_roles").insert({ user_id: userId, role: "client" });

        if (clientId) {
          // Use template tasks
          const workItemInserts = onboardingTasks.map((task) => ({
            client_id: clientId!,
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: "queued",
          }));

          const { data: createdItems } = await adminClient
            .from("work_items").insert(workItemInserts).select("id");
          tasksCreated = createdItems?.length || 0;

          const brandName = templateRow?.brand_name || "THE BUSINESS SUPPORT STUDIO™";

          await adminClient.from("updates").insert({
            client_id: clientId,
            content: `Welcome to ${brandName}! Your workspace is live and your team is ready. Start by completing your profile and exploring your studios.`,
            update_type: "milestone",
            posted_by: callerUser.id,
          });

          await adminClient.from("documents").insert({
            client_id: clientId,
            name: `Welcome to ${brandName} — Getting Started Guide`,
            category: "shared",
            uploaded_by: callerUser.id,
          });

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
              pre_filled_fields: preFilledFields,
              missing_fields: missingFields,
              onboarding_skippable: essentialsComplete,
              template_used: !!templateRow,
            },
          });
        }
      }
    }

    await adminClient.from("applications")
      .update({ status: "approved" }).eq("id", application_id);

    const prefillPct = Math.round((preFilledFields.length / (preFilledFields.length + missingFields.length)) * 100) || 0;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Application approved. Workspace created with ${tasksCreated} onboarding tasks.`,
        client_id: clientId,
        tasks_created: tasksCreated,
        enabled_studios: enabledStudios,
        tier: tier || "standard",
        prefill_percentage: prefillPct,
        pre_filled_fields: preFilledFields,
        missing_fields: missingFields,
        onboarding_skippable: preFilledFields.length >= 3,
        template_used: !!templateRow,
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
