import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { publicSupabase } from "@/lib/supabase/public";
import { getMaterialBySlug } from "@/lib/queries";
import { formatPrice, splitList } from "@/lib/utils";
import ImageLightbox from "@/components/ui/ImageLightbox";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const material = await getMaterialBySlug(publicSupabase, slug);
  if (!material) return {};

  const title = material.name;
  const description =
    material.description?.slice(0, 155) ??
    `${material.name} — a fabric available at Knit & Knot's custom tailoring centre in Trivandrum.`;

  return {
    title,
    description,
    alternates: { canonical: `/materials/${material.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: material.main_image ? [{ url: material.main_image }] : undefined,
    },
  };
}

export default async function MaterialDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const material = await getMaterialBySlug(publicSupabase, slug);
  if (!material) notFound();

  const gallery = (material.material_images ?? []).filter((i) => i.image_type === "gallery");
  const texture = (material.material_images ?? []).filter((i) => i.image_type === "texture");
  const lifestyle = (material.material_images ?? []).filter((i) => i.image_type === "lifestyle");

  return (
    <main className="pb-24 pt-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-12 text-center">
          <span className="text-xs uppercase tracking-[0.35em] text-gold">Material</span>
          <h1 className="font-display mt-4 text-4xl md:text-6xl">{material.name}</h1>
        </div>

        {material.main_image && (
          <div className="relative mb-16 h-[45vh] w-full overflow-hidden rounded-2xl md:h-[60vh]">
            <Image src={material.main_image} alt={material.name} fill priority className="object-cover" />
          </div>
        )}

        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="font-display text-2xl">About This Material</h2>
            <p className="mt-3 text-espresso/70">{material.description}</p>

            {material.characteristics && (
              <>
                <h3 className="font-display mt-8 text-xl">Characteristics</h3>
                <p className="mt-2 text-espresso/70">{material.characteristics}</p>
              </>
            )}

            {material.care_instructions && (
              <>
                <h3 className="font-display mt-8 text-xl">Care</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-espresso/70">
                  {splitList(material.care_instructions).map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </>
            )}
          </div>

          <div className="rounded-2xl bg-cream/50 p-6">
            <dl className="space-y-4 text-sm">
              {material.composition && (
                <div>
                  <dt className="text-espresso/45">Composition</dt>
                  <dd className="mt-0.5">{material.composition}</dd>
                </div>
              )}
              {material.color && (
                <div>
                  <dt className="text-espresso/45">Colour</dt>
                  <dd className="mt-0.5">{material.color}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {(gallery.length > 0 || texture.length > 0 || lifestyle.length > 0) && (
          <ImageLightbox
            images={[...gallery, ...texture, ...lifestyle].map((img) => ({ url: img.url, alt: img.alt ?? material.name }))}
            className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4"
            itemClassName="aspect-square rounded-xl bg-cream"
          />
        )}
      </div>

      <div className="mx-auto mt-24 max-w-7xl px-6 md:px-10">
        <div className="mb-10 text-center">
          <span className="text-xs uppercase tracking-[0.35em] text-gold">Designed With This Material</span>
          <h2 className="font-display mt-4 text-3xl md:text-4xl">{material.products?.length ?? 0} Designs, One Material</h2>
        </div>

        {!material.products || material.products.length === 0 ? (
          <p className="py-10 text-center text-black/50">
            No designs published for this material yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8">
            {material.products.map((p) => {
              const img = p.product_images?.[0]?.url;
              return (
                <Link key={p.id} href={`/product/${p.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-cream">
                    {img && <Image src={img} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />}
                  </div>
                  <p className="font-display mt-3 text-sm">{p.name}</p>
                  <p className="text-xs text-espresso/50">{formatPrice(p.base_price)}</p>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-16 rounded-2xl bg-espresso px-8 py-14 text-center text-white">
          <h3 className="font-display text-2xl md:text-3xl">Have a different idea?</h3>
          <p className="mx-auto mt-3 max-w-md text-white/65">
            Tell us what you imagine and we&apos;ll create it using {material.name}.
          </p>
          <Link
            href={`/custom-request?material=${material.slug}`}
            className="mt-6 inline-block rounded-full bg-white px-8 py-3 text-sm tracking-wide text-charcoal transition hover:bg-gold-light"
          >
            Create Something Custom
          </Link>
        </div>
      </div>
    </main>
  );
}
