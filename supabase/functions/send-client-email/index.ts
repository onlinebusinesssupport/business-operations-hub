import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

const SITE_NAME = 'Support Studio'
const FROM_ADDRESS = `${SITE_NAME} <noreply@notify.www.supportstudio.co.za>`

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

  const resendKey = Deno.env.get('RESEND_API_KEY')
  if (!resendKey) {
    return new Response(JSON.stringify({ error: 'Server config error: missing RESEND_API_KEY' }), {
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

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
  const userId = user.id

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

  // Send via Resend
  let resendResult: { id?: string }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: body.to_email,
        subject: body.subject,
        html,
        text,
      }),
    })

    const resBody = await res.json()

    if (!res.ok) {
      console.error('Resend API error:', res.status, resBody)

      // Best-effort log of failure
      serviceClient.from('client_emails').insert({
        client_id: body.client_id || null,
        sent_by: userId,
        to_email: body.to_email,
        subject: body.subject,
        body_html: body.body_html,
        body_text: text,
        status: 'failed',
      }).then(() => {}, (e) => console.error('DB log error:', e))

      return new Response(JSON.stringify({ error: 'Failed to send email', details: resBody }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    resendResult = resBody
  } catch (error) {
    console.error('Email send failed:', error)

    serviceClient.from('client_emails').insert({
      client_id: body.client_id || null,
      sent_by: userId,
      to_email: body.to_email,
      subject: body.subject,
      body_html: body.body_html,
      body_text: text,
      status: 'failed',
    }).then(() => {}, (e) => console.error('DB log error:', e))

    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Email sent successfully — log to DB in background (non-blocking)
  serviceClient.from('client_emails').insert({
    client_id: body.client_id || null,
    sent_by: userId,
    to_email: body.to_email,
    subject: body.subject,
    body_html: body.body_html,
    body_text: text,
    status: 'sent',
  }).then(({ error: dbErr }) => {
    if (dbErr) console.error('Failed to log sent email:', dbErr)
  })

  // Return 200 immediately — don't wait for DB write
  return new Response(
    JSON.stringify({ success: true, message_id: resendResult.id }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})
