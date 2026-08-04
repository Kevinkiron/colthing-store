"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, cn } from "@/lib/utils";
import type { GarmentType, MeasurementProfile } from "@/lib/types";
import { GARMENT_TYPE_LABELS } from "@/lib/measurementFields";
import MeasurementFields from "@/components/custom/MeasurementFields";

type Tab = "orders" | "requests" | "measurements";

type OrderRow = {
  id: string;
  order_number: string;
  subtotal: number;
  status: string;
  created_at: string;
};

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

  const [newLabel, setNewLabel] = useState("");
  const [newGarmentType, setNewGarmentType] = useState<GarmentType>("shirt");
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
      supabase.from("orders").select("id, order_number, subtotal, status, created_at").eq("user_id", userId).order("created_at", { ascending: false }).then(({ data }) => setOrders((data as OrderRow[]) ?? []));
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
      .insert({ user_id: userId, label: newLabel, garment_type: newGarmentType, measurements: newMeasurements })
      .select()
      .single();
    if (!error && data) {
      setProfiles((p) => [data as MeasurementProfile, ...p]);
      setNewLabel("");
      setNewMeasurements({});
    }
    setSavingProfile(false);
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
              <div key={o.id} className="flex items-center justify-between rounded-xl border border-black/10 p-4">
                <div>
                  <p className="font-display text-sm">#{o.order_number}</p>
                  <p className="text-xs text-espresso/50">{new Date(o.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatPrice(o.subtotal)}</p>
                  <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs capitalize">{o.status}</span>
                </div>
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
                  <p className="text-xs text-espresso/50 capitalize">{r.garment_type} — {new Date(r.created_at).toLocaleDateString()}</p>
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
                    <p className="font-display text-sm">{p.label} <span className="text-xs text-espresso/40">({GARMENT_TYPE_LABELS[p.garment_type]})</span></p>
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
            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              <input placeholder="Label, e.g. Standard" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} className="rounded-lg border border-black/15 px-4 py-3 text-sm" />
              <select value={newGarmentType} onChange={(e) => setNewGarmentType(e.target.value as GarmentType)} className="rounded-lg border border-black/15 px-4 py-3 text-sm">
                {Object.entries(GARMENT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <MeasurementFields garmentType={newGarmentType} values={newMeasurements} onChange={(field, value) => setNewMeasurements((m) => ({ ...m, [field]: value }))} />
            <button disabled={savingProfile || !newLabel} onClick={saveProfile} className="mt-4 rounded-full bg-espresso px-6 py-2.5 text-sm text-white disabled:opacity-40">
              {savingProfile ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
