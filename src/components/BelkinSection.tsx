import { useEffect, useLayoutEffect, useRef, useState } from "react";

const GREEN = "linear-gradient(90deg,#00ff5f,#22e07a,#00e0a0,#00ff5f)";
const WORDS = ["POWER", "SPEED", "PERFORMANCE", "POSSIBILITIES"];

// portion of the scroll used to slide the sentence in from the right
const SLIDE_PART = 0.45;

export function BelkinSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);

  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [range, setRange] = useState({ start: 0, end: 0 });
  const [x, setX] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // measure: where the sentence starts (off-screen right) and where it stops
  useLayoutEffect(() => {
    let raf = 0;
    const measure = () => {
      const row = rowRef.current;
      const slot = slotRef.current;
      if (!row || !slot) return;
      const vw = window.innerWidth;
      const rowRect = row.getBoundingClientRect();
      const slotRect = slot.getBoundingClientRect();
      // current (untranslated by measurement time) offset of the word slot centre
      const slotCentre = slotRect.left - rowRect.left + slotRect.width / 2;
      const start = vw; // fully off-screen to the right
      const end = vw / 2 - slotCentre; // word slot lands in the middle
      setRange({ start, end });
    };
    const schedule = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    schedule();
    // re-measure once webfonts settle so the slide distance stays correct
    if (typeof document !== "undefined" && "fonts" in document) {
      void document.fonts.ready.then(schedule);
    }
    const ro = new ResizeObserver(schedule);
    if (rowRef.current) ro.observe(rowRef.current);
    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.min(Math.max(-rect.top / total, 0), 0.9999);

      // linear, constant-speed travel — matches the reference ticker exactly
      const slide = Math.min(progress / SLIDE_PART, 1);
      setX(range.start + (range.end - range.start) * slide);

      const wordProgress = Math.max(progress - SLIDE_PART, 0) / (1 - SLIDE_PART);
      setIndex(Math.min(Math.floor(wordProgress * WORDS.length), WORDS.length - 1));
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [range]);

  return (
    <section
      ref={wrapRef}
      className="relative h-[300svh] bg-background md:h-[420svh]"
      style={{ "--slide-gradient": GREEN } as React.CSSProperties}
      aria-label="Belkin — ready for iPhone"
    >
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <h2 className="w-full">
          <div
            ref={rowRef}
            className="flex w-max items-baseline gap-[0.3em] whitespace-nowrap font-display text-[clamp(1.5rem,7.5vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-[clamp(2rem,6.5vw,3.25rem)] md:text-[clamp(2.75rem,6vw,5rem)]"
            style={{
              transform: reduced ? "none" : `translate3d(${x}px,0,0)`,
              willChange: "transform",
            }}
          >
            <span className="accent-gradient">Belkin</span>
            <span>ready for iPhone with</span>
            <span
              ref={slotRef}
              className="relative inline-block h-[1.3em] w-[8.6em] overflow-hidden align-baseline"
            >
              {WORDS.map((word, i) => (
                <span
                  key={word}
                  className="absolute inset-x-0 top-0 flex items-baseline transition-[opacity,transform] duration-300 ease-linear"
                  style={{
                    opacity: i === index ? 1 : 0,
                    transform: reduced
                      ? "none"
                      : i === index
                        ? "translateY(0)"
                        : i < index
                          ? "translateY(-70%)"
                          : "translateY(70%)",
                  }}
                  aria-hidden={i !== index}
                >
                  {i % 2 === 0 ? (
                    <span className="accent-gradient">{word}</span>
                  ) : (
                    <span className="text-foreground">{word}</span>
                  )}
                </span>
              ))}
            </span>
          </div>
        </h2>

        <div className="pointer-events-none absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-2">
          {WORDS.map((word, i) => (
            <span
              key={word}
              className="h-[3px] w-10 rounded-full transition-colors duration-300"
              style={{
                backgroundImage: i <= index ? GREEN : "none",
                backgroundColor: i <= index ? "transparent" : "var(--border)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
