

## Fix: Email Sending Fails — "Run not found or expired"

### Root Cause

The `send-client-email` edge function uses `sendLovableEmail()` with a random `run_id` (`crypto.randomUUID()`). This API requires a valid `run_id` provided by Lovable's webhook system — it's designed for the auth email hook flow where Lovable initiates the run. A random UUID is rejected with "Run not found or expired."

In short: `@lovable.dev/email-js` only works within the auth webhook pipeline. It cannot be used for arbitrary admin-initiated transactional emails.

### Solution

Integrate a third-party email service (Resend) to power the admin Email Hub. Resend has a generous free tier (100 emails/day) and works with your existing verified domain (`notify.www.supportstudio.co.za`).

### Changes

1. **Add `RESEND_API_KEY` secret** — You'll need to create a free Resend account at resend.com, add your domain, and provide the API key.

2. **Rewrite `supabase/functions/send-client-email/index.ts`**:
   - Replace `sendLovableEmail` with a direct `fetch` call to Resend's API (`https://api.resend.com/emails`)
   - Keep the same branded HTML wrapper, admin auth check, and database logging
   - Send from `noreply@notify.www.supportstudio.co.za` via Resend

3. **No changes needed** to:
   - Admin UI (`AdminEmails.tsx`)
   - Client portal (`Emails.tsx`)
   - Database schema or RLS policies
   - Auth email hook (continues using Lovable's built-in system)

### Technical detail

```typescript
// Replace sendLovableEmail with:
const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: `Support Studio <noreply@notify.www.supportstudio.co.za>`,
    to: body.to_email,
    subject: body.subject,
    html,
    text,
  }),
});
```

