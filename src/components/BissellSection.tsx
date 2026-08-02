import { useEffect, useRef, useState } from "react";
import { Heart, ShoppingCart, Eye } from "lucide-react";

import banner from "@/assets/bissell-banner.jpg.asset.json";
import b1 from "@/assets/bissell-1.jpg";
import b2 from "@/assets/bissell-2.jpg";
import b3 from "@/assets/bissell-3.jpg";
import b4 from "@/assets/bissell-4.jpg";

const RED = "linear-gradient(90deg,#ff2d2d,#ff6a3d,#ff0055,#ff2d2d)";

const PRODUCTS = [
  { name: "CrossWave HF3 Cordless", price: "$279.00", image: b1 },
  { name: "CrossWave OmniForce", price: "$399.00", image: b2 },
  { name: "CrossWave X7 Plus Pet Pro", price: "$449.00", image: b3 },
  { name: "CrossWave HydroSteam", price: "$529.00", image: b4 },
];

export function BissellSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean[]>(() => PRODUCTS.map(() => false));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(PRODUCTS.map(() => true));
      return;
    }
    const root = gridRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-card]"));
    const observer = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = [...prev];
          for (const entry of entries) {
            const i = Number((entry.target as HTMLElement).dataset["card"]);
            next[i] = entry.isIntersecting;
          }
          return next;
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -8% 0px" },
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="bg-background py-20 md:py-28"
      style={{ "--slide-gradient": RED } as React.CSSProperties}
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <img
          src={banner.url}
          alt="Bissell CrossWave range — power in every pass"
          loading="lazy"
          className="w-full rounded-2xl object-cover"
        />

        <div className="mt-16 text-center">
          <h2 className="font-display text-[clamp(2rem,6vw,3rem)] font-semibold tracking-[-0.03em] text-foreground">
            Bissell <span className="accent-gradient">essentials</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">
            Multi-surface wet and dry cleaners that lift dirt, dust and spills in a single pass.
          </p>
        </div>

        <div
          ref={gridRef}
          className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4"
        >
          {PRODUCTS.map((p, i) => (
            <article
              key={p.name}
              data-card={i}
              className="group transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: visible[i] ? 1 : 0,
                transform: visible[i] ? "translateY(0)" : "translateY(40px)",
                transitionDelay: `${i * 90}ms`,
              }}
            >
              <div className="relative aspect-square overflow-hidden rounded-xl bg-card">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  width={768}
                  height={768}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  type="button"
                  aria-label={`Add ${p.name} to wishlist`}
                  className="absolute right-3 top-3 grid size-8 place-items-center rounded-full text-foreground/80 transition-colors hover:text-accent"
                >
                  <Heart className="size-4" />
                </button>
                <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-background/80 py-3 text-xs font-medium text-foreground backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
                  <Eye className="size-4" />
                  Quick View
                </div>
              </div>

              <h3 className="mt-4 font-display text-base font-semibold leading-tight text-foreground transition-colors">
                <span className="group-hover:accent-gradient">{p.name}</span>
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.price}</p>
              <span className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ShoppingCart className="size-3.5" />
                Select Options
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
