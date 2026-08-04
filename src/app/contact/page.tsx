"use client";
import { useState } from "react";
import Link from "next/link";
import { Instagram, Mail, Phone } from "lucide-react";
import { publicSupabase } from "@/lib/supabase/public";
import WhatsAppIcon from "@/components/layout/WhatsAppIcon";

const WHATSAPP_NUMBER = "919562572931";
const WHATSAPP_MESSAGE = "Hi Knit & Knot! I'd like to make a custom request.";
const INSTAGRAM_URL = "https://www.instagram.com/knit__and_knot/";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: insertErr } = await publicSupabase.from("contact_messages").insert(form);
    setSubmitting(false);
    if (insertErr) {
      setError("Something went wrong sending your message. Please try WhatsApp instead.");
      return;
    }
    setSubmitted(true);
  }

  return (
    <main className="mx-auto max-w-4xl px-6 pb-24 pt-32 md:px-10">
      <div className="mb-14 text-center">
        <span className="text-xs uppercase tracking-[0.35em] text-gold">Get in Touch</span>
        <h1 className="font-display mt-4 text-4xl md:text-5xl">Contact Us</h1>
        <p className="mx-auto mt-4 max-w-lg text-espresso/60">
          Questions about a material, an order, or want to talk through a
          custom design before submitting a request? Reach us however is
          easiest.
        </p>
      </div>

      <div className="mb-16 grid gap-4 sm:grid-cols-2">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-6 transition hover:border-gold"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
            <WhatsAppIcon className="h-6 w-6" />
          </span>
          <div>
            <p className="font-display text-lg">Chat on WhatsApp</p>
            <p className="text-sm text-espresso/50">+91 95625 72931 — fastest way to reach us</p>
          </div>
        </a>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-6 transition hover:border-gold"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white">
            <Instagram className="h-6 w-6" />
          </span>
          <div>
            <p className="font-display text-lg">Message us on Instagram</p>
            <p className="text-sm text-espresso/50">@knit__and_knot</p>
          </div>
        </a>
      </div>

      <div className="rounded-2xl bg-cream/50 p-6 text-center mb-4 text-sm text-espresso/60">
        Prefer to describe your design directly?{" "}
        <Link href="/custom-request" className="underline underline-offset-2 text-espresso">
          Create Something Custom
        </Link>{" "}
        instead — or send us a quick message below.
      </div>

      {submitted ? (
        <div className="rounded-2xl border border-black/10 bg-white p-8 text-center">
          <p className="font-display text-xl">Thank you!</p>
          <p className="mt-2 text-sm text-espresso/60">
            We&apos;ve received your message and will get back to you shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-black/10 bg-white p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border border-black/15 px-4 py-3 text-sm" />
            <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-lg border border-black/15 px-4 py-3 text-sm" />
          </div>
          <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm" />
          <textarea required rows={4} placeholder="How can we help?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={submitting} className="w-full rounded-full bg-espresso py-3.5 text-sm tracking-wide text-white transition hover:bg-charcoal disabled:opacity-50">
            {submitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}

      <div className="mt-10 flex flex-col items-center gap-2 text-sm text-espresso/50">
        <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> hello@knitandknot.com</p>
        <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> +91 95625 72931</p>
      </div>
    </main>
  );
}
