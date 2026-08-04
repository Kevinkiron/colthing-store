import Link from "next/link";
import CustomRequestForm from "@/components/custom/CustomRequestForm";

export default function CustomRequestPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 md:px-10">
      <div className="mb-8 text-center">
        <span className="text-xs uppercase tracking-[0.35em] text-gold">Create Something Custom</span>
        <h1 className="font-display mt-4 text-4xl md:text-5xl">Have Your Own Idea?</h1>
        <p className="mx-auto mt-4 max-w-lg text-espresso/60">
          Tell us what you imagine and we&apos;ll create it using the
          material you love. Our atelier will review your request and send
          you a quotation.
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
