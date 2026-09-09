import crypto from "crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
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
      items: {
        product_id: string;
        variant_id: string | null;
        product_name: string;
        size: string;
        quantity: number;
        unit_price: number;
        item_type: string;
        customization: unknown;
        measurements: unknown;
        customization_price: number;
      }[];
    };

    // ── 1. Verify Razorpay signature ────────────────────────────────────────
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Payment verification failed. Invalid signature." },
        { status: 400 }
      );
    }

    // ── 2. Place the order in Supabase ──────────────────────────────────────
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const { data, error: rpcErr } = await supabase.rpc("place_order", {
      p_user_id: session?.user.id ?? null,
      p_customer_name: form.name,
      p_customer_email: form.email,
      p_customer_phone: form.phone,
      p_shipping_address: {
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        payment_id: razorpay_payment_id,      // stored in the JSON blob for now
        razorpay_order_id: razorpay_order_id,
      },
      p_items: items,
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
