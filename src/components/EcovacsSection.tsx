import { useEffect, useRef, useState } from "react";

import video from "@/assets/ecovacs-clean.webm.asset.json";
import poster from "@/assets/ecovacs-poster.jpg.asset.json";

const WORDS = ["innovation", "intelligence", "precision", "power"];
const BLUE = "linear-gradient(90deg,#00c6ff,#3b82f6,#22d3ee,#00c6ff)";

export function EcovacsSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setWordIndex((i) => (i + 1) % WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (reduced) {
      setProgress(1);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const raw = (vh - rect.top) / (vh * 0.85);
      setProgress(Math.min(1, Math.max(0, raw)));
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
  }, [reduced]);

  const eased = 1 - Math.pow(1 - progress, 3);
  const width = 68 + eased * 32;
  const radius = 28 - eased * 28;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-24 md:py-32"
      style={{ "--slide-gradient": BLUE } as React.CSSProperties}
    >
      <div className="mx-auto max-w-[1100px] px-5 text-center md:px-10">
        <h2 className="font-display text-[clamp(2rem,7vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground md:text-[clamp(2.75rem,4.4vw,3.75rem)]">
          Ecovacs robot vacuums for your home, designed with{" "}
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <span key={wordIndex} className="animate-wipe-up inline-block">
              <span className="accent-gradient inline-block">{WORDS[wordIndex]}</span>
            </span>
          </span>
        </h2>
        <p className="mt-7 text-[15px] font-medium tracking-tight text-foreground/90">Ecovacs</p>
        <p className="mt-1 text-[13px] font-light text-muted-foreground">
          Smart home cleaning robots
        </p>
      </div>

      <div className="mt-14 flex justify-center md:mt-20">
        <div
          className="relative aspect-[16/9] overflow-hidden bg-card will-change-[width]"
          style={{
            width: `min(100vw, ${width}vw)`,
            borderRadius: `${radius}px`,
          }}
        >
          <video
            src={video.url}
            poster={poster.url}
            className="size-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
      </div>
    </section>
  );
}