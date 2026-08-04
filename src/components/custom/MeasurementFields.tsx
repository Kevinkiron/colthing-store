"use client";
import type { GarmentType } from "@/lib/types";
import { MEASUREMENT_FIELDS } from "@/lib/measurementFields";

export default function MeasurementFields({
  garmentType,
  values,
  onChange,
}: {
  garmentType: GarmentType;
  values: Record<string, string>;
  onChange: (field: string, value: string) => void;
}) {
  const fields = MEASUREMENT_FIELDS[garmentType] ?? MEASUREMENT_FIELDS.other;

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {fields.map((f) => (
        <div key={f}>
          <label className="mb-1 block text-xs text-espresso/50">{f} (in)</label>
          <input
            value={values[f] ?? ""}
            onChange={(e) => onChange(f, e.target.value)}
            type="number"
            step="0.1"
            className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
          />
        </div>
      ))}
    </div>
  );
}
