"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signInErr) {
      setError(signInErr.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase.from("admin_profiles").select("id").eq("id", data.user.id).maybeSingle();
    if (!profile) {
      await supabase.auth.signOut();
      setError("This account doesn't have admin access.");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="font-display text-3xl">Admin Sign In</h1>
      <p className="mt-2 text-sm text-black/50">
        Manage categories, materials, products, custom requests and orders.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={loading}
          className="w-full rounded-full bg-espresso py-3 text-sm text-white disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-xs text-black/40">
        Admin accounts are provisioned directly by an existing admin — there is
        no public sign-up here. See the README for how to add one.
      </p>
    </main>
  );
}
