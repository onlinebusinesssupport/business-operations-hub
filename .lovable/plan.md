

## Accountant Module — Phase 1: Full Foundation (Admin Only)

This builds a SAGE-like bookkeeping system inside the admin backend with three pillars: chart of accounts, AI-powered bank statement processing, and SA tax/compliance tracking.

---

### 1. Database Schema (3 new tables + 1 migration)

**`chart_of_accounts`** — Cost centres, profit centres, GL accounts
- `id`, `code` (text, e.g. "5100"), `name` ("Office Rent"), `type` (enum: `income | expense | asset | liability | equity`), `category` (text, e.g. "Cost of Sales", "Operating Expenses"), `tax_treatment` (text: "vat_inclusive", "vat_exclusive", "exempt", "zero_rated"), `is_active` boolean, `created_at`
- Seeded with standard SA SME accounts (SARS-aligned categories)

**`bank_statements`** — Uploaded statement metadata
- `id`, `file_path` (text), `file_name`, `upload_date`, `period_start` (date), `period_end` (date), `bank_name` (text), `account_number` (text), `status` ("processing" | "categorised" | "reviewed"), `total_in` (numeric), `total_out` (numeric), `transaction_count` (int), `created_at`

**`transactions`** — Individual line items from statements
- `id`, `statement_id` (FK → bank_statements), `date`, `description` (text — raw bank description), `amount` (numeric, positive=credit, negative=debit), `balance` (numeric, nullable), `account_id` (FK → chart_of_accounts, nullable — AI suggests, admin confirms), `ai_category` (text — AI's suggestion before confirmation), `ai_confidence` (numeric 0-1), `confirmed` (boolean default false), `vat_amount` (numeric, nullable), `notes` (text), `created_at`

**`compliance_items`** — Tax deadlines and regulatory obligations
- `id`, `title` ("VAT201 Return"), `body` (enum: "SARS" | "CIPC" | "UIF" | "COIDA" | "Other"), `due_date` (date), `frequency` ("monthly" | "bi-monthly" | "quarterly" | "annual" | "once"), `status` ("upcoming" | "due" | "submitted" | "overdue"), `notes`, `created_at`
- Seeded with standard SA obligations (VAT, provisional tax, CIPC annual return, UIF, PAYE if applicable)

All tables: RLS admin-only. Storage bucket `bank-statements` (private, admin-only).

---

### 2. AI Transaction Categorisation (Edge Function)

**`supabase/functions/categorise-transactions/index.ts`**
- Accepts statement_id, fetches uncategorised transactions
- Uses Lovable AI (gemini-3-flash-preview) with an SA-specific system prompt:
  - Knows SA VAT rate (15%), common bank description patterns (FNB, Nedbank, Absa, Standard Bank)
  - Maps transactions to chart_of_accounts codes
  - Returns structured output via tool calling: `{ account_code, confidence, vat_amount, reasoning }`
- Batches transactions (50 at a time) to stay within token limits
- Updates each transaction's `ai_category`, `ai_confidence`, `account_id`
- Sets statement status to "categorised"

**`supabase/functions/parse-bank-statement/index.ts`**
- Accepts uploaded file (CSV or PDF)
- CSV: Parses rows, detects SA bank formats (FNB, Nedbank, Standard Bank, Absa all have slightly different CSV layouts — the AI identifies the format)
- PDF: Sends to Lovable AI with the document content for extraction
- Inserts transactions into the `transactions` table
- Triggers categorisation automatically

---

### 3. Admin UI — New Route: `/admin/accountant`

**Three tabs:**

**A. Statements Tab**
- Upload button (drag-drop zone for CSV/PDF)
- List of uploaded statements with: period, bank, status badge, transaction count, totals
- Click a statement → transaction review view

**B. Transaction Review**
- Table of transactions for selected statement
- Each row: date, description, amount, AI-suggested category (with confidence %), confirm/override dropdown (from chart_of_accounts)
- Bulk confirm button for high-confidence matches (>80%)
- Filter: uncategorised, confirmed, all
- Running totals: income vs expense

**C. Compliance Tracker Tab**
- Calendar-style list of upcoming obligations
- Each item: title, body (SARS/CIPC/etc), due date, status, overdue indicator
- Quick-add for new items
- AI advisory button: "What should I know?" — calls Lovable AI with current compliance state + SA regulatory context

**D. Chart of Accounts Tab**
- CRUD table for accounts
- Pre-seeded with ~30 standard SA SME accounts
- Type and tax treatment columns
- Active/inactive toggle

---

### 4. Navigation

- Add "Accountant" to admin sidebar (icon: Calculator or BookOpen)
- Route: `/admin/accountant`

---

### 5. Implementation Order

1. DB migration (tables + seed data + storage bucket + RLS)
2. Chart of Accounts UI (static CRUD, no AI needed)
3. Statement upload + CSV/PDF parsing edge function
4. Transaction review UI
5. AI categorisation edge function
6. Compliance tracker (table + seed + UI)

---

### Technical Notes

- CSV parsing happens in the edge function (Deno), no external libraries needed for basic CSV
- PDF parsing uses Lovable AI to extract structured transaction data from the document text
- All AI calls use `LOVABLE_API_KEY` (already configured)
- No external accounting APIs — everything is self-contained
- VAT calculations at 15% applied by AI based on `tax_treatment` of the matched account

