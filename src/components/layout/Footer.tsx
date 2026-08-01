"use client";
import Link from "next/link";
import { useState } from "react";
import { Instagram, Facebook, Youtube, MapPin } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="relative overflow-hidden bg-[--color-charcoal] text-[--color-ivory]">
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-[--color-gold]/10 blur-3xl animate-floaty" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[--color-gold]/10 blur-3xl animate-floaty" style={{ animationDelay: "2s" }} />

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid gap-14 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <p className="font-display text-2xl tracking-[0.2em]">LUNA ATELIER</p>
            <p className="mt-4 max-w-xs text-sm text-[--color-ivory]/60">
              Everyday elegance for women, thoughtfully designed and priced for
              real life. Premium look, honest prices.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" aria-label="Instagram" className="rounded-full border border-white/15 p-2 transition hover:border-[--color-gold] hover:text-[--color-gold]">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Facebook" className="rounded-full border border-white/15 p-2 transition hover:border-[--color-gold] hover:text-[--color-gold]">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" aria-label="YouTube" className="rounded-full border border-white/15 p-2 transition hover:border-[--color-gold] hover:text-[--color-gold]">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[--color-ivory]/50">Shop</p>
            <ul className="space-y-3 text-sm text-[--color-ivory]/80">
              <li><Link href="/shop">All Products</Link></li>
              <li><Link href="/shop?category=dresses">Dresses</Link></li>
              <li><Link href="/shop?category=co-ords-sets">Co-ords</Link></li>
              <li><Link href="/wishlist">Wishlist</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[--color-ivory]/50">Support</p>
            <ul className="space-y-3 text-sm text-[--color-ivory]/80">
              <li>Shipping & Returns</li>
              <li>Size Guide</li>
              <li>Track Order</li>
              <li>Contact Us</li>
            </ul>
            <p className="mt-6 flex items-center gap-2 text-sm text-[--color-ivory]/60">
              <MapPin className="h-4 w-4 text-[--color-gold]" /> Shipping pan-India
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[--color-ivory]/50">
              Join the atelier
            </p>
            <p className="mb-4 text-sm text-[--color-ivory]/70">
              10% off your first order, styling notes, new-drop alerts.
            </p>
            {subscribed ? (
              <p className="text-sm text-[--color-gold]">You&apos;re on the list — welcome.</p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubscribed(true);
                }}
                className="flex overflow-hidden rounded-full border border-white/20"
              >
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[--color-ivory]/40"
                />
                <button type="submit" className="whitespace-nowrap bg-[--color-gold] px-5 text-sm text-[--color-charcoal]">
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-[--color-ivory]/40 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Luna Atelier. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
