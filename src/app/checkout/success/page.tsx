import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  return (
    <main className="mx-auto flex max-w-lg flex-col items-center px-6 pb-24 pt-40 text-center">
      <CheckCircle2 className="h-14 w-14 text-[--color-gold]" />
      <h1 className="font-display mt-6 text-3xl">Order Placed</h1>
      <p className="mt-3 text-black/60">
        Thank you! Your order {order && <span className="font-medium">#{order}</span>} has
        been received. We&apos;ll reach out shortly to confirm delivery details.
      </p>
      <Link href="/shop" className="mt-8 rounded-full bg-[--color-charcoal] px-8 py-3 text-sm text-white">
        Continue Shopping
      </Link>
    </main>
  );
}
