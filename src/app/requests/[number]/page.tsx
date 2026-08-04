"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Check } from "lucide-react";
import { publicSupabase } from "@/lib/supabase/public";
import { formatPrice, cn } from "@/lib/utils";
import type { CustomRequestStatus } from "@/lib/types";

const STATUS_STEPS: { key: CustomRequestStatus; label: string }[] = [
  { key: "submitted", label: "Request Submitted" },
  { key: "under_review", label: "Under Review" },
  { key: "quotation_ready", label: "Quotation Ready" },
  { key: "approved", label: "Approved" },
  { key: "payment_received", label: "Payment Received" },
  { key: "in_production", label: "In Production" },
  { key: "quality_check", label: "Quality Check" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

type TrackedRequest = {
  id: string;
  request_number: string;
  garment_type: string;
  description: string;
  status: CustomRequestStatus;
  measurements: Record<string, string>;
  preferred_fit: string | null;
  color_requirements: string | null;
  additional_requirements: string | null;
  desired_delivery_date: string | null;
  budget: number | null;
  created_at: string;
  materials?: { name: string; slug: string; main_image: string | null } | null;
  products?: { name: string; slug: string } | null;
  custom_request_images?: { url: string; image_type: string }[];
  quotations?: {
    id: string;
    status: string;
    total: number;
    notes: string | null;
    quotation_items: { id: string; label: string; amount: number }[];
  }[];
};

export default function RequestStatusPage() {
  const { number } = useParams<{ number: string }>();
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [submittedEmail, setSubmittedEmail] = useState(params.get("email") ?? "");
  const [request, setRequest] = useState<TrackedRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responding, setResponding] = useState(false);

  async function lookup(emailToUse: string) {
    setLoading(true);
    setError(null);
    const { data, error: rpcErr } = await publicSupabase.rpc("track_custom_request", {
      p_request_number: number,
      p_email: emailToUse,
    });
    setLoading(false);
    if (rpcErr || !data) {
      setError("We couldn't find a request with that number and email combination.");
      return;
    }
    setRequest(data as TrackedRequest);
    setSubmittedEmail(emailToUse);
  }

  useEffect(() => {
    if (submittedEmail) lookup(submittedEmail);
  }, []);

  async function respond(status: "accepted" | "changes_requested") {
    setResponding(true);
    await publicSupabase.rpc("respond_to_quotation", {
      p_request_number: number,
      p_email: submittedEmail,
      p_status: status,
    });
    await lookup(submittedEmail);
    setResponding(false);
  }

  if (!request) {
    return (
      <main className="mx-auto max-w-md px-6 pb-24 pt-40 text-center">
        <h1 className="font-display text-3xl">Track Your Request</h1>
        <p className="mt-3 text-sm text-espresso/60">
          Request {number} — enter the email you used to submit it.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            lookup(email);
          }}
          className="mt-6 space-y-3"
        >
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button disabled={loading} className="w-full rounded-full bg-espresso py-3 text-sm text-white disabled:opacity-50">
            {loading ? "Looking up..." : "Track Request"}
          </button>
        </form>
      </main>
    );
  }

  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === request.status);
  const quotation = request.quotations?.[0];

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 md:px-10">
      <div className="mb-10 text-center">
        <span className="text-xs uppercase tracking-[0.35em] text-gold">Custom Request</span>
        <h1 className="font-display mt-4 text-3xl">{request.request_number}</h1>
        {request.materials && <p className="mt-2 text-sm text-espresso/50">Material: {request.materials.name}</p>}
      </div>

      {request.status === "cancelled" ? (
        <p className="text-center text-red-600">This request has been cancelled.</p>
      ) : (
        <ol className="mb-14 space-y-0">
          {STATUS_STEPS.map((s, i) => (
            <li key={s.key} className="relative flex gap-4 pb-8 last:pb-0">
              {i < STATUS_STEPS.length - 1 && (
                <span
                  className={cn(
                    "absolute left-[11px] top-6 h-full w-px",
                    i < currentIndex ? "bg-gold" : "bg-black/10"
                  )}
                />
              )}
              <span
                className={cn(
                  "z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                  i <= currentIndex ? "border-gold bg-gold text-white" : "border-black/20 text-transparent"
                )}
              >
                {i <= currentIndex && <Check className="h-3.5 w-3.5" />}
              </span>
              <span className={cn("text-sm", i <= currentIndex ? "text-espresso" : "text-espresso/40")}>{s.label}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="font-display text-xl">Your Request</h2>
          <p className="mt-3 text-sm text-espresso/70">{request.description}</p>
          <dl className="mt-4 space-y-2 text-sm text-espresso/60">
            <div><dt className="inline text-espresso/40">Garment: </dt><dd className="inline capitalize">{request.garment_type}</dd></div>
            {request.preferred_fit && <div><dt className="inline text-espresso/40">Fit: </dt><dd className="inline">{request.preferred_fit}</dd></div>}
            {request.color_requirements && <div><dt className="inline text-espresso/40">Colour: </dt><dd className="inline">{request.color_requirements}</dd></div>}
            {request.desired_delivery_date && <div><dt className="inline text-espresso/40">Desired delivery: </dt><dd className="inline">{request.desired_delivery_date}</dd></div>}
          </dl>
        </div>

        {request.custom_request_images && request.custom_request_images.length > 0 && (
          <div>
            <h2 className="font-display text-xl">Reference Images</h2>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {request.custom_request_images.map((img, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-cream">
                  <Image src={img.url} alt="Reference" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {quotation && (
        <div className="mt-14 rounded-2xl border border-black/10 p-6">
          <h2 className="font-display text-xl">Your Quotation</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {quotation.quotation_items?.map((item) => (
              <li key={item.id} className="flex justify-between text-espresso/70">
                <span>{item.label}</span>
                <span>{formatPrice(item.amount)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-black/10 pt-4 font-medium">
            <span>Total</span>
            <span>{formatPrice(quotation.total)}</span>
          </div>
          {quotation.notes && <p className="mt-3 text-xs text-espresso/50">{quotation.notes}</p>}

          {quotation.status === "pending" && (
            <div className="mt-6 flex gap-3">
              <button
                disabled={responding}
                onClick={() => respond("accepted")}
                className="flex-1 rounded-full bg-espresso py-3 text-sm text-white disabled:opacity-50"
              >
                Accept &amp; Pay
              </button>
              <button
                disabled={responding}
                onClick={() => respond("changes_requested")}
                className="flex-1 rounded-full border border-black/15 py-3 text-sm"
              >
                Request Changes
              </button>
            </div>
          )}
          {quotation.status === "accepted" && (
            <p className="mt-6 text-sm text-gold">
              Quotation accepted. This is a demo checkout — our team will
              reach out to collect payment and confirm production.
            </p>
          )}
          {quotation.status === "changes_requested" && (
            <p className="mt-6 text-sm text-espresso/60">
              You&apos;ve requested changes — our team will follow up shortly.
            </p>
          )}
        </div>
      )}
    </main>
  );
}
