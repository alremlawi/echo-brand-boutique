import { useEffect, useRef, useState } from "react";

const GREEN = "linear-gradient(90deg,#00ff5f,#22e07a,#00e0a0,#00ff5f)";
const WORDS = ["POWER", "SPEED", "PERFORMANCE", "POSSIBILITIES"];

// constant marquee speed, px per second (matches the reference ticker feel)
const SPEED = 90;

function Sentence({ index, reduced }: { index: number; reduced: boolean }) {
  return (
    <div className="flex shrink-0 items-baseline gap-[0.3em] whitespace-nowrap pr-[0.6em]">
      <span className="accent-gradient">Belkin</span>
      <span>ready for iPhone with</span>
      <span className="relative inline-block h-[1.3em] w-[8.6em] overflow-hidden align-baseline">
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
  );
}

export function BelkinSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const indexRef = useRef(0);
  const reducedRef = useRef(false);

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

  // continuous marquee — the sentence never stops moving
  useEffect(() => {
    const track = trackRef.current;
    const copy = copyRef.current;
    const wrap = wrapRef.current;
    if (!track || !copy || !wrap) return;

    let raf = 0;
    let last = 0;
    let offset = 0;
    let width = copy.offsetWidth || 1;
    let visible = true;

    const ro = new ResizeObserver(() => {
      width = copy.offsetWidth || 1;
    });
    ro.observe(copy);

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      if (!reducedRef.current) {
        offset = (offset + SPEED * dt) % width;
        track.style.transform = `translate3d(${-offset}px,0,0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    // only animate while the section is on screen
    const io = new IntersectionObserver((entries) => {
      visible = entries.some((e) => e.isIntersecting);
      if (visible) start();
      else stop();
    });
    io.observe(wrap);

    const onVisibility = () => {
      if (document.hidden || !visible) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    start();
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // scroll still drives which keyword is showing
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
      const next = Math.min(Math.floor(progress * WORDS.length), WORDS.length - 1);
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
            ref={trackRef}
            className="flex w-max items-baseline whitespace-nowrap font-display text-[clamp(1.5rem,7.5vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground sm:text-[clamp(2rem,6.5vw,3.25rem)] md:text-[clamp(2.75rem,6vw,5rem)]"
            style={{
              transform: reduced ? "none" : "translate3d(0,0,0)",
              willChange: "transform",
              backfaceVisibility: "hidden",
            }}
          >
            <div ref={copyRef} className="flex shrink-0">
              <Sentence index={index} reduced={reduced} />
            </div>
            <Sentence index={index} reduced={reduced} />
            <Sentence index={index} reduced={reduced} />
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
