import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { sendLovableEmail } from 'npm:@lovable.dev/email-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const SITE_NAME = 'Support Studio'
const SENDER_DOMAIN = 'notify.www.supportstudio.co.za'
const FROM_DOMAIN = 'notify.www.supportstudio.co.za'

function wrapHtml(subject: string, bodyHtml: string): string {
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
</html>`
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const apiKey = Deno.env.get('LOVABLE_API_KEY')
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Server config error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Authenticate caller
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  )

  const token = authHeader.replace('Bearer ', '')
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token)
  if (claimsError || !claimsData?.claims) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
  const userId = claimsData.claims.sub as string

  // Check admin role
  const serviceClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  const { data: roleData } = await serviceClient
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .maybeSingle()

  if (!roleData) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let body: { to_email: string; subject: string; body_html: string; client_id?: string }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (!body.to_email || !body.subject || !body.body_html) {
    return new Response(JSON.stringify({ error: 'Missing required fields: to_email, subject, body_html' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const html = wrapHtml(body.subject, body.body_html)
  const text = stripHtml(body.body_html)

  let result: { message_id?: string }
  try {
    result = await sendLovableEmail(
      {
        run_id: crypto.randomUUID(),
        to: body.to_email,
        from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
        sender_domain: SENDER_DOMAIN,
        subject: body.subject,
        html,
        text,
        purpose: 'transactional',
      },
      { apiKey }
    )
  } catch (error) {
    console.error('Email send failed:', error)

    // Log failed email
    await serviceClient.from('client_emails').insert({
      client_id: body.client_id || null,
      sent_by: userId,
      to_email: body.to_email,
      subject: body.subject,
      body_html: body.body_html,
      body_text: text,
      status: 'failed',
    })

    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Log sent email
  await serviceClient.from('client_emails').insert({
    client_id: body.client_id || null,
    sent_by: userId,
    to_email: body.to_email,
    subject: body.subject,
    body_html: body.body_html,
    body_text: text,
    status: 'sent',
  })

  return new Response(
    JSON.stringify({ success: true, message_id: result.message_id }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})
