# Homepage Hero, Interactive House & Motion System — Implementation Plan

> **For agentic workers:** Use `superpowers:executing-plans` or `superpowers:subagent-driven-development` to implement task-by-task. Check off steps with `- [ ]` / `- [x]`.

**Goal:** Homepage hero at top with cut-reveal copy, animated phrase cycler, interactive house (exterior/interior + service hotspots), estimate form under house; site-wide GSAP scroll motion, pinned services, tilted projects grid, curtain day/night — all responsive and `prefers-reduced-motion` safe.

**Architecture:** Next.js Pages Router + CSS Modules (existing palette/fonts unchanged). New motion lives in `components/` (`HeroSection`, `InteractiveHouse`, `WordCycler`, `CurtainToggle`, `ScrollMotion`). Pages wire data only; no admin/API changes. House visuals use `public/house-exterior.jpg` and `public/house-interior.jpg` (project assets; `graphify-out/` is a code graph, not illustration SVGs).

**Tech Stack:** Next.js 16 · React 19 · GSAP 3.15 + ScrollTrigger · `@gsap/react` · Lenis (smooth scroll) · CSS Modules · Barlow / Barlow Condensed

**Current baseline (already in repo):** Most structure exists. Gaps vs this spec are called out per phase.

---

## Layout & Information Architecture

### Homepage above-the-fold (desktop ≥769px)

```
┌─────────────────────────────────────────────────────────────────┐
│  NAV: links · EN/ES · CTA · [Day/Night curtain toggle]          │
├──────────────────────────────┬──────────────────────────────────┤
│  LEFT (~50%)                 │  RIGHT (~50%)                    │
│  · Eyebrow (CCB)             │  · [Exterior | Interior] toggle  │
│  · H1 cut-reveal lines       │  · Interactive house + hotspots  │
│  · "Time to ___" cycler      │  · Quick estimate form           │
│  · CTAs + trust row          │                                  │
└──────────────────────────────┴──────────────────────────────────┘
│  Reviews, How We Work, Services preview, … (scroll sections)    │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile (<768px) — single column, top-to-bottom

1. Eyebrow + headline (cut-reveal, smaller type)
2. Phrase cycler
3. CTAs + trust
4. House (scaled, 4:3 aspect, 48px tap targets)
5. Form (full width)

**Clarification — “form at top of page”:** The **hero block** stays first on the homepage (before Reviews, etc.). Within the right column, order is **house → form** (house visually above form). The form is not removed or moved below the fold.

### Column rhythm (OpenAI / The Verge inspiration)

- Max content width ~1280px, generous horizontal padding
- Section labels: small caps, gold accent, optional rule
- Scroll: subtle **fade + translateY** (not heavy rotation) via `data-anim="fade-up"` and `data-anim="stagger-group"`
- Lenis smooth scroll on desktop; disabled when `prefers-reduced-motion: reduce`

---

## Design Tokens (do not change)

| Token | Value | Usage |
|-------|--------|--------|
| `--gold` | `#C8961E` | Accents, CTAs, hotspots |
| `--gold-light` | `#E8B84B` | Hover |
| `--dark` | `#0F1923` | Dark bg / light mode text |
| `--dark-mid` | `#1A2736` | Surfaces |
| `--dark-card` | `#1E2F40` | Cards, form |
| `--white` | `#F5F3EF` | Light text on dark |
| `--text` | `#D4CFC8` | Body on dark |
| `--gray` | `#8A9BAA` | Muted |
| Fonts | Barlow, Barlow Condensed | All UI |

Light mode: invert surfaces via `[data-theme="light"]` in `styles/globals.css`; gold unchanged.

---

## Phase 0 — Backup & safety

**Before any edit:**

```powershell
cd "C:\Users\Diego Ramirez\J-RNWConstructionSite"
New-Item -ItemType Directory -Force -Path ./backup
$files = @(
  'components/HeroSection.js','components/HeroSection.module.css',
  'components/InteractiveHouse.js','components/InteractiveHouse.module.css',
  'components/WordCycler.js','components/WordCycler.module.css',
  'components/CurtainToggle.js','components/CurtainToggle.module.css',
  'components/ScrollMotion.js','components/Layout.js','components/Layout.module.css',
  'pages/index.js','pages/services.js','pages/projects.js',
  'styles/globals.css','styles/Services.module.css','styles/Projects.module.css',
  'context/ThemeContext.js'
)
foreach ($f in $files) {
  if (Test-Path $f) { Copy-Item $f "./backup/$($f -replace '[/\\]','-').bak" -Force }
}
```

**Do not touch:** `pages/admin/**`, `pages/adminside/**`, `pages/api/**`, `lib/**`, `*.sqlite`, `.env.local` secrets.

---

## Phase 1 — Hero copy & vertical cut-reveal

**Reference:** [vertical-cut-reveal](https://21st.dev/community/components/danielpetho/vertical-cut-reveal/default) · [fin.ai](https://fin.ai)

**Files:** `components/HeroSection.js`, `components/HeroSection.module.css`

### Copy (exact lines, each in its own clip row)

1. Portland's #1  
2. General Contractor  
3. Serving Homes & Businesses for Over 20 Years.  
4. Remodeling · Additions · Siding · Painting.  
5. Drywall · Restoration · Mitigation · Emergency Services.  
6. Portland · Tigard · Tualatin · Gresham · Happy Valley · Oregon City  

### Animation spec

| Property | Value |
|----------|--------|
| Wrapper | `.lineWrap { overflow: hidden }` |
| Inner | `.lineInner { display: block; will-change: transform }` |
| Motion | `y: '108%'` → `0` |
| Stagger | `0.065s` per line |
| Duration | `0.85s` |
| Ease | `power3.out` |
| Delay | `0.15s` after mount |
| Reduced motion | Skip animation; show final state |

### fin.ai-inspired styling (CSS only)

- Tight headline line-height `~1.05–1.06`
- Condensed weight 800, slight negative tracking
- Eyebrow: 11px, `letter-spacing: 0.2em`, gold
- Restrained contrast; no new fonts/colors

**Status:** Lines + cut-reveal **done**. Optional polish: last line slightly smaller/muted for cities row.

---

## Phase 2 — Animated phrase cycler (English)

**Reference:** [animated-hero](https://21st.dev/community/components/tommyjepsen/animated-hero/default)

**Files:** `components/WordCycler.js`, `components/WordCycler.module.css`

### Copy change required

Replace Spanish prefix/words with:

**Prefix:** `Time to ` (fixed)  
**Rotating phrases:**

- Restore  
- Fix  
- Create Something Beautiful  
- Finish the Project  
- Transform Your Space  
- Rebuild  
- Mitigate the Damage  
- Renovate  
- Give New Life  
- Protect Your Home  

(Display as full sentence: “Time to **Restore**”, etc.)

### Animation spec

| Step | GSAP |
|------|------|
| Exit | `y: -22`, `opacity: 0`, `0.25s`, `power2.in` |
| Enter | from `y: 26`, `opacity: 0` → `0/1`, `0.3s`, `power2.out` |
| Interval | `2800ms` |
| Reduced motion | Show first phrase only; no interval |

**Status:** **Gap** — component still uses Spanish (`Es tiempo de`). Implement English list above.

---

## Phase 3 — Interactive house

**Files:** `components/InteractiveHouse.js`, `components/InteractiveHouse.module.css`  
**Assets:** `/house-exterior.jpg`, `/house-interior.jpg`

### Structure (right column)

```
[ Exterior | Interior ]  ← segmented control
┌─────────────────────────┐
│  image + hotspots       │
│  mode label overlay     │
└─────────────────────────┘
[ Quick estimate form ]    ← unchanged below house
```

### Hotspots

| Mode | Label | Suggested link |
|------|--------|----------------|
| Exterior | Reconstruction | `/services` or slug |
| Exterior | Remodeling | `/services` |
| Exterior | Siding | `/services` |
| Exterior | Vinyl | `/services` |
| Exterior | Painting | `/services` |
| Exterior | Emergency Services | `/services` |
| Interior | Drywall | `/services` |
| Interior | Remodeling | `/services` |
| Interior | Reconstruction | `/services` |
| Interior | Mitigation | `/services` |
| Interior | Restoration | `/services` |

**Interaction:**

- Pulsing dot (GSAP scale loop, or CSS fallback)
- Tooltip on hover / focus / tap (mobile)
- Min target **44×44px** (48px on mobile)
- Optional: `<Link>` or `router.push` on click

### Exterior ↔ Interior transitions (GSAP timeline)

**Enter interior (camera “into” house):**

1. Exterior layer: `scale: 2.35`, `opacity: 0`, `blur(6px)`, `0.72s`, `power3.in`
2. Container: `scale: 1.12` (same timing)
3. Swap `mode` to `interior`
4. Reset exterior transform
5. Interior: from `scale: 1.18`, `opacity: 0` → settled, `0.55s`, `power2.out`
6. Container: `scale: 1`

**Exit interior (step “outside”):**

1. Interior: `scale: 0.52`, `opacity: 0`, `blur(4px)`, `0.58s`, `power3.in`
2. Container: slight shrink
3. Swap to `exterior`
4. Exterior fade/zoom in from `scale: 0.88`
5. Container back to `scale: 1`

**Reduced motion:** Instant `setMode`; no timeline.

**Status:** Core timeline **done**. **Gap:** wire hotspots to service routes; confirm image assets exist in `public/`.

---

## Phase 4 — Hero grid & form

**Files:** `components/HeroSection.js`, `components/HeroSection.module.css`, `pages/index.js`

- Desktop: `grid-template-columns: 1fr 1fr`, gap ~48–52px  
- Breakpoint: `max-width: 768px` (or 900px) → single column  
- Form fields: name, phone, email, message; POST `/api/contact` or parent `onContactSubmit`  
- `min-height: 100vh` hero; top padding clears fixed nav (~100–110px)

**Status:** **Done** (house above form in right column).

---

## Phase 5 — Site-wide scroll animations

**Files:** `components/ScrollMotion.js`, `pages/index.js` (+ section `data-anim` attrs)

### Patterns

| Attribute | Behavior |
|-----------|----------|
| `data-anim="fade-up"` | `y: 36`, fade in, `start: top 88%`, `once: true` |
| `data-anim="stagger-group"` | Parent; children use `data-anim-child`, stagger `0.09s` |
| `data-anim="service-card"` etc. | Can keep subtle side drift or unify to fade-up |

### Homepage targets

- Section headers: `fade-up`
- How We Work steps: `stagger-group`
- Handle cards: `stagger-group`
- Services preview cards: `stagger-group`
- About, projects preview: `fade-up` / existing attrs

**Reduced motion:** `ScrollMotion` returns early; no Lenis; no hidden pre-animation state.

**Status:** **Mostly done** — verify all major sections tagged.

---

## Phase 6 — Services pinned scroll

**Reference:** [container-scroll-animation](https://21st.dev/community/components/aceternity/container-scroll-animation/default)

**Files:** `pages/services.js`, `styles/Services.module.css`

### Behavior (desktop only)

```js
ScrollTrigger.create({
  trigger: pinSection,
  start: 'top top',
  end: `+=${cardCount * 480}`,
  pin: true,
  scrub: 1,
  anticipatePin: 1,
});
// Timeline: card 0 visible; cards 1..n from y:70 opacity:0
```

**Mobile:** No pin; normal stacked grid.

**Match media:** `(prefers-reduced-motion: no-preference) and (min-width: 769px)`

**Status:** **Done** on `/services`.

---

## Phase 7 — Projects tilted grid

**Reference:** [scroll-tilted-grid](https://21st.dev/community/components/ruixenui/scroll-tilted-grid/default)

**Files:** `pages/projects.js`, `styles/Projects.module.css`

### Behavior

- Cards: `data-tilt-card`
- Alternate direction by index
- `scrub: 1.2` on scroll progress → `rotateZ: ±2.5°`, slight `y` shift
- Desktop only + reduced-motion off

**Status:** **Done** on `/projects`.

---

## Phase 8 — Day / night curtain toggle

**Reference:** [curtain-theme-toggle](https://21st.dev/community/components/fatih-developer/curtain-theme-toggle/default)

**Files:** `components/CurtainToggle.js`, `context/ThemeContext.js`, `components/Layout.js`, `styles/globals.css`

### Behavior

1. Click → top + bottom navy panels (`#0F1923`) `scaleY: 0 → 1` meet center  
2. On complete → `toggle()` theme + `localStorage` `jrnw-theme`  
3. Panels retract  
4. Reduced motion → instant theme swap, no curtain  

**Placement:** Desktop nav + mobile menu footer.

**Status:** **Done**.

---

## Phase 9 — Responsiveness checklist

| Width | Checks |
|-------|--------|
| 375px | No horizontal scroll; form full width; hotspots 48px; single column |
| 390px | Same |
| 768px | Hero stacks; services pin off; tilt off |
| 1024px+ | Two-column hero; 3-col pin grid; project grid 2–3 cols |

### Overflow audit (browser console)

```js
document.querySelectorAll('*').forEach(el => {
  if (el.scrollWidth > document.documentElement.clientWidth)
    console.log('overflow', el);
});
```

### Touch

- Hotspot tap toggles tooltip (`hotspotActive`)
- No hover-only critical info

---

## Phase 10 — Testing & verification

```bash
cd "C:\Users\Diego Ramirez\J-RNWConstructionSite"
npm run build   # or pnpm build
npm run dev
```

**Manual matrix:**

- [ ] Hero cut-reveal on load  
- [ ] “Time to ___” cycles in English  
- [ ] House hotspots show labels; optional navigation works  
- [ ] Interior / Exterior cinematic transition  
- [ ] Form submits; hero stays first section  
- [ ] Scroll sections fade in  
- [ ] `/services` pin (desktop)  
- [ ] `/projects` tilt (desktop)  
- [ ] Curtain toggle light/dark  
- [ ] Reduced motion: no scroll hijack, instant house mode, static phrase  

---

## File map (summary)

| File | Responsibility |
|------|----------------|
| `components/HeroSection.*` | 2-col hero, cut-reveal, form, composes house + cycler |
| `components/InteractiveHouse.*` | Modes, hotspots, zoom timelines |
| `components/WordCycler.*` | Phrase rotation |
| `components/CurtainToggle.*` | Theme curtain |
| `components/ScrollMotion.js` | Global ScrollTrigger + Lenis |
| `components/Layout.*` | Nav, ThemeProvider, toggle placement |
| `context/ThemeContext.js` | Theme state |
| `pages/index.js` | `<HeroSection />` first |
| `pages/services.js` | Pin section |
| `pages/projects.js` | Tilt grid |
| `styles/globals.css` | Tokens + light theme |

---

## Implementation priority (remaining work)

| Priority | Task | Effort |
|----------|------|--------|
| P0 | Backup all touched files | 5 min |
| P1 | `WordCycler` → English “Time to …” phrases | 30 min |
| P2 | Hotspot → `/services` (or per-slug) links | 1 h |
| P3 | QA mobile + reduced motion | 1 h |
| P4 | Optional: fin.ai micro-polish (spacing, city line tone) | 30 min |

**Estimated remaining:** ~3 h (most motion shell already shipped).

---

## Risks & decisions

1. **House assets:** JPG in `public/`, not graphify SVG. If SVGs are added later, swap `<img>` for inline SVG or `next/image` without changing timeline logic.  
2. **Form vs house order:** Spec = house above form inside hero; hero remains page top.  
3. **i18n:** Site has EN/ES via `LanguageContext`; cycler may need `t.` keys for Spanish parity later.  
4. **Lenis + ScrollTrigger:** Refresh on route change (already in `ScrollMotion`).  
5. **Pin section on short viewports:** Keep `end` scroll distance proportional to card count to avoid trapped scroll.

---

## Approval gate

Per `superpowers:brainstorming`, confirm before coding:

1. English-only cycler vs bilingual  
2. Hotspot click → list page vs specific service slugs  
3. House above form in right column (current) vs form-first on mobile  

Once approved, run **Phase 0 backup**, then **P1–P3** via `executing-plans`.
