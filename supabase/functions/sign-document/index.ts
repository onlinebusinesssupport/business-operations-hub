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
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Verify caller
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await anonClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { document_id, signer_name, pod_id } = await req.json();
    if (!document_id || !signer_name || !pod_id) {
      return new Response(JSON.stringify({ error: "Missing document_id, signer_name, or pod_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the document and verify ownership
    const { data: doc, error: docErr } = await supabase
      .from("signed_documents")
      .select("*, work_items!inner(client_id, clients!inner(id, name, contact_profile_id))")
      .eq("id", document_id)
      .single();

    if (docErr || !doc) {
      return new Response(JSON.stringify({ error: "Document not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify user owns this client
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    const workItem = doc.work_items as { client_id: string; clients: { id: string; name: string; contact_profile_id: string } };
    if (workItem.clients.contact_profile_id !== profile?.id) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (doc.signed_by_client) {
      return new Response(JSON.stringify({ error: "Already signed" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const clientId = workItem.client_id;
    const now = new Date().toISOString();

    // Generate a simple signed PDF text (placeholder — real PDF gen would use a library)
    const pdfContent = [
      `SIGNED DOCUMENT — ${doc.type}`,
      ``,
      `Client: ${workItem.clients.name}`,
      `Signed by: ${signer_name}`,
      `Email: ${user.email}`,
      `Date: ${now}`,
      `Document ID: ${document_id}`,
      ``,
      `This document has been electronically signed via SUPPORT STUDIO™.`,
      `The signer confirmed their identity and intent to sign.`,
    ].join("\n");

    const encoder = new TextEncoder();
    const pdfBytes = encoder.encode(pdfContent);

    // Upload to storage
    const filePath = `${clientId}/${pod_id}/${doc.type.replace(/\s+/g, "-").toLowerCase()}-signed-${Date.now()}.txt`;
    const { error: uploadErr } = await supabase.storage
      .from("signed-documents")
      .upload(filePath, pdfBytes, { contentType: "text/plain", upsert: false });

    if (uploadErr) throw uploadErr;

    // Update document record
    await supabase
      .from("signed_documents")
      .update({
        signed_by_client: true,
        signed_at: now,
        file_path: filePath,
        esign_provider: "built-in",
      })
      .eq("id", document_id);

    // Check if all 3 documents for this work_item are now signed
    const { data: allDocs } = await supabase
      .from("signed_documents")
      .select("id, signed_by_client")
      .eq("project_id", doc.project_id);

    const allSigned = allDocs?.every((d) => d.id === document_id ? true : d.signed_by_client);

    if (allSigned) {
      // Move pod to active
      await supabase
        .from("pods")
        .update({ status: "active", config: { onboarding_step: 4, work_item_id: doc.project_id } })
        .eq("id", pod_id);

      // Update workflow stages
      await supabase
        .from("workflow_stages")
        .update({ status: "complete" })
        .eq("work_item_id", doc.project_id)
        .in("name", ["NDA / MOU Signing"]);

      await supabase
        .from("workflow_stages")
        .update({ status: "complete" })
        .eq("work_item_id", doc.project_id)
        .eq("name", "Pod Live");

      // Create discovery meeting work item
      await supabase.from("work_items").insert({
        client_id: clientId,
        title: `Discovery Meeting — ${workItem.clients.name}`,
        description: "Initial discovery session to align on goals, timelines, and deliverables.",
        status: "queued",
        priority: "high",
      });

      // Log activity
      await supabase.from("activity_log").insert({
        entity_type: "pod",
        entity_id: pod_id,
        action: "pod_onboarding_complete",
        actor_id: user.id,
        client_id: clientId,
        details: {
          message: `${workItem.clients.name} completed all document signing. Pod is now active.`,
        },
      });
    }

    // Log individual signing
    await supabase.from("activity_log").insert({
      entity_type: "signed_document",
      entity_id: document_id,
      action: "document_signed",
      actor_id: user.id,
      client_id: clientId,
      details: {
        doc_type: doc.type,
        signer_name,
        all_complete: !!allSigned,
      },
    });

    return new Response(
      JSON.stringify({ success: true, all_signed: !!allSigned, file_path: filePath }),
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
