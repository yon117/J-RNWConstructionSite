# Mobile Scroll Motion Upgrades Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve mobile conversion and readability with a sticky action bar, section jump menu, tighter hero layout, and lighter scroll motion.

**Architecture:** Keep mobile behavior in `components/Layout.js` and `components/Layout.module.css` so the fixed UI is global and reusable. Keep section content changes in `pages/index.js`, `components/HeroSection.js`, and the section styles that already own the visuals. Keep animation orchestration in `components/ScrollMotion.js` so motion stays centralized and can be reduced or disabled per viewport.

**Tech Stack:** Next.js Pages Router, React, CSS Modules, GSAP, ScrollTrigger, Lenis, existing `Layout` and `HeroSection` components.

---

### Task 1: Mobile action rail

**Files:**
- Modify: `components/Layout.js`
- Modify: `components/Layout.module.css`
- Modify: `pages/index.js`

- [ ] **Step 1: Add mobile action model**

```js
const MOBILE_ACTIONS = [
  { id: 'call', label: 'Call', href: 'tel:+15039982340' },
  { id: 'estimate', label: 'Estimate', action: 'contact' },
  { id: 'jump', label: 'Menu', action: 'sections' },
];
```

- [ ] **Step 2: Render sticky bottom bar on mobile only**

```jsx
{isMobile && (
  <div className={styles.mobileStickyBar} role="navigation" aria-label="Quick actions">
    ...
  </div>
)}
```

- [ ] **Step 3: Add menu toggle and section jump sheet**

```jsx
{showMobileSections && (
  <div className={styles.mobileSectionSheet}>
    {mobileSections.map((section) => (
      <button key={section.id} onClick={() => scrollToSection(section.id)}>
        {section.num} {section.label}
      </button>
    ))}
  </div>
)}
```

- [ ] **Step 4: Add mobile layout CSS**

```css
@media (max-width: 768px) {
  .mobileStickyBar { display: grid; grid-template-columns: 1fr 1fr 1fr; }
  .mobileSectionSheet { position: fixed; bottom: 64px; left: 12px; right: 12px; }
}
```

- [ ] **Step 5: Verify no overlap with footer and no horizontal scroll**

Run: `npm run build`
Expected: build passes, no CSS overflow regression in mobile viewport.

### Task 2: Hero trim

**Files:**
- Modify: `components/HeroSection.js`
- Modify: `styles/Home.module.css`

- [ ] **Step 1: Add mobile-only collapse points to hero**

```jsx
<div className={styles.heroMobileCompact}>
  <div className={styles.heroBadge} />
  <h1>...</h1>
  <div className={styles.heroMobileTrust}>...</div>
</div>
```

- [ ] **Step 2: Hide heavy hero elements on small screens**

```css
@media (max-width: 768px) {
  .heroHouseCol,
  .heroStats,
  .heroCredentials { display: none; }
}
```

- [ ] **Step 3: Keep one compact trust stack visible**

```css
.heroMobileTrust {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
}
```

- [ ] **Step 4: Keep CTA reachable above the fold**

Add mobile spacing so the form and `Call` action stay near the hero top.

- [ ] **Step 5: Verify first paint on mobile**

Run: `npm run build`
Expected: hero still renders, no clipped content, form reachable without deep scroll.

### Task 3: Scroll motion

**Files:**
- Modify: `components/ScrollMotion.js`
- Modify: `components/HeroSection.js`
- Modify: `pages/index.js`

- [ ] **Step 1: Keep desktop motion, reduce mobile motion**

```js
if (window.innerWidth <= 768) {
  // only lightweight fade/translate on mobile
}
```

- [ ] **Step 2: Add `data-anim` hooks to section roots and card groups**

```jsx
<section id="section-process" data-anim="section-reveal">
<section id="section-services" data-anim="section-reveal">
<section id="section-portfolio" data-anim="section-reveal">
<section id="section-contact" data-anim="section-reveal">
```

- [ ] **Step 3: Add staggered reveals for card grids**

Use `stagger-group` + `data-anim-child` on mobile-safe groups that already exist.

- [ ] **Step 4: Keep parallax only on desktop**

Retain the horizontal row parallax on wide screens, skip it under mobile breakpoint.

- [ ] **Step 5: Honor reduced motion**

If `prefers-reduced-motion: reduce`, skip GSAP setup entirely.

- [ ] **Step 6: Verify route transitions do not replay broken animation state**

Run: `npm run build`
Expected: build passes and route changes do not throw chunk or animation errors.

### Task 4: Mobile polish pass

**Files:**
- Modify: `components/Reviews.js`
- Modify: `styles/Reviews.module.css`
- Modify: `styles/WarningSigns.module.css`
- Modify: `styles/Home.module.css`

- [ ] **Step 1: Compact review cards on small screens**

```css
@media (max-width: 640px) {
  .reviewCard { width: 86vw; min-height: auto; }
}
```

- [ ] **Step 2: Tighten long sections and accordions**

Reduce padding for `WarningSigns`, `FAQ`, `Services`, and `bottomCta` on mobile.

- [ ] **Step 3: Keep text readable**

Maintain white or high-contrast text on all dark mobile surfaces.

- [ ] **Step 4: Check for tap target size and scroll traps**

Buttons, nav items, and CTA bar must stay large enough for thumb use.

- [ ] **Step 5: Verify in browser**

Run: `npm run build`
Then open home page at mobile width and confirm:
`sticky bar visible`, `section menu opens`, `hero shorter`, `scroll motion subtle`, `no horizontal scroll`.

### Self-Review

- Scope covered: sticky bottom CTA, section jump menu, hero trim, scroll animations, mobile polish.
- No placeholders left.
- Files are separated by responsibility: layout shell, hero, motion engine, section styles.
- Desktop behavior stays intact because mobile changes are gated by viewport and existing section structure.

