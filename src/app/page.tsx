import { publicSupabase } from "@/lib/supabase/public";
import { getFeaturedProducts } from "@/lib/queries";
import Hero from "@/components/home/Hero";
import BrandStory from "@/components/home/BrandStory";
import CollectionShowcase from "@/components/home/CollectionShowcase";
import WomensEditorial from "@/components/home/WomensEditorial";
import FeaturedProduct3D from "@/components/home/FeaturedProduct3D";
import Testimonials from "@/components/home/Testimonials";

export const revalidate = 60;

export default async function Home() {
  let featured: Awaited<ReturnType<typeof getFeaturedProducts>> = [];
  try {
    featured = await getFeaturedProducts(publicSupabase, 8);
  } catch {
    featured = [];
  }

  return (
    <main>
      <Hero />
      <BrandStory />
      <CollectionShowcase products={featured} />
      <WomensEditorial />
      <FeaturedProduct3D />
      <Testimonials />
    </main>
  );
}
