import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const checkoutSchema = z.object({
  planId: z.enum([
    "essential_marriage",
    "complete_marriage",
    "premium_marriage",
    "essential_k1",
    "complete_k1",
    "essential_citizenship",
    "complete_citizenship",
    "essential_work_permit",
    "complete_work_permit",
    "essential_family",
    "complete_family",
    "guardian_essential",
    "guardian_family",
    "guardian_dynasty",
    "case_rescue_transfer",
    "emergency_consultation",
  ]),
  caseType: z.string().optional(),
});

const planConfig: Record<string, { priceId: string; mode: "payment" | "subscription"; amount: number }> = {
  essential_marriage: {
    priceId: process.env.STRIPE_PRICE_ESSENTIAL_MARRIAGE || "",
    mode: "payment",
    amount: 99900,
  },
  complete_marriage: {
    priceId: process.env.STRIPE_PRICE_COMPLETE_MARRIAGE || "",
    mode: "payment",
    amount: 149900,
  },
  premium_marriage: {
    priceId: process.env.STRIPE_PRICE_PREMIUM_MARRIAGE || "",
    mode: "payment",
    amount: 249900,
  },
  essential_k1: {
    priceId: process.env.STRIPE_PRICE_ESSENTIAL_K1 || "",
    mode: "payment",
    amount: 79900,
  },
  complete_k1: {
    priceId: process.env.STRIPE_PRICE_COMPLETE_K1 || "",
    mode: "payment",
    amount: 119900,
  },
  essential_citizenship: {
    priceId: process.env.STRIPE_PRICE_ESSENTIAL_CITIZENSHIP || "",
    mode: "payment",
    amount: 49900,
  },
  complete_citizenship: {
    priceId: process.env.STRIPE_PRICE_COMPLETE_CITIZENSHIP || "",
    mode: "payment",
    amount: 69900,
  },
  essential_work_permit: {
    priceId: process.env.STRIPE_PRICE_ESSENTIAL_WORK_PERMIT || "",
    mode: "payment",
    amount: 29900,
  },
  complete_work_permit: {
    priceId: process.env.STRIPE_PRICE_COMPLETE_WORK_PERMIT || "",
    mode: "payment",
    amount: 39900,
  },
  essential_family: {
    priceId: process.env.STRIPE_PRICE_ESSENTIAL_FAMILY || "",
    mode: "payment",
    amount: 59900,
  },
  complete_family: {
    priceId: process.env.STRIPE_PRICE_COMPLETE_FAMILY || "",
    mode: "payment",
    amount: 89900,
  },
  guardian_essential: {
    priceId: process.env.STRIPE_PRICE_GUARDIAN_ESSENTIAL || "",
    mode: "subscription",
    amount: 2900,
  },
  guardian_family: {
    priceId: process.env.STRIPE_PRICE_GUARDIAN_FAMILY || "",
    mode: "subscription",
    amount: 4900,
  },
  guardian_dynasty: {
    priceId: process.env.STRIPE_PRICE_GUARDIAN_DYNASTY || "",
    mode: "subscription",
    amount: 9900,
  },
  case_rescue_transfer: {
    priceId: process.env.STRIPE_PRICE_CASE_RESCUE || "",
    mode: "payment",
    amount: 39900,
  },
  emergency_consultation: {
    priceId: process.env.STRIPE_PRICE_EMERGENCY_CONSULTATION || "",
    mode: "payment",
    amount: 9900,
  },
};

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId, caseType } = checkoutSchema.parse(body);

    const config = planConfig[planId];
    if (!config || !config.priceId) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    const successPath = planId.startsWith("guardian")
      ? "/familia?success=true"
      : "/pricing?success=true";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: config.mode,
      payment_method_types: ["card"],
      line_items: [
        {
          price: config.priceId,
          quantity: 1,
        },
      ],
      customer_email: session.user.email,
      client_reference_id: session.user.id,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${successPath}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${planId.startsWith("guardian") ? "/familia" : "/pricing"}?cancelled=true`,
      metadata: {
        userId: session.user.id,
        planId,
        caseType: caseType || "",
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
