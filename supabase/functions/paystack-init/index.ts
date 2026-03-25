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
    if (!authHeader) throw new Error("Missing authorization header");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) throw new Error("Unauthorized");

    const { invoice_id } = await req.json();
    if (!invoice_id) throw new Error("invoice_id is required");

    // Fetch invoice (RLS ensures the client owns it)
    const { data: invoice, error: invErr } = await supabase
      .from("invoices")
      .select("id, amount, currency, invoice_number, client_id, status")
      .eq("id", invoice_id)
      .maybeSingle();

    if (invErr || !invoice) throw new Error("Invoice not found");
    if (invoice.status !== "sent" && invoice.status !== "overdue") {
      throw new Error("Invoice is not payable");
    }

    // Amount in kobo/cents (Paystack expects smallest currency unit)
    const amountInSmallest = Math.round(Number(invoice.amount) * 100);
    const reference = `INV-${invoice.invoice_number || invoice.id}-${Date.now()}`;

    const paystackSecret = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!paystackSecret) throw new Error("Paystack not configured");

    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: amountInSmallest,
        currency: invoice.currency || "ZAR",
        reference,
        metadata: {
          invoice_id: invoice.id,
          client_id: invoice.client_id,
          invoice_number: invoice.invoice_number,
        },
      }),
    });

    const paystackData = await paystackRes.json();
    if (!paystackData.status) {
      throw new Error(paystackData.message || "Paystack initialization failed");
    }

    // Store the reference on the invoice using service role
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    await adminClient
      .from("invoices")
      .update({ paystack_reference: reference })
      .eq("id", invoice.id);

    return new Response(
      JSON.stringify({ authorization_url: paystackData.data.authorization_url, reference }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
