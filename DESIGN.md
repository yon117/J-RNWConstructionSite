---
name: J-RNW Construction
description: Rugged premium contractor site built on deep navy and earned gold.
colors:
  gold: "#C8961E"
  gold-light: "#E8B84B"
  gold-antique: "#D4AF37"
  deep-midnight: "#0F1923"
  dark-slate: "#1A2736"
  dark-card: "#1E2F40"
  footer-black: "#080F16"
  warm-offwhite: "#F5F3EF"
  muted-linen: "#D4CFC8"
  steel-blue-gray: "#8A9BAA"
  emergency-red: "#B84040"
typography:
  display:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(46px, 7vw, 78px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "clamp(32px, 4vw, 48px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Barlow Condensed, sans-serif"
    fontSize: "1.15rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.03em"
  body:
    fontFamily: "Barlow, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "Barlow, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.2em"
rounded:
  sharp: "2px"
  sm: "3px"
  md: "4px"
  pill: "50px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "24px"
  lg: "40px"
  section: "96px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.deep-midnight}"
    rounded: "{rounded.sm}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.gold-light}"
    textColor: "{colors.deep-midnight}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.warm-offwhite}"
    rounded: "{rounded.sm}"
    padding: "13px 24px"
  nav-cta:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.deep-midnight}"
    rounded: "{rounded.sm}"
    padding: "9px 18px"
---

# Design System: J-RNW Construction

## 1. Overview

**Creative North Star: "The Foreman's Gold Standard"**

J-RNW is built the way a foreman runs a job site: everything in its place, no wasted motion, every element accountable. The deep navy palette is not chosen to look sleek; it is chosen because it commands attention at arm's length on a phone screen in bright daylight. The gold accent is not decorative; it is the mark left by earned confidence, the stripe on a hard hat that means someone knows what they are doing. Every interface decision answers to one question: does this make a skeptical homeowner more likely to pick up the phone?

The system rejects three things by name. First, SaaS cream: soft whites, Inter on beige, rounded everything. Nothing on this site should feel like a productivity app. Second, low-budget contractor stock: clip-art hammers, safety-yellow CTAs, Comic Sans energy. The craft is real; the interface must match it. Third, cold corporate: all-blue enterprise palettes with zero warmth. This is a local family business with serious skills, not an insurance company.

The result is a **committed dark system** with a single saturated accent. Navy surfaces stack in four lightness steps. Gold appears on at most 10-15% of any given screen; its scarcity is its authority. Typography is compressed, uppercase, and heavy where it commands; relaxed and readable where it informs.

**Key Characteristics:**
- Deep navy in four tonal steps; no pure black, no gray without blue
- Gold is earned: CTA, icon accent, active state, section label; never decoration
- Barlow Condensed for every headline; Barlow for all body copy; no third family
- Corners are almost square: 2-4px max on interactive elements
- Grid gaps of 2-3px create seams, not padding; sections feel architectural
- Section labels use a 24px gold rule before the text; consistent system-wide

## 2. Colors: The Foreman's Palette

One saturated accent on four navy steps. No secondary accent. Every color has a specific structural role; nothing exists for decoration.

### Primary
- **Construction Gold** (#C8961E): The canonical accent. CTA backgrounds, active states, section label rules, icon color, form focus rings, nav hover underlines. Never used as a large background surface.
- **Gold Hover** (#E8B84B): Button hover state only. One step lighter than Construction Gold; confirms interaction without a jarring shift.

### Secondary
- **Antique Gold** (#D4AF37): Decorative and ambient gold. Service card corner brackets, step-number circles, warning severity indicators, badge highlights. Slightly warmer and brighter than the canonical gold; use where structural weight is lower.

### Neutral
- **Deep Midnight** (#0F1923): Root background and primary surface. The lowest layer of the site.
- **Dark Slate** (#1A2736): Section alternating background, card surfaces, form inputs. One step above Deep Midnight.
- **Dark Card** (#1E2F40): Card and panel fill. Sits on Dark Slate without visible overlap; adds depth without shadow.
- **Footer Black** (#080F16): Footer only. The floor of the tonal stack.
- **Warm Off-White** (#F5F3EF): Primary text on dark. Slightly warm to match the gold; never pure white.
- **Muted Linen** (#D4CFC8): Secondary body text. Paragraphs, descriptions, form placeholder context.
- **Steel Blue-Gray** (#8A9BAA): Muted supporting text. Labels, footer links, trust items, helper copy.
- **Emergency Red** (#B84040): Emergency button and panel only. Never used for general errors. Carries its own glow shadow.

### Named Rules
**The Scarcity Rule.** Construction Gold (#C8961E) appears on no more than 15% of any given screen. The gold glow on the floating button, the underline on nav hover, the form focus ring — these register precisely because the rest of the screen holds back. Never fill a section background with gold.

**The Seam Rule.** Dark color borders between grid cells (2-3px gaps with a gold-tinted background) create the impression of architectural joints, not gutters. Use `background: rgba(200, 150, 30, 0.06)` on grid wrappers and `gap: 2px` on the cells. This is load-bearing — do not replace seams with padding.

## 3. Typography

**Display Font:** Barlow Condensed (Google Fonts, weights 700-800; fallback: sans-serif)
**Body Font:** Barlow (Google Fonts, weights 400-600; fallback: sans-serif)
**Label/Mono Font:** None. Barlow at small sizes with wide letter-spacing covers every utility role.

**Character:** Barlow Condensed at 800 weight, uppercase, tight line-height (0.95) reads like painted signage on a building. It does not ask — it declares. Barlow at 400 weight for body is the foreman's spoken word: clear, direct, unornamented. The pairing works because compression at the large scale leaves room for the body to breathe.

### Hierarchy
- **Display** (800, clamp(46px 7vw 78px), line-height 0.95, uppercase, letter-spacing -0.01em): Hero H1 only. Gold `em` spans for the brand name or key phrase. Never used below the fold.
- **Headline** (800, clamp(32px 4vw 48px), line-height 0.95, uppercase, letter-spacing -0.01em): Section titles (`h2`). The gold `em` span pattern carries through: one phrase in gold, the rest in Warm Off-White.
- **Title** (800, 1.05-1.45rem, line-height 1.15-1.25, uppercase, letter-spacing 0.02-0.04em): Component titles inside cards, FAQ questions, footer column headers. Barlow Condensed but smaller.
- **Body** (400-500, 14-16px, line-height 1.7): Paragraphs, form help text, service descriptions. Max line length 65-75ch. Color: Muted Linen (#D4CFC8) on dark backgrounds.
- **Label** (600, 10-12px, line-height 1, letter-spacing 0.1-0.2em, ALL CAPS): Section eyebrows, form field labels, badge text, nav links. Color: Steel Blue-Gray (#8A9BAA) or Construction Gold depending on context.

### Named Rules
**The Uppercase Contract.** Every Barlow Condensed instance is `text-transform: uppercase`. No exceptions. Mixing case with Condensed 800 breaks the system's authority register.

**The Gold Em Rule.** In display and headline text, exactly one phrase per heading gets `color: var(--gold)` via an `<em>` span (with `font-style: normal`). One voice elevated. Not two, not zero.

## 4. Elevation

This system uses a hybrid approach: tonal depth through dark surface stacking as the base layer, with targeted shadows for floating and interactive-response elements only.

The four dark steps (Footer Black → Deep Midnight → Dark Slate → Dark Card) create a Z-axis without shadows. A panel sits visibly above its background because its fill is one step lighter, not because it casts a shadow. This is the system's ground state: flat by default.

Shadows appear in three specific contexts only: scroll response (nav after scrolling), hero form panel (establishes the quote form as the primary conversion surface), and floating/fixed UI (floating contact button, emergency button). In all three cases, the shadow is directional and generous in radius — blurred broad spreads, not tight offsets.

### Shadow Vocabulary
- **Nav Scroll Shadow** (`0 4px 24px rgba(0,0,0,0.5)` + `backdrop-filter: blur(8px)`): Appears on the sticky nav after the user scrolls. Separates nav from content; signals that the nav plane is above the page.
- **Hero Form Lift** (`0 28px 80px rgba(0,0,0,0.35)`): Applied to the quote form panel in the hero. The only large-radius shadow on a content element; establishes the form as the primary conversion object.
- **Gold Glow Float** (`0 4px 20px rgba(200,150,30,0.4)`): Floating CTA button only. A warm ambient glow that marks the gold button as permanently accessible. Never applied to static in-page buttons.
- **Emergency Glow** (`0 4px 24px rgba(184,64,64,0.4)`): Emergency button only. Mirrors the Gold Glow Float pattern but in red. Reserved for emergency contact UI.
- **Step Number Halo** (`0 4px 18px rgba(212,175,55,0.38)`): Gold circular step indicators in the process section. Communicates that these numbered nodes are interactive waypoints.

### Named Rules
**The Flat-By-Default Rule.** Service cards, project cards, contact form container, FAQ accordion, area chips: no `box-shadow` at rest. Depth comes from the four-step dark surface stack. Shadows are earned by floating, scrolling, or emergency contexts only.

## 5. Components

### Buttons
Tactile and direct. Almost square corners. No border-radius above 3px on interactive elements. Uppercase Barlow Condensed. The gold primary button is the single loudest element on any page section; there should be at most one per viewport.

- **Shape:** Almost square (3px radius)
- **Primary:** Construction Gold background (#C8961E), Deep Midnight text (#0F1923), padding 14px 28px. Barlow Condensed 700, 15px, uppercase, letter-spacing 0.1em. Min-height 48px for tap targets.
- **Hover:** Gold Light (#E8B84B) background, `translateY(-1px)`, transition 0.2s.
- **Secondary / Ghost:** Transparent background, 1px solid `rgba(255,255,255,0.2)` border. Hover: border shifts to Construction Gold, text shifts to gold. Same shape and sizing as primary.
- **Nav CTA:** Identical to primary but compact: 9px 18px padding, 12px font. Lives in the navbar; no `::after` underline pseudo-element (explicitly disabled).
- **Form Submit:** Full-width primary button variant. 14px padding, min-height 52px. Disabled state: `opacity: 0.6`, `cursor: not-allowed`.

### Service Cards
The most distinctive component in the system. Corner bracket decorations via `::before` (top-left) and `::after` (bottom-right) pseudo-elements in Antique Gold (#D4AF37). These brackets expand on hover (14px → 22px). Ghost numerals in Barlow Condensed 800 at 5.5rem, `rgba(200,150,30,0.055)` opacity, sit bottom-right as watermark.

- **Shape:** No border-radius (0px). Grid seam system handles separation.
- **Background:** `#0e1622` at rest, `#131e30` on hover.
- **Border:** `1px solid #1a2535` at rest, shifts to `#253548` on hover.
- **Internal Padding:** 28px 24px.
- **Hover:** Background shift + bracket expansion + border shift. No transform, no shadow.

### Project Cards
Photo-based. Image fills the card; a gradient overlay (`to top`, 95% → 0%) sits above. Category in small gold uppercase; title in Barlow Condensed 800 white uppercase at the bottom. Featured card spans 2 grid rows.

- **Shape:** No border-radius. 3px gap between cells on a near-black grid wrapper.
- **Image Treatment:** `brightness(0.65) saturate(0.8)` at rest; `brightness(0.8) saturate(1)` on hover with `scale(1.05)`.
- **Overlay:** `linear-gradient(to top, rgba(8,18,28,0.95) 0%, transparent 55%)`.

### Inputs / Fields
Minimal. Stroke-based with dark fill.

- **Style:** `background: var(--dark-mid)`, `border: 1px solid rgba(255,255,255,0.08)`, `border-radius: 3px`, padding 12px 14px.
- **Focus:** Border shifts to `var(--gold)`. No glow, no scale.
- **Placeholder:** Steel Blue-Gray (#8A9BAA).
- **Min-height:** 48px for all inputs, 100px for textarea.

### Navigation
Two-tier: gold topbar (phone, address, hours) above the main dark nav. Sticky after scroll.

- **Topbar:** Construction Gold (#C8961E) background, Deep Midnight text. 12px Barlow 600. Compact 7px vertical padding.
- **Nav:** Deep Midnight background. Logo circle with gold border; brand name in Barlow Condensed 700 19px. Links in Steel Blue-Gray, uppercase 13px, hover to gold with a 1px gold underline that scales in via `scaleX`.
- **Scrolled State:** `rgba(10,14,20,0.97)` background, `backdrop-filter: blur(8px)`, gold-tinted `border-bottom`.
- **Mobile:** Links collapse; gold-bordered hamburger appears. Mobile drawer on `--dark-mid` background; items 54px min-height for touch targets.

### Section Label (Signature Component)
Every section opens with a label row: a 24px × 2px Construction Gold rule, a gap, then uppercase Barlow 600 11px in Construction Gold with 0.2em letter-spacing. Implemented via `::before` pseudo-element. Provides consistent section entry rhythm across every page.

- **Style:** `display: flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 600; color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase`
- **Rule:** `::before { content: ''; width: 24px; height: 2px; background: var(--gold); flex-shrink: 0; }`

### FAQ Accordion
- **Background:** `#0e1622` with gold-tinted 1px border (`rgba(200,150,30,0.08)`). Border brightens to `rgba(200,150,30,0.28)` when open.
- **Question:** Barlow Condensed 800 uppercase, Warm Off-White. Gold category chip (9px, Barlow Condensed, 2px border-radius) at left.
- **Answer:** Barlow body text, Steel Blue-Gray, with a 2px gold-tinted `border-left` at 0.25 opacity. (Exception to the side-stripe ban: thin 2px decorative rule at reduced opacity on block-quote-style answer text, not on card/list items.)

## 6. Do's and Don'ts

### Do:
- **Do** use Construction Gold (#C8961E) as the single accent. One voice, one color.
- **Do** use the four-step dark surface stack (Footer Black → Deep Midnight → Dark Slate → Dark Card) to create depth before reaching for shadows.
- **Do** keep Barlow Condensed at 800 weight and uppercase on every headline. Scale and weight are the hierarchy; mixing case breaks the system.
- **Do** put at most one primary gold CTA button in each viewport section. Its scarcity is its power.
- **Do** use the 24px gold rule + uppercase label before every section heading, system-wide.
- **Do** use the corner bracket `::before` / `::after` pattern on service cards as the signature interactive affordance.
- **Do** use `rgba(200, 150, 30, 0.06)` as the grid wrapper background and 2-3px gaps between cells. These seams are structural, not decorative.
- **Do** size all tap targets to minimum 48px height on mobile.
- **Do** pair every headline `<h2>` with the gold-em pattern: one phrase elevated in Construction Gold via `font-style: normal` `<em>`.

### Don't:
- **Don't** use SaaS cream: soft whites, Inter on beige, rounded-everything aesthetic. This site is a contractor, not a productivity app.
- **Don't** use low-budget contractor stock imagery clichés: clip-art hammers, safety-yellow CTAs, Comic Sans energy.
- **Don't** use cold corporate palettes: all-blue enterprise colors with zero warmth. The navy must stay warm-tinted.
- **Don't** use border-radius above 4px on buttons, cards, inputs, or interactive elements. The hero form panel (26px) and floating pill button (50px) are isolated exceptions with explicit rationale.
- **Don't** fill any content section with a gold background. Gold belongs on elements, not surfaces. The gold topbar is the only full-width gold surface; it defines the brand entry and then recedes.
- **Don't** add a second typeface. Barlow and Barlow Condensed are the entire type system.
- **Don't** use glassmorphism as a default treatment. The nav scrolled-state blur is purposeful and state-driven; do not apply blur to cards or decorative panels.
- **Don't** use gradient text (`background-clip: text`). Gold text is always `color: var(--gold)`, solid, no gradient.
- **Don't** add shadows to static card or list elements. Shadows are reserved for floating, scroll-response, and emergency-context elements only.
- **Don't** use the hero-metric template (big number, small label, gradient accent) as a section pattern. Stats exist as a horizontal strip subordinate to the hero, not as a standalone section centerpiece.
