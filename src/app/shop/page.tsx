import type { Metadata } from "next";
import ShopClient from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop Ready-to-Wear Designs",
  description:
    "Browse Knit & Knot's ready-to-wear designs — buy as shown or customise any piece to your measurements. Custom tailoring in Trivandrum with doorstep delivery.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return <ShopClient />;
}
