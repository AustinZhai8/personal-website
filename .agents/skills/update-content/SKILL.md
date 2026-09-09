---
name: update-content
description: Add or edit an experience entry, main project, or minor project on austinzhai.com. Use whenever the request is about site content — a new job/internship, a new project, updating a description, swapping a screenshot — rather than layout or styling. Covers the exact data shapes, ordering rules, image pipeline, voice rules, and the verification pass.
---

# Update site content (experience & projects)

All content is array literals in `src/App.jsx`. This skill turns a content request into a
correct edit in one pass instead of a schema-guessing loop.

## Step 1 — Pick the array

| Request | Array | Rendered by |
|---|---|---|
| Job, internship, club role | `EXPERIENCE` | `ExperienceCard` |
| Substantial project (own card, expandable, images/links/highlights) | `MAIN_PROJECTS` | `MainProjectCard` |
| Small hardware/firmware project | `MINOR_HARDWARE` | `MinorEntry` |
| Small software project | `MINOR_SOFTWARE` | `MinorEntry` |

If it's ambiguous whether a project is "main" or "minor": main projects are deployed/multi-part
things with highlights worth expanding (Portfolio Vision, this site); minor projects are
single-repo builds. When genuinely unsure, ask Austin — it changes the visual weight.

New entries go at the **top** of their array (reverse chronological), unless the dates say
otherwise.

## Step 2 — Match the shape exactly

### EXPERIENCE entry
```js
{
  company: 'Company Name',
  role: 'Exact Role Title',
  dates: 'May 2026 to June 2026',   // or 'June 2026 to Present' — spelled months, "to"
  tag: 'Hardware Engineering',       // short category pill, 1–3 words
  description: "One paragraph, first person…",
}
```

### MAIN_PROJECTS entry — all keys required; use `[]`, never omit
```js
{
  id: 'kebab-unique-id',        // MUST be unique across ALL four content arrays (shared openIds map)
  title: 'Project Name',
  year: '2026',
  category: 'Software',          // or 'Hardware'
  summary: 'One-two sentence card blurb, always visible.',
  detail: 'Optional one-liner shown when expanded.',   // '' if none
  parts: [ { tag: 'Part 1 · Name', body: '…', chips: ['Python'] } ],  // [] if single-part
  skills: [ { label: 'Languages', chips: ['JavaScript'] } ],           // optional key; only if no parts
  highlights: [ 'Concrete, quantified achievement line', … ],          // 3–6 lines
  links: [
    { href: 'https://…', label: 'domain.com', primary: true, external: true }, // live site
    { href: 'https://github.com/AustinZhai8/…', label: 'GitHub' },             // repo(s)
  ],
  images: [ { src: '/projects/name.png', alt: 'Descriptive alt' } ],   // [] if none
}
```

### MINOR_* entry
```js
{
  id: 'kebab-unique-id',
  title: 'Project Name',
  year: '2026',
  description: 'One paragraph.',
  chips: ['ESP32', 'RFID'],
  links: [{ href: 'https://github.com/AustinZhai8/…', label: 'GitHub' }],
  images: [{ src: '/projects/name.jpg', alt: '…', w: 300 }],  // w: px number or 'auto'; [] if none
}
```

The card components call `.length` on `images`/`parts`/`highlights` — a missing key crashes
the page. Empty array, never absent.

## Step 3 — Images (if any)

1. Put the file in `public/projects/` (top-level `public/` is reserved for site-wide assets
   like the headshot and favicons).
2. Reference it as `/projects/filename.ext` with the **exact case of the file on disk** —
   Vercel is case-sensitive, the Windows dev server is not, so a case mismatch only breaks in
   production.
3. Keep files reasonably sized (existing project images are 60–170 KB). If Austin hands you a
   multi-MB photo, tell him it should be resized/compressed before it ships.
4. Alt text: describe the thing, not "screenshot" ("Servo Sonar Radar with radar display").

## Step 4 — Write the prose (voice rules)

- First person, confident, plain prose. 2–6 full sentences. Never "Responsible for…", never
  bullet fragments, never third person.
- At least one concrete number in every substantial description (%, count, $, or timeframe).
  If Austin's raw notes have no numbers, ask him for one — every existing entry has one, and
  an unquantified entry reads weaker next to the others.
- Name tools specifically (AVEVA SCADA, Isolation Forest), not generically.
- It's fine to include one human/reflective closing line — several existing entries do
  ("The biggest lesson: the scariest part of starting something is just starting.").
- Highlights are single lines, each independently impressive, each quantified where possible.

## Step 5 — Verify (do not skip)

1. `npm run lint` → exit 0.
2. `npm run dev`, open the page (`#experience` or `#projects`):
   - New entry renders, in the right position, card expands/collapses.
   - Images load (check the network tab or just look).
3. If you touched `MAIN_PROJECTS`/`MINOR_*`: print-preview `#projects` (Ctrl+P) — the new
   entry appears expanded, links show as plain-text URLs (they come from the `links` array via
   `.print-links` automatically; just confirm).
4. Confirm the new `id` doesn't appear anywhere else in `App.jsx`.

Do **not** commit or push unless Austin asks — push to `main` deploys production immediately.
