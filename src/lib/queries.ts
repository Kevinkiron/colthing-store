import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Product,
  Category,
  Material,
  CustomRequest,
  Quotation,
  MeasurementProfile,
} from "@/lib/types";

const PRODUCT_SELECT = `
  *,
  categories ( id, name, slug, sort_order ),
  materials ( id, name, slug, description, main_image ),
  product_images ( id, product_id, url, alt, sort_order, color ),
  product_variants ( id, product_id, size, color, color_hex, sku, price, stock ),
  customization_options ( id, product_id, name, sort_order, is_active,
    customization_values ( id, option_id, label, description, image, additional_price, is_active, sort_order )
  )
`;

const MATERIAL_SELECT = `
  *,
  categories ( id, name, slug, sort_order ),
  material_images ( id, material_id, url, image_type, alt, sort_order )
`;

export async function getCategories(client: SupabaseClient) {
  const { data, error } = await client
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Category[];
}

// ---------- Materials (informational, never purchasable) ----------

export async function getFeaturedMaterials(client: SupabaseClient, limit = 6) {
  const { data, error } = await client
    .from("materials")
    .select(MATERIAL_SELECT)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Material[];
}

export async function getMaterials(client: SupabaseClient, opts: { categorySlug?: string } = {}) {
  const query = client
    .from("materials")
    .select(MATERIAL_SELECT)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  const { data, error } = await query;
  if (error) throw error;
  let materials = (data ?? []) as Material[];
  if (opts.categorySlug) {
    materials = materials.filter((m) => m.categories?.slug === opts.categorySlug);
  }
  return materials;
}

export async function getMaterialBySlug(client: SupabaseClient, slug: string) {
  const { data, error } = await client
    .from("materials")
    .select(MATERIAL_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (error) return null;
  const material = data as Material;

  const { data: products } = await client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("material_id", material.id)
    .eq("status", "active");

  material.products = (products ?? []) as Product[];
  return material;
}

// ---------- Products (purchasable garments) ----------

export async function getFeaturedProducts(client: SupabaseClient, limit = 8) {
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

export async function getProducts(
  client: SupabaseClient,
  opts: { categorySlug?: string; materialSlug?: string; search?: string } = {}
) {
  let query = client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (opts.search) query = query.ilike("name", `%${opts.search}%`);

  const { data, error } = await query;
  if (error) throw error;
  let products = (data ?? []) as Product[];

  if (opts.categorySlug) products = products.filter((p) => p.categories?.slug === opts.categorySlug);
  if (opts.materialSlug) products = products.filter((p) => p.materials?.slug === opts.materialSlug);
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

// One material, many possibilities — for the homepage
export async function getOneMaterialManyPossibilities(client: SupabaseClient) {
  const { data: material } = await client
    .from("materials")
    .select(MATERIAL_SELECT)
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!material) return null;

  const { data: products } = await client
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("material_id", (material as Material).id)
    .eq("status", "active");

  return { material: material as Material, products: (products ?? []) as Product[] };
}

// ---------- Custom requests & quotations ----------

export async function createCustomRequest(
  client: SupabaseClient,
  payload: Record<string, unknown>
) {
  const { data, error } = await client.from("custom_requests").insert(payload).select().single();
  if (error) throw error;
  return data as CustomRequest;
}

export async function getCustomRequestByNumber(client: SupabaseClient, requestNumber: string) {
  const { data, error } = await client
    .from("custom_requests")
    .select(
      `*, materials(id,name,slug,main_image), products(id,name,slug),
       custom_request_images(*), quotations(*, quotation_items(*))`
    )
    .eq("request_number", requestNumber)
    .single();
  if (error) return null;
  return data as CustomRequest & { quotations: Quotation[] };
}

export async function getMeasurementProfiles(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from("measurement_profiles")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as MeasurementProfile[];
}
