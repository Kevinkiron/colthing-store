"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";

type OrderItem = {
  id: string;
  product_name: string;
  size: string | null;
  quantity: number;
  unit_price: number;
  item_type: string;
  customization: { optionName: string; valueLabel: string; price: number }[] | null;
  measurements: Record<string, string> | null;
};

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: {
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    payment_id?: string;
    payment_method?: string;
  } | null;
  subtotal: number;
  status: string;
  created_at: string;
  cancelled_at: string | null;
  cancelled_by: string | null;
  cancellation_reason: string | null;
  refund_status: string | null;
  refunded_at: string | null;
  order_items: OrderItem[];
};

export default function AdminOrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data as Order[]) ?? []);
        setLoading(false);
      });
  }, []);

  async function updateStatus(id: string, status: string) {
    const order = orders.find((o) => o.id === id);

    // Cancelling from this side may mean money has to go back to the
    // customer, so make it a deliberate choice rather than a stray click on
    // a dropdown.
    if (status === "cancelled") {
      const paid = Boolean(order?.shipping_address?.payment_id);
      const ok = confirm(
        paid
          ? `Cancel order #${order?.order_number}?\n\nThis order was paid online, so it will be flagged as needing a refund.`
          : `Cancel order #${order?.order_number}?`
      );
      if (!ok) return;

      const patch = {
        status,
        cancelled_at: new Date().toISOString(),
        cancelled_by: "admin",
        refund_status: paid ? "pending" : "not_applicable",
      };
      await supabase.from("orders").update(patch).eq("id", id);
      setOrders((os) => os.map((o) => (o.id === id ? { ...o, ...patch } : o)));
      return;
    }

    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  async function markRefunded(id: string, orderNumber: string) {
    const ok = confirm(
      `Mark order #${orderNumber} as refunded?\n\nOnly do this once you've actually issued the refund in the Razorpay dashboard — this just records it here.`
    );
    if (!ok) return;

    const patch = {
      refund_status: "refunded",
      refunded_at: new Date().toISOString(),
    };
    await supabase.from("orders").update(patch).eq("id", id);
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }

  const awaitingRefund = orders.filter(
    (o) => o.status === "cancelled" && o.refund_status === "pending"
  ).length;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl">Orders</h1>
        {awaitingRefund > 0 && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
            {awaitingRefund} awaiting refund
          </span>
        )}
      </div>
      {loading ? (
        <p className="text-sm text-black/50">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-black/50">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-black/10 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display">#{o.order_number}</p>
                  <p className="text-xs text-black/50">
                    {o.customer_name} · {o.customer_email} · {o.customer_phone}
                  </p>
                  {o.shipping_address && (
                    <p className="text-xs text-black/40">
                      {o.shipping_address.address}, {o.shipping_address.city}, {o.shipping_address.state} {o.shipping_address.pincode}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-medium">{formatPrice(o.subtotal)}</p>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="rounded-full border border-black/15 px-3 py-1.5 text-xs capitalize"
                  >
                    {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              {o.status === "cancelled" && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-medium text-amber-900">
                    Cancelled{o.cancelled_by ? ` by ${o.cancelled_by}` : ""}
                    {o.cancelled_at ? ` on ${new Date(o.cancelled_at).toLocaleDateString()}` : ""}
                  </p>
                  {o.cancellation_reason && (
                    <p className="mt-1 text-xs text-amber-900/75">
                      Reason: {o.cancellation_reason}
                    </p>
                  )}

                  {o.refund_status === "pending" && (
                    <div className="mt-3 space-y-2">
                      {o.shipping_address?.payment_id ? (
                        <>
                          <p className="text-xs text-amber-900/75">
                            Paid online — refund {formatPrice(o.subtotal)} to the customer.
                          </p>
                          <p className="text-xs text-amber-900/60">
                            Payment ID: <code>{o.shipping_address.payment_id}</code>
                          </p>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <a
                              href={`https://dashboard.razorpay.com/app/payments/${o.shipping_address.payment_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full bg-amber-900 px-4 py-1.5 text-xs text-white transition hover:bg-amber-800"
                            >
                              Refund in Razorpay
                            </a>
                            <button
                              onClick={() => markRefunded(o.id, o.order_number)}
                              className="rounded-full border border-amber-900/30 px-4 py-1.5 text-xs text-amber-900 transition hover:bg-amber-100"
                            >
                              Mark as refunded
                            </button>
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-amber-900/75">
                          No online payment recorded for this order — nothing to refund.
                        </p>
                      )}
                    </div>
                  )}

                  {o.refund_status === "refunded" && (
                    <p className="mt-2 text-xs text-green-700">
                      Refunded{o.refunded_at ? ` on ${new Date(o.refunded_at).toLocaleDateString()}` : ""}.
                    </p>
                  )}

                  {o.refund_status === "not_applicable" && (
                    <p className="mt-2 text-xs text-amber-900/60">
                      No payment was taken, so no refund is needed.
                    </p>
                  )}
                </div>
              )}

              <ul className="mt-4 space-y-2 border-t border-black/5 pt-3 text-sm text-black/70">
                {o.order_items?.map((item) => (
                  <li key={item.id}>
                    <div className="flex justify-between">
                      <span>
                        {item.product_name} ({item.size}) x{item.quantity}
                        <span className="ml-2 rounded-full bg-black/5 px-2 py-0.5 text-[10px] uppercase tracking-wide text-black/50">
                          {item.item_type === "customized" ? "Customized" : "Original"}
                        </span>
                      </span>
                      <span>{formatPrice(item.unit_price * item.quantity)}</span>
                    </div>
                    {item.customization && item.customization.length > 0 && (
                      <ul className="mt-1 pl-3 text-xs text-black/45">
                        {item.customization.map((c, i) => (
                          <li key={i}>{c.optionName}: {c.valueLabel}</li>
                        ))}
                      </ul>
                    )}
                    {item.measurements && Object.keys(item.measurements).length > 0 && (
                      <p className="mt-1 pl-3 text-xs text-black/40">
                        {Object.entries(item.measurements).map(([k, v]) => `${k}: ${v}"`).join("  ·  ")}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
