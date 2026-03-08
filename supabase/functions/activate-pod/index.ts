import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Verify the caller
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { client_id, pod_name } = await req.json();
    if (!client_id || !pod_name) {
      return new Response(JSON.stringify({ error: "Missing client_id or pod_name" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify this user owns this client
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    const { data: client } = await supabase
      .from("clients")
      .select("id, name")
      .eq("id", client_id)
      .eq("contact_profile_id", profile?.id)
      .maybeSingle();

    if (!client) {
      return new Response(JSON.stringify({ error: "Client not found" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check for duplicate
    const { data: existing } = await supabase
      .from("pods")
      .select("id")
      .eq("client_id", client_id)
      .eq("name", pod_name)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ error: "Pod already activated" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Create the pod
    const { data: pod, error: podError } = await supabase
      .from("pods")
      .insert({
        client_id,
        name: pod_name,
        status: "onboarding",
        config: { onboarding_step: 1 },
      })
      .select()
      .single();

    if (podError) throw podError;

    // 2. Create a work item for pod onboarding
    const { data: workItem, error: wiError } = await supabase
      .from("work_items")
      .insert({
        client_id,
        title: `${pod_name} — Pod Onboarding`,
        description: `Onboarding workflow for the ${pod_name} service pod.`,
        status: "in_progress",
        priority: "high",
      })
      .select()
      .single();

    if (wiError) throw wiError;

    // 3. Create workflow stages
    const stages = [
      { name: "Pod Activated", status: "complete", order_index: 0 },
      { name: "NDA / MOU Signing", status: "todo", order_index: 1 },
      { name: "Kick-off Brief", status: "todo", order_index: 2 },
      { name: "Pod Live", status: "todo", order_index: 3 },
    ];

    await supabase.from("workflow_stages").insert(
      stages.map((s) => ({ ...s, work_item_id: workItem.id }))
    );

    // 4. Create NDA signed_document record
    await supabase.from("signed_documents").insert({
      project_id: workItem.id,
      type: "NDA",
      signed_by_client: false,
      signed_by_admin: false,
    });

    // 5. Log activity for admin notification
    await supabase.from("activity_log").insert({
      entity_type: "pod",
      entity_id: pod.id,
      action: "pod_activated",
      actor_id: user.id,
      client_id,
      details: {
        pod_name,
        client_name: client.name,
        message: `${client.name} activated ${pod_name}`,
      },
    });

    return new Response(
      JSON.stringify({ success: true, pod_id: pod.id, work_item_id: workItem.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
