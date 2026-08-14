"use client";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Shared helper for any action that should only run for a signed-in user
// (wishlist, checkout, etc). If there's no session, sends the person to
// login and brings them right back here afterwards via ?redirect=.
export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  return async function requireAuth(action: () => void) {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      router.push(`/account/login?redirect=${encodeURIComponent(pathname)}`);
      return false;
    }
    action();
    return true;
  };
}
