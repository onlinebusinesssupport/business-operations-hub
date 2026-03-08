import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const resendKey = Deno.env.get('RESEND_API_KEY')
  if (!resendKey) {
    console.error('Missing RESEND_API_KEY')
    return new Response(JSON.stringify({ error: 'Config error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let body: { type: string; record: { sender_id: string; recipient_id: string; content: string } }
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const record = body.record
  if (!record?.recipient_id || !record?.sender_id) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const serviceClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Get recipient email from profiles
  const { data: recipientProfile } = await serviceClient
    .from('profiles')
    .select('email, full_name')
    .eq('user_id', record.recipient_id)
    .maybeSingle()

  if (!recipientProfile?.email) {
    console.log('No email found for recipient:', record.recipient_id)
    return new Response(JSON.stringify({ skipped: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Get sender name
  const { data: senderProfile } = await serviceClient
    .from('profiles')
    .select('full_name, company_name')
    .eq('user_id', record.sender_id)
    .maybeSingle()

  const senderName = senderProfile?.full_name || senderProfile?.company_name || 'Your account manager'

  // Send notification email via Resend
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Support Studio <noreply@notify.www.supportstudio.co.za>',
        to: recipientProfile.email,
        subject: `New message from ${senderName}`,
        html: `
          <div style="font-family:'Inter',Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px;">
            <p style="font-size:11px;font-weight:700;letter-spacing:0.15em;color:#1E3D2F;text-transform:uppercase;margin-bottom:24px;">SUPPORT STUDIO™</p>
            <p style="font-size:14px;color:#333;line-height:1.6;">
              You have a new message from <strong>${senderName}</strong>.
            </p>
            <p style="font-size:13px;color:#666;margin-top:16px;padding:12px;background:#f5f5f5;border-left:3px solid #1E3D2F;">
              ${record.content.substring(0, 200)}${record.content.length > 200 ? '…' : ''}
            </p>
            <a href="https://business-calm-command.lovable.app/portal" 
               style="display:inline-block;margin-top:24px;padding:10px 24px;background:#1E3D2F;color:#fff;text-decoration:none;font-size:13px;font-weight:500;">
              Log in to reply
            </a>
            <p style="font-size:11px;color:#999;margin-top:32px;">Sent from Support Studio™</p>
          </div>
        `,
      }),
    })

    if (!res.ok) {
      const errBody = await res.json()
      console.error('Resend error:', errBody)
    }
  } catch (e) {
    console.error('Failed to send notification email:', e)
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
