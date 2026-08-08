export type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
};

export type MaterialImage = {
  id: string;
  material_id: string;
  url: string;
  image_type: "gallery" | "texture" | "lifestyle";
  alt: string | null;
  sort_order: number;
};

export type Material = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  composition: string | null;
  color: string | null;
  texture: string | null;
  characteristics: string | null;
  care_instructions: string | null;
  main_image: string | null;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  material_images?: MaterialImage[];
  products?: Product[];
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  size: string;
  sku: string | null;
  price: number | null;
  stock: number;
};

export type CustomizationValue = {
  id: string;
  option_id: string;
  label: string;
  description: string | null;
  image: string | null;
  additional_price: number;
  is_active: boolean;
  sort_order: number;
};

export type CustomizationOption = {
  id: string;
  product_id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
  customization_values?: CustomizationValue[];
};

export type GarmentType = "shirt" | "dress" | "kurta" | "trousers" | "other";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  material_id: string | null;
  base_price: number;
  compare_at_price: number | null;
  sku: string | null;
  fabric: string | null;
  care_instructions: string | null;
  design_details: string | null;
  production_time: string | null;
  garment_type: GarmentType;
  customization_enabled: boolean;
  is_featured: boolean;
  is_bestseller: boolean;
  is_new: boolean;
  status: "active" | "draft" | "archived";
  created_at: string;
  categories?: Category | null;
  materials?: Material | null;
  product_images?: ProductImage[];
  product_variants?: ProductVariant[];
  customization_options?: CustomizationOption[];
};

export type MeasurementProfile = {
  id: string;
  user_id: string;
  label: string;
  garment_type: GarmentType;
  measurements: Record<string, string>;
  created_at: string;
};

export type CustomRequestImage = {
  id: string;
  request_id: string;
  url: string;
  image_type: "reference" | "sketch" | "inspiration";
  sort_order: number;
};

export type CustomRequestStatus =
  | "submitted"
  | "under_review"
  | "need_more_info"
  | "quotation_ready"
  | "approved"
  | "payment_received"
  | "in_production"
  | "quality_check"
  | "shipped"
  | "delivered"
  | "cancelled";

export type QuotationItem = {
  id: string;
  quotation_id: string;
  label: string;
  amount: number;
  sort_order: number;
};

export type Quotation = {
  id: string;
  custom_request_id: string;
  status: "pending" | "accepted" | "changes_requested" | "expired";
  total: number;
  notes: string | null;
  created_at: string;
  quotation_items?: QuotationItem[];
};

export type CustomRequest = {
  id: string;
  request_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  material_id: string | null;
  inspired_by_product_id: string | null;
  garment_type: string;
  description: string;
  measurements: Record<string, string>;
  preferred_fit: string | null;
  color_requirements: string | null;
  additional_requirements: string | null;
  desired_delivery_date: string | null;
  budget: number | null;
  status: CustomRequestStatus;
  created_at: string;
  materials?: Material | null;
  products?: Product | null;
  custom_request_images?: CustomRequestImage[];
  quotations?: Quotation[];
};

export type SelectedCustomization = {
  optionName: string;
  valueLabel: string;
  price: number;
};

export type CartLine = {
  cartLineId: string;
  itemType: "standard" | "customized";
  productId: string;
  variantId: string | null;
  slug: string;
  name: string;
  size: string;
  basePrice: number;
  customizationPrice: number;
  price: number;
  image: string | null;
  quantity: number;
  maxStock: number;
  customization?: SelectedCustomization[];
  measurements?: Record<string, string>;
};
