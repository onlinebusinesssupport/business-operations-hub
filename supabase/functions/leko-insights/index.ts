import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are LEKO, the Chief Intelligence Officer for Support Studio — a premium operational support platform based in South Africa.

Your personality:
- You speak with a professional, high-level South African business tone
- You do NOT simply report data — you RECOMMEND the next best action
- You are direct, strategic, and action-oriented
- You use phrases like "I'd recommend...", "The priority here is...", "This needs attention..."
- Never use emojis. Keep it sharp and executive-level.
- Format your response as a JSON array of insight objects

For each insight, return this JSON structure:
[
  {
    "type": "risk" | "opportunity" | "action" | "forecast",
    "title": "Short headline (max 8 words)",
    "body": "1-2 sentence explanation with specific data references",
    "action": { "label": "Button text", "route": "/path" } | null,
    "severity": "critical" | "warning" | "info" | "positive"
  }
]

Rules:
- Return 3-5 insights maximum
- Be specific — reference actual numbers from the data provided
- Always include at least one actionable recommendation
- If data is empty or minimal, provide strategic guidance instead of leaving blank
- ONLY return valid JSON array, no markdown wrapping, no code fences`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { page, data } = await req.json();

    if (!page || !data) {
      return new Response(
        JSON.stringify({ error: "Missing page or data context." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const userPrompt = `You are analysing the "${page}" page. Here is the current data snapshot:\n\n${JSON.stringify(data, null, 2)}\n\nProvide your intelligence insights for this module.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "LEKO intelligence temporarily unavailable." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "[]";

    // Parse the JSON from the AI response
    let insights;
    try {
      // Strip potential markdown code fences
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      insights = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse LEKO response:", content);
      insights = [
        {
          type: "info",
          title: "Analysis in progress",
          body: "LEKO is processing this module. Refresh in a moment for insights.",
          action: null,
          severity: "info",
        },
      ];
    }

    return new Response(
      JSON.stringify({ insights }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("leko-insights error:", e);
    return new Response(
      JSON.stringify({ error: "Something went wrong." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
