

## Audit: Transactions Not Appearing in Admin Finance

### Root Cause

**Line 77 of `AdminFinance.tsx`**: The query filters `.eq("confirmed", true)`, meaning only manually confirmed transactions appear. Newly uploaded transactions have `confirmed = false` by default, so they're invisible.

```typescript
// Current — excludes all new uploads
const { data } = await supabase.from("transactions").select("...").eq("confirmed", true);
```

### Portal Finance page

`src/pages/portal/Finance.tsx` is a static placeholder with zero data fetching — it needs no fix right now (it's a client-facing page, not the admin view).

### Changes

**1. `src/pages/admin/AdminFinance.tsx`**

- **Remove the `confirmed` filter** (or make it toggleable) so all transactions appear. Add a visual indicator (badge/column) showing confirmed vs unconfirmed status so the admin can distinguish.
- **Add Supabase Realtime subscription** on the `transactions` table to auto-refresh when new rows are inserted (e.g. after bank statement parsing). Use `useEffect` + `supabase.channel()` to invalidate the `finance-transactions` react-query key on `INSERT`/`UPDATE` events.
- Also subscribe to `bank_statements` changes to refresh that panel in real-time.

### Scope
- 1 file edited: `src/pages/admin/AdminFinance.tsx`
- No database or edge function changes
- RLS is fine — admin role already has full access to `transactions`

