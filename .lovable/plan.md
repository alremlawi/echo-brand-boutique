## Goal

Build the first stage of an electronics e-commerce storefront (JBL, Belkin, Ecovacs, Bissell, BaByliss, Moulinex, Cuisinart) with a full-width auto-playing hero slider, styled exactly like the "ReBoot" reference screenshot: dark background, orange accent, transparent overlay header.

## Hero slider

- Full-bleed slider at `/` using the uploaded banner images (registered as CDN assets, not copied into the repo):
  1. Belkin charging showcase
  2. JBL audio stage
  3. Ecovacs robot vacuums
  4. Bissell home cleaning
  5. BaByliss hair styling
  6. Moulinex kitchen appliances
  7. Cuisinart kitchen appliances
- Auto-advance every ~6s, pause on hover, with manual arrows + dot indicators; loops infinitely.
- Motion: cross-fade between slides plus a slow Ken Burns zoom/pan on the active image so it feels alive; text animates in (headline word-stagger, subline + button fade-up).
- English marketing copy per slide, e.g.:
  - Belkin — "Power Without Limits" / "Wireless charging built for your everyday."
  - JBL — "Unleash The Sound" / "Portable audio, headphones and party speakers."
  - Ecovacs — "Let The Robots Clean" / "Smart vacuums that map, mop and dock."
  - Bissell — "Deep Clean, Every Corner" / "Home care that actually lifts the dirt."
  - BaByliss — "Style That Turns Heads" / "Salon results, straight from your hands."
  - Moulinex — "Master Your Kitchen" / "Precision appliances for everyday cooking."
  - Cuisinart — "Cook Bold" / "Iconic kitchen tools, built to perform."
- Each slide's first word/phrase gets the orange accent, like the reference.

## Header

Overlay navigation bar on top of the hero: logo mark + wordmark, links (Home, Shop, Brands, Blog, Contact), and account / cart / search icons on the right, cart badge included.

## Design system

Dark charcoal background (`#141414`-ish), orange accent (`#F26522`-ish), white text — added as oklch tokens in `src/styles.css`, no hardcoded colors in components. Bold condensed-ish display headings with a clean body font, loaded via `<link>` in the root route.

## Technical notes

- Uploaded banners become `src/assets/*.asset.json` CDN pointers via the assets CLI and are imported in the slider component.
- Slider implemented as a self-contained React component (state + interval), no extra carousel dependency required; images preloaded so transitions don't flash.
- `src/routes/index.tsx` placeholder is replaced with the storefront page and gets its own `head()` metadata (title, description, og/twitter tags).
- Mobile: image scales with `object-cover`, text sizes step down, arrows hidden in favor of swipe + dots.

Later stages (product grid, brand pages, cart, checkout) come after you approve this hero + shell.