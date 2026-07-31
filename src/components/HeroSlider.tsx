import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import belkin from "@/assets/belkin.png.asset.json";
import jbl from "@/assets/jbl.png.asset.json";
import ecovacs from "@/assets/ecovacs.png.asset.json";
import bissell from "@/assets/bissell.png.asset.json";
import babyliss from "@/assets/babyliss.png.asset.json";
import moulinex from "@/assets/moulinex.png.asset.json";
import cuisinart from "@/assets/cuisinart.png.asset.json";

type Slide = {
  brand: string;
  accentWords: string;
  restWords: string;
  sub: string;
  cta: string;
  image: string;
  gradient: string;
};

const SLIDES: Slide[] = [
  {
    brand: "Belkin",
    accentWords: "Power",
    restWords: "without limits",
    sub: "Wireless charging built for your everyday devices.",
    cta: "Shop Belkin",
    image: belkin.url,
    gradient: "linear-gradient(90deg,#00ff5f,#39ff14,#00ffa3,#00ff5f)",
  },
  {
    brand: "JBL",
    accentWords: "Extreme",
    restWords: "the sound",
    sub: "Portable audio, headphones and party speakers.",
    cta: "Shop JBL",
    image: jbl.url,
    gradient: "linear-gradient(90deg,#ff8a00,#ff5722,#ffb300,#ff8a00)",
  },
  {
    brand: "Ecovacs",
    accentWords: "Let robots",
    restWords: "do the cleaning",
    sub: "Smart vacuums that map, mop and dock on their own.",
    cta: "Shop Ecovacs",
    image: ecovacs.url,
    gradient: "linear-gradient(90deg,#00c6ff,#3b82f6,#22d3ee,#00c6ff)",
  },
  {
    brand: "Bissell",
    accentWords: "Deep clean",
    restWords: "every corner",
    sub: "Home care machines that actually lift the dirt.",
    cta: "Shop Bissell",
    image: bissell.url,
    gradient: "linear-gradient(90deg,#ff2d55,#ff5f6d,#ff0033,#ff2d55)",
  },
  {
    brand: "BaByliss",
    accentWords: "Style",
    restWords: "that turns heads",
    sub: "Salon results, straight from your own hands.",
    cta: "Shop BaByliss",
    image: babyliss.url,
    gradient: "linear-gradient(90deg,#ff5fbf,#ff9ad5,#f472b6,#ff5fbf)",
  },
  {
    brand: "Moulinex",
    accentWords: "Master",
    restWords: "your kitchen",
    sub: "Precision appliances for everyday cooking.",
    cta: "Shop Moulinex",
    image: moulinex.url,
    gradient: "linear-gradient(90deg,#ff1e1e,#ff6a3d,#e11d48,#ff1e1e)",
  },
  {
    brand: "Cuisinart",
    accentWords: "Cook bold",
    restWords: "cook better",
    sub: "Iconic kitchen tools, built to perform for years.",
    cta: "Shop Cuisinart",
    image: cuisinart.url,
    gradient: "linear-gradient(90deg,#e6e6e6,#9ca3af,#ffffff,#e6e6e6)",
  },
];

const DURATION = 6000;

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback((next: number) => {
    setIndex((next + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(index + 1), DURATION);
    return () => clearTimeout(t);
  }, [index, paused, go]);

  useEffect(() => {
    SLIDES.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  }, []);

  return (
    <section
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-background"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const endX = e.changedTouches[0]?.clientX;
        if (endX !== undefined) {
          const dx = endX - touchX.current;
          if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
        }
        touchX.current = null;
      }}
    >
      {SLIDES.map((slide, i) => {
        const active = i === index;
        return (
          <div
            key={slide.brand}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              active ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
            aria-hidden={!active}
          >
            <img
              src={slide.image}
              alt={`${slide.brand} products`}
              className={`size-full object-cover ${active ? "animate-kenburns" : "scale-105"}`}
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/55 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/40" />

            <div
              className="absolute inset-0"
              style={{ "--slide-gradient": slide.gradient } as React.CSSProperties}
            >
              <div className="mx-auto flex h-full max-w-[1400px] items-center px-5 pl-6 md:px-10 md:pl-24">
                <div className="max-w-2xl">
                  <h1 className="font-display text-[12vw] font-medium leading-[1.02] tracking-[-0.02em] text-foreground sm:text-6xl lg:text-7xl">
                    <span className="block overflow-hidden pb-[0.06em]">
                      <span
                        className={`block ${active ? "animate-wipe-up [animation-delay:600ms]" : "opacity-0"}`}
                      >
                        <span className="accent-gradient inline-block">
                          {slide.accentWords}
                        </span>
                      </span>
                    </span>
                    <span className="block overflow-hidden pb-[0.06em]">
                      <span
                        className={`block ${active ? "animate-wipe-up [animation-delay:760ms]" : "opacity-0"}`}
                      >
                        {slide.restWords}
                      </span>
                    </span>
                  </h1>
                  <div className="overflow-hidden pb-1">
                    <p
                      className={`mt-5 max-w-md text-base text-foreground/80 md:text-[17px] ${
                        active ? "animate-wipe-up [animation-delay:980ms]" : "opacity-0"
                      }`}
                    >
                      {slide.sub}
                    </p>
                  </div>
                  <div className="overflow-hidden pb-2">
                    <div
                      className={active ? "animate-wipe-up [animation-delay:1200ms]" : "opacity-0"}
                    >
                      <a
                        href="#"
                        className="accent-btn mt-7 inline-flex items-center justify-center rounded-sm border border-foreground/70 px-7 py-3 text-[15px] font-medium text-foreground transition-colors duration-300"
                      >
                        {slide.cta}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <button
        aria-label="Previous slide"
        onClick={() => go(index - 1)}
        className="absolute left-4 top-1/2 z-20 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-foreground/25 text-foreground backdrop-blur-sm transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground md:grid"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        aria-label="Next slide"
        onClick={() => go(index + 1)}
        className="absolute right-4 top-1/2 z-20 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-foreground/25 text-foreground backdrop-blur-sm transition-colors hover:border-accent hover:bg-accent hover:text-accent-foreground md:grid"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute bottom-10 left-1/2 z-20 flex w-[min(88vw,340px)] -translate-x-1/2 items-center gap-4 md:left-auto md:right-14 md:translate-x-0">
        <span className="text-sm tabular-nums text-foreground/80">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="relative h-px flex-1 bg-foreground/30">
          <span
            key={`${index}-${paused}`}
            className={`absolute inset-y-0 left-0 -top-px h-[2px] bg-foreground ${
              paused ? "w-full" : "animate-progress"
            }`}
            style={paused ? undefined : { animationDuration: `${DURATION}ms` }}
          />
        </div>
        <span className="text-sm tabular-nums text-foreground/60">
          {String(SLIDES.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}