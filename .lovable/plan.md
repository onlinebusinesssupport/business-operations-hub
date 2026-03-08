

## Fix: Bank Statement Upload Failing Due to Malformed AI-Extracted Dates

### Problem
The `parse-bank-statement` edge function uses AI (Gemini) to extract transactions from PDF bank statements. The AI occasionally returns malformed date strings like `"2025-10-27 exterminated"` and `"2025-11-10os"`. These are inserted directly into the `transactions` table's `date` column (Postgres `date` type), causing a `22007` invalid date syntax error — which crashes the entire upload.

### Fix

**`supabase/functions/parse-bank-statement/index.ts`**

Add a date validation/sanitization step before inserting transactions into the database:

1. After the AI returns parsed transactions (line ~243), filter and sanitize each transaction's `date` field:
   - Strip any trailing non-date characters (letters, spaces after a valid YYYY-MM-DD pattern)
   - Validate with a strict `YYYY-MM-DD` regex
   - Skip transactions with dates that can't be salvaged
2. This ensures only valid dates reach Postgres, preventing the 500 error
3. Log a warning for any skipped transactions so you have visibility

### Scope
- One file change: `supabase/functions/parse-bank-statement/index.ts`
- No database migration needed
- No frontend changes needed

