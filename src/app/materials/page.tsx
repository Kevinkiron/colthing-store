import { publicSupabase } from "@/lib/supabase/public";
import { getMaterials } from "@/lib/queries";
import MaterialCard from "@/components/materials/MaterialCard";

export const revalidate = 60;

export default async function MaterialsPage() {
  const materials = await getMaterials(publicSupabase).catch(() => []);

  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-10">
      <div className="mb-14 text-center">
        <span className="text-xs uppercase tracking-[0.35em] text-gold">Material</span>
        <h1 className="font-display mt-4 text-4xl md:text-5xl">Everyday Fabrics, Effortless Style</h1>
        <p className="mx-auto mt-4 max-w-lg text-espresso/60">
          Thoughtfully chosen fabrics, quality materials, and stylish
          patterns come together to create comfortable everyday wear
          designed for work, college, and every moment in between.
        </p>
      </div>

      {materials.length === 0 ? (
        <p className="py-20 text-center text-black/50">
          No materials published yet. Add one from the admin panel.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8">
          {materials.map((m, i) => (
            <MaterialCard key={m.id} material={m} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
