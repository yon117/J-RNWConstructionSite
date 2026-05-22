# Napkin Runbook

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

## Execution & Validation (Highest Priority)
1. **[2026-05-20] Theme regressions hide mobile copy fast**
   Do instead: verify both `data-theme="dark"` and `data-theme="light"` on mobile widths before shipping any UI polish.
2. **[2026-05-20] Existing files require backups first**
   Do instead: `Copy-Item <file> <file>.bak.<reason>` before every edit to an existing repo file.

## UI Guardrails
1. **[2026-05-20] Sticky nav must keep same theme while scrolling**
   Do instead: scrolled-state styling may add shadow/blur, but preserve light-mode light surface and dark-mode dark surface.
2. **[2026-05-20] Light-mode overrides can accidentally force white text**
   Do instead: audit explicit color overrides in light theme; prefer theme tokens unless a section truly needs a custom contrast color.

## User Directives
1. **[2026-05-20] Terse output, exact substance**
   Do instead: caveman-short updates, no filler, test before claiming done.
