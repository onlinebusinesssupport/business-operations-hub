

## Remove Client/Admin Toggle from Login

### Problem
The login page has a visible "Client / Admin" toggle that any user can see and interact with. This is confusing and exposes the existence of an admin portal to clients. Since the system already checks roles in the database, the toggle is unnecessary — routing should be fully automatic based on the user's actual role.

### Solution
Remove the toggle entirely. After successful login, the existing role-check logic already determines whether to route to `/admin` or `/portal`. The flow becomes:

1. User logs in with email/password or OAuth
2. System checks `user_roles` table for admin role
3. Admins → `/admin`, everyone else → `/portal`

### Changes

**`src/pages/Login.tsx`**:
- Remove the `portalType` state variable
- Remove the Client/Admin toggle buttons (lines 100–123)
- Remove the conditional access-denied check for non-admin users selecting "admin" (lines 76–81)
- Simplify routing: `navigate(roleData ? "/admin" : "/portal")` (line 83)
- Update subtitle text to a single generic message (lines 129–131)
- Remove the conditional "Apply for access" link guard — always show it (line 209)

This is a UI-only change. No database or edge function modifications needed.

