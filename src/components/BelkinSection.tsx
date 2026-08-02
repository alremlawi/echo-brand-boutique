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
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
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
      className="relative h-[420svh] bg-background"
      style={{ "--slide-gradient": GREEN } as React.CSSProperties}
      aria-label="Belkin — ready for iPhone"
    >
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <h2 className="w-full">
          <div
            ref={rowRef}
            className="flex w-max items-baseline gap-[0.3em] whitespace-nowrap font-display text-[clamp(2.5rem,11vw,4rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground md:text-[clamp(3.5rem,7vw,6rem)]"
            style={{
              transform: reduced ? "none" : `translate3d(${x}px,0,0)`,
              willChange: "transform",
            }}
          >
            <span className="accent-gradient">Belkin</span>
            <span>ready for iPhone with</span>
            <span
              ref={slotRef}
              className="relative inline-block h-[1.15em] w-[6.6em] overflow-hidden align-baseline"
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
