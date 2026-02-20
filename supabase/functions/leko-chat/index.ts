import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

const MAX_MESSAGES_UNAUTH = 5;
const MAX_MESSAGE_LENGTH = 500;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    // Input validation
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid request: messages array required." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate message structure and length
    for (const msg of messages) {
      if (!msg || typeof msg.content !== "string" || !["user", "assistant"].includes(msg.role)) {
        return new Response(
          JSON.stringify({ error: "Invalid message format." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (msg.content.length > MAX_MESSAGE_LENGTH) {
        return new Response(
          JSON.stringify({ error: `Messages must be under ${MAX_MESSAGE_LENGTH} characters.` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Check authentication
    let isAuthenticated = false;
    const authHeader = req.headers.get("authorization");

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      // Skip validation for the anon key itself (unauthenticated callers)
      const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
      if (token !== anonKey) {
        const supabaseClient = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_ANON_KEY")!,
          { global: { headers: { Authorization: authHeader } } }
        );
        const { data, error } = await supabaseClient.auth.getUser();
        if (!error && data?.user) {
          isAuthenticated = true;
        }
      }
    }

    // Enforce stricter limits for unauthenticated users
    if (!isAuthenticated) {
      const userMessages = messages.filter((m: { role: string }) => m.role === "user");
      if (userMessages.length > MAX_MESSAGES_UNAUTH) {
        return new Response(
          JSON.stringify({ error: "Please sign in to continue the conversation." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

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
      JSON.stringify({ error: "Something went wrong. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
