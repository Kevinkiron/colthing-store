"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [counts, setCounts] = useState({
    categories: 0,
    materials: 0,
    products: 0,
    pendingRequests: 0,
    orders: 0,
  });

  useEffect(() => {
    async function load() {
      const [{ count: categories }, { count: materials }, { count: products }, { count: pendingRequests }, { count: orders }] =
        await Promise.all([
          supabase.from("categories").select("*", { count: "exact", head: true }),
          supabase.from("materials").select("*", { count: "exact", head: true }),
          supabase.from("products").select("*", { count: "exact", head: true }),
          supabase.from("custom_requests").select("*", { count: "exact", head: true }).in("status", ["submitted", "under_review", "need_more_info"]),
          supabase.from("orders").select("*", { count: "exact", head: true }),
        ]);
      setCounts({
        categories: categories ?? 0,
        materials: materials ?? 0,
        products: products ?? 0,
        pendingRequests: pendingRequests ?? 0,
        orders: orders ?? 0,
      });
    }
    load();
  }, []);

  const cards = [
    { label: "Categories", value: counts.categories, href: "/admin/categories" },
    { label: "Materials", value: counts.materials, href: "/admin/materials" },
    { label: "Products", value: counts.products, href: "/admin/products" },
    { label: "Custom Requests Awaiting You", value: counts.pendingRequests, href: "/admin/custom-requests" },
    { label: "Orders", value: counts.orders, href: "/admin/orders" },
  ];

  return (
    <div>
      <h1 className="font-display mb-8 text-3xl">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="rounded-xl border border-black/10 bg-white p-6 transition hover:border-gold">
            <p className="font-display text-3xl">{c.value}</p>
            <p className="mt-1 text-sm text-black/50">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
