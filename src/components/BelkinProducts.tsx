import { useEffect, useRef, useState } from "react";
import { Heart, ShoppingCart, Eye } from "lucide-react";

import p1 from "@/assets/belkin-1.jpg";
import p2 from "@/assets/belkin-2.jpg";
import p3 from "@/assets/belkin-3.jpg";
import p4 from "@/assets/belkin-4.jpg";

const GREEN = "linear-gradient(90deg,#00ff5f,#22e07a,#00e0a0,#00ff5f)";

const PRODUCTS = [
  { name: "BoostCharge Pro MagSafe Stand", price: "$129.00", image: p1 },
  { name: "BoostCharge Magnetic Power Bank 10K", price: "$79.00", image: p2 },
  { name: "BoostCharge Pro 3-in-1 Wireless Pad", price: "$149.00", image: p3 },
  { name: "SoundForm Elite + 30W Charger", price: "$99.00", image: p4 },
];

export function BelkinProducts() {
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
      className="bg-background py-10 md:py-16"
      style={{ "--slide-gradient": GREEN } as React.CSSProperties}
      aria-label="Belkin products"
    >
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div ref={gridRef} className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
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