

## Billing Workflow: Invoice Upload → Client Payment → POP Upload

### Problem
Currently, invoices are just database records with no file attachments. There's no way for admins to upload an actual invoice document, no way for clients to download it, and no mechanism for clients to upload Proof of Payment (POP) with transaction details.

### Workflow Design

```text
ADMIN creates invoice          CLIENT sees invoice
with file + details            downloads PDF/file
        │                              │
  [draft] → [sent] ──────────► [visible to client]
                                       │
                               Client pays externally
                                       │
                               Client uploads POP
                               + logs details
                                       │
                          [awaiting_confirmation] ◄──┘
                                       │
                               Admin reviews POP
                                       │
                                    [paid] ✓
```

**Invoice statuses**: `draft` → `sent` → `awaiting_confirmation` → `paid` (+ `overdue` as needed)

**Stage trigger**: When admin moves an invoice from `draft` to `sent`, it becomes visible to the client. No new work manager stage needed — the billing tab itself IS the workflow stage.

### Database Changes

Add columns to the `invoices` table:
- `file_path text` — path to uploaded invoice file in storage
- `pop_file_path text` — path to client's uploaded POP
- `pop_details jsonb` — client-logged payment details (reference number, bank, amount paid, date paid)
- `invoice_number text` — already exists

Add RLS policy so clients can UPDATE their own invoices (only `pop_file_path` and `pop_details` fields — enforced at app level since Postgres column-level RLS isn't practical; the existing "sent"/"awaiting_confirmation" status acts as a guard).

Create a storage bucket `invoice-files` (private) with RLS:
- Admins can upload/read all
- Clients can read files in their client folder + upload POP files

### Admin Billing Tab Changes (PartnerCockpit)

Enhance the existing billing section:
1. **"Create Invoice" button** opens a form with: invoice number, amount, due date, description, currency, and **file upload** (PDF/image)
2. File uploads to `invoice-files/{client_id}/invoices/{filename}`
3. Invoice list shows a download link for the file
4. New status option: `awaiting_confirmation` (when client uploads POP)
5. POP column — admin can view/download the client's uploaded POP and see their logged details
6. One-click "Confirm Payment" button to mark as `paid`

### Client Billing Page Changes (portal/Billing.tsx)

Enhance the existing client billing page:
1. Invoices with status `sent`, `awaiting_confirmation`, `overdue`, or `paid` are visible (not `draft`)
2. Each invoice row gets a **"Download Invoice"** button (signed URL from storage)
3. For unpaid invoices (`sent`/`overdue`): **"Upload POP"** button opens a dialog:
   - File upload (PDF/image of POP)
   - Reference/transaction number (text)
   - Bank name (text)
   - Amount paid (number)
   - Date paid (date picker)
4. On submit: uploads file to `invoice-files/{client_id}/pop/{filename}`, updates invoice with `pop_file_path` + `pop_details`, sets status to `awaiting_confirmation`
5. Status badges update to reflect the full lifecycle

### Technical Notes

- All file serving uses Supabase signed URLs (time-limited, secure)
- No external payment APIs — purely file-based workflow
- Activity log entries for: invoice created, invoice sent, POP uploaded, payment confirmed
- Client can only upload POP for invoices in `sent` or `overdue` status (app-level guard)

