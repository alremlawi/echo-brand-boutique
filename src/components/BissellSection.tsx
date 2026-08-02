import { useEffect, useRef, useState } from "react";

import dirtyFloor from "@/assets/floor-dirty.jpg.asset.json";
import cleanFloor from "@/assets/floor-clean.jpg.asset.json";
import vacuum from "@/assets/bissell-vacuum.png.asset.json";

const RED = "linear-gradient(90deg,#ff2d2d,#ff6a3d,#ff0055,#ff2d2d)";

export function BissellSection() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -rect.top / total));
      setProgress(p);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // ease the pass so it starts and ends softly
  const eased = progress * progress * (3 - 2 * progress);
  const x = 6 + eased * 82; // % across the floor
  // natural push: slight rocking + subtle bob as it rolls
  const wobble = Math.sin(eased * Math.PI * 6);
  const tilt = -2 + wobble * 2.6;
  const bob = Math.abs(Math.sin(eased * Math.PI * 8)) * 6;

  return (
    <section
      ref={sceneRef}
      className="relative h-[260vh] bg-background"
      style={{ "--slide-gradient": RED } as React.CSSProperties}
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1400px] px-5 text-center md:px-10">
          <h2 className="font-display text-[clamp(2rem,6vw,3rem)] font-semibold tracking-[-0.03em] text-foreground">
            Bissell cleans as you <span className="accent-gradient">scroll</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
            Multi-surface wet and dry vacuums that lift dirt, dust and spills in a single pass.
          </p>
        </div>

        <div className="relative mt-10 h-[52vh] w-full overflow-hidden md:h-[56vh]">
          <img
            src={dirtyFloor.url}
            alt="Dusty floor before cleaning"
            className="absolute inset-0 size-full object-cover"
          />
          <img
            src={cleanFloor.url}
            alt="Spotless floor after cleaning"
            className="absolute inset-0 size-full object-cover"
            style={{ clipPath: `inset(0 ${100 - Math.min(100, x + 4)}% 0 0)` }}
          />
          {/* soft wet edge where the brush passes */}
          <div
            className="pointer-events-none absolute inset-y-0 w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-foreground/10 to-transparent blur-md"
            style={{ left: `${x + 4}%` }}
          />
          <img
            src={vacuum.url}
            alt="Bissell CrossWave multi-surface vacuum"
            className="pointer-events-none absolute bottom-[4%] h-[78%] w-auto -translate-x-1/2 drop-shadow-2xl"
            style={{
              left: `${x}%`,
              transform: `translate(-50%, ${-bob}px) rotate(${tilt}deg)`,
              transformOrigin: "50% 100%",
            }}
          />
        </div>
      </div>
    </section>
  );
}
