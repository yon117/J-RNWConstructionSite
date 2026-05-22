# J-RNW Full Website Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the public-facing site with cinematic GSAP animations, interactive house hero, day/night toggle, container scroll services, and tilted projects grid.

**Architecture:** Add Tailwind CSS alongside existing CSS Modules (scoped to new components only — admin/existing pages untouched). New components live in `components/`. Existing pages (`index.js`, `services.js`, `projects.js`) gain new sections; their data-fetching and DB code is NOT touched. Banana/Gemini generates two house images (exterior + interior) used as backgrounds for the InteractiveHouse component.

**Tech Stack:** Next.js 16 Pages Router · GSAP 3.15 + ScrollTrigger · Lenis 1.3 · Tailwind CSS 3 · CSS Modules · Barlow + Barlow Condensed · banana-claude (Gemini image gen)

**Time Estimates (total ~22–28 hours coding):**
- Phase 0 — Setup: ~1 h
- Phase 1 — Theme system: ~1 h
- Phase 2 — Day/Night curtain toggle: ~2.5 h
- Phase 3 — Hero section: ~6 h
- Phase 4 — Interactive house: ~4 h
- Phase 5 — Site-wide scroll animations: ~2 h
- Phase 6 — Services container scroll pin: ~3 h
- Phase 7 — Projects tilted grid: ~3 h
- Phase 8 — Mobile + a11y polish: ~2 h

**DO NOT TOUCH:** Any file under `pages/adminside/`, `pages/admin/`, `pages/api/`, `lib/`, `hooks/`, `utils/`, `database.sqlite`, `jandr.sqlite`, or any `.bak` file.

---

## File Map

### New files
| File | Purpose |
|---|---|
| `tailwind.config.js` | Tailwind scoped to new components |
| `postcss.config.js` | PostCSS pipeline |
| `context/ThemeContext.js` | Day/night theme state (React context) |
| `components/CurtainToggle.js` | Navbar day/night button with GSAP curtain wipe |
| `components/CurtainToggle.module.css` | Toggle styles |
| `components/WordCycler.js` | "Es tiempo de ___" animated word cycling |
| `components/WordCycler.module.css` | Cycling styles |
| `components/HeroSection.js` | Full 2-col hero (cut-reveal text + house + form) |
| `components/HeroSection.module.css` | Hero layout styles |
| `components/InteractiveHouse.js` | Exterior/interior house with hotspots + GSAP zoom |
| `components/InteractiveHouse.module.css` | House styles |

### Modified files
| File | What changes |
|---|---|
| `styles/globals.css` | Add `[data-theme="light"]` CSS vars |
| `components/Layout.js` | Wrap with ThemeContext, add CurtainToggle to nav |
| `components/Layout.module.css` | Add toggle positioning |
| `pages/index.js` | Replace hero JSX with `<HeroSection>`, add scroll animation hooks |
| `styles/Home.module.css` | Add/update hero + scroll animation styles |
| `pages/services.js` | Add container scroll pin section |
| `styles/Services.module.css` | Container scroll styles |
| `pages/projects.js` | Replace grid with TiltedScrollGrid |
| `styles/Projects.module.css` | Tilt styles |
| `.env.local` | Add `GEMINI_API_KEY` |

---

## Phase 0 — Setup (~1 h)

### Task 0.1 — Configure banana Gemini API key

**Files:** `.env.local`

- [ ] **Step 1: Add API key to .env.local**

Open `.env.local` and append (do NOT commit this file):
```
GEMINI_API_KEY=<your-key-from-aistudio.google.com>
```

- [ ] **Step 2: Run banana setup**

```bash
# In a new terminal (not inside Claude Code session)
npx nanobanana-mcp setup
# When prompted, paste the GEMINI_API_KEY value
```

If MCP unavailable, banana falls back to direct script:
```bash
python3 "C:/Users/Diego Ramirez/.claude/skills/banana/scripts/generate.py" \
  --prompt "test" --aspect-ratio "1:1"
```

---

### Task 0.2 — Install Tailwind CSS alongside CSS Modules

**Files:** `tailwind.config.js`, `postcss.config.js`, `package.json`

- [ ] **Step 1: Install**

```bash
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 2: Write `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Scope ONLY to new components — never touches admin or existing CSS Modules
  content: [
    './components/CurtainToggle.js',
    './components/WordCycler.js',
    './components/HeroSection.js',
    './components/InteractiveHouse.js',
    './context/ThemeContext.js',
  ],
  darkMode: ['attribute', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        gold:       '#C8961E',
        'gold-lt':  '#E8B84B',
        dark:       '#0F1923',
        'dark-mid': '#1A2736',
        'dark-card':'#1E2F40',
        'off-white':'#F5F3EF',
        muted:      '#D4CFC8',
        steel:      '#8A9BAA',
      },
      fontFamily: {
        barlow:     ['Barlow', 'sans-serif'],
        condensed:  ['Barlow Condensed', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Add Tailwind directives to globals.css**

Open `styles/globals.css` and prepend at very top (before existing content):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [ ] **Step 4: Verify dev server still runs**

```bash
pnpm dev
```

Expected: site loads at `http://localhost:3000`, no style regressions on existing pages.

- [ ] **Step 5: Commit**

```bash
git add tailwind.config.js postcss.config.js styles/globals.css package.json pnpm-lock.yaml
git commit -m "chore: add Tailwind CSS scoped to new components"
```

---

### Task 0.3 — Generate house exterior image with banana

**Files:** `public/house-exterior.jpg`

- [ ] **Step 1: Generate via banana skill**

Invoke `/banana generate` with this prompt (or run the fallback script):

**Prompt to use:**
```
A modern American craftsman-style single-family house exterior viewed straight-on, 
golden hour lighting casting warm amber tones. Deep navy blue sky backdrop. 
Front porch with wood columns, gabled roofline, stone veneer base, cedar shake 
siding. Well-manicured front yard. Highly detailed architectural illustration, 
slightly stylized but photorealistic. Clean lines. Captured with Canon EOS R5, 
35mm lens at f/8. Professional architectural photography for a contractor website.
```

Aspect ratio: `16:9`, resolution: `2K`

Fallback script:
```bash
python3 "C:/Users/Diego Ramirez/.claude/skills/banana/scripts/generate.py" \
  --prompt "A modern American craftsman-style single-family house exterior viewed straight-on, golden hour lighting, deep navy blue sky, front porch with wood columns, gabled roofline, stone veneer base, cedar shake siding, well-manicured yard. Architectural photography for a contractor website. Canon EOS R5 35mm f/8." \
  --aspect-ratio "16:9"
```

- [ ] **Step 2: Save to `public/house-exterior.jpg`**

Rename/copy the generated file to `public/house-exterior.jpg`.

---

### Task 0.4 — Generate house interior image with banana

**Files:** `public/house-interior.jpg`

- [ ] **Step 1: Generate interior**

**Prompt:**
```
Modern home interior under active renovation — open floor plan, freshly installed 
drywall with visible seams ready for taping, wood subfloor, new window openings, 
warm construction lighting. A few power tools visible in background. Clean, 
professional job site. Slightly wide-angle architectural photography. 
Canon EOS R5 24mm lens at f/5.6. Professional contractor portfolio photo.
```

Aspect ratio: `16:9`, resolution: `2K`

- [ ] **Step 2: Save to `public/house-interior.jpg`**

- [ ] **Step 3: Commit**

```bash
git add public/house-exterior.jpg public/house-interior.jpg
git commit -m "assets: add banana-generated house exterior and interior images"
```

---

## Phase 1 — Theme System (~1 h)

### Task 1.1 — Light/dark CSS vars in globals.css

**Files:** `styles/globals.css`

- [ ] **Step 1: Back up**

```bash
cp styles/globals.css styles/globals.css.bak
```

- [ ] **Step 2: Add light mode vars**

After the existing `:root { ... }` block, add:
```css
/* Light mode — applied by ThemeContext via data-theme="light" on <html> */
[data-theme="light"] {
  --dark:       #F5F3EF;
  --dark-mid:   #E8E4DD;
  --dark-card:  #DDD8D0;
  --white:      #0F1923;
  --text:       #1A2736;
  --gray:       #4A5568;
  --primary:    #F5F3EF;
  --secondary:  #0F1923;
  --text-light: #0F1923;
  /* gold stays identical in both modes */
}
```

- [ ] **Step 3: Verify no regressions**

```bash
pnpm dev
```

Navigate to homepage — dark mode should look unchanged (default is dark).

---

### Task 1.2 — ThemeContext

**Files:** `context/ThemeContext.js`

- [ ] **Step 1: Create context**

```js
// context/ThemeContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('jrnw-theme') || 'dark';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('jrnw-theme', next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

- [ ] **Step 2: Commit**

```bash
git add context/ThemeContext.js styles/globals.css
git commit -m "feat: add day/night theme system with CSS vars"
```

---

## Phase 2 — Day/Night Curtain Toggle (~2.5 h)

Reference: https://21st.dev/community/components/fatih-developer/curtain-theme-toggle/default
Navy blue (`#0F1923`) is the curtain color in dark mode. Gold accent on icon.

### Task 2.1 — CurtainToggle component

**Files:** `components/CurtainToggle.js`, `components/CurtainToggle.module.css`

- [ ] **Step 1: Create CurtainToggle.js**

```js
// components/CurtainToggle.js
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext';
import styles from './CurtainToggle.module.css';

export default function CurtainToggle() {
  const { theme, toggle } = useTheme();
  const curtainRef = useRef(null);
  const topRef = useRef(null);
  const botRef = useRef(null);
  const animating = useRef(false);

  const handleToggle = () => {
    if (animating.current) return;
    animating.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        toggle();
        animating.current = false;
      },
    });

    // Curtain closes (two panels meet center)
    tl.to(topRef.current, { scaleY: 1, duration: 0.3, ease: 'power2.in' }, 0)
      .to(botRef.current, { scaleY: 1, duration: 0.3, ease: 'power2.in' }, 0)
      // Hold briefly at center
      .to({}, { duration: 0.1 })
      // Curtain opens
      .to(topRef.current, { scaleY: 0, duration: 0.35, ease: 'power2.out' })
      .to(botRef.current, { scaleY: 0, duration: 0.35, ease: 'power2.out' }, '<');
  };

  return (
    <>
      {/* Full-viewport curtain overlay */}
      <div ref={curtainRef} className={styles.curtainWrap} aria-hidden="true">
        <div ref={topRef} className={`${styles.curtainPanel} ${styles.curtainTop}`} />
        <div ref={botRef} className={`${styles.curtainPanel} ${styles.curtainBot}`} />
      </div>

      <button
        onClick={handleToggle}
        className={styles.toggleBtn}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        title={theme === 'dark' ? 'Day mode' : 'Night mode'}
      >
        <span className={styles.icon}>
          {theme === 'dark' ? '☀' : '☾'}
        </span>
      </button>
    </>
  );
}
```

- [ ] **Step 2: Create CurtainToggle.module.css**

```css
/* components/CurtainToggle.module.css */
.curtainWrap {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  display: flex;
  flex-direction: column;
}

.curtainPanel {
  background-color: #0F1923; /* navy blue — preserved in both modes */
  flex: 1;
  transform-origin: top center;
  transform: scaleY(0);
  will-change: transform;
}

.curtainTop {
  transform-origin: top center;
}

.curtainBot {
  transform-origin: bottom center;
}

.toggleBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1.5px solid var(--gold);
  border-radius: 3px;
  color: var(--gold);
  cursor: pointer;
  transition: background 0.2s;
}

.toggleBtn:hover {
  background: rgba(200, 150, 30, 0.12);
}

.icon {
  font-size: 1rem;
  line-height: 1;
}
```

---

### Task 2.2 — Wire CurtainToggle into Layout

**Files:** `components/Layout.js`

- [ ] **Step 1: Back up Layout.js**

```bash
cp components/Layout.js components/Layout.js.bak3
```

- [ ] **Step 2: Add ThemeProvider + CurtainToggle to Layout**

At top of `Layout.js`, add imports:
```js
import { ThemeProvider } from '../context/ThemeContext';
import CurtainToggle from './CurtainToggle';
```

Wrap the return with `<ThemeProvider>` and place `<CurtainToggle />` in the nav bar JSX next to the existing nav CTA button. Find the nav CTA area and insert:
```jsx
{/* inside nav, near the CTA button */}
<CurtainToggle />
```

Wrap entire return:
```jsx
return (
  <ThemeProvider>
    {/* existing Layout JSX */}
  </ThemeProvider>
);
```

- [ ] **Step 3: Add toggle position to Layout.module.css**

```bash
cp components/Layout.module.css components/Layout.module.css.bak4
```

Add to `Layout.module.css`:
```css
.navToggleWrap {
  display: flex;
  align-items: center;
  gap: 12px;
}
```

- [ ] **Step 4: Test curtain animation**

```bash
pnpm dev
```

Click toggle — expect: navy curtain wipes down from top + up from bottom, meets at center, then retracts. Theme switches between dark/light.

- [ ] **Step 5: Commit**

```bash
git add components/CurtainToggle.js components/CurtainToggle.module.css \
  components/Layout.js components/Layout.module.css context/ThemeContext.js
git commit -m "feat: add day/night curtain toggle to navbar"
```

---

## Phase 3 — Hero Section (~6 h)

Reference styles: fin.ai · openai.com
Two columns: LEFT = cut-reveal text + word cycler | RIGHT = interactive house + contact form

### Task 3.1 — WordCycler component ("Es tiempo de ___")

**Files:** `components/WordCycler.js`, `components/WordCycler.module.css`

Words: Restaurar / Arreglar / Crear algo hermoso / Terminar el proyecto / Transformar tu espacio / Reconstruir / Mitigar el daño / Renovar / Dar nueva vida / Proteger tu hogar

Reference: https://21st.dev/community/components/tommyjepsen/animated-hero/default

- [ ] **Step 1: Create WordCycler.js**

```js
// components/WordCycler.js
import { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import styles from './WordCycler.module.css';

const WORDS = [
  'Restaurar',
  'Arreglar',
  'Crear algo hermoso',
  'Terminar el proyecto',
  'Transformar tu espacio',
  'Reconstruir',
  'Mitigar el daño',
  'Renovar',
  'Dar nueva vida',
  'Proteger tu hogar',
];

const INTERVAL = 2800; // ms per word

export default function WordCycler() {
  const [index, setIndex] = useState(0);
  const wordRef = useRef(null);
  const containerRef = useRef(null);

  useGSAP(() => {
    // Initial entrance
    gsap.from(wordRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
    });
  }, { scope: containerRef });

  useEffect(() => {
    const id = setInterval(() => {
      // Exit animation
      gsap.to(wordRef.current, {
        y: -24,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setIndex(i => (i + 1) % WORDS.length);
          // Entrance animation
          gsap.fromTo(
            wordRef.current,
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }
          );
        },
      });
    }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <div ref={containerRef} className={styles.wrap}>
      <span className={styles.prefix}>Es tiempo de </span>
      <span ref={wordRef} className={styles.word}>
        {WORDS[index]}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Create WordCycler.module.css**

```css
/* components/WordCycler.module.css */
.wrap {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
  font-family: 'Barlow Condensed', sans-serif;
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--text);
  min-height: 2.5em;
  overflow: hidden;
}

.prefix {
  color: var(--gray);
  font-weight: 400;
  font-style: italic;
}

.word {
  display: inline-block;
  color: var(--gold);
  will-change: transform, opacity;
  white-space: nowrap;
}
```

---

### Task 3.2 — Vertical cut-reveal text animation utility

Reference: https://21st.dev/community/components/danielpetho/vertical-cut-reveal/default

**Files:** `components/HeroSection.js` (inline hook — no separate file needed)

The cut-reveal splits text into lines, each line wrapped in an overflow-hidden container. GSAP animates `y` from 100% to 0 per line with stagger.

Helper function (added inside HeroSection.js):
```js
// Wraps each line of text in a clip container for vertical reveal
function splitIntoLines(text) {
  return text.split('\n').map((line, i) => (
    <div key={i} className={heroStyles.lineWrap}>
      <span className={heroStyles.lineInner}>{line}</span>
    </div>
  ));
}
```

GSAP animation (inside useGSAP in HeroSection):
```js
gsap.from('.lineInner', {
  y: '105%',
  duration: 0.9,
  stagger: 0.08,
  ease: 'power3.out',
  delay: 0.3,
});
```

---

### Task 3.3 — HeroSection layout

**Files:** `components/HeroSection.js`, `components/HeroSection.module.css`

- [ ] **Step 1: Create HeroSection.js**

```js
// components/HeroSection.js
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import WordCycler from './WordCycler';
import InteractiveHouse from './InteractiveHouse';
import styles from './HeroSection.module.css';

const HERO_TEXT_LINES = [
  "Portland's #1 General Contractor",
  "Serving Homes & Businesses",
  "for Over 20 Years.",
  "Remodeling · Additions · Siding · Painting.",
  "Drywall · Restoration · Mitigation · Emergency Services.",
  "Portland · Tigard · Tualatin · Gresham · Happy Valley · Oregon City",
];

function LineReveal({ lines }) {
  return lines.map((line, i) => (
    <div key={i} className={styles.lineWrap}>
      <span className={styles.lineInner}>{line}</span>
    </div>
  ));
}

export default function HeroSection({ onContactSubmit }) {
  const heroRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Vertical cut reveal on hero lines
      gsap.from(heroRef.current.querySelectorAll(`.${styles.lineInner}`), {
        y: '105%',
        duration: 0.85,
        stagger: 0.07,
        ease: 'power3.out',
        delay: 0.2,
      });
      // Word cycler fade in
      gsap.from(heroRef.current.querySelector(`.${styles.cyclerWrap}`), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.9,
        ease: 'power2.out',
      });
      // Right column slide in
      gsap.from(heroRef.current.querySelector(`.${styles.rightCol}`), {
        opacity: 0,
        x: 40,
        duration: 0.9,
        delay: 0.4,
        ease: 'power3.out',
      });
    });
  }, { scope: heroRef });

  return (
    <section ref={heroRef} className={styles.hero}>
      <div className={styles.grid}>
        {/* LEFT COLUMN */}
        <div className={styles.leftCol}>
          <p className={styles.eyebrow}>Licensed · Bonded · Insured</p>

          <h1 className={styles.headline}>
            <LineReveal lines={HERO_TEXT_LINES} />
          </h1>

          <div className={styles.cyclerWrap}>
            <WordCycler />
          </div>

          <div className={styles.ctaRow}>
            <a href="tel:+15033334444" className={styles.btnPrimary}>
              Call Now — Free Estimate
            </a>
            <a href="#services" className={styles.btnSecondary}>
              See Our Work
            </a>
          </div>

          <div className={styles.trustRow}>
            <span>⭐ 4.9 on Google</span>
            <span>·</span>
            <span>20+ Years in Portland</span>
            <span>·</span>
            <span>CCB Licensed</span>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.rightCol}>
          <InteractiveHouse />

          {/* Quick Contact Form */}
          <form className={styles.quickForm} onSubmit={onContactSubmit}>
            <p className={styles.formTitle}>Get a Free Estimate</p>
            <input name="name" placeholder="Your name" required className={styles.input} />
            <input name="phone" type="tel" placeholder="Phone number" required className={styles.input} />
            <input name="email" type="email" placeholder="Email address" required className={styles.input} />
            <textarea name="message" placeholder="Describe your project…" rows={3} className={styles.textarea} />
            <button type="submit" className={styles.formBtn}>Send Request</button>
          </form>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create HeroSection.module.css**

```css
/* components/HeroSection.module.css */
.hero {
  min-height: 100vh;
  background-color: var(--dark);
  display: flex;
  align-items: center;
  padding: 100px 0 60px;
}

.grid {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}

/* ── LEFT ── */
.leftCol {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.eyebrow {
  font-family: 'Barlow', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
}

.headline {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: clamp(28px, 4.5vw, 56px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.01em;
  color: var(--white);
  overflow: hidden;
}

/* Cut-reveal machinery */
.lineWrap {
  overflow: hidden;
}

.lineInner {
  display: block;
  will-change: transform;
}

.cyclerWrap {
  margin-top: 8px;
}

.ctaRow {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.btnPrimary {
  display: inline-flex;
  align-items: center;
  padding: 14px 28px;
  background: var(--gold);
  color: var(--dark);
  font-family: 'Barlow', sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: 3px;
  text-decoration: none;
  transition: background 0.2s;
}

.btnPrimary:hover { background: var(--gold-light); }

.btnSecondary {
  display: inline-flex;
  align-items: center;
  padding: 13px 24px;
  border: 1.5px solid rgba(200,150,30,0.4);
  color: var(--white);
  font-family: 'Barlow', sans-serif;
  font-size: 14px;
  font-weight: 600;
  border-radius: 3px;
  text-decoration: none;
  transition: border-color 0.2s;
}

.btnSecondary:hover { border-color: var(--gold); }

.trustRow {
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 12px;
  color: var(--gray);
  flex-wrap: wrap;
}

/* ── RIGHT ── */
.rightCol {
  display: flex;
  flex-direction: column;
  gap: 24px;
  will-change: transform, opacity;
}

/* Quick contact form */
.quickForm {
  background: var(--dark-card);
  border: 1px solid rgba(200,150,30,0.15);
  border-radius: 4px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.formTitle {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--white);
  margin-bottom: 4px;
}

.input,
.textarea {
  background: var(--dark-mid);
  border: 1px solid rgba(138,155,170,0.2);
  border-radius: 3px;
  padding: 10px 14px;
  color: var(--white);
  font-family: 'Barlow', sans-serif;
  font-size: 14px;
  width: 100%;
  transition: border-color 0.2s;
}

.input:focus,
.textarea:focus {
  outline: none;
  border-color: var(--gold);
}

.textarea {
  resize: vertical;
  min-height: 80px;
}

.formBtn {
  padding: 12px 24px;
  background: var(--gold);
  color: var(--dark);
  font-family: 'Barlow', sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background 0.2s;
}

.formBtn:hover { background: var(--gold-light); }

/* ── MOBILE ── */
@media (max-width: 768px) {
  .hero {
    padding: 90px 0 48px;
  }

  .grid {
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .headline {
    font-size: clamp(26px, 7vw, 40px);
  }

  .ctaRow {
    flex-direction: column;
  }

  .btnPrimary,
  .btnSecondary {
    text-align: center;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .grid {
    padding: 0 16px;
  }
}
```

---

## Phase 4 — Interactive House (~4 h)

Two states: EXTERIOR (default) and INTERIOR. GSAP zoom timeline on toggle.
Hotspots = absolutely positioned divs with pulsing animation.

### Task 4.1 — InteractiveHouse component

**Files:** `components/InteractiveHouse.js`, `components/InteractiveHouse.module.css`

- [ ] **Step 1: Create InteractiveHouse.js**

```js
// components/InteractiveHouse.js
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Image from 'next/image';
import styles from './InteractiveHouse.module.css';

const EXTERIOR_HOTSPOTS = [
  { id: 'reconstruction', label: 'Reconstruction',       x: '20%', y: '30%' },
  { id: 'remodeling',     label: 'Remodeling',            x: '50%', y: '25%' },
  { id: 'siding',         label: 'Siding',                x: '78%', y: '40%' },
  { id: 'vinyl',          label: 'Vinyl Windows',         x: '60%', y: '55%' },
  { id: 'painting',       label: 'Painting',              x: '35%', y: '60%' },
  { id: 'emergency',      label: 'Emergency Services',    x: '15%', y: '70%' },
];

const INTERIOR_HOTSPOTS = [
  { id: 'drywall',        label: 'Drywall',               x: '25%', y: '35%' },
  { id: 'remodeling-in',  label: 'Remodeling',            x: '55%', y: '28%' },
  { id: 'reconstruction-in', label: 'Reconstruction',     x: '72%', y: '50%' },
  { id: 'mitigation',     label: 'Mitigation',            x: '40%', y: '65%' },
  { id: 'restoration',    label: 'Restoration',           x: '18%', y: '60%' },
];

function Hotspot({ label, x, y }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={styles.hotspot}
      style={{ left: x, top: y }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role="button"
      aria-label={label}
    >
      <span className={styles.dot} />
      <span className={styles.pulse} />
      {hovered && <span className={styles.tooltip}>{label}</span>}
    </div>
  );
}

export default function InteractiveHouse() {
  const [mode, setMode] = useState('exterior'); // 'exterior' | 'interior'
  const containerRef = useRef(null);
  const extRef = useRef(null);
  const intRef = useRef(null);
  const isAnimating = useRef(false);

  const enterInterior = () => {
    if (isAnimating.current || mode === 'interior') return;
    isAnimating.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        setMode('interior');
        isAnimating.current = false;
      },
    });

    tl.to(extRef.current, {
      scale: 2.5,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.in',
    })
    .set(extRef.current, { scale: 1 })
    .fromTo(
      intRef.current,
      { opacity: 0, scale: 1.15 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
    );
  };

  const exitInterior = () => {
    if (isAnimating.current || mode === 'exterior') return;
    isAnimating.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        setMode('exterior');
        isAnimating.current = false;
      },
    });

    tl.to(intRef.current, {
      scale: 0.5,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in',
    })
    .fromTo(
      extRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.55, ease: 'power2.out' }
    );
  };

  const hotspots = mode === 'exterior' ? EXTERIOR_HOTSPOTS : INTERIOR_HOTSPOTS;

  return (
    <div ref={containerRef} className={styles.wrap}>
      {/* Mode toggle buttons */}
      <div className={styles.modeBtns} role="group" aria-label="House view">
        <button
          className={`${styles.modeBtn} ${mode === 'exterior' ? styles.active : ''}`}
          onClick={exitInterior}
        >
          Exterior
        </button>
        <button
          className={`${styles.modeBtn} ${mode === 'interior' ? styles.active : ''}`}
          onClick={enterInterior}
        >
          Interior
        </button>
      </div>

      {/* House imagery */}
      <div className={styles.imageWrap}>
        {/* Exterior image */}
        <div
          ref={extRef}
          className={styles.imageLayer}
          style={{ opacity: mode === 'exterior' ? 1 : 0 }}
        >
          <Image
            src="/house-exterior.jpg"
            alt="House exterior — tap hotspots to explore services"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        {/* Interior image */}
        <div
          ref={intRef}
          className={styles.imageLayer}
          style={{ opacity: mode === 'interior' ? 1 : 0 }}
        >
          <Image
            src="/house-interior.jpg"
            alt="House interior — tap hotspots to explore services"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Hotspots overlay */}
        {hotspots.map(h => (
          <Hotspot key={h.id} label={h.label} x={h.x} y={h.y} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create InteractiveHouse.module.css**

```css
/* components/InteractiveHouse.module.css */
.wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
  user-select: none;
}

/* Mode toggle */
.modeBtns {
  display: flex;
  gap: 4px;
  background: var(--dark-mid);
  border-radius: 3px;
  padding: 3px;
  width: fit-content;
}

.modeBtn {
  padding: 7px 18px;
  border: none;
  border-radius: 2px;
  background: transparent;
  color: var(--gray);
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}

.modeBtn.active {
  background: var(--gold);
  color: var(--dark);
}

/* Image container */
.imageWrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 3px;
  overflow: hidden;
  background: var(--dark-mid);
}

.imageLayer {
  position: absolute;
  inset: 0;
  will-change: transform, opacity;
  transition: none; /* GSAP handles transitions */
}

/* Hotspots */
.hotspot {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 10;
  /* min 44px tap target */
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot {
  display: block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--gold);
  border: 2px solid #fff;
  position: relative;
  z-index: 2;
}

.pulse {
  position: absolute;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(200, 150, 30, 0.3);
  animation: pulseRing 2s ease-out infinite;
  z-index: 1;
}

@keyframes pulseRing {
  0%   { transform: scale(0.6); opacity: 1; }
  100% { transform: scale(1.8); opacity: 0; }
}

.tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--dark);
  color: var(--white);
  font-family: 'Barlow', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 5px 10px;
  border-radius: 2px;
  white-space: nowrap;
  border: 1px solid rgba(200,150,30,0.3);
  pointer-events: none;
  z-index: 20;
}

/* Mobile: touch-friendly */
@media (max-width: 768px) {
  .imageWrap {
    aspect-ratio: 4 / 3;
  }

  .hotspot {
    min-width: 48px;
    min-height: 48px;
  }

  .tooltip {
    font-size: 10px;
    padding: 4px 8px;
  }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .pulse {
    animation: none;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add components/InteractiveHouse.js components/InteractiveHouse.module.css \
  components/HeroSection.js components/HeroSection.module.css \
  components/WordCycler.js components/WordCycler.module.css
git commit -m "feat: add InteractiveHouse, HeroSection, WordCycler components"
```

---

### Task 4.2 — Wire HeroSection into index.js

**Files:** `pages/index.js`, `styles/Home.module.css`

- [ ] **Step 1: Back up**

```bash
cp pages/index.js pages/index.js.bak4
cp styles/Home.module.css styles/Home.module.css.bak2
```

- [ ] **Step 2: Import and use HeroSection**

At top of `pages/index.js`, add:
```js
import HeroSection from '../components/HeroSection';
```

Replace the existing hero `<section>` JSX (find the hero section — it's the first major section with background image and headline) with:
```jsx
<HeroSection onContactSubmit={handleContactSubmit} />
```

Where `handleContactSubmit` is the existing form submit handler already in the page, or create a minimal one:
```js
const handleContactSubmit = async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
  e.target.reset();
};
```

- [ ] **Step 3: Test hero renders**

```bash
pnpm dev
```

Check: two-column layout renders, cut-reveal plays on load, word cycler cycles, house image shows with hotspots.

---

## Phase 5 — Site-wide Scroll Animations (~2 h)

All sections: fade-up + slight slide-in. GSAP ScrollTrigger stagger on groups.
Reference style: openai.com, theverge.com — clean, restrained, not flashy.

### Task 5.1 — Update ScrollMotion component / add global scroll hook

**Files:** `components/ScrollMotion.js`

- [ ] **Step 1: Back up**

```bash
cp components/ScrollMotion.js components/ScrollMotion.js.bak2
```

- [ ] **Step 2: Update ScrollMotion.js**

Replace contents with:
```js
// components/ScrollMotion.js
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Call once in _app.tsx — animates all [data-anim] elements
export function useScrollMotion() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Fade-up for individual elements
      gsap.utils.toArray('[data-anim="fade-up"]').forEach(el => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        });
      });

      // Stagger group: all children animate in sequence
      gsap.utils.toArray('[data-anim="stagger-group"]').forEach(group => {
        const children = group.querySelectorAll('[data-anim-child]');
        gsap.from(children, {
          y: 32,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: group,
            start: 'top 85%',
            once: true,
          },
        });
      });

      // Stat numbers count-up
      gsap.utils.toArray('[data-anim="stat"]').forEach(el => {
        gsap.from(el, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
          },
        });
      });
    });

    return () => mm.revert();
  }, []);
}

export default function ScrollMotion() {
  useScrollMotion();
  return null;
}
```

- [ ] **Step 3: Add `data-anim` attributes to index.js sections**

In `pages/index.js`, add `data-anim="fade-up"` to section titles and `data-anim="stagger-group"` + `data-anim-child` to card grids. Example pattern:
```jsx
<h2 className="section-title" data-anim="fade-up">Our Services</h2>
<div className={styles.servicesGrid} data-anim="stagger-group">
  {services.map(s => (
    <div key={s.id} className={styles.serviceCard} data-anim-child>
      {/* card content */}
    </div>
  ))}
</div>
```

Apply same pattern to Services page and Projects page section titles.

- [ ] **Step 4: Commit**

```bash
git add components/ScrollMotion.js pages/index.js
git commit -m "feat: update scroll animations with GSAP ScrollTrigger stagger"
```

---

## Phase 6 — Services Container Scroll Pin (~3 h)

Reference: https://21st.dev/community/components/aceternity/container-scroll-animation/default
The services section pins while cards animate in sequence as user scrolls through.

### Task 6.1 — Container scroll pin in services.js

**Files:** `pages/services.js`, `styles/Services.module.css`

- [ ] **Step 1: Back up**

```bash
cp pages/services.js pages/services.js.bak3
cp styles/Services.module.css styles/Services.module.css.bak
```

- [ ] **Step 2: Add GSAP pin section to services.js**

At top of `services.js`, add imports:
```js
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

Add a new pinned section component inside services.js (before the return, after existing imports):
```js
function ServiceScrollPin({ services }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 769px)', () => {
      const cards = trackRef.current.querySelectorAll('[data-service-card]');
      const totalScroll = (cards.length - 1) * 100; // vw units via percentage

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${cards.length * 600}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      cards.forEach((card, i) => {
        if (i === 0) return; // first card starts visible
        tl.from(card, {
          y: 80,
          opacity: 0,
          duration: 1,
        }, i - 1);
      });

      return () => tl.scrollTrigger?.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className={svcStyles.pinSection}>
      <div className={svcStyles.pinInner}>
        <h2 className={svcStyles.pinTitle} data-anim="fade-up">What We Do</h2>
        <div ref={trackRef} className={svcStyles.pinTrack}>
          {services.map((svc, i) => (
            <div key={svc.id || i} className={svcStyles.pinCard} data-service-card>
              <div className={svcStyles.pinCardIcon}>{svc.icon}</div>
              <h3 className={svcStyles.pinCardTitle}>{svc.title}</h3>
              <p className={svcStyles.pinCardDesc}>{svc.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Import the CSS module at top:
```js
import svcStyles from '../styles/Services.module.css';
```

Insert `<ServiceScrollPin services={servicesData} />` into the page return where the services grid currently exists. Keep existing data fetching untouched — just pass the data as a prop.

- [ ] **Step 3: Add CSS to Services.module.css**

```css
/* Services pin section */
.pinSection {
  min-height: 100vh;
  background: var(--dark-mid);
  overflow: hidden;
}

.pinInner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 24px;
}

.pinTitle {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 800;
  color: var(--white);
  margin-bottom: 48px;
}

.pinTrack {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 3px;
}

.pinCard {
  background: var(--dark-card);
  padding: 32px 28px;
  border-radius: 2px;
  will-change: transform, opacity;
}

.pinCardIcon {
  font-size: 2rem;
  margin-bottom: 16px;
  color: var(--gold);
}

.pinCardTitle {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--white);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.pinCardDesc {
  font-family: 'Barlow', sans-serif;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text);
}

@media (max-width: 768px) {
  .pinSection {
    min-height: auto;
  }

  .pinTrack {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Test**

```bash
pnpm dev
```

Navigate to `/services`. Pin should hold section while cards animate in sequence on scroll. On mobile (<768px), pin is disabled, cards stack normally.

- [ ] **Step 5: Commit**

```bash
git add pages/services.js styles/Services.module.css
git commit -m "feat: add container scroll pin to services section"
```

---

## Phase 7 — Projects Tilted Scroll Grid (~3 h)

Reference: https://21st.dev/community/components/ruixenui/scroll-tilted-grid/default
Cards rotate slightly (±3°) based on scroll position. Each card has independent tilt.

### Task 7.1 — TiltedScrollGrid in projects.js

**Files:** `pages/projects.js`, `styles/Projects.module.css`

- [ ] **Step 1: Back up**

```bash
cp pages/projects.js pages/projects.js.bak3
cp styles/Projects.module.css styles/Projects.module.css.bak
```

- [ ] **Step 2: Add tilt hook to projects.js**

```js
// Inside projects.js — add after existing imports
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

function useTiltedGrid(gridRef) {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 769px)', () => {
      const cards = gridRef.current?.querySelectorAll('[data-tilt-card]');
      if (!cards) return;

      cards.forEach((card, i) => {
        const direction = i % 2 === 0 ? 1 : -1; // alternate tilt direction
        gsap.to(card, {
          rotateZ: direction * 2.5,
          y: direction * -16,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      });
    });

    return () => mm.revert();
  }, []);
}
```

- [ ] **Step 3: Add TiltedGrid component inside projects.js**

```js
function TiltedProjectGrid({ projects }) {
  const gridRef = useRef(null);
  useTiltedGrid(gridRef);

  return (
    <div ref={gridRef} className={projStyles.tiltGrid}>
      {projects.map((project, i) => (
        <div key={project.id || i} className={projStyles.tiltCard} data-tilt-card>
          <div className={projStyles.tiltCardImg}>
            {project.images?.[0] && (
              <img
                src={project.images[0]}
                alt={project.title || 'Project'}
                className={projStyles.tiltCardImage}
              />
            )}
          </div>
          <div className={projStyles.tiltCardBody}>
            <span className={projStyles.tiltCardTag}>{project.category || 'Project'}</span>
            <h3 className={projStyles.tiltCardTitle}>{project.title}</h3>
            {project.description && (
              <p className={projStyles.tiltCardDesc}>{project.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```

Import CSS module:
```js
import projStyles from '../styles/Projects.module.css';
```

Replace existing project grid JSX with `<TiltedProjectGrid projects={projects} />`. Keep existing data fetching (DB call) unchanged.

- [ ] **Step 4: Add CSS to Projects.module.css**

```css
/* Tilted scroll grid */
.tiltGrid {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.tiltCard {
  background: var(--dark-card);
  border-radius: 3px;
  overflow: hidden;
  will-change: transform;
  transform-origin: center center;
  transition: box-shadow 0.3s;
}

.tiltCard:hover {
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
}

.tiltCardImg {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--dark-mid);
}

.tiltCardImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.tiltCard:hover .tiltCardImage {
  transform: scale(1.04);
}

.tiltCardBody {
  padding: 20px 22px;
}

.tiltCardTag {
  display: inline-block;
  font-family: 'Barlow', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 8px;
}

.tiltCardTitle {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--white);
  line-height: 1.2;
  margin-bottom: 8px;
}

.tiltCardDesc {
  font-family: 'Barlow', sans-serif;
  font-size: 13px;
  line-height: 1.6;
  color: var(--text);
}

@media (max-width: 1024px) {
  .tiltGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .tiltGrid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0 16px;
  }
}
```

- [ ] **Step 5: Test tilt**

```bash
pnpm dev
```

Navigate to `/projects`. Cards should alternate tilt direction as you scroll through them on desktop. On mobile, no tilt (flat grid).

- [ ] **Step 6: Commit**

```bash
git add pages/projects.js styles/Projects.module.css
git commit -m "feat: add tilted scroll grid to projects page"
```

---

## Phase 8 — Mobile & Accessibility Polish (~2 h)

### Task 8.1 — Verify breakpoints

- [ ] **Step 1: Test at 375px (iPhone SE)**

Open Chrome DevTools → Responsive → 375px width.

Checklist:
- Hero: single column, headline readable, house image full-width
- Hotspots: min 48px tap target (verify in DevTools)
- CTA buttons: full width, stacked
- Word cycler: wraps cleanly, gold word visible
- Services: pin disabled, cards stack

- [ ] **Step 2: Test at 390px (iPhone 14)**

Same checklist as 375px.

- [ ] **Step 3: Test at 768px (tablet)**

Checklist:
- Hero: single column (grid collapses at 768px breakpoint)
- House image: aspect-ratio 4/3
- Tilted grid: 2 columns at 768px (check CSS)

- [ ] **Step 4: Verify no horizontal scroll**

```js
// Run in browser console to check for overflow
document.querySelectorAll('*').forEach(el => {
  if (el.offsetWidth > document.documentElement.offsetWidth) {
    console.log('OVERFLOW:', el);
  }
});
```

Fix any elements causing horizontal overflow.

---

### Task 8.2 — prefers-reduced-motion audit

- [ ] **Step 1: Enable reduced motion in OS**

Windows: Settings → Accessibility → Visual Effects → Animation effects OFF.

- [ ] **Step 2: Verify all GSAP animations are gated**

Every GSAP call must be inside `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)`. Check:
- HeroSection.js: ✓ (in useGSAP with matchMedia)
- CurtainToggle.js: ✓ (matchMedia already present — add if missing)
- InteractiveHouse.js: GSAP zoom works but should degrade — add guard:

```js
// In enterInterior / exitInterior inside InteractiveHouse.js
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReduced) {
  // instant state change — no animation
  setMode('interior'); // or 'exterior'
  return;
}
```

- ScrollMotion.js: ✓ (matchMedia wrapper already present)
- Services pin: ✓ (matchMedia in useEffect)
- Projects tilt: ✓ (matchMedia in useTiltedGrid)

- [ ] **Step 3: Verify pulse animation**

CSS `@media (prefers-reduced-motion: reduce)` block disables `.pulse` animation in `InteractiveHouse.module.css`. Already included in Step 2 of Task 4.1 — verify it's present.

---

### Task 8.3 — Final smoke test

- [ ] **Step 1: Build for production**

```bash
pnpm build
```

Expected: zero build errors. Fix any TypeScript or import errors reported.

- [ ] **Step 2: Run production build**

```bash
pnpm start
```

Test full page flow:
1. Homepage loads — dark mode default, hero cut-reveal plays
2. Word cycler cycles through Spanish words
3. House exterior hotspots pulse, tooltips show on hover
4. Click "Interior" — GSAP zoom transition plays
5. Click "Exterior" — GSAP zoom-out plays
6. Day/Night toggle — curtain wipe, theme switches
7. Scroll down index — sections fade-up with stagger
8. Services page — container pin works on desktop
9. Projects page — cards tilt alternately on scroll
10. Light mode: all text readable, gold preserved

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete full site redesign — hero, interactive house, scroll animations, day/night toggle"
```

---

## Quick Reference — Time Budget

| Phase | Est. Time |
|---|---|
| 0 — Setup (Tailwind + banana) | 1 h |
| 1 — Theme system | 1 h |
| 2 — Curtain toggle | 2.5 h |
| 3 — Hero section | 6 h |
| 4 — Interactive house | 4 h |
| 5 — Scroll animations | 2 h |
| 6 — Services pin | 3 h |
| 7 — Projects tilt | 3 h |
| 8 — Mobile + a11y | 2 h |
| **Total** | **~24.5 h** |

## Files NOT touched (enforcement)

```
pages/adminside/**
pages/admin/**
pages/api/**
lib/**
hooks/**
utils/**
*.sqlite
*.bak
.env.local  (except adding GEMINI_API_KEY)
```
