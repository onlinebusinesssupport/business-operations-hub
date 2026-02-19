

# Visual Identity Refresh: Warm Minimalism with Terracotta

## Summary

Update the entire color system from cold monochrome to a warm, editorial palette built on three tones: **off-white**, **soft charcoal**, and **terracotta**. All changes flow from design tokens -- most components update automatically.

## Color Palette

```text
Off-White (background)      #FAF8F5
Soft Charcoal (foreground)   #2C2C2C
Terracotta (primary accent)  #C4653A
Terracotta Light (hover/bg)  #F0DDD4
Warm Muted Text              #8A8278
Warm Borders                 #EDE9E3
Card Surface                 #F5F2EE
```

## Files to Modify

### 1. src/index.css -- Design Tokens
- Light mode: swap all CSS custom properties to use the warm palette above
  - `--background` becomes the off-white
  - `--foreground` becomes soft charcoal
  - `--primary` becomes terracotta
  - `--primary-foreground` stays white
  - `--muted-foreground`, `--border`, `--divider`, `--card` all shift to warm neutrals
- Dark mode: complementary warm-dark tokens (deep warm charcoal bg, muted terracotta accent)
- Add `--terracotta` and `--terracotta-foreground` custom properties

### 2. tailwind.config.ts -- Color Mapping
- Add `terracotta` color referencing the new CSS variable for explicit use where needed

### 3. src/components/ui/button.tsx -- Primary Button
- The default/primary variant automatically picks up the terracotta from `--primary`
- No code change needed -- it flows from the token update

### 4. src/components/CallToAction.tsx -- CTA Banner
- Change `bg-primary` to `bg-terracotta` so the banner uses the warm terracotta tone
- Update text and button variants to contrast properly against terracotta

### 5. src/components/HowItWorks.tsx -- Step Accent
- Tint step numbers (01, 02, etc.) with `text-terracotta` for a subtle accent thread through the homepage

### 6. src/pages/HowWeWork.tsx -- CTA Section
- Change the bottom CTA section from `bg-primary` to `bg-terracotta` to match the warm identity

### 7. src/pages/Login.tsx -- Active Tab & Button
- Portal type selector active state: change from `bg-foreground` to `bg-terracotta text-white`
- Sign-in button inherits terracotta automatically via primary token

## What Stays the Same
- Typography (Inter + Playfair Display)
- Layout, spacing, and component structure
- Framer-motion animations and ALL CAPS micro-labels
- All routing and backend logic

## No New Dependencies Required

