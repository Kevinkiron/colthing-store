import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you order from or use Knit & Knot.",
  alternates: { canonical: "/terms" },
};

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 md:px-10">
      <span className="text-xs uppercase tracking-[0.35em] text-gold">Legal</span>
      <h1 className="font-display mt-4 text-4xl md:text-5xl">Terms of Service</h1>
      <p className="mt-3 text-sm text-espresso/50">Last updated: August 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-espresso/70">
        <section>
          <h2 className="font-display mb-2 text-xl text-espresso">1. About Us</h2>
          <p>
            Knit &amp; Knot is a custom tailoring centre based in
            Thiruvananthapuram (Trivandrum), Kerala, offering ready-to-wear
            designs, customisable designs, and fully bespoke tailoring.
          </p>
        </section>

        <section>
          <h2 className="font-display mb-2 text-xl text-espresso">2. Orders &amp; Custom Requests</h2>
          <p>
            Ready-to-wear orders are confirmed once placed and paid for.
            Customised designs and fully bespoke requests are quoted
            individually based on the design, material, and measurements you
            share with us — production only begins once you&apos;ve approved
            the quotation.
          </p>
        </section>

        <section>
          <h2 className="font-display mb-2 text-xl text-espresso">3. Measurements &amp; Fit</h2>
          <p>
            Garments are made to the measurements you provide. We recommend
            double-checking your measurements before submitting an order or
            request — if you&apos;re unsure how to measure yourself, reach
            out to us and we&apos;ll help. Because each piece is made to
            order, fit issues arising from inaccurate measurements provided
            by the customer may not be covered under free alterations.
          </p>
        </section>

        <section>
          <h2 className="font-display mb-2 text-xl text-espresso">4. Pricing &amp; Payment</h2>
          <p>
            Prices for ready-to-wear designs are shown at checkout. Custom
            and bespoke work is priced via a quotation sent after we review
            your request, which you can accept or ask us to revise before any
            payment is collected.
          </p>
        </section>

        <section>
          <h2 className="font-display mb-2 text-xl text-espresso">5. Production Time &amp; Delivery</h2>
          <p>
            Production timelines vary by garment and are communicated at the
            time of order or quotation. We deliver pan-India, with doorstep
            delivery available in and around Trivandrum.
          </p>
        </section>

        <section>
          <h2 className="font-display mb-2 text-xl text-espresso">6. Cancellations &amp; Returns</h2>
          <p>
            Because most garments are made to order or made-to-measure,
            cancellations are only possible before production begins.
            Exchanges or alterations for genuine fit or quality issues are
            handled on a case-by-case basis — contact us as soon as possible
            after receiving your order.
          </p>
        </section>

        <section>
          <h2 className="font-display mb-2 text-xl text-espresso">7. Changes to These Terms</h2>
          <p>
            We may update these terms from time to time. Continued use of the
            site after changes are posted means you accept the updated
            terms.
          </p>
        </section>

        <section>
          <h2 className="font-display mb-2 text-xl text-espresso">8. Contact Us</h2>
          <p>
            Questions about these terms? Reach us at{" "}
            <a href="mailto:hello@knitandknot.com" className="underline underline-offset-2">hello@knitandknot.com</a>{" "}
            or via the contact options on our{" "}
            <a href="/contact" className="underline underline-offset-2">Contact page</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
