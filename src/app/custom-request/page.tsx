import type { Metadata } from "next";
import Link from "next/link";
import CustomRequestForm from "@/components/custom/CustomRequestForm";

export const metadata: Metadata = {
  title: "Create a Custom Design — Bespoke Tailoring",
  description:
    "Share your reference images, measurements and preferred material with Knit & Knot's Trivandrum tailors, and get a fully custom, made-to-measure outfit designed around your idea.",
  alternates: { canonical: "/custom-request" },
};

export default function CustomRequestPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 md:px-10">
      <div className="mb-8 text-center">
        <span className="text-xs uppercase tracking-[0.35em] text-gold">Create Custom</span>
        <h1 className="font-display mt-4 text-4xl md:text-5xl">Create Your Own Style</h1>
        <p className="mx-auto mt-2 text-espresso/70">Have a design in mind?</p>
        <p className="mx-auto mt-4 max-w-lg text-espresso/60">
          Share your reference and measurements, then select your preferred
          material from our in-store collection. We&apos;ll customise the
          design and create an outfit tailored to your style and fit.
        </p>
      </div>

      <p className="mb-10 text-center text-sm text-espresso/50">
        Prefer to talk it through instead of filling out a form?{" "}
        <Link href="/contact" className="underline underline-offset-2 text-espresso">
          Contact us on WhatsApp or Instagram
        </Link>{" "}
        and we&apos;ll help you put your custom request together.
      </p>

      <CustomRequestForm />
    </main>
  );
}
