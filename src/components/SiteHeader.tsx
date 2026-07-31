import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Menu } from "lucide-react";
import { useEffect, useState } from "react";

const NAV = ["Home", "Shop", "Brands", "Blog", "Contact Us"];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-background/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 md:px-10">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid grid-cols-3 gap-[3px]">
            {[1, 0, 1, 1, 1, 0, 0, 1, 1].map((on, i) => (
              <span
                key={i}
                className={`block size-[7px] rounded-[1px] ${on ? "bg-accent" : "bg-transparent"}`}
              />
            ))}
          </span>
          <span className="font-display text-2xl font-extrabold tracking-tight text-foreground">
            Re<span className="text-accent">Volt</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex lg:mr-auto lg:ml-12">
          {NAV.map((item, i) => (
            <a
              key={item}
              href="#"
              className={`relative text-[17px] font-medium tracking-tight transition-colors hover:text-accent ${
                i === 0 ? "text-foreground" : "text-foreground/85"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-5 text-foreground">
          <button aria-label="Account" className="transition-colors hover:text-accent">
            <User className="size-[22px]" strokeWidth={1.5} />
          </button>
          <button aria-label="Cart" className="relative transition-colors hover:text-accent">
            <ShoppingBag className="size-[22px]" strokeWidth={1.5} />
            <span className="absolute -bottom-1 -right-1.5 grid size-[15px] place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
              0
            </span>
          </button>
          <button aria-label="Search" className="transition-colors hover:text-accent">
            <Search className="size-[22px]" strokeWidth={1.5} />
          </button>
          <button aria-label="Menu" className="transition-colors hover:text-accent lg:hidden">
            <Menu className="size-[22px]" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}