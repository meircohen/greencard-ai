import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    // Verify environment variables
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: "Stripe is not configured" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Webhook signature missing" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        // Handle successful checkout
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        console.log("Checkout completed:", {
          userId: checkoutSession.client_reference_id,
          customerId: checkoutSession.customer,
          metadata: checkoutSession.metadata,
        });
        // TODO: Update user subscription in database
        break;

      case "customer.subscription.updated":
        // Handle subscription update
        const subscription = event.data.object as Stripe.Subscription;
        console.log("Subscription updated:", {
          subscriptionId: subscription.id,
          status: subscription.status,
        });
        // TODO: Update subscription status in database
        break;

      case "customer.subscription.deleted":
        // Handle subscription cancellation
        const deletedSubscription = event.data.object as Stripe.Subscription;
        console.log("Subscription deleted:", {
          subscriptionId: deletedSubscription.id,
        });
        // TODO: Update subscription status in database
        break;

      case "invoice.payment_failed":
        // Handle failed payment
        const failedInvoice = event.data.object as Stripe.Invoice;
        console.log("Payment failed:", {
          invoiceId: failedInvoice.id,
          customerId: failedInvoice.customer,
        });
        // TODO: Notify user of failed payment
        break;

      default:
        console.log("Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
