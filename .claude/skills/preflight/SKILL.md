---
name: preflight
description: Full pre-ship verification gate for austinzhai.com. Run before any commit/push (push to main deploys production immediately), after any multi-file change, or whenever asked to "check", "verify", or "make sure it's ready". Automates lint, build + bundle budget, and asset-case audit, then walks the manual visual checks. Ends with a pass/fail report.
---

# Preflight — verify the site before it ships

Pushing to `main` deploys austinzhai.com within minutes. There are no tests, so this gate is
the only thing between an edit and production. Run every section; report results as a
checklist at the end. If any check fails, fix it (or report it) — never declare "ready to
push" with a failing box.

## 1. Automated checks

Run these first; they're cheap and catch most regressions.

### 1a. Lint
```
npm run lint
```
Must exit 0. Fix violations rather than disabling rules.

### 1b. Build + bundle budget
```
npm run build
```
Must succeed. Then read Vite's output table: the main JS chunk's **gzip** size must be
**< 100 kB**. The site's own project card claims "Sub-100KB JS bundle with under 1s LCP" —
exceeding the budget makes the site lie about itself. If a change pushed it over, the fix is
almost always "remove the new dependency", not "raise the budget".

### 1c. Asset reference audit (case-sensitive)
Every absolute asset path in `App.jsx` must match a real file in `public/` with exact case
(Vercel is Linux; the Windows dev server hides case mismatches). Run from the repo root in
Bash:

```bash
grep -oE "(src|href): '/[^']+'|src=\"/[^\"]+\"" src/App.jsx \
  | grep -oE '/[A-Za-z0-9._/-]+\.(png|jpg|JPG|jpeg|svg|pdf|webp)' | sort -u \
  | while read -r p; do
      if ls "public$p" >/dev/null 2>&1 \
         && [ "$(cd public && find . -ipath ".$p" | head -1)" = ".$p" ]; then
        echo "OK   $p"
      else
        echo "FAIL $p"
      fi
    done
```

Any `FAIL` line is a broken image **in production only**. Fix the reference (preferred) or
rename the file to match.

## 2. Manual visual checks

Start the dev server (`npm run dev`, http://localhost:5173) and check each page you touched —
plus `#projects` always, because the print stylesheet depends on it.

### 2a. Pages render and navigate
- Visit `#home`, `#about`, `#experience`, `#projects` directly by hash — each loads correctly
  (hash routing has no 404; a typo just silently shows Home).
- Nav highlights the active page; browser back/forward works.

### 2b. Print contract (whenever Experience/Projects or index.css changed)
Open `#projects`, Ctrl+P, and verify the preview:
- [ ] Black text on white — no dark backgrounds anywhere
- [ ] No nav bar, footer, chevron toggles, link pills, or "Back to Home" button
- [ ] Every project card is **expanded** even if collapsed on screen
- [ ] Plain-text URLs appear under each project (from `.print-links`)
- [ ] `Austin Zhai · austinzhai.com · github.com/AustinZhai8` line shows under the title
- [ ] No card is split awkwardly across a page break

### 2c. Motion / visibility (whenever animations or new sections were added)
- In DevTools → Rendering → emulate `prefers-reduced-motion: reduce`, hard-reload each page:
  **all content must be immediately visible.** Anything missing is an element stuck at
  `opacity: 0` that isn't covered by the reduced-motion override list in `index.css`.
- Without emulation, scroll each page bottom to top and back: no section stays blank
  (a permanently invisible `.reveal` element means `useScrollReveal` never observed it —
  usually missing `deps` for conditionally-rendered content).

### 2d. Responsive
- At 560px viewport width: no horizontal scrollbar, nav links fit, cards stack.
- At 640px: the investing image grid collapses to one column.

### 2e. Interaction spot-check
- Expand/collapse a main project and a minor project — smooth open, chevron rotates.
- External links open in a new tab.

## 3. Report

End with a checklist of every item above marked pass/fail/not-applicable (state *why* for
n/a, e.g. "no CSS touched — print check skipped" is **not** allowed if `index.css` or the
Projects/Experience regions changed). If everything passes, say so plainly — and still do not
commit or push unless Austin has asked.
