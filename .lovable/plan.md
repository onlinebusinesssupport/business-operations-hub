
## Goal

Rework the "Environments we've operated in" section on `/about` so it conveys depth of experience as a **studio capability**, not a personal CV. Remove org names, job titles, dates, and the location-by-role mapping. Keep the credibility, lose the literalness.

## Approach

Replace the 8-card org/role grid with a **"Sectors we've operated across"** layout: 4 industry domain pillars, each showing what the studio brings out of that world — not who worked where or when.

Each pillar = one card with:
- Sector name (e.g. Hospitality & Service)
- One-line "what this gives us" capability statement
- 2–3 short skill tags (operational outcomes, not job titles)

### Proposed pillars

1. **Hospitality & Service Operations** — service standards, guest-grade communication, calm under pressure.
   Tags: SOPs · Service design · Crisis handling
2. **Corporate & Executive Support** — inbox, calendar, and decision-flow management at executive tempo.
   Tags: Exec ops · Stakeholder mgmt · Confidentiality
3. **Corporate Travel & Logistics** — coordinating people, suppliers, and timelines without things slipping.
   Tags: Vendor coordination · Itineraries · Budget control
4. **Nonprofit & Impact Operations** — running lean teams that have to deliver public outcomes with limited resources.
   Tags: Grants ops · Reporting · Award submissions

### Credibility strip (replaces the city list)

A single quiet row of numbers, no names:
- 15+ years combined operating experience
- 4 sectors
- 7+ awards delivered for client and partner organisations
- Operating across South Africa & globally

## Copy changes

- Eyebrow stays: `OPERATIONAL EXPERIENCE`
- Heading changes from "Environments we've operated in." → **"Sectors we've operated across."**
- Subhead changes from a decade-of-leadership line → "The studio is built on operator experience from four high-pressure sectors. Every Virtual Assistant, Setter, and remote operator we place inherits these standards."

## Files

- `src/pages/About.tsx`
  - Replace the `experienceMap` array with a new `sectors` array (4 items, sector + capability + tags).
  - Replace the org-card grid render with a 4-card sector grid (keep the same motion/timing pattern and `Briefcase`/`Award` icon usage feel, but no org name, role, period, location, or highlight fields).
  - Replace the city pills row with the credibility strip above.
  - Keep section background, borders, spacing, animations.

## Out of scope

- No changes to other About sections (hero, story, values, who-we-serve, philosophy).
- No copy changes elsewhere on the site.
- No removal of the section — it stays, just reframed.
