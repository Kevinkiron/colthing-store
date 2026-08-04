"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Package, ClipboardList, Home, Layers, Shapes, Inbox, LayoutDashboard } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const items = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/categories", label: "Categories", icon: Shapes },
    { href: "/admin/materials", label: "Materials", icon: Layers },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/custom-requests", label: "Custom Requests", icon: Inbox },
    { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  ];

  async function logout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  return (
    <aside className="flex w-full shrink-0 flex-row items-center justify-between border-b border-black/10 bg-white px-6 py-4 md:w-64 md:flex-col md:items-stretch md:justify-start md:border-b-0 md:border-r md:px-6 md:py-8">
      <Link href="/admin/products" className="font-display text-lg tracking-wide">
        Knit &amp; Knot Admin
      </Link>
      <nav className="flex gap-2 overflow-x-auto md:mt-10 md:flex-col md:gap-1 md:overflow-visible">
        {items.map((i) => (
          <Link
            key={i.href}
            href={i.href}
            className={cn(
              "flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition",
              pathname.startsWith(i.href) ? "bg-espresso text-white" : "text-black/70 hover:bg-black/5"
            )}
          >
            <i.icon className="h-4 w-4" /> {i.label}
          </Link>
        ))}
      </nav>
      <div className="hidden md:mt-auto md:block md:pt-10">
        <Link href="/" className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-black/70 hover:bg-black/5">
          <Home className="h-4 w-4" /> View Store
        </Link>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-black/70 hover:bg-black/5">
          <LogOut className="h-4 w-4" /> Log Out
        </button>
      </div>
    </aside>
  );
}
