"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=dresses", label: "Dresses" },
  { href: "/shop?category=tops", label: "Tops" },
  { href: "/shop?category=co-ords-sets", label: "Co-ords" },
  { href: "/shop?category=loungewear", label: "Loungewear" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const open = useCartStore((s) => s.open);
  const count = useCartStore((s) => s.count());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "bg-[--color-ivory]/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className={cn("h-6 w-6", scrolled ? "text-[--color-charcoal]" : "text-white")} />
        </button>

        <nav className="hidden gap-8 md:flex">
          {links.slice(0, 3).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm tracking-wide transition-colors hover:opacity-70",
                scrolled ? "text-[--color-charcoal]" : "text-white"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          className={cn(
            "font-display text-xl tracking-[0.25em] transition-colors",
            scrolled ? "text-[--color-charcoal]" : "text-white"
          )}
        >
          LUNA ATELIER
        </Link>

        <div className="flex items-center gap-5">
          <Link href="/shop" className="hidden md:block" aria-label="Search">
            <Search className={cn("h-5 w-5", scrolled ? "text-[--color-charcoal]" : "text-white")} />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist">
            <Heart className={cn("h-5 w-5", scrolled ? "text-[--color-charcoal]" : "text-white")} />
          </Link>
          <button onClick={open} className="relative" aria-label="Cart">
            <ShoppingBag className={cn("h-5 w-5", scrolled ? "text-[--color-charcoal]" : "text-white")} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[--color-gold] text-[10px] font-medium text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] flex flex-col bg-[--color-charcoal] px-8 py-6 text-white md:hidden"
          >
            <div className="flex justify-end">
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="mt-16 flex flex-col gap-8">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-display text-3xl"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
