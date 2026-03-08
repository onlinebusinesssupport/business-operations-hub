

## Update Upload Handler + Add Health Check Badge

### Changes to `src/pages/admin/AdminAccountant.tsx`

**1. Upload handler — use `inserted_count` / `skipped_count` from response (lines 173-184)**

Replace the current fire-and-forget invoke with:
- Capture `data` from the edge function response
- Show contextual toast based on `skipped_count`:
  - `skipped_count > 0` → warning toast: "Import complete: X saved, Y skipped due to unreadable data"
  - `skipped_count === 0` → success toast: "Successfully imported all X transactions"
  - If `inserted_count === 0` → destructive toast: "No valid transactions found"

**2. Health check badge on statement rows (line 469 area)**

Enhance the `statusBadge` helper and statement table to show a parse-health indicator:
- Store `inserted_count` and `skipped_count` on the `bank_statements` record (the edge function already updates the statement row — we'll read `transaction_count` and add a `skipped_count` column via migration)
- Display next to the status badge:
  - **Green** `CheckCircle` — all transactions parsed cleanly (skipped = 0)
  - **Amber** `AlertTriangle` — partial parse (skipped > 0)
  - **Red** `XCircle` — total failure (inserted = 0)

### Database migration needed

Add `skipped_count` column to `bank_statements`:
```sql
ALTER TABLE public.bank_statements ADD COLUMN IF NOT EXISTS skipped_count integer DEFAULT 0;
```

Update `parse-bank-statement` edge function to write `skipped_count` when it updates the statement record (one-line addition to the existing update query).

### Scope
- 1 migration: add `skipped_count` to `bank_statements`
- 1 edge function tweak: `parse-bank-statement` — persist `skipped_count`
- 1 frontend file: `AdminAccountant.tsx` — smarter toasts + health badge on rows

