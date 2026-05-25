# Mobile homepage redesign notes

Date: 2026-05-24
Scope: `pages/index.js`, hero, homepage mobile layout, trust order, motion polish.

## Why this pass happened

- Mobile homepage had horizontal overflow risk from hero/service layouts and marquee width.
- Header chrome too tall on mobile. Hero content pushed too far below fold.
- Social proof came too early. Mobile conversion flow weaker than it should be.
- Some labels and helper text were too small on phones.
- Motion stack already existed (`gsap`, `ScrollTrigger`, `Lenis`) but trust/stats sections did not use it enough.

## What changed

1. Section order improved for mobile-first conversion:
   - Hero
   - Trust band
   - Services + process
   - Reviews
   - Warning signs + proof card
   - Projects
   - Areas + FAQ
   - Bottom CTA

2. Mobile trust strip added under hero:
   - `20+ Years in Portland`
   - `5.0 Google Rating`
   - `CCB #232708`
   - `24/7 Emergency Response`

3. Hero/mobile layout hardened:
   - safer grid math
   - `min-width: 0` protections
   - full-width mobile CTA buttons
   - tighter mobile spacing
   - hidden gold topbar on mobile

4. Motion polish added:
   - count-up animation for stats using `data-countup`
   - subtle CTA sheen
   - section label gold-line grow

5. Readability fixes:
   - larger mobile helper/label text in warning signs
   - safer review card widths
   - review section clip overflow
   - smaller mobile map footprint

## Files touched

- `pages/index.js`
- `components/HeroSection.js`
- `styles/Home.module.css`
- `components/Layout.module.css`
- `components/ScrollMotion.js`
- `styles/WarningSigns.module.css`
- `styles/Reviews.module.css`

## Known intent

- Keep brand colors.
- Make mobile feel more professional, more trust-heavy, more conversion-focused.
- Motion should feel restrained and solid, not flashy.
- Construction brand should read as dependable, fast, licensed, local.

## If something breaks

Check these first:

1. Hero overflow:
   - `styles/Home.module.css`
   - `.heroInner`
   - `.heroFormCol`
   - `.heroFormPanel`

2. Mobile order:
   - `pages/index.js`
   - `styles/Home.module.css`
   - `.mobileServicesOrder`
   - `.mobileProcessOrder`

3. Count-up stats:
   - `components/ScrollMotion.js`
   - elements using `data-countup`

4. Sticky/header spacing:
   - `components/Layout.module.css`
   - `.topbar`
   - `.seasonalBanner`
   - `.mobileQuickBar`

5. Reviews overflow:
   - `styles/Reviews.module.css`
   - `.reviewsSection`
   - `.marqueeViewport`
   - `.reviewCard`

## Future good next steps

- Replace temporary proof numbers with audited business metrics if better numbers exist.
- Add before/after project proof block higher on mobile if photography improves.
- Track CTA click rate before/after this layout.
- If hero still feels crowded, move house visual below form on mobile only.
