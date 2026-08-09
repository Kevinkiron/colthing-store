import type { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Knit & Knot, a custom tailoring centre in Trivandrum — reach us on WhatsApp, Instagram, or send a message directly.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactClient />;
}
