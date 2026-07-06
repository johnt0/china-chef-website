# Motion system — transition catalog

Companion reference for
[2026-07-06-micro-interactions-design.md](./2026-07-06-micro-interactions-design.md).
Every micro-interaction on the site is one of the five types below. No new
type is introduced by this pass — the goal is to apply these five
consistently, not invent a sixth.

## 1. Press spring — `.btn-press`

**What it's for**: anything clickable and button/pill-shaped.

| | |
|---|---|
| Trigger | `:hover`, `:active` |
| Hover | `translateY(-2px)`, hover shadow fades in via `::after` (see below) |
| Active | `translateY(1px) scale(0.97)`, hover shadow fades back out |
| Duration / easing (rest → hover) | 200ms, `cubic-bezier(0.34, 1.4, 0.5, 1)` (spring, slight overshoot) |
| Duration / easing (press) | 90ms, `cubic-bezier(0.4, 0, 0.2, 1)` (fast, linear-ish — press must feel immediate) |
| Shadow mechanism | `box-shadow` is never transitioned directly (it forces a repaint every frame). Instead, a `.btn-press::after` pseudo-element carries the hover shadow (`--shadow-btn-hover`) at `opacity: 0`, crossfaded to `opacity: 1` on hover/back to `0` on active — opacity + transform are compositor-only, so this animates on the GPU. The resting shadow is the plain `shadow-btn` Tailwind class already on each button (static, no transition needed). |
| Reduced motion | `transition: none; transform: none`; `::after` pinned to `opacity: 0` |
| Already on | Hero's two CTAs, Menu's spicy toggle, Menu's category chips, Menu's "Clear filters" |
| Newly applied by this pass | Navbar phone pill, Value's Lunch/Platter tab pills |

## 2. Animated underline — `.link-underline` (new shared class)

**What it's for**: plain text links (not button-shaped).

Extracted from Navbar's existing bespoke desktop-nav-link treatment — the
single nicest interaction already on the site — into a shared `.link-underline`
class. Navbar itself is refactored to consume the shared class rather than
keeping its own inline copy, so there's one underline behavior site-wide.

| | |
|---|---|
| Trigger | `:hover`, `:focus-visible`, or `[aria-current="true"]` (active page) |
| Mechanism | `::after` pseudo-element underline. **Base**: `scaleX(0)`, `transform-origin: right`. **Hover/focus/active**: `scaleX(1)`, `transform-origin: left`. Flipping the origin between states means the underline draws in from the left on enter and erases out to the right on leave, instead of shrinking back the way it came. |
| Duration / easing | 300ms, `cubic-bezier(0.22, 0.61, 0.36, 1)` |
| Reduced motion | No `transform` transition — the underline snaps to its state instantly |
| Already on | Navbar desktop nav links (source of the pattern, now refactored onto the shared class) |
| Newly applied by this pass | Footer nav links, Visit's phone link, Visit's "Get directions" link |

## 3. Property fade — plain `transition-colors` / `transition-opacity`

**What it's for**: small, local state changes that aren't press or reveal —
a color shift, an opacity change, a border/shadow appearing. The "default"
when nothing fancier is warranted.

| | |
|---|---|
| Trigger | `:hover`, `:focus`, conditional render |
| Duration | 150–300ms depending on context (200ms is the site's baseline default) |
| Easing | `ease-in-out` or the default `ease` — no spring, no overshoot |
| Reduced motion | Not gated — these are simple property fades, not motion in the vestibular-trigger sense, so they stay on |
| Already on | Menu's dish-row hover-bg (`transition-colors duration-200`), price nudge-on-hover |
| Newly applied by this pass | Menu's `SearchInput` focus border/shadow, Menu's clear-"×" button hover color, Visit's "Get directions" arrow nudge (`translate-x` via `transition-transform`), Visit's `LazyLoadMap` iframe fade-in (`transition-opacity`) |

## 4. Scroll reveal — `acc-fade-up` keyframe, via new `useReveal` hook

**What it's for**: a section or card entering on scroll, once, the first
time it's seen.

| | |
|---|---|
| Trigger | IntersectionObserver fires once, then unobserves |
| Mechanism | `opacity 0 → 1`, `translateY(12px) → 0` |
| Duration / easing | 0.4s, `cubic-bezier(0.22, 0.61, 0.36, 1)` (already defined in `index.css`, previously unused) |
| Reduced motion | Skips straight to the end state — no fade, no translate, just appears |
| Already defined, previously unused | `--animate-acc-fade-up` in `index.css` |
| Newly wired up by this pass | Story.tsx (whole section), Value.tsx's intro block + specials card (via their existing `data-reveal`/`data-reveal-delay` attributes), QuickInfo.tsx (via its existing `data-reveal` attribute), Footer.tsx |

## 5. Gentle pulse — `gentle-pulse` keyframe (`animate-spicy-pulse`)

**What it's for**: a small dot indicator signaling "this is live/active
right now" — not for anything else. Reused as-is, no new keyframe.

| | |
|---|---|
| Trigger | Always-on `infinite` loop while the element is mounted |
| Mechanism | `opacity 1 → 0.7 → 1`, `scale(1) → 1.15 → 1` |
| Duration / easing | 3s, `ease-in-out`, infinite |
| Reduced motion | An infinite scale+opacity loop with no stop mechanism is a WCAG 2.2.2 (Pause/Stop/Hide) and vestibular-trigger concern. Under `prefers-reduced-motion: reduce`, `.animate-spicy-pulse` swaps to an opacity-only keyframe (`gentle-pulse-opacity`: `opacity 1 → 0.7 → 1`, same 3s timing, **no** `scale`) — the dot still reads as "live" without the dimension change. This fixes all instances of the class, including the ones that predate this pass. |
| Already on | Menu.tsx's spicy dots (dish rows + intro legend) |
| Newly applied by this pass | Value.tsx's spicy dot (parity fix — same dot, was missing the class); QuickInfo.tsx's and Visit.tsx's "Open" status dot, **only** when status is "Open" (not "Closed"/"Closing Soon") |

## Decision rule for future additions

When adding a new interactive element, pick from the table above by shape
and intent — don't invent a sixth type:

- Button/pill you click → **Press spring**
- Text link you click → **Animated underline**
- Anything else that changes on hover/focus/state → **Property fade**
- Content appearing on scroll → **Scroll reveal**
- A small dot saying "this is live" → **Gentle pulse**
