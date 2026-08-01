"use client";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

export default function Filters({
  categories,
  active,
  onChange,
  sort,
  onSortChange,
}: {
  categories: Category[];
  active: string | null;
  onChange: (slug: string | null) => void;
  sort: string;
  onSortChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row md:items-center md:justify-between">
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        <button
          onClick={() => onChange(null)}
          className={cn(
            "whitespace-nowrap rounded-full border px-4 py-2 text-xs uppercase tracking-wide transition",
            active === null
              ? "border-[--color-charcoal] bg-[--color-charcoal] text-white"
              : "border-black/15 hover:border-[--color-gold]"
          )}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => onChange(c.slug)}
            className={cn(
              "whitespace-nowrap rounded-full border px-4 py-2 text-xs uppercase tracking-wide transition",
              active === c.slug
                ? "border-[--color-charcoal] bg-[--color-charcoal] text-white"
                : "border-black/15 hover:border-[--color-gold]"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="rounded-full border border-black/15 px-4 py-2 text-xs uppercase tracking-wide"
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}
