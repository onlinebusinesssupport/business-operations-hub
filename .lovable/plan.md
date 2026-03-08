

## Newsletter Email Collection & Admin Management

### Current State
- The Media page has a "Stay Informed" newsletter section but **no email input field** — it's just a heading.
- The Footer has no newsletter signup either.
- No `newsletter_subscribers` table exists in the database.
- Emails from `contact_submissions` and `applications` tables exist but aren't surfaced as a mailing list.

### What We'll Build

**1. Database — `newsletter_subscribers` table**
- `id`, `email` (unique), `source` (text — "footer", "media", "blog"), `subscribed_at`, `unsubscribed_at` (nullable), `is_active` (boolean, default true)
- RLS: Public INSERT (anyone can subscribe), admin-only SELECT/UPDATE/DELETE
- No auth required to subscribe

**2. Website — Email Collection Points**
- **Footer**: Add a compact email input + "Subscribe" button in the footer's empty 4th column area
- **Media page**: Add an email input to the existing "Stay Informed" section (currently has no form)
- Both submit to `newsletter_subscribers` with the appropriate `source` tag
- Toast confirmation on success, duplicate email handling (upsert — silently succeed)

**3. Admin Page — `/admin/subscribers`**
- New admin page showing all collected emails in a table: email, source, date subscribed, active status
- **Aggregate view**: Also pulls unique emails from `contact_submissions` and `applications` tables so you see ALL emails collected across the platform in one place
- Search/filter by source
- Export to CSV button (client-side generation, no API needed)
- Toggle active/inactive (for unsubscribes)
- Add to admin sidebar navigation

### Implementation Order
1. DB migration (table + RLS + public insert policy)
2. Footer newsletter input component
3. Media page newsletter form
4. Admin subscribers page with CSV export
5. Sidebar nav update

