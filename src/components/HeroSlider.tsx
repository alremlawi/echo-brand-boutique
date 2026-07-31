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
};

const SLIDES: Slide[] = [
  {
    brand: "Belkin",
    accentWords: "Power",
    restWords: "without limits",
    sub: "Wireless charging built for your everyday devices.",
    cta: "Shop Belkin",
    image: belkin.url,
  },
  {
    brand: "JBL",
    accentWords: "Unleash",
    restWords: "the sound",
    sub: "Portable audio, headphones and party speakers.",
    cta: "Shop JBL",
    image: jbl.url,
  },
  {
    brand: "Ecovacs",
    accentWords: "Let robots",
    restWords: "do the cleaning",
    sub: "Smart vacuums that map, mop and dock on their own.",
    cta: "Shop Ecovacs",
    image: ecovacs.url,
  },
  {
    brand: "Bissell",
    accentWords: "Deep clean",
    restWords: "every corner",
    sub: "Home care machines that actually lift the dirt.",
    cta: "Shop Bissell",
    image: bissell.url,
  },
  {
    brand: "BaByliss",
    accentWords: "Style",
    restWords: "that turns heads",
    sub: "Salon results, straight from your own hands.",
    cta: "Shop BaByliss",
    image: babyliss.url,
  },
  {
    brand: "Moulinex",
    accentWords: "Master",
    restWords: "your kitchen",
    sub: "Precision appliances for everyday cooking.",
    cta: "Shop Moulinex",
    image: moulinex.url,
  },
  {
    brand: "Cuisinart",
    accentWords: "Cook bold,",
    restWords: "cook better",
    sub: "Iconic kitchen tools, built to perform for years.",
    cta: "Shop Cuisinart",
    image: cuisinart.url,
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
      className="relative h-[92vh] min-h-[560px] w-full overflow-hidden bg-background"
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

            <div className="absolute inset-0">
              <div className="mx-auto flex h-full max-w-[1400px] items-center px-5 md:px-10">
                <div className="max-w-2xl">
                  <p
                    className={`mb-5 text-xs font-semibold uppercase tracking-[0.35em] text-accent ${
                      active ? "animate-rise [animation-delay:100ms]" : "opacity-0"
                    }`}
                  >
                    {slide.brand}
                  </p>
                  <h1 className="font-display text-[13vw] font-bold leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                    <span
                      className={`block text-accent ${active ? "animate-rise [animation-delay:200ms]" : "opacity-0"}`}
                    >
                      {slide.accentWords}
                    </span>
                    <span
                      className={`block ${active ? "animate-rise [animation-delay:330ms]" : "opacity-0"}`}
                    >
                      {slide.restWords}
                    </span>
                  </h1>
                  <p
                    className={`mt-6 max-w-md text-base text-foreground/75 md:text-lg ${
                      active ? "animate-rise [animation-delay:460ms]" : "opacity-0"
                    }`}
                  >
                    {slide.sub}
                  </p>
                  <div className={active ? "animate-rise [animation-delay:600ms]" : "opacity-0"}>
                    <a
                      href="#"
                      className="mt-9 inline-flex items-center justify-center border border-foreground/70 px-9 py-3.5 text-sm font-medium text-foreground transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-foreground"
                    >
                      {slide.cta}
                    </a>
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

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 md:left-10 md:translate-x-0">
        {SLIDES.map((s, i) => (
          <button
            key={s.brand}
            aria-label={`Go to ${s.brand} slide`}
            onClick={() => go(i)}
            className="group relative h-[3px] overflow-hidden bg-foreground/25 transition-all duration-300"
            style={{ width: i === index ? 56 : 22 }}
          >
            <span
              key={`${s.brand}-${index}-${paused}`}
              className={`absolute inset-y-0 left-0 bg-accent ${
                i === index ? (paused ? "w-full" : "animate-progress") : "w-0"
              }`}
              style={i === index && !paused ? { animationDuration: `${DURATION}ms` } : undefined}
            />
          </button>
        ))}
      </div>
    </section>
  );
}