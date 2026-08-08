"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import MaterialForm from "@/components/admin/MaterialForm";
import type { Material } from "@/lib/types";

export default function EditMaterialPage() {
  const { id } = useParams<{ id: string }>();
  const supabase = createClient();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("materials").select("*, material_images(*)").eq("id", id).single().then(({ data }) => {
      setMaterial(data as Material);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <p className="text-sm text-black/50">Loading...</p>;
  if (!material) return <p className="text-sm text-black/50">Material not found.</p>;

  return (
    <div>
      <h1 className="font-display mb-8 text-3xl">Edit Material</h1>
      <MaterialForm material={material} />
    </div>
  );
}
