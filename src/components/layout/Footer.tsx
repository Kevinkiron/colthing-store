"use client";
import Link from "next/link";
import { Instagram, Facebook, MapPin } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-charcoal text-ivory">
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-gold/10 blur-3xl animate-floaty" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-rose/10 blur-3xl animate-floaty" style={{ animationDelay: "2s" }} />

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid gap-14 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl">Knit &amp; Knot</p>
            <p className="mt-4 max-w-xs text-sm text-ivory/60">
              Knit &amp; Knot, based in Trivandrum, creates custom-stitched
              outfits and everyday wear for college students and working
              women.
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
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
            <p className="mt-6 flex items-center gap-2 text-sm text-ivory/60">
              <MapPin className="h-4 w-4 text-gold" /> Shipping pan-India
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-ivory/40 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Knit &amp; Knot. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-ivory/70">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-ivory/70">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
