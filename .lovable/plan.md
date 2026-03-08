

## Harden Bank Statement Pipeline — Sanitization + Graceful Responses

### Current State
Both functions already have partial fixes applied:
- `parse-bank-statement` has date regex sanitization and the improved prompt
- `categorise-transactions` has correct `getUser()` auth (no more `getClaims`)

What's still missing from the "Architect's Hardening" spec:

### Changes

**1. `supabase/functions/parse-bank-statement/index.ts`**

- **Amount sanitization**: Before insertion, strip non-numeric characters (except `.` and `-`) from `amount` and `balance` fields to prevent Postgres numeric errors. Currently amounts from the AI path are trusted as numbers but could arrive as strings like `"R1,234.56"`.
- **Calendar date validation**: After extracting YYYY-MM-DD via regex, verify it's a real date (e.g. reject `2025-02-30`) using `new Date(d).toISOString()` check.
- **Graceful 200 response with counts**: Instead of returning a 400 when some transactions are skipped, return `{ success: true, inserted_count, skipped_count }` with status 200 so the UI stays stable. Only error if zero valid transactions remain.

**2. `supabase/functions/categorise-transactions/index.ts`**

- Already fixed (uses `getUser()`). No further changes needed — auth context is correct.

### Scope
- One file edited: `parse-bank-statement/index.ts`
- No database changes
- No frontend changes

