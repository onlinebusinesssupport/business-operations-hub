
## Goal

Reposition The Business Support Studio™ from a founder-led ("Dylan Mgobhozi") brand into a studio/agency that supplies the best Virtual Assistants, Setters, and remote/virtual talent for businesses. Update contact details everywhere. Keep all existing service packages and pricing untouched.

## New brand facts (apply globally)

- Email: `thebusinesssupportstudio@gmail.com` (replaces `thequitehelpinghand@gmail.com`)
- Phone: `+27 62 889 6021` / displayed as `062 889 6021` (replaces `+27 74 953 4914`)
- WhatsApp link: `https://wa.me/27628896021`
- `tel:` link: `tel:+27628896021`
- No personal founder attribution. Replace "Dylan", "Dylan Mgobhozi", "Founder" mentions with the studio voice ("our team", "the studio", "The Business Support Studio™").
- Information Officer (legal pages, POPIA): change from "Dylan Mgobhozi" to "The Business Support Studio™ — Information Officer" (generic role, same email).

## New positioning line

"South Africa's studio for elite Virtual Assistants, Appointment Setters, and remote operators — matched, managed, and embedded into your business."

## Files to update

1. `src/pages/About.tsx`
   - Remove the personal founder section (photo block, "Dylan Mgobhozi · Founder", paragraphs about his career arc).
   - Replace with a studio-origin narrative: a remote-talent studio built to give SA founders access to vetted VAs, setters, and operators. Keep the Experience Map / trust signals reframed as the studio's collective experience instead of one person's CV.
   - First-person "I/Me" copy → first-person plural "we/our team".

2. `src/pages/Contact.tsx`
   - Replace all email + phone + WhatsApp references with the new ones.

3. `src/components/Footer.tsx`
   - Update email + phone links.
   - Tagline can stay; optionally tighten to mention VA/setter talent.

4. `src/pages/Privacy.tsx` and `src/pages/Terms.tsx`
   - Replace email and Information Officer references. Keep legal entity ("The Business Support Studio (Pty) Ltd", Johannesburg).

5. `src/pages/Reviews.tsx`
   - Replace every "Dylan" with "the studio" / "our team" / "The Business Support Studio™" (form labels, response attribution, intro copy).

6. `src/components/OnboardingWizard.tsx`
   - Change `— Dylan, Founder` signature to `— The Business Support Studio™ team`.

7. `src/pages/admin/AdminSettings.tsx`
   - Update displayed admin name/email to the new studio email (keep the field, just change the seed value).

8. Light positioning refresh on:
   - `src/components/Hero.tsx`
   - `src/components/ServicesPreview.tsx` / `src/components/ServiceTiers.tsx`
   - `src/pages/Services.tsx`
   - Add a clear VA / Setter / Remote-talent angle to the headline and supporting copy. **Do not change package names, scope, deliverables, or pricing.**

## Out of scope (explicitly not changing)

- Service tier structures, package contents, prices.
- Database schema, edge functions, auth, billing logic.
- Studios infrastructure (Digital Presence, Lead Engine, Automation, Operations, Travel & Activities, Grants & Awards) — these stay as the productised packages; the VA/Setter framing wraps around them.
- Memory entries about Dylan as founder will need refreshing afterwards, but no code depends on them.

## Validation

- Grep the repo after changes for `Dylan`, `Mgobhozi`, `thequitehelpinghand`, `4914`, `749534914` — should return zero results.
- Visually check Home, About, Contact, Footer, Privacy, Terms, Reviews, Onboarding modal.
