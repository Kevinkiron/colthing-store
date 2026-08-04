import type { GarmentType } from "@/lib/types";

export const MEASUREMENT_FIELDS: Record<GarmentType, string[]> = {
  shirt: ["Shoulder", "Chest", "Waist", "Hip", "Sleeve Length", "Shirt Length", "Neck", "Armhole"],
  kurta: ["Shoulder", "Chest", "Waist", "Hip", "Sleeve Length", "Kurta Length", "Neck"],
  dress: ["Shoulder", "Bust", "Waist", "Hip", "Sleeve", "Length"],
  trousers: ["Waist", "Hip", "Rise", "Thigh", "Inseam", "Outseam", "Bottom Opening"],
  other: ["Chest / Bust", "Waist", "Hip", "Length"],
};

export const GARMENT_TYPE_LABELS: Record<GarmentType, string> = {
  shirt: "Shirt",
  kurta: "Kurta",
  dress: "Dress",
  trousers: "Trousers",
  other: "Other",
};
