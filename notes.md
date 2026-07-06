Also add <link rel="canonical" href="https://chinachef.com/"> and <meta name="theme-color" content="#C1272D"> for mobile chrome.

Accessibility

    Decorative glyphs (⌖ ◷ ☏ 厨 福 ● 📞) need aria-hidden="true". Right now SR users hear "telephone receiver, red circle, kitchen, fortune, …" — pure noise.
    No skip-to-content link. One anchor styled off-screen, focus-visible brings it in.
    Header <nav> needs aria-label="Primary" to distinguish from the footer's link list.
    Muted text colors (#7A7264 on #FBEAE8, #7A5B56 on #FDF3F1, #B0A692 on #F4DEDB) — at least one of these fails AA 4.5:1, I'd run them through a contrast checker before shipping.
    Floating Call FAB: no safe-area-inset-bottom padding. On iPhones with the home indicator it overlaps the gesture bar.

Performance

    <script src="./support.js"> in <head> without defer blocks render. Add defer.
    Google Fonts loaded after first paint via <helmet> — promote to <head> and consider self-hosting just the two Cormorant Garamond weights you actually use (regular + italic). One fewer third-party connection.
    setupReveal() runs in componentDidMount and again after fetch — only the second call observes the freshly-mounted reveal nodes. Works, but worth a comment so a future you doesn't "fix" it.

Nice-to-haves I'd add
    MenuSection + MenuItem schema layered on top of the Restaurant schema. Helps dish-level discovery in Google.
    TODO: generate this JSON-LD (Restaurant + MenuSection/MenuItem) at build time from src/data/menu.json and bake it into index.html, rather than injecting client-side. Menu.tsx already imports menu.json statically (not fetched at runtime), so the schema can be static too. Avoids relying on a runtime head-management lib (react-helmet-async) whose client-injected script only reliably reaches crawlers that execute JS (Google does; Bing/social-card scrapers mostly don't).
    OG image has no width/height — FB / X will warn. Add <meta property="og:image:width"> etc.
    apple-touch-icon missing sizes="180x180" attribute.



run the rendered page through a standard WCAG AA contrast checker to ensure your foreground text meets the 4.5:1 ratio threshold against the background elements.
