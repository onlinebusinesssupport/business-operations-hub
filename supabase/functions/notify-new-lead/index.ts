import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { client_id, client_name, source } = await req.json();

    // Get all admin users
    const { data: admins } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

    if (!admins || admins.length === 0) {
      return new Response(JSON.stringify({ ok: true, message: "No admins to notify" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create notification for each admin
    const notifications = admins.map((admin) => ({
      user_id: admin.user_id,
      title: "New Lead Received",
      body: `${client_name} just submitted from ${source}`,
      link: `/admin/clients`,
      read: false,
    }));

    await supabase.from("notifications").insert(notifications);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
