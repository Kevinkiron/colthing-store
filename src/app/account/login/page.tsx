"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function AccountLoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createClient();
  const redirectTo = params.get("redirect") || "/account";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCreatedPopup, setShowCreatedPopup] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else router.push(redirectTo);
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else if (data.session) {
        // Email confirmation is off — the account is already active and
        // signed in, so celebrate and move straight into the account area.
        setShowCreatedPopup(true);
      } else {
        setInfo("Account created. If email confirmation is required, check your inbox, then sign in.");
      }
    }
    setLoading(false);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-24">
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

      {showCreatedPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center">
            <p className="font-display text-2xl">Account Created!</p>
            <p className="mt-2 text-sm text-espresso/60">
              You&apos;re all set and signed in. Let&apos;s get you to your account.
            </p>
            <button
              onClick={() => router.push(redirectTo)}
              className="mt-6 w-full rounded-full bg-espresso py-3 text-sm text-white"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function AccountLoginPage() {
  return (
    <Suspense fallback={null}>
      <AccountLoginInner />
    </Suspense>
  );
}
