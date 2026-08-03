import { createFileRoute } from "@tanstack/react-router";

import { HeroSlider } from "@/components/HeroSlider";
import { EcovacsSection } from "@/components/EcovacsSection";
import { EcovacsProducts } from "@/components/EcovacsProducts";
import { BissellSection } from "@/components/BissellSection";
import { BelkinSection } from "@/components/BelkinSection";
import { BelkinProducts } from "@/components/BelkinProducts";
import { SiteHeader } from "@/components/SiteHeader";

const TITLE = "ReVolt — JBL, Belkin, Ecovacs, Bissell & BaByliss Store";
const DESCRIPTION =
  "Shop premium audio, charging, home cleaning and personal care tech from JBL, Belkin, Ecovacs, Bissell, BaByliss, Moulinex and Cuisinart.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const BRANDS = ["JBL", "BELKIN", "ECOVACS", "BISSELL", "BABYLISS", "MOULINEX", "CUISINART"];

function Index() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <SiteHeader />
      <main>
        <HeroSlider />
        <EcovacsSection />
        <EcovacsProducts />
        <BissellSection />
        <BelkinSection />
        <BelkinProducts />
        <section className="border-y border-border/60 py-8">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-12 gap-y-5 px-5 md:justify-between md:px-10">
            {BRANDS.map((b) => (
              <span
                key={b}
                className="font-display text-lg font-bold tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
              >
                {b}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
