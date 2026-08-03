import { useEffect, useLayoutEffect, useRef, useState } from "react";

const GREEN = "linear-gradient(90deg,#00ff5f,#22e07a,#00e0a0,#00ff5f)";
const WORDS = ["POWER", "SPEED", "PERFORMANCE", "POSSIBILITIES"];

// scroll phases: slide in -> word swapping -> slide out
const SLIDE_IN = 0.28;
const WORDS_END = 0.82;

export function BelkinSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);

  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const rangeRef = useRef({ start: 0, end: 0, exit: 0 });
  const indexRef = useRef(0);
  const reducedRef = useRef(false);
  const xRef = useRef(0);
  const applyRef = useRef(() => {});

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      reducedRef.current = mq.matches;
      setReduced(mq.matches);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // measure where the sentence starts (off-screen right) and where it stops
  useLayoutEffect(() => {
    let raf = 0;
    const measure = () => {
      const row = rowRef.current;
      const slot = slotRef.current;
      if (!row || !slot) return;
      const vw = window.innerWidth;
      const rowRect = row.getBoundingClientRect();
      const slotRect = slot.getBoundingClientRect();
      const slotCentre = slotRect.left - rowRect.left + slotRect.width / 2;
      const pad = Math.min(vw * 0.06, 64);
      rangeRef.current = {
        start: pad, // sentence begins at its first word, on screen
        end: vw / 2 - slotCentre, // last word settles in the middle
        exit: -rowRect.width - pad, // sentence leaves to the left
      };
      window.dispatchEvent(new Event("scroll"));
    };
    const schedule = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    schedule();
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
    applyRef.current = () => {
      const row = rowRef.current;
      if (!row || reducedRef.current) return;
      row.style.transform = `translate3d(${xRef.current}px,0,0)`;
    };
    const update = () => {
      frame = 0;
      const el = wrapRef.current;
      const row = rowRef.current;
      if (!el || !row) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.min(Math.max(-rect.top / total, 0), 0.9999);

      const { start, end, exit } = rangeRef.current;
      let x: number;
      if (progress < SLIDE_IN) {
        // phase 1 — travel from the first word until the last word is centred
        x = start + (end - start) * (progress / SLIDE_IN);
      } else if (progress < WORDS_END) {
        // phase 2 — parked while the keywords swap
        x = end;
      } else {
        // phase 3 — the sentence moves on and the page continues
        x = end + (exit - end) * ((progress - WORDS_END) / (1 - WORDS_END));
      }
      xRef.current = Math.round(x * 100) / 100;
      applyRef.current();

      const wordProgress = Math.min(
        Math.max(progress - SLIDE_IN, 0) / (WORDS_END - SLIDE_IN),
        0.9999,
      );
      const next = Math.min(Math.floor(wordProgress * WORDS.length), WORDS.length - 1);
      if (next !== indexRef.current) {
        indexRef.current = next;
        setIndex(next);
      }
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative h-[300svh] bg-background md:h-[420svh]"
      style={{ "--slide-gradient": GREEN } as React.CSSProperties}
      aria-label="Belkin — ready for iPhone"
    >
      <div className="sticky top-0 flex h-svh items-center overflow-hidden [contain:layout_paint]">
        <h2 className="w-full">
          <div
            ref={rowRef}
            className="flex w-max items-baseline gap-[0.22em] whitespace-nowrap font-display text-[clamp(2.25rem,11vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.04em] text-foreground sm:text-[clamp(3rem,9.5vw,5rem)] md:text-[clamp(4.5rem,8.5vw,7.5rem)]"
            style={{
              transform: reduced ? "none" : "translate3d(0,0,0)",
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
          >
            <span className="accent-gradient">Belkin</span>
            <span>ready for iPhone with</span>
            <span
              ref={slotRef}
              className="relative inline-block h-[1.25em] w-[8.4em] overflow-hidden align-baseline"
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

      </div>
    </section>
  );
}
