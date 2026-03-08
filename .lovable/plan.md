

## Prevent Autofill + Add Phone OTP for Admin Login

### The Real Problem
The browser autofills the test account credentials. Two fixes — one quick, one deeper.

### Fix 1: Disable Autofill (immediate)
Add `autoComplete="off"` to the email and password inputs on the login form. This stops the browser from pre-filling saved credentials.

**`src/pages/Login.tsx`**
- Set `autoComplete="off"` on the `<form>` element
- Set `autoComplete="new-password"` on the password input and `autoComplete="off"` on the email input

### Fix 2: Magic Link Login for Admin (recommended over phone OTP)
Phone OTP requires a paid Twilio account and additional configuration. A simpler and equally secure alternative: add a **"Sign in with email link"** option under the Studio Control section. This sends a one-time magic link to your admin email — no password, no autofill issues.

**`src/pages/Login.tsx`**
- When "Studio Control →" is clicked, show a small inline form with just an email field and a "Send magic link" button
- Calls `supabase.auth.signInWithOtp({ email })` which sends a login link
- The existing post-login routing and MFA flow handle the rest

### Changes
1. **`src/pages/Login.tsx`** — Add autofill prevention attributes + magic link option for Studio Control

