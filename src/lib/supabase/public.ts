import { createClient } from "@supabase/supabase-js";

// Plain read-only client for public catalog data (safe to use in
// Server Components, Client Components, and Route Handlers alike).
export const publicSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
