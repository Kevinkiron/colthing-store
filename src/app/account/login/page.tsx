"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AccountLoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push("/account");
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setInfo("Account created. If email confirmation is required, check your inbox, then sign in.");
    }
    setLoading(false);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="font-display text-3xl">{mode === "signin" ? "Sign In" : "Create Your Account"}</h1>
      <p className="mt-2 text-sm text-espresso/50">
        Save your measurements, track orders and custom requests.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm" />
        <input required type="password" placeholder="Password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-black/15 px-4 py-3 text-sm" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        {info && <p className="text-sm text-green-700">{info}</p>}
        <button disabled={loading} className="w-full rounded-full bg-espresso py-3 text-sm text-white disabled:opacity-50">
          {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-6 text-xs text-espresso/50 underline underline-offset-2">
        {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
      </button>
    </main>
  );
}
