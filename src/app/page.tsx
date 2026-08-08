import { publicSupabase } from "@/lib/supabase/public";
import { getFeaturedMaterials, getFeaturedProducts, getOneMaterialManyPossibilities } from "@/lib/queries";
import Hero from "@/components/home/Hero";
import BrandStory from "@/components/home/BrandStory";
import FeaturedMaterials from "@/components/home/FeaturedMaterials";
import OneMaterialManyPossibilities from "@/components/home/OneMaterialManyPossibilities";
import ReadyToWear from "@/components/home/ReadyToWear";
import ProductShowcase from "@/components/home/FeaturedProduct3D";
import MakeItYours from "@/components/home/MakeItYours";
import HaveYourOwnIdea from "@/components/home/HaveYourOwnIdea";
import Testimonials from "@/components/home/Testimonials";

export const revalidate = 60;

export default async function Home() {
  const [materials, products, combo] = await Promise.all([
    getFeaturedMaterials(publicSupabase, 6).catch(() => []),
    getFeaturedProducts(publicSupabase, 8).catch(() => []),
    getOneMaterialManyPossibilities(publicSupabase).catch(() => null),
  ]);

  return (
    <main>
      <Hero />
      <BrandStory />
      <FeaturedMaterials materials={materials} />
      {combo && <OneMaterialManyPossibilities material={combo.material} products={combo.products} />}
      <ReadyToWear products={products} />
      <ProductShowcase product={products[0] ?? null} />
      <MakeItYours />
      <HaveYourOwnIdea />
      <Testimonials />
    </main>
  );
}
