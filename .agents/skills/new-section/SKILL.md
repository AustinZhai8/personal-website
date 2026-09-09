---
name: new-section
description: Add a new page or a new section to austinzhai.com without breaking the animation, print, or palette systems. Use for structural/UI work — "add a Skills page", "add a testimonials section to About", "redesign the hero" — anything beyond editing existing content arrays. Covers routing wiring, the reveal-animation contract, print/reduced-motion coverage, and CSS placement conventions.
---

# Add a page or section

This codebase looks like a normal React app but has three invisible contracts (entrance
animation, print, palette) that new UI must join. This skill wires new structure in correctly
the first time.

## Decide: new section vs. new page

- **New section on an existing page** — the common case. Skip to "Building the markup".
- **New page** — only if Austin explicitly asked for a new top-level page. It needs 4 wiring
  points, all in `src/App.jsx`:
  1. A `function NewPage({ onNavigate })` component in its own `// ─── Name ───…` banner
     region, placed with the other pages (keep file order: Icons → Hooks → Nav → Page →
     shared → pages → PAGES → App).
  2. Its body wrapped in `<Page pageKey="newpage">` — this gives the fade-in transition and
     scroll-to-top. Include `<Footer />` at the bottom and usually a `<NextPage>` button
     continuing the home → about → experience → projects loop (adjust neighbors' NextPage
     targets if the new page joins the loop).
  3. An entry in the `PAGES` map: `{ …, newpage: NewPage }`. The hash (`#newpage`) comes from
     this key — no other routing config exists. **Do not add react-router.**
  4. A `{ id: 'newpage', label: 'New Page' }` entry in the `links` array inside `Nav` (Home is
     reachable via the brand button, so it's not in `links`).

## Building the markup

- Content column: wrap in `style={{ maxWidth: '960px', margin: '0 auto' }}`; pages that start
  below the fixed nav use `className="page-pad"` (7.5rem top padding clears the nav bar).
- Reuse the shared pieces before inventing new ones: `Eyebrow`, `SectionRule`, `Chip`,
  `NextPage`, `Footer`, and the label classes `.sub-heading` / `.sub-sub-heading` /
  `.mini-label`.
- Icons: inline SVG function components in the Icons region, ~15px, `currentColor`. No icon
  libraries.
- JSX style: no semicolons, single quotes, `function` declarations, `&apos;` for apostrophes
  in text.

## The animation contract (this is where new sections silently break)

Two systems; pick the right one:

| Use | When |
|---|---|
| `.fade-in-up` / `.stagger` (on-mount, keyframe-driven) | Above-the-fold content visible immediately on page load (heroes, page titles) |
| `.reveal` + `useScrollReveal` (scroll-triggered) | Everything further down the page |

Rules for `.reveal`:
1. The page component must have `const ref = useRef(null)` + `useScrollReveal(ref)` and the
   `.reveal` elements must be **descendants of the element carrying `ref`** — otherwise they
   stay at `opacity: 0` forever (they start invisible).
2. The observer runs once on mount. If a `.reveal` element can mount **later** (conditional
   rendering, data toggles), pass the controlling state: `useScrollReveal(ref, [thatState])`.
   Forgetting this is the #1 way sections become permanently invisible.
3. Don't nest `.reveal` inside `.reveal`; one per logical section block is the pattern.

If you create a **new** class that animates from `opacity: 0`, you must add it to **both**
override lists in `index.css` in the same edit — `@media (prefers-reduced-motion: reduce)` and
`@media print` — alongside `.reveal, .stagger > *, .fade-in-up, .exp-card`. Strongly prefer
reusing the existing classes so this never comes up.

## The CSS

- New classes go in `src/index.css` under the matching `/* ─── Section ─── */` banner (create
  a banner for a genuinely new region). Kebab-case, one class per visual concept, named after
  the thing (`.testimonial-card`), not its look (`.rounded-box`).
- **Colors only via the CSS variables** (`--bg`, `--bg2`, `--card`, `--border`, `--border2`,
  `--text`, `--text2`, `--text3`, `--accent`, `--accent-soft`). No hardcoded hex except
  `#0b0b0d` as text-on-accent. Hardcoded colors break the print palette, which works by
  re-mapping these variables.
- **No Tailwind utilities in JSX** even though Tailwind is installed. Inline `style={{}}` is
  for layout only (flex/grid/gap/margin), never color or typography.
- Easing: this site consistently uses `cubic-bezier(0.22, 1, 0.36, 1)`; durations 0.2s for
  hovers, 0.45–0.85s for entrances. Match it.
- Responsive: check 560px and 640px (the existing breakpoints); add a media query at one of
  those rather than inventing a new breakpoint.

## The print contract

Ask: "what should this look like on the printed resume?" (Ctrl+P on `#projects` — but print
CSS is global, so a new page/section is affected too):
- Screen-only chrome (buttons, chevrons, nav-like elements, link pills, decorative
  scroll hints) → `className="no-print"` (space-separated with other classes).
- Paper-only content → `.print-only` (hidden on screen by `index.css`).
- Links that matter on paper → add a `.print-links print-only` block with `label: raw-url`
  plain text, mirroring `MainProjectCard`.
- Cards/blocks that shouldn't split across pages → ensure they're covered by a
  `break-inside: avoid` rule in the print block.
- If the new section should **not** print at all (most non-Projects additions), wrap the whole
  thing in `.no-print` and be done.

## Verify before calling it done

1. `npm run lint` → 0; `npm run build` → succeeds, main JS chunk still < 100 kB gzip.
2. Dev server: section animates in on scroll; hard-reload with DevTools reduced-motion
   emulation on → everything visible immediately.
3. If a new page: direct-load `http://localhost:5173/#newpage` works, nav highlights it,
   back/forward works.
4. Ctrl+P on `#projects` (and the new page if it prints): nothing dark, nothing interactive,
   nothing missing.
5. 560px viewport: no horizontal scroll.

Do not commit or push unless Austin asks — push to `main` is a production deploy.
