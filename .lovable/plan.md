

## Fix: Invite Function — Handle Existing Users

### Problem
When `inviteUserByEmail` returns "already been registered," the function catches the error but `inviteData.user` is null, so it silently skips role assignment and client creation. No email is sent either.

### Fix (in `supabase/functions/invite-user/index.ts`)

After the invite call, if the error says "already been registered":
1. Look up the existing user by email using `adminClient.auth.admin.listUsers()` filtered by email
2. Use that user's ID to proceed with role assignment and client record creation (same logic that already exists)
3. Return a response indicating the user was already registered but has now been linked as a client

### Code Changes

In the section after the `inviteUserByEmail` call (~line 100-110):

```typescript
let userId = inviteData?.user?.id;

// Handle already-registered users
if (!userId && inviteError?.message?.includes("already been registered")) {
  const { data: listData } = await adminClient.auth.admin.listUsers();
  const existing = listData?.users?.find(u => u.email === email);
  userId = existing?.id ?? null;
}
```

The rest of the function (role upsert, client creation) already uses `userId` and will now execute correctly for existing users too.

### Immediate Fix for Xolisa
After deploying the code fix, either:
- Re-send the invite from the admin UI (it will now handle the existing user correctly), or
- The migration can directly assign the role and create the client record for this specific user

### No DB Migration Needed
This is purely an edge function logic fix.

