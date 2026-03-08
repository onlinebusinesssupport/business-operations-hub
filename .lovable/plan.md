

## Problem Analysis

Two issues:

1. **Subscribe button fails** — The form uses `upsert` with `onConflict: "email"`. When an email already exists, the upsert attempts an UPDATE, which is blocked by RLS (only admins can update). This causes the "Something went wrong" error.

2. **Missing fields** — The form only collects email. You want **full name** and a **POPI consent checkbox**.

## Plan

### 1. Database Migration

Add two columns to `newsletter_subscribers`:
- `full_name` (text, nullable for backward compat)
- `popi_consent` (boolean, default false)

Update the RLS INSERT policy to also allow anonymous users to UPDATE their own row (or switch from upsert to an insert-only approach with conflict handling).

**Simplest fix**: Replace `upsert` with a plain `insert` using `.insert(...).select()` and handle duplicate emails gracefully (catch unique constraint error code `23505` and show a friendly "You're already subscribed" message). This avoids needing UPDATE permissions entirely.

### 2. Update NewsletterForm Component

- Add `fullName` state and input field
- Add `popiConsent` boolean state and a checkbox: "I consent to receiving communications in accordance with POPIA"
- Validate: require full name (non-empty, max 100 chars), require consent checked
- Send `full_name` and `popi_consent` in the insert payload
- Handle duplicate email error with a friendly toast instead of generic error

**Compact mode** (footer): Stack the name + email inputs in a tighter layout, checkbox below, button beside email.

**Non-compact mode** (e.g. Media page): More spacious vertical layout.

### 3. Admin Subscribers Page

Ensure the admin subscribers view displays the new `full_name` and `popi_consent` columns (will check if it auto-reads from the table).

### Files Changed

| File | Change |
|------|--------|
| Migration SQL | Add `full_name`, `popi_consent` columns |
| `src/components/NewsletterForm.tsx` | Add name input, POPI checkbox, switch from upsert to insert with duplicate handling |
| `src/pages/admin/AdminSubscribers.tsx` | Display full_name and consent status columns |

