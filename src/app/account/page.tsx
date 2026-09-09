"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, cn } from "@/lib/utils";
import type { MeasurementProfile } from "@/lib/types";
import MeasurementFields from "@/components/custom/MeasurementFields";

type Tab = "orders" | "requests" | "measurements";

type OrderRow = {
  id: string;
  order_number: string;
  subtotal: number;
  status: string;
  created_at: string;
  refund_status: string | null;
};

// A customer can call off an order themselves right up until it leaves the
// studio. After that they need to talk to us.
const CANCELLABLE = ["pending", "confirmed"];

type RequestRow = {
  id: string;
  request_number: string;
  garment_type: string;
  status: string;
  created_at: string;
};

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClient();
  const [tab, setTab] = useState<Tab>("orders");
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState("");

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [profiles, setProfiles] = useState<MeasurementProfile[]>([]);

  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState("");
  const [newMeasurements, setNewMeasurements] = useState<Record<string, string>>({});
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/account/login");
        return;
      }
      setEmail(data.session.user.email ?? "");
      setChecked(true);
      const userId = data.session.user.id;
      supabase.from("orders").select("id, order_number, subtotal, status, created_at, refund_status").eq("user_id", userId).order("created_at", { ascending: false }).then(({ data }) => setOrders((data as OrderRow[]) ?? []));
      supabase.from("custom_requests").select("id, request_number, garment_type, status, created_at").eq("user_id", userId).order("created_at", { ascending: false }).then(({ data }) => setRequests((data as RequestRow[]) ?? []));
      supabase.from("measurement_profiles").select("*").eq("user_id", userId).order("created_at", { ascending: false }).then(({ data }) => setProfiles((data as MeasurementProfile[]) ?? []));
    });
  }, []);

  async function saveProfile() {
    setSavingProfile(true);
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user.id;
    if (!userId || !newLabel) {
      setSavingProfile(false);
      return;
    }
    const { data, error } = await supabase
      .from("measurement_profiles")
      .insert({ user_id: userId, label: newLabel, garment_type: "other", measurements: newMeasurements })
      .select()
      .single();
    if (!error && data) {
      setProfiles((p) => [data as MeasurementProfile, ...p]);
      setNewLabel("");
      setNewMeasurements({});
    }
    setSavingProfile(false);
  }

  async function cancelOrder(order: OrderRow) {
    const confirmed = confirm(
      `Cancel order #${order.order_number}?\n\nThis can't be undone. If you've already paid, we'll arrange your refund and it will reach you in 5–7 working days.`
    );
    if (!confirmed) return;

    const reason = prompt("Could you tell us why? (optional)") ?? "";

    setCancellingId(order.id);
    const { error } = await supabase.rpc("cancel_order", {
      p_order_id: order.id,
      p_reason: reason,
    });
    setCancellingId(null);

    if (error) {
      alert(error.message || "We couldn't cancel that order. Please contact us and we'll sort it out.");
      return;
    }

    setOrders((os) =>
      os.map((o) =>
        o.id === order.id ? { ...o, status: "cancelled", refund_status: "pending" } : o
      )
    );
  }

  async function deleteProfile(id: string) {
    await supabase.from("measurement_profiles").delete().eq("id", id);
    setProfiles((p) => p.filter((x) => x.id !== id));
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (!checked) return <div className="flex min-h-screen items-center justify-center text-sm text-espresso/40">Loading...</div>;

  return (
    <main className="mx-auto max-w-4xl px-6 pb-24 pt-32 md:px-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">My Account</h1>
          <p className="mt-1 text-sm text-espresso/50">{email}</p>
        </div>
        <button onClick={logout} className="text-sm text-espresso/50 underline">Log Out</button>
      </div>

      <div className="mb-8 flex gap-2 border-b border-black/10">
        {([
          ["orders", "My Orders"],
          ["requests", "My Custom Requests"],
          ["measurements", "My Measurements"],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "border-b-2 px-4 py-3 text-sm transition",
              tab === key ? "border-gold text-espresso" : "border-transparent text-espresso/40"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <p className="text-sm text-espresso/50">No orders yet.</p>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="rounded-xl border border-black/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display text-sm">#{o.order_number}</p>
                    <p className="text-xs text-espresso/50">{new Date(o.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatPrice(o.subtotal)}</p>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs capitalize",
                        o.status === "cancelled" ? "bg-red-50 text-red-700" : "bg-black/5"
                      )}
                    >
                      {o.status}
                    </span>
                  </div>
                </div>

                {CANCELLABLE.includes(o.status) && (
                  <div className="mt-3 border-t border-black/5 pt-3 text-right">
                    <button
                      onClick={() => cancelOrder(o)}
                      disabled={cancellingId === o.id}
                      className="text-xs text-red-600 underline underline-offset-2 transition hover:text-red-700 disabled:opacity-40"
                    >
                      {cancellingId === o.id ? "Cancelling..." : "Cancel this order"}
                    </button>
                  </div>
                )}

                {o.status === "cancelled" && o.refund_status === "pending" && (
                  <p className="mt-3 border-t border-black/5 pt-3 text-xs text-espresso/55">
                    Cancelled. Your refund is being arranged and should reach you within 5–7 working days.
                  </p>
                )}

                {o.status === "cancelled" && o.refund_status === "refunded" && (
                  <p className="mt-3 border-t border-black/5 pt-3 text-xs text-green-700">
                    Cancelled and refunded.
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {tab === "requests" && (
        <div className="space-y-3">
          {requests.length === 0 ? (
            <p className="text-sm text-espresso/50">
              No custom requests yet. <Link href="/custom-request" className="underline">Create one</Link>.
            </p>
          ) : (
            requests.map((r) => (
              <Link key={r.id} href={`/requests/${r.request_number}?email=${encodeURIComponent(email)}`} className="flex items-center justify-between rounded-xl border border-black/10 p-4 transition hover:border-gold">
                <div>
                  <p className="font-display text-sm">{r.request_number}</p>
                  <p className="text-xs text-espresso/50">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
                <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs capitalize">{r.status.replace(/_/g, " ")}</span>
              </Link>
            ))
          )}
        </div>
      )}

      {tab === "measurements" && (
        <div>
          <div className="space-y-3">
            {profiles.length === 0 ? (
              <p className="text-sm text-espresso/50">No saved measurement profiles yet.</p>
            ) : (
              profiles.map((p) => (
                <div key={p.id} className="rounded-xl border border-black/10 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-sm">{p.label}</p>
                    <button onClick={() => deleteProfile(p.id)} aria-label="Delete profile"><Trash2 className="h-4 w-4 text-black/40" /></button>
                  </div>
                  <p className="mt-2 text-xs text-espresso/50">
                    {Object.entries(p.measurements).map(([k, v]) => `${k}: ${v}"`).join("  ·  ")}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 rounded-2xl bg-cream/50 p-6">
            <p className="mb-4 font-display text-lg">Add a Measurement Profile</p>
            <div className="mb-4">
              <input placeholder="Label, e.g. Standard" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm sm:max-w-xs" />
            </div>
            <MeasurementFields garmentType="other" values={newMeasurements} onChange={(field, value) => setNewMeasurements((m) => ({ ...m, [field]: value }))} />
            <button disabled={savingProfile || !newLabel} onClick={saveProfile} className="mt-4 rounded-full bg-espresso px-6 py-2.5 text-sm text-white disabled:opacity-40">
              {savingProfile ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
