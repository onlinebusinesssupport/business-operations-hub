

## Why Invites Land in Spam

The invite email is being sent from `no-reply@auth.lovable.cloud` — the default Lovable auth email sender. Email providers like Gmail flag these as spam because:

1. **Generic shared domain** — `auth.lovable.cloud` has no relationship to your brand, so spam filters distrust it
2. **No custom DKIM/SPF** — your domain isn't authenticating these emails

You already have a custom email domain (`supportstudio.co.za`) configured for transactional emails. The fix is to set up **custom auth email templates** so that auth emails (invites, password resets, verification) also send from your domain instead of `auth.lovable.cloud`.

### What needs to happen

1. **Scaffold auth email templates** — generates branded templates for all auth email types (invite, signup confirmation, password reset, magic link, email change, reauthentication)
2. **Apply your brand styling** — match colors, logo, and tone from your existing app
3. **Deploy the auth-email-hook** edge function — routes auth emails through your custom domain

After this, invite emails will come from `supportstudio.co.za` with proper DNS authentication, dramatically reducing spam classification.

### No database or routing changes needed
This is purely an email infrastructure + template change.

