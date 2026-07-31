## Goal

Add the first product section directly below the hero — an Ecovacs feature block styled like the ReBoot reference video: a large centered headline whose final word is a colored highlight, followed by a video that grows to full-bleed as you scroll.

## Headline

Centered, large display text, tight leading, same font as the site:

"Ecovacs robot vacuums for your home, designed with **innovation**"

- The last word cycles through **innovation → intelligence → precision → power** on a timer (~2.2s each), with a wipe-up/fade swap matching the hero's motion language.
- The rotating word uses a vivid blue gradient (same shimmer treatment as the hero accent word), reusing the existing `accent-gradient` utility with an Ecovacs blue `--slide-gradient`.
- Small supporting line under the headline (brand label + one-line descriptor), like the "Peter Bowman / Electronic technician" block in the reference.

## Scroll-expanding video

- The uploaded Ecovacs clip is registered as a CDN asset (not committed as a binary) and imported as a pointer.
- Plays muted, looped, autoplay, `playsInline`, with `preload="metadata"` and a poster frame so nothing flashes.
- Starts as a rounded contained card (~70% width) and, as the section scrolls through the viewport, scales out to full-bleed width with corners flattening — driven by scroll progress, exactly like the reference. Motion is smooth/eased and respects `prefers-reduced-motion` (static full-width card instead).
- Mobile: stays full-width with a lighter scale range; text sizes step down.

## Technical notes

- New `src/components/EcovacsSection.tsx`, rendered in `src/routes/index.tsx` after `<HeroSlider />` (kept above the existing brand strip, which stays as-is).
- Scroll progress via a single `IntersectionObserver` + rAF-throttled scroll handler on the section ref — no new dependencies.
- Rotating-word swap uses existing keyframes in `src/styles.css`; only a small blue gradient token is added if needed. No hardcoded color utilities in components.
- Hero, header, and existing design tokens are untouched.

Next stages (product grid/cards for Ecovacs, then other brands) come after you approve this section.
