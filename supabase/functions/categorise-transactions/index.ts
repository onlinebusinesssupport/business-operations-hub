import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { statement_id } = await req.json();
    if (!statement_id) {
      return new Response(JSON.stringify({ error: "statement_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Fetch chart of accounts
    const { data: accounts } = await supabase.from("chart_of_accounts").select("*").eq("is_active", true);
    if (!accounts || accounts.length === 0) {
      return new Response(JSON.stringify({ error: "No chart of accounts found" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Fetch uncategorised transactions
    const { data: txns } = await supabase
      .from("transactions")
      .select("*")
      .eq("statement_id", statement_id)
      .eq("confirmed", false)
      .is("account_id", null)
      .order("date");

    if (!txns || txns.length === 0) {
      await supabase.from("bank_statements").update({ status: "categorised" }).eq("id", statement_id);
      return new Response(JSON.stringify({ success: true, categorised: 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const accountList = accounts.map((a: any) => `${a.code} - ${a.name} (${a.type}, ${a.category}, tax: ${a.tax_treatment})`).join("\n");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    // Process in batches of 50
    const BATCH_SIZE = 50;
    let totalCategorised = 0;

    for (let i = 0; i < txns.length; i += BATCH_SIZE) {
      const batch = txns.slice(i, i + BATCH_SIZE);

      const txnList = batch.map((t: any, idx: number) =>
        `[${idx}] Date: ${t.date} | Desc: "${t.description}" | Amount: R${t.amount}`
      ).join("\n");

      const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are an expert South African bookkeeper and tax advisor. You specialise in categorising bank transactions for SMEs according to SARS tax requirements.

Key SA tax knowledge:
- VAT rate: 15% (since April 2018)
- VAT on amount: amount × 15/115 for VAT-inclusive items
- Bank charges, insurance, salaries, interest = VAT exempt
- Most business expenses are VAT-inclusive
- Common SA bank descriptions: EFT, DEBIT ORDER, POS PURCHASE, CASH WITHDRAWAL, SALARY, FEE, INTEREST
- FNB descriptions often start with category codes
- Nedbank uses INTERNAL TRANSFER, DEBIT ORDER, etc.

For each transaction, match it to the most appropriate account from the chart of accounts. Be specific - don't default everything to "Other Income" or "Cost of Sales". Consider the description carefully.

If a debit (negative amount) matches a typically credit-side account or vice versa, still categorise correctly — the sign indicates the direction.`
            },
            {
              role: "user",
              content: `Categorise these bank transactions using the chart of accounts below.

CHART OF ACCOUNTS:
${accountList}

TRANSACTIONS:
${txnList}`
            }
          ],
          tools: [{
            type: "function",
            function: {
              name: "categorise_batch",
              description: "Return categorisation for each transaction",
              parameters: {
                type: "object",
                properties: {
                  results: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        index: { type: "number", description: "Transaction index from the list" },
                        account_code: { type: "string", description: "Chart of accounts code (e.g. '6020')" },
                        confidence: { type: "number", description: "Confidence 0.0 to 1.0" },
                        vat_amount: { type: "number", description: "VAT amount in ZAR (0 if exempt)" },
                        reasoning: { type: "string", description: "Brief reason for categorisation" }
                      },
                      required: ["index", "account_code", "confidence", "reasoning"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["results"],
                additionalProperties: false
              }
            }
          }],
          tool_choice: { type: "function", function: { name: "categorise_batch" } }
        }),
      });

      if (!aiResp.ok) {
        if (aiResp.status === 429) {
          // Rate limited - wait and retry
          await new Promise(r => setTimeout(r, 5000));
          i -= BATCH_SIZE; // Retry this batch
          continue;
        }
        const errText = await aiResp.text();
        console.error("AI categorisation error:", errText);
        continue;
      }

      const aiData = await aiResp.json();
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) continue;

      const { results } = JSON.parse(toolCall.function.arguments);

      // Build account code → id lookup
      const codeToId: Record<string, string> = {};
      for (const a of accounts) {
        codeToId[(a as any).code] = (a as any).id;
      }

      // Update each transaction
      for (const r of results) {
        const txn = batch[r.index];
        if (!txn) continue;

        const accountId = codeToId[r.account_code] || null;

        await supabase.from("transactions").update({
          account_id: accountId,
          ai_category: `${r.account_code} - ${r.reasoning}`,
          ai_confidence: r.confidence,
          vat_amount: r.vat_amount || 0,
        }).eq("id", (txn as any).id);

        totalCategorised++;
      }
    }

    // Update statement status
    await supabase.from("bank_statements").update({ status: "categorised" }).eq("id", statement_id);

    return new Response(JSON.stringify({ success: true, categorised: totalCategorised }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("categorise-transactions error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
