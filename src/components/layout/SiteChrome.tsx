"use client";
import { usePathname } from "next/navigation";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import FloatingContact from "@/components/layout/FloatingContact";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <SmoothScroll>
      <Navbar />
      {children}
      <Footer />
      <CartDrawer />
      <FloatingContact />
    </SmoothScroll>
  );
}
