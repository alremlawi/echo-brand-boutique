import { useEffect, useRef, useState } from "react";

const GREEN = "linear-gradient(90deg,#00ff5f,#22e07a,#00e0a0,#00ff5f)";

const WORDS = ["POWER", "SPEED", "PERFORMANCE", "POSSIBILITIES"];

export function BelkinSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
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
      const progress = Math.min(Math.max(-rect.top / total, 0), 0.999);
      setIndex(Math.floor(progress * WORDS.length));
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
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative h-[400svh] bg-background"
      style={{ "--slide-gradient": GREEN } as React.CSSProperties}
      aria-label="Belkin — ready for iPhone"
    >
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden px-5 md:px-10">
        <h2 className="mx-auto max-w-[1100px] text-center font-display text-[clamp(2.25rem,8vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-foreground md:text-[clamp(3rem,5.6vw,4.75rem)]">
          <span className="accent-gradient">Belkin</span> ready for iPhone with{" "}
          <span className="relative mt-3 block h-[1.2em] overflow-hidden">
            {WORDS.map((word, i) => (
              <span
                key={word}
                className="absolute inset-x-0 top-0 flex items-center justify-center transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
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
