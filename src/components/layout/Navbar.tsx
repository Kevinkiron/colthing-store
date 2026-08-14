"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Menu, X, User } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";

const links = [
  { href: "/materials", label: "Materials" },
  { href: "/shop", label: "Ready to Wear" },
  { href: "/custom-request", label: "Create Custom" },
];

// Only the homepage has a full-bleed dark hero behind the nav — every other
// page starts with a light/white background, so the nav must always render
// in its "scrolled" (light bg, dark text) style there, or the white-on-white
// text becomes invisible.
export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolledPast, setScrolledPast] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const open = useCartStore((s) => s.open);
  const count = useCartStore((s) => s.count());

  const scrolled = !isHome || scrolledPast;

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolledPast(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Mount flag so the drawer (rendered via a portal) only ever appears on
  // the client, never during SSR where `document` doesn't exist.
  useEffect(() => setMounted(true), []);

  // Lock background scroll while the drawer is open so the page behind it
  // can't move — on mobile Safari a scrollable body behind a fixed overlay
  // can peek through at the edges as the address bar collapses/expands.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "bg-ivory/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <button onClick={() => setMobileOpen(true)} className="md:hidden" aria-label="Open menu">
          <Menu className={cn("h-6 w-6", scrolled ? "text-espresso" : "text-white")} />
        </button>

        <nav className="hidden gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "text-sm tracking-wide transition-colors hover:opacity-70",
                scrolled ? "text-espresso" : "text-white"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className={cn("font-display text-2xl transition-colors", scrolled ? "text-espresso" : "text-white")}>
          Knit &amp; Knot
        </Link>

        <div className="flex items-center gap-5">
          <Link href="/account" aria-label="Account" className="hidden md:block">
            <User className={cn("h-5 w-5", scrolled ? "text-espresso" : "text-white")} />
          </Link>
          <Link href="/wishlist" aria-label="Wishlist">
            <Heart className={cn("h-5 w-5", scrolled ? "text-espresso" : "text-white")} />
          </Link>
          <button onClick={open} className="relative" aria-label="Cart">
            <ShoppingBag className={cn("h-5 w-5", scrolled ? "text-espresso" : "text-white")} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-medium text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ backgroundColor: "#1c1815", height: "100dvh" }}
                className="fixed inset-0 z-[110] flex flex-col bg-charcoal px-8 py-6 text-white md:hidden"
              >
                <div className="flex justify-between items-center">
                  <span className="font-display text-xl">Knit &amp; Knot</span>
                  <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <nav className="mt-16 flex flex-col gap-8">
                  {links.map((l) => (
                    <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="font-display text-3xl">
                      {l.label}
                    </Link>
                  ))}
                  <Link href="/account" onClick={() => setMobileOpen(false)} className="font-display text-3xl">
                    Account
                  </Link>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </header>
  );
}
