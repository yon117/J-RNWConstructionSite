# Napkin Runbook — J-RNW Construction Site

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

---

## Execution & Validation (Highest Priority)

1. **[2026-05-18] BACKUP required before editing any existing file**
   Do instead: `Copy-Item "file.ext" "file.ext.bak"` before every Edit/Write on existing files. Exception: files created from scratch in same session.

2. **[2026-05-18] Env vars must live on VPS, not `.env.local`**
   Do instead: SSH into Hostinger VPS to set/verify env vars in production. `.env.local` is local-only.

3. **[2026-05-18] PowerShell JSON files written by Python may have UTF-8 BOM**
   Do instead: read with `encoding='utf-8-sig'` in Python (not `'utf-8'`) to avoid `JSONDecodeError: Unexpected UTF-8 BOM`.

---

## Architecture & God Nodes

1. **[2026-05-18] `getDb()` is the central hub — 53 edges, bridges 4 communities**
   Do instead: when touching DB layer, expect every page/API to depend on it. Changes here ripple everywhere.

2. **[2026-05-18] `isValidSessionToken()` guards all admin routes via `getServerSideProps`**
   Do instead: every new admin page must call `isValidSessionToken()` in `getServerSideProps` — it's the established pattern, not optional.

3. **[2026-05-18] graphify knowledge graph lives at `graphify-out/`**
   Do instead: for codebase questions run `graphify query "<question>"` first. `graphify update .` after code changes.

---

## Stack & Toolchain

1. **[2026-05-18] Framework: Next.js Pages Router, CSS Modules — no Tailwind**
   Do instead: write styles in `.module.css` files. Import as `styles.className`. No utility classes.

2. **[2026-05-18] Fonts: Barlow + Barlow Condensed (Google Fonts) — loaded in `_app.js`**
   Do instead: reference `var(--font-barlow)` / `var(--font-barlow-condensed)` from `globals.css`. Don't re-import fonts elsewhere.

3. **[2026-05-18] Canonical colors defined as CSS custom properties in `styles/globals.css`**
   Do instead: use `var(--color-name)` everywhere. Never hardcode hex values that already exist as variables.

4. **[2026-05-18] SMTP: GoDaddy `smtpout.secureserver.net:587`, account `julioramirez@jandrnw.com`**
   Do instead: use these exact credentials for email. Don't swap to SendGrid/Mailgun without explicit approval.

---

## CSS Theme Bug Patterns (Critical)

1. **[2026-05-21] `color: var(--dark)` in light-mode override = invisible text**
   Do instead: use hardcoded `#0f1923` in any `:global([data-theme="light"])` color rule. In light mode `--dark = #F5F3EF` (cream) — cream text on cream bg = invisible.

2. **[2026-05-21] `color: var(--white)` on hardcoded-dark-bg elements = invisible in light mode**
   Do instead: hardcode `color: #F5F3EF` for any element whose background is hardcoded (not a variable) dark value. Variables invert but hardcoded values don't.

3. **[2026-05-21] Footer bg is hardcoded `#080F16` — never changes with theme**
   Do instead: add explicit light-mode footer overrides forcing cream text (`#F5F3EF`, `#8A9BAA`, `#D4CFC8`). Don't rely on variable inversion.

4. **[2026-05-21] Interactive house tooltip/modeBtn use variables — break in light mode**
   Do instead: `InteractiveHouse.module.css` tooltip → `color: #F5F3EF`. modeBtn.active → `color: #0f1923`.

---

## Design System Guardrails

1. **[2026-05-18] Design north star: "Foreman's Gold Standard" — not corporate, not low-budget**
   Do instead: check anti-references (anti-SaaS cream, anti-corporate, anti-low-budget) before approving any new UI. Construction Gold `#C8961E` is sacred — use sparingly (scarcity rule).

2. **[2026-05-18] Four-step dark surface stack: footer_black → deep_midnight → dark_slate → dark_card**
   Do instead: use this exact hierarchy for dark backgrounds. Don't invent new dark values.

3. **[2026-05-18] Uppercase contract + gold em-rule are named design rules**
   Do instead: headings follow uppercase contract. Section dividers use gold em-rule. Don't break these without explicit directive.

---

## User Directives

1. **[2026-05-18] Caveman mode always active (full level)**
   Do instead: drop articles/filler/pleasantries every response. Fragments OK. Off only on "stop caveman" / "normal mode".

2. **[2026-05-21] Hero headline lines — "Remodeling…", "Drywall…", "Portland cities…" must stay**
   Do instead: never delete those VerticalCutReveal body lines from `HeroSection.js`. User confirmed they must remain.
