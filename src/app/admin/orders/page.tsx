"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";

type OrderItem = {
  id: string;
  product_name: string;
  size: string | null;
  color: string | null;
  quantity: number;
  unit_price: number;
};

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: { address?: string; city?: string; state?: string; pincode?: string } | null;
  subtotal: number;
  status: string;
  created_at: string;
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
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  return (
    <div>
      <h1 className="font-display mb-8 text-3xl">Orders</h1>
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
              <ul className="mt-4 space-y-1 border-t border-black/5 pt-3 text-sm text-black/70">
                {o.order_items?.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.product_name} ({item.color}/{item.size}) x{item.quantity}</span>
                    <span>{formatPrice(item.unit_price * item.quantity)}</span>
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
