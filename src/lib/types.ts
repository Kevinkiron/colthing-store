export type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  color: string | null;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  size: string;
  color: string;
  color_hex: string | null;
  sku: string | null;
  price: number | null;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  base_price: number;
  compare_at_price: number | null;
  fabric: string | null;
  care_instructions: string | null;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  status: "active" | "draft" | "archived";
  created_at: string;
  categories?: Category | null;
  product_images?: ProductImage[];
  product_variants?: ProductVariant[];
};

export type CartLine = {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  size: string;
  color: string;
  price: number;
  image: string | null;
  quantity: number;
  maxStock: number;
};
