"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Row = {
  id: string;
  request_number: string;
  customer_name: string;
  status: string;
  created_at: string;
  materials: { name: string } | null;
};

export default function AdminCustomRequestsPage() {
  const supabase = createClient();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("custom_requests")
      .select("id, request_number, customer_name, status, created_at, materials(name)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRows((data as unknown as Row[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="font-display mb-8 text-3xl">Custom Requests</h1>
      {loading ? (
        <p className="text-sm text-black/50">Loading...</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-black/50">No custom requests yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/10 text-xs uppercase text-black/40">
                <th className="p-4">Request</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Material</th>
                <th className="p-4">Status</th>
                <th className="p-4">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-black/5">
                  <td className="p-4">
                    <Link href={`/admin/custom-requests/${r.id}`} className="font-medium underline">{r.request_number}</Link>
                  </td>
                  <td className="p-4">{r.customer_name}</td>
                  <td className="p-4 text-black/60">{r.materials?.name ?? "—"}</td>
                  <td className="p-4">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs capitalize",
                        r.status === "submitted" || r.status === "under_review" ? "bg-gold/10 text-gold" : "bg-black/5"
                      )}
                    >
                      {r.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="p-4 text-black/50">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
