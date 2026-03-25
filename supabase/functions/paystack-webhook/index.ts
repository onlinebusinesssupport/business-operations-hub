import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-paystack-signature",
};

async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const hex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hex === signature;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecret) throw new Error("Paystack not configured");

    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature") || "";

    const valid = await verifySignature(body, signature, paystackSecret);
    if (!valid) {
      return new Response("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.success") {
      const { reference, metadata } = event.data;
      const invoiceId = metadata?.invoice_id;
      const clientId = metadata?.client_id;

      if (!invoiceId) {
        return new Response("No invoice_id in metadata", { status: 200 });
      }

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

      // Update invoice to paid
      const { error: updateErr } = await supabase
        .from("invoices")
        .update({
          status: "paid",
          paid_date: new Date().toISOString().split("T")[0],
          paystack_reference: reference,
        })
        .eq("id", invoiceId);

      if (updateErr) {
        console.error("Failed to update invoice:", updateErr);
        return new Response("DB error", { status: 500 });
      }

      // Log activity
      await supabase.from("activity_log").insert({
        action: "PAYSTACK_PAYMENT_CONFIRMED",
        entity_type: "invoice",
        entity_id: invoiceId,
        client_id: clientId || null,
        details: {
          reference,
          amount: event.data.amount / 100,
          currency: event.data.currency,
          channel: event.data.channel,
        },
      });

      // Notify admin of successful payment
      try {
        await fetch(
          `${Deno.env.get("SUPABASE_URL")}/functions/v1/notify-admin`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event_type: "payment_confirmed",
              user_email: event.data.customer?.email || metadata?.email || "",
              full_name: event.data.customer?.first_name || metadata?.full_name || "",
              business_name: metadata?.business_name || "",
              details: {
                amount: event.data.amount / 100,
                currency: event.data.currency,
                reference,
                invoice_id: invoiceId,
              },
            }),
          }
        );
      } catch (notifyErr) {
        console.error("notify-admin error:", notifyErr);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Server error", { status: 500 });
  }
});
