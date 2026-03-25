import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SITE_NAME = "Support Studio";
const FROM_ADDRESS = `${SITE_NAME} <noreply@notify.www.supportstudio.co.za>`;

interface NotifyPayload {
  event_type: string;
  user_email?: string;
  full_name?: string;
  business_name?: string;
  details?: Record<string, unknown>;
}

const EVENT_LABELS: Record<string, string> = {
  new_signup: "🆕 New Signup",
  onboarding_complete: "✅ Onboarding Complete",
  new_lead: "🎯 New Lead Captured",
  payment_confirmed: "💰 Payment Confirmed",
  payment_failed: "❌ Payment Failed",
};

function buildEmailHtml(payload: NotifyPayload): string {
  const label = EVENT_LABELS[payload.event_type] || payload.event_type;

  const rows: string[] = [];
  if (payload.full_name) rows.push(`<tr><td style="padding:6px 0;color:#999;font-size:13px;width:140px;">Name</td><td style="padding:6px 0;font-size:13px;color:#1E3D2F;">${payload.full_name}</td></tr>`);
  if (payload.user_email) rows.push(`<tr><td style="padding:6px 0;color:#999;font-size:13px;">Email</td><td style="padding:6px 0;font-size:13px;color:#1E3D2F;">${payload.user_email}</td></tr>`);
  if (payload.business_name) rows.push(`<tr><td style="padding:6px 0;color:#999;font-size:13px;">Business</td><td style="padding:6px 0;font-size:13px;color:#1E3D2F;">${payload.business_name}</td></tr>`);

  if (payload.details) {
    for (const [key, value] of Object.entries(payload.details)) {
      const label = key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      rows.push(`<tr><td style="padding:6px 0;color:#999;font-size:13px;">${label}</td><td style="padding:6px 0;font-size:13px;color:#1E3D2F;">${String(value)}</td></tr>`);
    }
  }

  const bodyHtml = `
    <h1 style="font-size:18px;font-weight:700;color:#1E3D2F;margin:0 0 20px;">${label}</h1>
    <table width="100%" cellpadding="0" cellspacing="0">${rows.join("")}</table>
    <p style="font-size:12px;color:#999;margin:24px 0 0;">This is an automated notification from your platform.</p>
  `;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'Inter',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
<tr><td align="center" style="padding:40px 20px;">
<table width="100%" style="max-width:580px;">
  <tr><td style="padding-bottom:24px;">
    <span style="font-size:11px;font-weight:700;letter-spacing:0.15em;color:#1E3D2F;text-transform:uppercase;">SUPPORT STUDIO™</span>
  </td></tr>
  <tr><td style="background-color:#ffffff;border:1px solid #e5e5e5;padding:32px;">
    ${bodyHtml}
  </td></tr>
  <tr><td style="padding-top:24px;text-align:center;">
    <p style="font-size:11px;color:#999999;margin:0;">Sent from Support Studio™ · supportstudio.co.za</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const adminEmail = Deno.env.get("ADMIN_EMAIL");
    if (!resendKey || !adminEmail) {
      throw new Error("Missing RESEND_API_KEY or ADMIN_EMAIL secret");
    }

    let payload: NotifyPayload;
    try {
      payload = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!payload.event_type) {
      return new Response(JSON.stringify({ error: "Missing event_type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subjectLabel = EVENT_LABELS[payload.event_type] || payload.event_type;
    const subject = `[Support Studio] ${subjectLabel}`;
    const html = buildEmailHtml(payload);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: adminEmail,
        subject,
        html,
      }),
    });

    const resBody = await res.json();

    if (!res.ok) {
      console.error("Resend error:", res.status, resBody);
      return new Response(JSON.stringify({ error: "Failed to send notification", details: resBody }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, message_id: resBody.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("notify-admin error:", e);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
