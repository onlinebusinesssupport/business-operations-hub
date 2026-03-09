
## Paystack Integration Plan

### What this enables
Clients can pay invoices directly from the Billing portal via Paystack (card, bank transfer, mobile money). When payment is confirmed by Paystack's webhook, the invoice status auto-updates to `paid` — no manual "Upload POP" step needed.

---

### How it Works

```text
Client clicks "Pay Now" on an invoice
        ↓
Edge Function: paystack-init
Creates a Paystack transaction, returns a payment URL
        ↓
Client is redirected to Paystack's hosted checkout
        ↓
Paystack calls our webhook (Edge Function: paystack-webhook)
        ↓
Webhook verifies the payment & updates invoice status → "paid"
        ↓
Client sees invoice marked Paid in real-time
```

---

### Steps

**1. Secret Required**
You need a Paystack Secret Key from your [Paystack dashboard](https://dashboard.paystack.com/#/settings/developer) under Settings → API Keys.

I will store it securely as `PAYSTACK_SECRET_KEY`. The publishable key goes in the frontend to initialize the popup (optional).

**2. New Edge Function: `paystack-init`**
- Accepts `invoice_id` and `client_email`
- Calls `https://api.paystack.co/transaction/initialize`
- Returns `authorization_url` for redirect

**3. New Edge Function: `paystack-webhook`**
- Receives Paystack webhook events (event: `charge.success`)
- Verifies HMAC signature using `PAYSTACK_SECRET_KEY`
- Looks up the invoice by `reference` stored in `metadata`
- Updates invoice status to `paid` and sets `paid_date`
- Logs to `activity_log` with action `PAYSTACK_PAYMENT_CONFIRMED`

**4. Database: `invoices` table**
Add a `paystack_reference` column (text, nullable) to link the Paystack transaction reference to the invoice.

**5. Billing UI update (`src/pages/portal/Billing.tsx`)**
- Replace/augment "Upload POP" with a **"Pay Now"** button for invoices with status `sent` or `overdue`
- On click: calls `paystack-init` edge function, then opens Paystack's hosted checkout URL
- Keep the existing manual POP upload as a fallback for EFT clients

---

### Technical Notes
- Paystack charges in **kobo (ZAR cents)** — amount × 100 in the API call
- The webhook URL to register in Paystack dashboard will be: `https://nibnxnfxsypmaijmgcgk.supabase.co/functions/v1/paystack-webhook`
- Signature verification uses `X-Paystack-Signature` header with HMAC SHA512

---

### Files to Create/Edit

| File | Action |
|------|--------|
| Migration SQL | Add `paystack_reference` column to `invoices` |
| `supabase/functions/paystack-init/index.ts` | New edge function |
| `supabase/functions/paystack-webhook/index.ts` | New edge function |
| `src/pages/portal/Billing.tsx` | Add "Pay Now" button |

---

### What I Need From You First
Before I can implement this, I need you to add your **Paystack Secret Key**. Once you confirm you want to proceed, I'll prompt you to enter it securely — I won't ask for it until you're ready.

Shall I proceed?
