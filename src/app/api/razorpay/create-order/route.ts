import Razorpay from "razorpay";
import { NextResponse } from "next/server";
import { priceCart, type IncomingItem } from "@/lib/pricing";

export async function POST(request: Request) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Fail loudly and clearly if the keys were never configured — otherwise
    // the Razorpay SDK throws a vague error and the customer just sees
    // "something went wrong".
    if (!keyId || !keySecret) {
      console.error(
        "[razorpay/create-order] Missing RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET environment variables."
      );
      return NextResponse.json(
        { error: "Payments are not configured yet. Please contact us to complete your order." },
        { status: 503 }
      );
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const body = await request.json();
    const { items } = body as { items: IncomingItem[] };

    // The amount is never taken from the browser — it is recomputed here from
    // the real product rows so the price can't be tampered with in transit.
    const pricing = await priceCart(items);
    if (!pricing.ok) {
      return NextResponse.json({ error: pricing.error }, { status: 400 });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(pricing.total * 100), // ₹ → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("[razorpay/create-order]", err);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
