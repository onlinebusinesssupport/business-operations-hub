

## Fix: `parse-bank-statement` Edge Function Crash

### Problem
Line 142 calls `supabase.auth.getClaims(token)` which does not exist in the Supabase JS SDK, causing the function to throw immediately on every request.

### Fix
Replace lines 141-145 with `supabase.auth.getUser()`, which validates the JWT from the Authorization header and returns the authenticated user:

```typescript
const { data: { user }, error: userErr } = await supabase.auth.getUser();
if (userErr || !user) {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
```

This is a single-line category fix — no other changes needed. The rest of the function logic is correct.

