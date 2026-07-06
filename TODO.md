# Count-up stats section

Add a "proof" section between Story and Visit, reusing the maroon/parchment
color scheme Story already has (`--color-maroon`, `--color-parchment`,
`--color-rose`, `--color-gold` in `src/index.css`).

## Confirmed content

- **10+** Years in the neighborhood (rounded, no exact founding year)
- **233** Dishes on the menu (compute from `src/data/menu.json`, don't
  hardcode — `categories.reduce((sum, c) => sum + c.items.length, 0)`)
- **7** Days a week open (matches "Open 7 Days" copy already in `Visit.tsx`)

## 1. `src/hooks/useCountUp.ts`

- [ ] `useRef<HTMLDivElement>(null)` for the element to watch.
- [ ] `useState(0)` for the displayed value.
- [ ] `useRef<boolean>(false)` guard so the animation only ever runs once.
- [ ] `useEffect` that creates an `IntersectionObserver` on `ref.current`;
      on `entry.isIntersecting`, disconnect the observer and kick off the
      animation.
- [ ] Animate with `requestAnimationFrame`: track a `performance.now()`
      start time, compute `progress = min((now - start) / duration, 1)`,
      ease it (cubic ease-out: `1 - (1 - progress) ** 3`), `setValue` each
      frame until `progress >= 1`.
- [ ] Check `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
      up front — if true, `setValue(target)` immediately, skip the RAF loop.
- [ ] Clean up the observer in the effect's return function.
- [ ] Return `{ ref, value }`.

## 2. `src/pages/Stats.tsx`

- [ ] Compute `DISH_COUNT` from `menu.json` at module scope (see above).
- [ ] Define a small `STATS` array: `{ value, suffix, label }` for the
      three stats above.
- [ ] `StatItem` component: calls `useCountUp(stat.value)`, renders the
      number (`value + suffix`) big (Cormorant Garamond, ~`clamp(52px,
      7vw,80px)`, `text-gold`) with the label small underneath
      (`text-rose`, uppercase-ish, matches Story's eyebrow sizing).
- [ ] `Stats` section: `bg-maroon text-parchment`, centered container,
      3-column grid (`grid-cols-[repeat(auto-fit,minmax(160px,1fr))]`),
      matching Story's `max-w` / padding conventions.
- [ ] No big heading/eyebrow needed — keep it a compact strip, not a full
      section with its own headline (that was demo-only labeling).

## 3. Wire it up

- [ ] Import and place `<Stats />` between `<Story />` and `<Visit />` in
      `src/pages/Home.tsx`.
- [ ] Story and this section will both be maroon back-to-back — add a
      subtle seam so they read as two beats, not one slab. Simplest: a
      `border-t border-white/10` (or a rose-tinted 1px line) on the Stats
      section.

## 4. Verify

- [ ] Run the dev server, scroll to the section, confirm each number
      counts up once when it enters view and doesn't re-trigger on
      re-scroll.
- [ ] Toggle "reduce motion" in OS/browser settings and confirm the
      numbers just appear at full value, no animation.
- [ ] Check the maroon-to-maroon seam actually reads as two sections at
      normal scroll speed.


-----------

## Work on Value.tsx

Fuzzy Matching Tolerance: Implement a fuzzy search algorithm rather than strict string matching. Mobile users frequently make typos or use alternate spacing (e.g., typing "eggroll" instead of "egg roll"). A strict inclusion check will return zero results for these common errors.

Miss: No real modular scale or variable font; spacing rhythms feel a bit inconsistent across sections.
Color Scheme — 7.5/10

    The blush pink → deep maroon → crimson accent trio is warm and on-brand. Very intentional, very "neighborhood gem."
    Restraint is a strength — it doesn't feel noisy.
    But: red text on pink (e.g., the "BEST VALUE" eyebrow + the active "Lunch Special" pill) sits right around WCAG AA failure. A small issue, but it's the kind of thing modern accessibility audits flag.


CSS / Visual Polish — 6.5/10

    Layout is clean, centered, plenty of breathing room.
    Cards, chips, expandable accordions, map embed — all the right structural pieces.
    Missing the modern flourishes that would push it to 8+:
        No real micro-interactions visible (no hover lift, no transition hints)
        No imagery at all — heavy text-only menu feels like 2019 Squarespace
        The separator dashes flanking eyebrow text (— FAMILY OWNED · NOTTINGHAM, MD —) feel a touch dated
        Shadows/borders are flat — no glass, no subtle gradients, no depth
Accessibility — 5.5/10

This is the weakest area:

    Pink-on-pink and red-on-pink contrast issues (noted above)
    Icons paired with text labels ✅ (good)
    No visible skip-to-content link
    Likely no keyboard focus styles shown
    Color used as the sole indicator for "spicy" tags and special-state pills — needs a non-color cue
    Could benefit from a prefers-reduced-motion strategy if any animations exist

Information Architecture — 7/10

    Story section adds genuine personality (rare and great)
    Hours + address + phone all surfaced in three places — good
    Footer is minimal but fine
    The menu list of 16+ sections feels like a wall — there's no visual grouping, category icons, or imagery to break it up. Modern menu design leans on cards with photos, not nested accordions.

Swap the ASCII-style dashed eyebrows for something more refined, or remove them.

1. Visual Treatment Without Photos

Since real photography isn't on the table yet, consider:

    Tactile textures — rice paper, brushstroke accents, or hand-drawn line illustrations of chopsticks/bowls/wok. Even one repeating motif would warm up the page.
    Color-rich section headers — the all-pink accordion rows are visually flat. Try a deep-maroon header bar per category with the pink continuing below. Adds rhythm without needing images.
    Numbered dish typography — bigger, more elegant price treatment (e.g., $5.95 in a serif italic) can do the work that food porn usually does.


2. Making 16 Categories Feel Lighter (While Preserving Them)

You're stuck with the menu structure, but you can soften the wall:

    Sticky category nav at the top of the menu section — small horizontal scroll of pills (Soup, Pork, Beef…) that jumps the user down. Helps people land directly instead of scrolling past everything.
    Two-column grid on desktop for category sections (Appetizer + Soup side-by-side, Pork + Beef, etc.). Halves the scroll length immediately.
    Default-collapse everything except the first 2-3 sections so the page doesn't open feeling like a phone book.
    Tabbed "Most Popular" callout at the top of the menu — the 6-8 dishes you'd actually recommend. No new content, just curation of what already exists.

3. The Actually-Doable Polish List

    Fix the red-on-pink contrast issues (text color → deeper maroon, background tint for the "BEST VALUE" section → lighter)
    Add a visible focus ring style for keyboard nav (outline: 2px solid #8B0000 or similar)
    Subtle hover state on every menu row (slight background shift, smooth transition)
    Replace the dashed eyebrows (— FAMILY OWNED · NOTTINGHAM, MD —) with simple small-caps tracking — feels more current without losing the same intent
    Add a subtle texture/grain to the pink background — kills the "stock template pink" feeling
