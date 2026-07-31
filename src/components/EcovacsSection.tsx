import { useEffect, useRef, useState } from "react";

import video from "@/assets/ecovacs-clean.webm.asset.json";
import poster from "@/assets/ecovacs-poster.jpg.asset.json";

const WORDS = ["innovation", "intelligence", "precision", "power"];
const BLUE = "linear-gradient(90deg,#00c6ff,#3b82f6,#22d3ee,#00c6ff)";
const LONGEST = WORDS.reduce((a, b) => (b.length > a.length ? b : a));

const TYPE_MS = 55;
const DELETE_MS = 35;
const HOLD_MS = 1600;

const STAGES = [0, 1, 2] as const;
const DESKTOP_WIDTHS = [46, 72, 100];
const MOBILE_WIDTHS = [78, 92, 100];
const RADII = [28, 18, 0];

export function EcovacsSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [typed, setTyped] = useState<string>(WORDS[0] ?? "");
  const [deleting, setDeleting] = useState(false);
  const [stage, setStage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Typewriter: type -> hold -> delete -> next word
  useEffect(() => {
    const word = WORDS[wordIndex]!;
    if (reduced) {
      setTyped(word);
      const t = setTimeout(() => setWordIndex((i) => (i + 1) % WORDS.length), 2200);
      return () => clearTimeout(t);
    }

    if (!deleting) {
      if (typed.length < word.length) {
        const t = setTimeout(() => setTyped(word.slice(0, typed.length + 1)), TYPE_MS);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setDeleting(true), HOLD_MS);
      return () => clearTimeout(t);
    }

    if (typed.length > 0) {
      const t = setTimeout(() => setTyped(word.slice(0, typed.length - 1)), DELETE_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % WORDS.length);
    }, 220);
    return () => clearTimeout(t);
  }, [typed, deleting, wordIndex, reduced]);

  useEffect(() => {
    if (reduced) {
      setStage(2);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // how far the video block has travelled up the viewport (0 = just entering)
      const raw = (vh - rect.top) / vh;
      setStage((prev) => {
        // three buckets with hysteresis so boundaries don't flicker
        if (prev === 0) return raw > 0.5 ? (raw > 0.82 ? 2 : 1) : 0;
        if (prev === 1) return raw > 0.82 ? 2 : raw < 0.42 ? 0 : 1;
        return raw < 0.74 ? (raw < 0.42 ? 0 : 1) : 2;
      });
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

  // play only at the final stage
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (stage === STAGES[2]) {
      void el.play().catch(() => undefined);
    } else {
      el.pause();
    }
  }, [stage]);

  const width = (isMobile ? MOBILE_WIDTHS : DESKTOP_WIDTHS)[stage]!;
  const radius = RADII[stage]!;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background py-24 md:py-32"
      style={{ "--slide-gradient": BLUE } as React.CSSProperties}
    >
      <div className="mx-auto max-w-[1100px] px-5 text-center md:px-10">
        <h2 className="font-display text-[clamp(2rem,7vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground md:text-[clamp(2.75rem,4.4vw,3.75rem)]">
          Ecovacs robot vacuums for your home, designed with{" "}
          <span className="relative inline-flex items-baseline whitespace-pre">
            <span aria-hidden className="pointer-events-none invisible">
              {LONGEST}
            </span>
            <span className="absolute inset-y-0 left-0 flex items-baseline whitespace-pre">
              <span className="accent-gradient">{typed}</span>
              {!reduced && (
                <span className="animate-caret-blink ml-[0.06em] inline-block h-[0.82em] w-[0.05em] self-center bg-[#22d3ee]" />
              )}
            </span>
          </span>
        </h2>
        <p className="mt-7 text-[15px] font-medium tracking-tight text-foreground/90">Ecovacs</p>
        <p className="mt-1 text-[13px] font-light text-muted-foreground">
          Smart home cleaning robots
        </p>
      </div>

      <div ref={wrapRef} className="mt-14 flex justify-center md:mt-20">
        <div
          className="relative aspect-[16/9] overflow-hidden bg-card transition-[width,border-radius] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[width]"
          style={{
            width: `min(100vw, ${width}vw)`,
            borderRadius: `${radius}px`,
          }}
        >
          <video
            ref={videoRef}
            src={video.url}
            poster={poster.url}
            className="size-full object-cover"
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