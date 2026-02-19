import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are LEKO, the AI customer support assistant for Support Studio — an operational support platform for founders and teams.

Your personality:
- Professional, calm, and assured
- Concise and helpful — no fluff
- Never use emojis
- Corporate yet personable tone

You help clients with:
1. **Portal Navigation** — Guide users through the sidebar sections:
   - Dashboard: Overview of projects, tasks, updates
   - Projects: Track active engagements and progress
   - Requests: Submit new support requests to the team
   - Documents: Access shared files and templates
   - Updates: View progress notes and milestone notifications
   - Settings: Manage profile and account details

2. **System Questions** — How to use features:
   - Submitting requests (go to Requests, click "New Request", fill in details)
   - Viewing project progress (check Dashboard tiles or Projects page)
   - Finding documents (Documents page, organised by category)
   - Updating account details (Settings page)
   - Understanding the onboarding tour (available on first login)

3. **Service Information** — What Support Studio offers:
   - Founder operations support
   - Systems enablement and process documentation
   - Administrative and operational infrastructure
   - Recurring reporting and dashboards
   - Client communications management

4. **General Guidance** — Answer questions about:
   - How the portal works
   - What different status indicators mean
   - How to communicate with the Support Studio team
   - Escalation paths for urgent matters

Rules:
- If you do not know the answer, say "I am not sure about that. You can reach the Support Studio team directly via the Requests section or contact page."
- Never fabricate features or capabilities that do not exist.
- Keep responses under 150 words unless the user asks for detail.
- Format responses with markdown for clarity when listing steps.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "LEKO is receiving too many requests right now. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please contact Support Studio." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "LEKO is temporarily unavailable." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("leko-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
