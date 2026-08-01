import type { SupabaseClient } from "@supabase/supabase-js";
import type { Product, Category } from "@/lib/types";

const PRODUCT_SELECT = `
  *,
  categories ( id, name, slug, sort_order ),
  product_images ( id, product_id, url, alt, sort_order, color ),
  product_variants ( id, product_id, size, color, color_hex, sku, price, stock )
`;

export async function getFeaturedProducts(client: SupabaseClient, limit = 6) {
  const { data, error } = await client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getBestsellers(client: SupabaseClient, limit = 8) {
  const { data, error } = await client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .eq("is_bestseller", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getProducts(
  client: SupabaseClient,
  opts: { categorySlug?: string; search?: string } = {}
) {
  let query = client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (opts.search) {
    query = query.ilike("name", `%${opts.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  let products = (data ?? []) as Product[];

  if (opts.categorySlug) {
    products = products.filter((p) => p.categories?.slug === opts.categorySlug);
  }
  return products;
}

export async function getProductBySlug(client: SupabaseClient, slug: string) {
  const { data, error } = await client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("status", "active")
    .single();
  if (error) return null;
  return data as Product;
}

export async function getCategories(client: SupabaseClient) {
  const { data, error } = await client
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Category[];
}
