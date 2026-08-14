"use client";
import { useState } from "react";
import { Instagram } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { BUSINESS_PHONE_DIGITS, BUSINESS_INSTAGRAM } from "@/lib/seo";

const WHATSAPP_NUMBER = BUSINESS_PHONE_DIGITS;
const WHATSAPP_MESSAGE = "Hi Knit & Knot! I'd like to make a custom request.";
const INSTAGRAM_URL = BUSINESS_INSTAGRAM;

export default function FloatingContact() {
  const [hover, setHover] = useState<"whatsapp" | "instagram" | null>(null);

  return (
    <div className="fixed bottom-6 right-5 z-[65] flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message us on Instagram"
        onMouseEnter={() => setHover("instagram")}
        onMouseLeave={() => setHover(null)}
        className="flex items-center gap-2"
      >
        {hover === "instagram" && (
          <span className="hidden rounded-full bg-charcoal px-3 py-1.5 text-xs text-white shadow-lg md:inline-block">
            Message us on Instagram
          </span>
        )}
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white shadow-lg transition-transform hover:scale-110">
          <Instagram className="h-5 w-5" />
        </span>
      </a>

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setHover("whatsapp")}
        onMouseLeave={() => setHover(null)}
        className="flex items-center gap-2"
      >
        {hover === "whatsapp" && (
          <span className="hidden rounded-full bg-charcoal px-3 py-1.5 text-xs text-white shadow-lg md:inline-block">
            Chat on WhatsApp
          </span>
        )}
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-110">
          <WhatsAppIcon className="h-7 w-7" />
        </span>
      </a>
    </div>
  );
}
