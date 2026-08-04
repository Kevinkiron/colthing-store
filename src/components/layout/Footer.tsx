"use client";
import Link from "next/link";
import { useState } from "react";
import { Instagram, Facebook, Youtube, MapPin } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="relative overflow-hidden bg-charcoal text-ivory">
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-gold/10 blur-3xl animate-floaty" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-rose/10 blur-3xl animate-floaty" style={{ animationDelay: "2s" }} />

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid gap-14 md:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <p className="font-display text-2xl">Knit &amp; Knot</p>
            <p className="mt-4 max-w-xs text-sm text-ivory/60">
              A premium bespoke fashion atelier. Choose a material, wear it
              as designed, make it yours, or create something entirely your
              own.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="https://wa.me/919562572931" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="rounded-full border border-white/15 p-2 transition hover:border-gold hover:text-gold">
                <WhatsAppIcon className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/knit__and_knot/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="rounded-full border border-white/15 p-2 transition hover:border-gold hover:text-gold">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Facebook" className="rounded-full border border-white/15 p-2 transition hover:border-gold hover:text-gold">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" aria-label="YouTube" className="rounded-full border border-white/15 p-2 transition hover:border-gold hover:text-gold">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-ivory/50">Discover</p>
            <ul className="space-y-3 text-sm text-ivory/80">
              <li><Link href="/materials">Materials</Link></li>
              <li><Link href="/shop">Ready to Wear</Link></li>
              <li><Link href="/custom-request">Create Something Custom</Link></li>
              <li><Link href="/wishlist">Wishlist</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-ivory/50">Support</p>
            <ul className="space-y-3 text-sm text-ivory/80">
              <li>Size &amp; Measurement Guide</li>
              <li>Track Order / Request</li>
              <li>Shipping &amp; Returns</li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
            <p className="mt-6 flex items-center gap-2 text-sm text-ivory/60">
              <MapPin className="h-4 w-4 text-gold" /> Shipping pan-India
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-ivory/50">Join the atelier</p>
            <p className="mb-4 text-sm text-ivory/70">
              New materials, new designs, and styling notes — occasionally, thoughtfully.
            </p>
            {subscribed ? (
              <p className="text-sm text-gold">You&apos;re on the list — welcome.</p>
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
                  className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-ivory/40"
                />
                <button type="submit" className="whitespace-nowrap bg-gold px-5 text-sm text-white">
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-ivory/40 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Knit &amp; Knot. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
