"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { GarmentType, MeasurementProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function SavedProfilesPicker({
  garmentType,
  onSelect,
}: {
  garmentType: GarmentType;
  onSelect: (measurements: Record<string, string>) => void;
}) {
  const supabase = createClient();
  const [profiles, setProfiles] = useState<MeasurementProfile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) return;
      setSignedIn(true);
      supabase
        .from("measurement_profiles")
        .select("*")
        .eq("user_id", data.session.user.id)
        .eq("garment_type", garmentType)
        .then(({ data: rows }) => setProfiles((rows as MeasurementProfile[]) ?? []));
    });
  }, [garmentType]);

  if (!signedIn || profiles.length === 0) return null;

  return (
    <div className="mb-6">
      <p className="mb-2 text-xs uppercase tracking-wide text-espresso/50">Use Saved Measurements</p>
      <div className="flex flex-wrap gap-2">
        {profiles.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setActiveId(p.id);
              onSelect(p.measurements);
            }}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs transition",
              activeId === p.id ? "border-gold bg-gold/10" : "border-black/15"
            )}
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setActiveId(null)}
          className={cn(
            "rounded-full border px-4 py-1.5 text-xs transition",
            activeId === null ? "border-gold bg-gold/10" : "border-black/15"
          )}
        >
          Enter New Measurements
        </button>
      </div>
    </div>
  );
}
