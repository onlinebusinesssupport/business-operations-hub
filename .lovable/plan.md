

## Problem

The admin user `agenticos.za@gmail.com` has the correct admin role in the database -- the data is fine. The issue is that after signing in with Google OAuth, the app redirects back to the homepage (`/`) with no logic to detect the completed login and route the user to the correct dashboard (`/admin` or `/portal`).

The email/password login flow has explicit navigation after sign-in, but the Google/Apple OAuth flow simply triggers a redirect and has no post-redirect handler.

## Solution

Add a post-OAuth redirect handler that detects when a user returns from an OAuth sign-in and navigates them to the appropriate dashboard.

## Changes

### 1. Update `src/pages/Login.tsx`
- Change the OAuth `redirect_uri` to point back to the login page itself (`/login`) instead of the root (`/`).
- Add a `useEffect` hook that runs on mount to check if the user already has an active session (meaning they just returned from an OAuth redirect).
- If a session exists, check their role and navigate to `/admin` or `/portal` accordingly, including the MFA check.

### 2. Update `src/App.tsx`
- No routing changes needed since `/login` is already a registered route.

## Technical Details

The `useEffect` in `Login.tsx` will:
1. Call `supabase.auth.getSession()` on mount.
2. If a session exists, query `user_roles` for admin status.
3. Check for MFA factors and redirect to `/mfa-verify` if enrolled.
4. Otherwise, navigate to `/admin` (if admin) or `/portal` (if client).

This ensures that regardless of whether the user signs in with email/password, Google, or Apple, they always land in the right place.
