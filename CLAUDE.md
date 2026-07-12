# CLAUDE.md

Operating manual for working on this repo (austinzhai.com — Austin Zhai's personal portfolio).
Read the whole thing before your first edit. The site is small, but it has three invisible
cross-cutting systems (animation, print, palette) that silently break when edited naively.

## Commands

- `npm run dev` — Vite dev server at http://localhost:5173
- `npm run build` — production build to `dist/` (never edit `dist/` by hand)
- `npm run preview` — serve the production build locally
- `npm run lint` — ESLint over `**/*.{js,jsx}`; must exit 0 before any commit

There is no test suite. Verification is manual: dev server + the Quality Bars checklist below.

## Deployment is live and immediate

Pushing to `main` deploys straight to production at austinzhai.com via Vercel — there is no
staging branch and no preview gate you control from here.

> **Mistake this prevents:** committing and pushing "helpfully" after finishing a change.
> Never commit or push unless Austin explicitly asks. When he does ask, run the Quality Bars
> first. His commit messages are short and lowercase ("updates", "New position") — match that;
> don't write paragraph-long commit messages.

## Architecture (the whole site is three files)

**Vite + React 19 + Tailwind v4** (via `@tailwindcss/vite`; no `tailwind.config.js` — v4 is
CSS-first and imported at the top of `src/index.css`).

- `src/App.jsx` (~715 lines) — every component, icon, hook, and all content data. Order within
  the file: Icons → Hooks → Nav → Page wrapper → shared pieces → one region per page (component
  + its data arrays adjacent) → `PAGES` map → `App`. Regions are separated by
  `// ─── Name ───…` banner comments; keep new code inside the right region and add a banner
  for genuinely new regions.
- `src/index.css` — the entire visual system: `:root` palette variables, one plain CSS class per
  visual concept (`.exp-card`, `.proj-title`, …), motion keyframes, the reduced-motion override,
  and the `@media print` block. Sections use the same `/* ─── Name ─── */` banners.
- `src/main.jsx` — mounts `<App />` + `<Analytics />` (Vercel). Rarely touched.

**Routing** is hash-based with no router library: `App` holds `page` in `useState`, reads
`window.location.hash` on load, listens for `hashchange`, and `navigate(id)` does `setPage` +
`history.replaceState`. Pages are registered in the `PAGES` map (`home`, `about`, `experience`,
`projects`) at the bottom of `App.jsx`; nav links are the `links` array inside `Nav`.

> **Mistake this prevents:** installing React Router, creating a `components/` or `pages/`
> directory, or splitting `App.jsx` "for cleanliness". The one-file layout is deliberate.
> Do not restructure unless Austin explicitly asks for a restructure.

**Content is data-in-code.** `EXPERIENCE`, `MAIN_PROJECTS`, `MINOR_HARDWARE`, `MINOR_SOFTWARE`
are array literals in `App.jsx`, rendered by shared card components (`ExperienceCard`,
`MainProjectCard`, `MinorEntry`). Editing content = editing the array literal. Entries are
ordered reverse-chronologically (newest first). Project/minor entries need an `id` that is
unique across **all** project arrays combined — `openIds` on `ProjectsPage` is one shared map.

## Styling conventions

1. **Colors only via CSS variables** (`--bg`, `--bg2`, `--card`, `--border`, `--border2`,
   `--text`, `--text2`, `--text3`, `--accent`, `--accent-soft`). The only tolerated hardcoded
   color is `#0b0b0d` as text-on-accent (see `.btn-primary`).
   > **Mistake this prevents:** hardcoding a hex color in a class or inline style. The
   > `@media print` block re-maps the same variables to a light palette; a hardcoded color
   > prints as-is and breaks the resume-style printout.
2. **No Tailwind utility classes in JSX.** Tailwind v4 is installed but the codebase doesn't
   use utilities — styling lives in named classes in `index.css`. Inline `style={{}}` in JSX is
   for **layout only** (flex/grid/gap/margin/padding/maxWidth), never for color or typography.
   > **Mistake this prevents:** writing `className="text-sm text-gray-400 rounded-full"` —
   > it works, and it's wrong for this codebase. Match what's there: add a kebab-case class.
3. **Type scale is deliberate**: page titles use `clamp()`, labels are 10–11px uppercase with
   wide `letter-spacing` (see `.eyebrow`, `.sub-heading`, `.mini-label`). Reuse those classes
   instead of inventing near-duplicates.
4. Responsive breakpoints in use are `560px`, `640px`, and `max-height: 760px`. Check new UI
   at 560px width.

## JS/JSX conventions

- No semicolons, single quotes, function declarations (`function Foo() {}`) for components —
  no arrow-function components, no `React.FC`, no TypeScript.
- Apostrophes in JSX text are `&apos;` (ESLint react rules aren't enforcing this, but the
  codebase is consistent — keep it).
- Icons are inline SVG function components in the Icons region, sized ~15px, using
  `currentColor`. Add new icons there; don't install an icon library.
- ESLint's `no-unused-vars` ignores `^[A-Z_]` names — don't rely on that to leave dead
  components behind; delete unused code.

## The three cross-cutting systems — check all three on every UI change

### 1. Entrance animation (elements start invisible)

`.reveal`, `.fade-in-up`, `.stagger > *`, and `.exp-card` all start at `opacity: 0` and only
become visible when an animation or the IntersectionObserver fires. `useScrollReveal(ref, deps)`
observes `.reveal` descendants of `ref` **once, on mount** (or when `deps` change) and adds
`.visible`.

> **Mistake this prevents (the classic one):** adding a `.reveal` element that mounts *after*
> the observer ran — e.g. conditionally rendered content — without passing `deps` to
> `useScrollReveal`. Result: the element stays `opacity: 0` forever. If new `.reveal` content
> can appear after mount, pass the controlling state as `deps`. If a section is always present,
> `.reveal` inside the existing `ref` container is fine.

### 2. Reduced motion and print force-visibility

Because animated elements start invisible, both the `@media (prefers-reduced-motion: reduce)`
block and the `@media print` block contain an explicit selector list
(`.reveal, .stagger > *, .fade-in-up, .exp-card`) that forces `opacity: 1`.

> **Mistake this prevents:** creating a new class that animates from `opacity: 0` without
> adding it to **both** override lists. Result: content is permanently invisible for
> reduced-motion users and blank on the printout. Prefer reusing the existing animation
> classes; if you must add one, update both blocks in the same edit.

### 3. Print (the Projects page doubles as a resume)

Printing `#projects` must yield a clean black-on-white document. The contract:
- Interactive/screen-only chrome (nav, footer, chevrons, link pills, "next page" buttons) gets
  `.no-print`.
- Anything that must appear only on paper gets `.print-only` (hidden on screen by default).
- Every link pill has a plain-text twin in a `.print-links` block (label + raw URL), because
  hyperlinks are useless on paper.
- Collapsed `.proj-body` sections are forced open by the print block.

> **Mistake this prevents:** adding a new button, link row, or interactive element to the
> Projects page and forgetting its `.no-print` / `.print-links` counterpart. Nothing errors —
> the printout just quietly degrades. Always print-preview after touching Experience/Projects.

## Assets

Static assets live in `public/`, referenced by absolute path from `App.jsx`
(`/Headshot.JPG`, `/projects/pv-cli.png`). Project images go in `public/projects/`.

> **Mistake this prevents:** wrong filename case. Windows (dev) resolves `/headshot.jpg`
> against `Headshot.JPG`; Vercel (Linux, production) does not — the image 404s **only in
> production**. Every asset reference must match the file's exact case. Yes, the headshot's
> extension really is uppercase `.JPG`.

Known-unused files currently in the repo (don't reference them, don't "clean them up"
unprompted): `public/AZ_Resume.pdf`, `public/projects/led-mode-controller.jpg`,
`public/favicon.svg`, `public/icons.svg`, `src/assets/hero.png`, root `Headshot.JPG`.

> **Mistake this prevents:** trusting `README.md`. It is stale (mentions an embedded resume
> PDF that was removed). This file, not the README, is the source of truth.

## Content voice (when writing or editing entry text)

Descriptions in `EXPERIENCE` and project data are first-person, confident, plain prose:
- Full sentences, 2–6 per description. No bullet fragments, no third person, no "Responsible
  for…".
- At least one concrete number per substantial entry (%, count, $, timeframe) — every existing
  entry has one.
- Tools and tech named specifically (RSLinx, Isolation Forest), not generically ("various
  industry tools").
- Dates format: `May 2026 to June 2026` / `June 2026 to Present` — spelled-out months, "to",
  no en-dashes.

## Quality bars — every box checkable, check them before saying "done"

- [ ] `npm run lint` exits 0.
- [ ] `npm run build` succeeds, and the main JS bundle stays **under 100 kB gzip** (read the
      gzip column in Vite's build output — the site publicly claims "sub-100KB JS bundle" in
      its own project card, so exceeding it makes the site lie about itself).
- [ ] Every `src: '/...'` or `src="/..."` path in `App.jsx` matches a file in `public/` with
      exact case.
- [ ] Any new element that starts at `opacity: 0` is covered by both the reduced-motion and
      print override lists in `index.css`.
- [ ] Print preview of `#projects` (Ctrl+P in browser): no nav/footer/chevrons/pills, all
      cards expanded, black on white, raw URLs visible under each project.
- [ ] Page renders without horizontal scroll at 560px viewport width.
- [ ] Every external `<a>` has `target="_blank" rel="noopener noreferrer"`; icon-only links
      have `aria-label`; expand/collapse buttons have `aria-expanded`.
- [ ] New project entries: `id` unique across all four content arrays; `images`, `links`,
      `chips`/`highlights` fields present (empty arrays, not missing keys — the card components
      read `.length` on them).
- [ ] No new dependencies added unless Austin asked for one.
