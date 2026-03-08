

## Restore Admin Access Visibility on Login Page

The login form already auto-routes admins to `/admin` based on the `user_roles` table, so functionally nothing is broken. The fix is purely visual — add a discreet "Studio Control" link at the bottom of the login page so you have a clear, branded entry point.

### Change

**`src/pages/Login.tsx`**
- Add a small "Studio Control →" link below the "Apply for access" line, styled subtly (muted, small text)
- Clicking it simply scrolls focus to the same login form (since it already auto-routes admins) but gives you confidence you're in the right place
- Alternatively, add a minimal toggle or tab at the top of the form (Client / Admin) that changes the heading text to "Enter Studio Control" when Admin is selected — purely cosmetic, the form and routing logic stay identical

Given your preference for keeping the site clean, I recommend the subtle footer link approach rather than a full toggle.

