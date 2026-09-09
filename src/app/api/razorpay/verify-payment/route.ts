import crypto from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { priceCart, type IncomingItem } from "@/lib/pricing";

export async function POST(request: Request) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("[razorpay/verify-payment] Missing RAZORPAY_KEY_SECRET.");
      return NextResponse.json(
        { error: "Payments are not configured yet." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      form,
      items,
    } = body as {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      form: {
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
      };
      items: IncomingItem[];
    };

    // ── 1. Verify Razorpay signature ────────────────────────────────────────
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const provided = Buffer.from(razorpay_signature ?? "", "utf8");
    const expected = Buffer.from(expectedSignature, "utf8");
    const signatureValid =
      provided.length === expected.length &&
      crypto.timingSafeEqual(provided, expected);

    if (!signatureValid) {
      return NextResponse.json(
        { error: "Payment verification failed. Invalid signature." },
        { status: 400 }
      );
    }

    // ── 2. Re-price the cart server-side ────────────────────────────────────
    // The prices written into the order come from the database, never from
    // the browser's copy of the cart.
    const pricing = await priceCart(items);
    if (!pricing.ok) {
      return NextResponse.json({ error: pricing.error }, { status: 400 });
    }

    // ── 3. Place the order in Supabase ──────────────────────────────────────
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error: rpcErr } = await supabase.rpc("place_order", {
      p_user_id: user?.id ?? null,
      p_customer_name: form.name,
      p_customer_email: form.email,
      p_customer_phone: form.phone,
      p_shipping_address: {
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        payment_method: "razorpay",
        payment_id: razorpay_payment_id,
        razorpay_order_id: razorpay_order_id,
      },
      p_items: pricing.items,
    });

    if (rpcErr) {
      console.error("[razorpay/verify-payment] place_order rpc error:", rpcErr);
      return NextResponse.json({ error: rpcErr.message }, { status: 500 });
    }

    const order = data?.[0];
    if (!order) {
      return NextResponse.json(
        { error: "Order could not be placed." },
        { status: 500 }
      );
    }

    return NextResponse.json({ order_number: order.order_number });
  } catch (err) {
    console.error("[razorpay/verify-payment]", err);
    return NextResponse.json(
      { error: "Internal server error during payment verification" },
      { status: 500 }
    );
  }
}
