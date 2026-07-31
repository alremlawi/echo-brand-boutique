## 1. Highlighted word — typewriter effect

Replace the current wipe-up reveal of the rotating word (innovation → intelligence → precision → power) with a chat-style typing animation:

- Types the word character by character (~55ms per char), holds for ~1.6s, then deletes character by character (~35ms per char), then moves to the next word.
- A blinking caret (thin vertical bar in the blue brand gradient) sits right after the text while typing/deleting.
- The line keeps a reserved minimum width so the headline doesn't jump around as the word grows and shrinks.
- Keeps the existing blue gradient + shimmer on the typed text.
- Respects `prefers-reduced-motion`: shows the words swapping without the typing animation.

## 2. Video — 3-stage scroll expansion

Currently the video expands smoothly with scroll and autoplays. Change to:

- Starts noticeably smaller (a contained card, ~46% of viewport width, rounded corners).
- As the section scrolls up through the viewport, it snaps through three discrete stages rather than a continuous slide:
  - Stage 1 — small card (~46vw, large radius)
  - Stage 2 — mid card (~72vw, medium radius)
  - Stage 3 — full-bleed (100vw, no radius)
- Each stage transition is an eased animation (~600ms cubic-bezier) so it reads as three deliberate steps, matching the reference video.
- Playback: video no longer autoplays on load. It stays paused on the poster frame and begins playing (muted, looping) once it reaches the final full-bleed stage; it pauses again if scrolled back out.
- Mobile: stages step to ~78vw → ~92vw → 100vw so the first stage stays legible on a small screen.

## Technical notes

All changes stay inside `src/components/EcovacsSection.tsx`, plus a `typing`/`caret-blink` keyframe pair added to `src/styles.css`. Stage detection uses the existing scroll listener, quantized into 3 buckets with hysteresis so it doesn't flicker at boundaries; width/radius move to CSS transitions instead of per-frame inline values. Playback is toggled with a ref to the `<video>` element.
