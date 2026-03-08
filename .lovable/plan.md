
# Make the System Live and Interactive

## Problem Summary

Two core issues need fixing:

1. **Onboarding Wizard shows "Step 1 of 4" but feels empty** -- The wizard exists and has all 4 steps, but clients arriving via the approval flow don't see it because the `approve-application` Edge Function creates a profile with `onboarding_completed` potentially already set, or the profile/client linkage is incomplete. The welcome step (Step 0) also lacks visual warmth -- no branded imagery or clear value proposition.

2. **Admin approval feels disconnected** -- When you approve an application, the Edge Function sends an invite email and creates a client record, but there's no visible feedback loop back into the Admin dashboard. The pipeline, applications page, and overview don't refresh or show the activation result. The whole system feels like a shell because actions don't cascade visibly.

---

## Plan

### 1. Fix the Approval-to-Onboarding Pipeline

**Edge Function (`approve-application`):**
- After creating the client record, also generate 4 default onboarding `work_items` (same as the pipeline activation does) and a welcome `update` entry
- Log an `activity_log` entry so the activity feeds light up immediately
- Ensure the profile is created with `onboarding_completed = false` so the wizard triggers on first login

**Admin Applications page:**
- After successful approval, invalidate all relevant queries (`overview-clients`, `overview-work`, `pipeline-*`) so the dashboard metrics update instantly
- Show a success state with a summary: "Workspace created, invite sent, 4 onboarding tasks generated"
- Add a "View Workspace" link that navigates to the Partner Workspaces page

### 2. Upgrade the Onboarding Wizard

Make the 4-step wizard feel premium and alive:

- **Step 0 (Welcome):** Add the brand logo/mark, a calming welcome message with the client's name (pulled from the invite metadata), and a preview of what the 4 steps cover
- **Step 1 (Personal):** Pre-fill name and email from the auth metadata so it feels seamless
- **Step 2 (Business):** Pre-fill company name and industry from the invite metadata
- **Step 3 (Final):** Add a completion animation and the brand sign-off line: "Welcome to SUPPORT STUDIO(TM) -- Clarity builds momentum. Systems build freedom."

### 3. Connect Admin Actions to Visible Results

**AdminOverview:** 
- Add a "Recent Activations" mini-section that shows the last 3 approved clients with timestamps
- Ensure all KPI cards pull fresh data after any approval action

**AdminApplications:**
- After approval, show a confirmation banner with next steps visible
- Add activity logging so the approval shows in the Global Activity feed

**AdminLeadPipeline:**
- When a lead is dragged to "Won", also check if there's a matching application and update its status to "approved" for consistency
- Ensure the `activateClient` mutation creates the same infrastructure as the Edge Function (work items, updates, activity log)

### 4. Client Portal Post-Onboarding Experience

**PortalDashboard:**
- After completing the onboarding wizard, show a "First Week" welcome banner (Day 1 message) that persists for 7 days
- The dashboard should immediately show the onboarding work items as "Current Priorities"
- The activity feed should show the welcome entry

**Requests page:**
- If `clientId` is null (profile exists but no client linkage), show a clearer message: "Your workspace is being prepared. You'll have full access shortly."

### 5. Database Migration

Add a `client_id` column relationship improvement -- currently `clients.contact_profile_id` links to profiles, but the `get_my_client_id()` function already handles this. No schema changes needed.

Ensure the Edge Function creates an `activity_log` entry by adding an insert after client creation (using the service role client).

---

## Technical Details

### Files to modify:
- `supabase/functions/approve-application/index.ts` -- Add work_items, updates, and activity_log creation after client setup
- `src/components/OnboardingWizard.tsx` -- Enhance visual design, pre-fill fields from auth metadata, add completion animation
- `src/pages/admin/AdminApplications.tsx` -- Invalidate broader queries on approval, show richer success state
- `src/pages/admin/AdminOverview.tsx` -- Add recent activations section
- `src/pages/portal/PortalDashboard.tsx` -- Add first-week welcome banner
- `src/pages/portal/Requests.tsx` -- Better empty state when client workspace is pending

### Files to create:
- None -- all changes fit within existing files

### No new dependencies needed.
