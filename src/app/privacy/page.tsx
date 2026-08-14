import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Knit & Knot collects, uses, and protects your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 md:px-10">
      <span className="text-xs uppercase tracking-[0.35em] text-gold">Legal</span>
      <h1 className="font-display mt-4 text-4xl md:text-5xl">Privacy Policy</h1>
      <p className="mt-3 text-sm text-espresso/50">Last updated: August 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-espresso/70">
        <section>
          <h2 className="font-display mb-2 text-xl text-espresso">1. Information We Collect</h2>
          <p>
            When you place an order, submit a custom design request, create an
            account, or contact us, we collect information such as your name,
            email address, phone number, shipping address, measurements, and
            any reference images or design notes you share with us.
          </p>
        </section>

        <section>
          <h2 className="font-display mb-2 text-xl text-espresso">2. How We Use Your Information</h2>
          <p>
            We use your information to process orders and custom requests,
            communicate with you about your order or request (including via
            WhatsApp, email, or phone), fulfil delivery, and — if you&apos;ve
            opted in — send occasional updates about new materials and
            designs. We do not sell your personal information to third
            parties.
          </p>
        </section>

        <section>
          <h2 className="font-display mb-2 text-xl text-espresso">3. Measurements &amp; Custom Design Details</h2>
          <p>
            Measurements and design preferences you provide are used solely
            to create your garment and, if you choose to save them, to make
            future orders faster. You can update or delete saved measurement
            profiles at any time from your account.
          </p>
        </section>

        <section>
          <h2 className="font-display mb-2 text-xl text-espresso">4. Data Storage &amp; Security</h2>
          <p>
            Your information is stored securely using industry-standard
            infrastructure with access controls in place. While we take
            reasonable steps to protect your data, no method of transmission
            or storage is completely secure.
          </p>
        </section>

        <section>
          <h2 className="font-display mb-2 text-xl text-espresso">5. Cookies</h2>
          <p>
            We use minimal cookies and local storage to keep your cart and
            wishlist working across visits. We don&apos;t use third-party
            advertising trackers.
          </p>
        </section>

        <section>
          <h2 className="font-display mb-2 text-xl text-espresso">6. Your Rights</h2>
          <p>
            You can request access to, correction of, or deletion of your
            personal data at any time by contacting us. Account holders can
            also manage saved measurement profiles directly from their
            account page.
          </p>
        </section>

        <section>
          <h2 className="font-display mb-2 text-xl text-espresso">7. Contact Us</h2>
          <p>
            For any questions about this policy or your data, reach us at{" "}
            <a href="mailto:hello@knitandknot.com" className="underline underline-offset-2">hello@knitandknot.com</a>{" "}
            or via the contact options on our{" "}
            <a href="/contact" className="underline underline-offset-2">Contact page</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
