

## Build an In-Platform Email Hub for Client Communication

### What this does
Adds an "Emails" section to the admin panel where you can compose and send emails to your clients directly from the platform, using your `supportstudio.co.za` domain. All sent emails are logged so you have a full history of client communication without switching to Gmail or Outlook.

### Important constraint
Lovable's managed email system supports **transactional** emails (one-to-one, triggered by business events — like sending a client an update, a document link, or a follow-up). It does **not** support bulk marketing/newsletter campaigns. For your use case of emailing individual clients, this fits perfectly.

### Changes

**1. Database: `client_emails` table**
- `id`, `client_id` (FK → clients), `sent_by` (user_id), `to_email`, `subject`, `body_html`, `body_text`, `status` (sent/failed), `sent_at`, `created_at`
- RLS: admins can insert/select; clients can select their own emails
- This gives you a full audit trail of every email sent

**2. Edge function: `send-client-email`**
- Accepts `to_email`, `subject`, `body` (and optional `client_id`)
- Renders a branded HTML email wrapper (matching your existing template style — forest green, Space Grotesk)
- Sends via the Lovable transactional email API using your custom domain
- Inserts a record into `client_emails` and optionally into `notifications`

**3. Admin UI: Email tab + compose dialog**
- Add an "Emails" nav item in the admin sidebar
- Page shows a list of all sent emails (filterable by client, date)
- "Compose" button opens a dialog with: recipient (dropdown of clients or manual email), subject, rich-text body
- Send button calls the edge function
- Each client's detail/cockpit view also gets a "Send Email" shortcut

**4. Client portal: received emails view**
- Optional: add an "Emails" or "Messages" section in the client portal so clients can see emails sent to them (read-only)

### Technical approach
- The edge function uses `@lovable.dev/email-js` (same library as auth-email-hook) to send through your verified domain
- Email body is wrapped in a branded React Email template consistent with your existing auth templates
- All emails are persisted to the database for history/audit

