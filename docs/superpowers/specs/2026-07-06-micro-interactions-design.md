# Micro-interactions polish pass — design

## Context

The site's buttons already got a consistent "press" treatment (`.btn-press` in
`src/index.css`) in a prior pass. Auditing the rest of the site turned up two
categories of gap:

1. **Inconsistencies** — an interaction pattern exists somewhere but is
   missing from visually-identical elements elsewhere (e.g. the spicy dot
   pulses in `Menu.tsx` but not in `Value.tsx`; `.btn-press` is on most
   buttons but not the Navbar phone pill or Value's tab pills; the Navbar's
   animated-underline link treatment isn't reused anywhere else).
2. **Dead zones** — sections with no motion at all (the Story section is
   100% static; Footer links have no hover state), including an orphaned
   `data-reveal`/`data-reveal-delay` attribute already sitting in
   `Value.tsx` and `QuickInfo.tsx` that was never wired to any observer or
   CSS.

The site's established visual language (Cormorant Garamond serif headings,
warm terracotta/rose palette, soft brand-tinted shadows, generous spacing,
and the spring-eased `.btn-press` curve) is already "restrained layout,
warm surface" — minimal structure, cozy material. This pass leans into that
existing language rather than introducing a new one: subtle fades/lifts,
warm pulses, and the same spring easing already in use. Nothing here should
read as flashy or mechanical.

**Goal**: bring every interactive element up to the standard the best-treated
ones (Navbar links, `.btn-press` buttons, Menu's dish-row hover) already set,
and finish the two features that were clearly started but abandoned
(`data-reveal`, and the spicy-pulse-everywhere-a-dot-means-spicy pattern).

## Scope

**In scope**, grouped by mechanism:

### 1. Extend `.btn-press` to remaining buttons/pills
- Navbar phone pill — `src/components/Navbar.tsx:141-150`
- Value.tsx Lunch/Platter tab pills — `src/pages/Value.tsx:152-182` (also
  brings their 150ms transition up to the site-standard 200ms)

### 2. New shared `.link-underline` class (extracted from Navbar's existing bespoke treatment)
Navbar's desktop nav links (`Navbar.tsx:112-140`) already have the nicest
micro-interaction on the site: an `after:`-pseudo-element underline that
scales in from 0 on hover/focus (300ms cubic-bezier). Extract this into a
reusable `.link-underline` class in `index.css` and apply it to:
- Footer nav links — `src/components/Footer.tsx:53-59` (currently zero hover
  state)
- Visit.tsx's phone link — `src/pages/Visit.tsx:206-212` (currently no
  hover/transition at all)
- Visit.tsx's "Get directions" link — `src/pages/Visit.tsx:91-100`

### 3. New shared `useReveal` hook — scroll-triggered fade/lift-in
New file `src/hooks/useReveal.ts`, following the same IntersectionObserver
pattern already established by `src/hooks/useActiveSection.ts`. Fires once
per element (`unobserve` after first intersection), toggles a class that
plays the **already-defined-but-unused** `acc-fade-up` keyframe (fade +
`translateY(12px)`, 0.4s `cubic-bezier(0.22, 0.61, 0.36, 1)` — already tuned
subtle). Skips straight to the visible end-state when
`prefers-reduced-motion: reduce` is set, matching the convention `.btn-press`
already follows.

Applied to:
- **Story.tsx** — the whole section (currently fully static)
- **Value.tsx** — wires up the two *existing* `data-reveal`/
  `data-reveal-delay` attributes on the intro block (line ~78) and the
  specials card (lines ~130-131), using their existing delay values
- **QuickInfo.tsx** — wires up its existing `data-reveal` attribute (line 43)
- **Footer.tsx** — same reveal treatment, since it's the last section a user
  reaches

### 4. Status dot pulse — "Open" state only
Apply the existing `animate-spicy-pulse` class (the `gentle-pulse` keyframe,
reused as-is — no new animation) to the status dot in:
- `QuickInfo.tsx` (lines ~56-71)
- `Visit.tsx`'s `HoursRow` (lines ~171-180)

**Only** when the computed status is "Open" — not "Closed" or "Closing
Soon." A pulse reads as "live," so it should mark the positive state, not
decorate a closed sign.

### 5. Small standalone polish fixes
- **Menu.tsx `SearchInput`** (lines ~207-219) — add
  `transition-[border-color,box-shadow] duration-200` so focus isn't an
  instant snap (matches the `.btn-press` 200ms convention).
- **Menu.tsx clear-search "×" button** (lines ~220-229) — currently fully
  bare; add `hover:text-brand transition-colors duration-150`.
- **Value.tsx spicy dot** (lines ~262-268) — add the `animate-spicy-pulse`
  class it's missing (Menu.tsx's visually identical dot already has it).
- **Visit.tsx "Get directions" arrow icon** (line ~99) — nudge right on
  hover via `group-hover:translate-x-[3px] transition-transform duration-200`
  (same idea as Menu's price-nudge-on-row-hover).
- **Visit.tsx `LazyLoadMap`** (lines ~14-57) — fade the iframe in
  (`opacity-0` → `opacity-100`, `transition-opacity duration-300`) once
  loaded, instead of the current hard cut from placeholder to iframe.

## Explicitly out of scope

- **Sticky filter bar scroll-elevation** (`Menu.tsx` sticky bar) — would
  require a scroll listener, not just CSS; disproportionate effort for this
  pass.
- **`acc-height` keyframe** — stays defined but unused; no accordion
  component exists in the current UI to use it.
- **`Stats.tsx` / `useCountUp.ts`** — empty stubs, not rendered anywhere in
  `Home.tsx`; not part of the live site, nothing to enhance.

## Implementation notes

- All new/extended CSS lives in `src/index.css` alongside the existing
  `.btn-press` block — same file, same convention.
- `useReveal` should accept an optional delay (to read `data-reveal-delay`
  values already present in the markup) and return a ref + boolean/class-name
  pair, mirroring how `useActiveSection` is consumed today.
- No new dependencies. No new animation *vocabulary* — every new visual
  effect reuses a keyframe, easing curve, or duration already defined in
  `index.css`.

## Verification

1. `npm run build` — confirm no TS/build errors.
2. Manual pass with the dev server + browser (or Playwright driver, as used
   in the prior `.btn-press` change) for each item above:
   - Tab-focus and hover the Navbar phone pill, Value tab pills — confirm
     lift+press.
   - Hover Footer links, Visit's phone/"Get directions" links — confirm
     underline animates in.
   - Scroll to Story, Value's intro/specials card, QuickInfo, Footer —
     confirm fade/lift-in fires once, doesn't re-fire on scroll-back.
   - Toggle OS reduced-motion — confirm reveals show content immediately
     with no animation.
   - Confirm status dot pulses only when "Open," static otherwise.
   - Focus the search input — confirm smooth border/shadow transition; hover
     the "×" clear button — confirm color feedback.
   - Confirm Value.tsx spicy dots now pulse like Menu.tsx's.
   - Hover "Get directions" — confirm arrow nudges right.
   - Trigger the map lazy-load (scroll Visit into view) — confirm iframe
     fades in rather than popping in.
