import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const checkoutSchema = z.object({
  planId: z.enum(["navigator", "guided"]),
});

const getPriceIds = (): Record<string, string> => ({
  navigator: process.env.STRIPE_NAVIGATOR_PRICE_ID || "price_1234567890",
  guided: process.env.STRIPE_GUIDED_PRICE_ID || "price_0987654321",
});

export async function POST(request: NextRequest) {
  try {
    // Verify Stripe key is configured first
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Verify session
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Parse body
    const body = await request.json();
    const { planId } = checkoutSchema.parse(body);

    const priceIds = getPriceIds();
    const priceId = priceIds[planId];

    if (!priceId) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: session.user.email,
      client_reference_id: session.user.id,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing?cancelled=true`,
      metadata: {
        userId: session.user.id,
        planId,
      },
    });

    return NextResponse.json(
      {
        url: checkoutSession.url,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "Validation error" },
        { status: 400 }
      );
    }

    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
