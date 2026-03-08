import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  balance: number | null;
}

function parseCSV(text: string): ParsedTransaction[] {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  // Try to detect SA bank format by header row
  const header = lines[0].toLowerCase();
  const transactions: ParsedTransaction[] = [];

  // Generic CSV: detect columns by header keywords
  let dateCol = -1, descCol = -1, amountCol = -1, debitCol = -1, creditCol = -1, balCol = -1;

  const headers = lines[0].split(",").map(h => h.replace(/"/g, "").trim().toLowerCase());

  for (let i = 0; i < headers.length; i++) {
    const h = headers[i];
    if (h.includes("date") && dateCol === -1) dateCol = i;
    if ((h.includes("description") || h.includes("narrative") || h.includes("detail") || h.includes("reference")) && descCol === -1) descCol = i;
    if (h.includes("amount") && !h.includes("vat") && amountCol === -1) amountCol = i;
    if ((h.includes("debit") || h === "money out") && debitCol === -1) debitCol = i;
    if ((h.includes("credit") || h === "money in") && creditCol === -1) creditCol = i;
    if ((h.includes("balance") || h.includes("running")) && balCol === -1) balCol = i;
  }

  // FNB format often has: Date, Description, Amount, Balance
  // Nedbank: Date, Reference, Description, Debit, Credit, Balance
  // Standard Bank: Date, Description, Debit, Credit, Balance
  // Absa: Date, Description, Amount, Balance

  for (let i = 1; i < lines.length; i++) {
    // Handle quoted CSV fields
    const row = parseCSVRow(lines[i]);
    if (row.length < 2) continue;

    try {
      let date = dateCol >= 0 ? row[dateCol]?.trim() : row[0]?.trim();
      const desc = descCol >= 0 ? row[descCol]?.trim() : row[1]?.trim();

      if (!date || !desc) continue;

      // Parse date - handle various SA formats: dd/mm/yyyy, yyyy-mm-dd, dd-mm-yyyy, dd MMM yyyy
      date = normalizeDateString(date);
      if (!date) continue;

      let amount = 0;
      if (amountCol >= 0) {
        amount = parseAmount(row[amountCol]);
      } else if (debitCol >= 0 && creditCol >= 0) {
        const debit = parseAmount(row[debitCol]);
        const credit = parseAmount(row[creditCol]);
        amount = credit > 0 ? credit : -Math.abs(debit);
      } else {
        // Fallback: try column after description
        const col = descCol >= 0 ? descCol + 1 : 2;
        if (col < row.length) amount = parseAmount(row[col]);
      }

      const balance = balCol >= 0 ? parseAmount(row[balCol]) : null;

      if (amount !== 0 || desc.length > 0) {
        transactions.push({ date, description: desc, amount, balance: balance || null });
      }
    } catch {
      continue;
    }
  }

  return transactions;
}

function parseCSVRow(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function parseAmount(str: string | undefined): number {
  if (!str) return 0;
  const cleaned = str.replace(/[^\d.\-,]/g, "").replace(/,/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function normalizeDateString(dateStr: string): string | null {
  // Try yyyy-mm-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  // Try dd/mm/yyyy or dd-mm-yyyy
  let m = dateStr.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  // Try dd MMM yyyy (e.g. "05 Jan 2026")
  const months: Record<string, string> = { jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06", jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12" };
  m = dateStr.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
  if (m && months[m[2].toLowerCase()]) {
    return `${m[3]}-${months[m[2].toLowerCase()]}-${m[1].padStart(2, "0")}`;
  }
  return null;
}

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

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { statement_id, file_content, file_type } = await req.json();

    if (!statement_id) {
      return new Response(JSON.stringify({ error: "statement_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let transactions: ParsedTransaction[] = [];

    if (file_type === "csv" || file_type === "xlsx") {
      // CSV parsing
      transactions = parseCSV(file_content);
    } else if (file_type === "pdf") {
      // Use Lovable AI to extract transactions from PDF text
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

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
              content: `You are a precision-focused financial data extraction agent for South African bank statements.
Your task is to extract transaction data from bank statements into a structured JSON format.
South African banks include FNB, Nedbank, Standard Bank, Absa, Capitec. Amounts in ZAR. Debits are negative, credits are positive.

### CRITICAL FORMATTING RULES:
1. DATE FORMAT: Use ONLY 'YYYY-MM-DD' format.
2. NO EXTRANEOUS TEXT: Do NOT append status words, notes, or OCR artifacts to the date string (e.g., NEVER return "2025-10-27 exterminated" or "2025-11-10os").
3. PURITY: If a date is unclear or contains non-numeric artifacts, strip them and return only the base date.
4. NULLS: If a date is completely missing or unreadable, omit the transaction entirely.

### EXAMPLES of CORRECT vs INCORRECT:
- Input: "Oct 27 2025 - Transaction Cancelled" → Correct date: "2025-10-27" (NOT "2025-10-27 cancelled")
- Input: "10/11/2025 (Pending)" → Correct date: "2025-11-10" (NOT "2025-11-10 pending")`
            },
            {
              role: "user",
              content: `Extract all transactions from this bank statement:\n\n${file_content}`
            }
          ],
          tools: [{
            type: "function",
            function: {
              name: "extracted_transactions",
              description: "Return all extracted transactions from the bank statement",
              parameters: {
                type: "object",
                properties: {
                  bank_name: { type: "string", description: "Name of the bank (FNB, Nedbank, Standard Bank, Absa, Capitec, etc)" },
                  account_number: { type: "string", description: "Account number if visible" },
                  period_start: { type: "string", description: "Statement period start date (YYYY-MM-DD)" },
                  period_end: { type: "string", description: "Statement period end date (YYYY-MM-DD)" },
                  transactions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        date: { type: "string", description: "Transaction date in YYYY-MM-DD format" },
                        description: { type: "string", description: "Transaction description/narrative" },
                        amount: { type: "number", description: "Amount: positive for credits, negative for debits" },
                        balance: { type: "number", description: "Running balance after transaction, null if unknown" }
                      },
                      required: ["date", "description", "amount"]
                    }
                  }
                },
                required: ["transactions"]
              }
            }
          }],
          tool_choice: { type: "function", function: { name: "extracted_transactions" } }
        }),
      });

      if (!aiResp.ok) {
        const errText = await aiResp.text();
        console.error("AI error:", errText);
        throw new Error("Failed to parse PDF with AI");
      }

      const aiData = await aiResp.json();
      const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
      if (toolCall) {
        const parsed = JSON.parse(toolCall.function.arguments);
        transactions = parsed.transactions || [];

        // Update statement metadata from AI extraction
        if (parsed.bank_name || parsed.account_number || parsed.period_start || parsed.period_end) {
          await supabase.from("bank_statements").update({
            bank_name: parsed.bank_name || null,
            account_number: parsed.account_number || null,
            period_start: parsed.period_start || null,
            period_end: parsed.period_end || null,
          }).eq("id", statement_id);
        }
      }
    }

    if (transactions.length === 0) {
      return new Response(JSON.stringify({ error: "No transactions found in file" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // === STRICT DATA SANITIZATION LAYER ===
    const DATE_REGEX = /(\d{4}-\d{2}-\d{2})/;
    const sanitized: ParsedTransaction[] = [];
    let skippedCount = 0;

    for (const t of transactions) {
      // 1. Date: regex extraction + calendar validation
      const rawDate = t.date?.trim() ?? "";
      const dateMatch = rawDate.match(DATE_REGEX);
      if (!dateMatch) {
        console.warn(`[Sanitizer] Skipped – no date in "${t.date}":`, t.description);
        skippedCount++;
        continue;
      }
      const extractedDate = dateMatch[1];
      const parsed = new Date(extractedDate + "T00:00:00Z");
      if (isNaN(parsed.getTime())) {
        console.warn(`[Sanitizer] Skipped – invalid calendar date "${extractedDate}":`, t.description);
        skippedCount++;
        continue;
      }

      // 2. Amount sanitization: strip non-numeric chars (keep digits, dot, minus)
      const cleanAmount = (val: unknown): number => {
        if (typeof val === "number" && !isNaN(val)) return val;
        const s = String(val ?? "0").replace(/[^\d.\-]/g, "");
        const n = parseFloat(s);
        return isNaN(n) ? 0 : n;
      };

      sanitized.push({
        date: extractedDate,
        description: t.description || "",
        amount: cleanAmount(t.amount),
        balance: t.balance != null ? cleanAmount(t.balance) : null,
      });
    }

    if (sanitized.length === 0) {
      return new Response(JSON.stringify({ error: "No transactions with valid dates found", inserted_count: 0, skipped_count: skippedCount }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert validated transactions
    const rows = sanitized.map(t => ({
      statement_id,
      date: t.date,
      description: t.description,
      amount: t.amount,
      balance: t.balance,
    }));

    const { error: insertErr } = await supabase.from("transactions").insert(rows);
    if (insertErr) throw insertErr;

    // Update statement totals
    const totalIn = sanitized.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const totalOut = sanitized.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

    await supabase.from("bank_statements").update({
      transaction_count: sanitized.length,
      total_in: totalIn,
      total_out: totalOut,
      status: "processing",
      skipped_count: skippedCount,
    }).eq("id", statement_id);

    return new Response(JSON.stringify({ success: true, inserted_count: sanitized.length, skipped_count: skippedCount }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("parse-bank-statement error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
