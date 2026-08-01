"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setChecked(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/admin/login");
      } else {
        setChecked(true);
      }
    });
  }, [pathname, router, supabase]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (!checked) return <div className="flex min-h-screen items-center justify-center text-sm text-black/40">Loading...</div>;

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminNav />
      <div className="flex-1 bg-[--color-ivory] px-6 py-8 md:px-10">{children}</div>
    </div>
  );
}
