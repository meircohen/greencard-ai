import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb } from "@/lib/db";
import { subscriptions, payments, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { audit } from "@/lib/audit";
import { logger } from "@/lib/logger";
import { sendEmail, paymentConfirmationEmail } from "@/lib/email";

/**
 * Idempotency: track processed Stripe event IDs to prevent duplicate handling.
 * In production this should be a DB table; using a bounded in-memory set for now
 * with TTL-based cleanup. The Stripe event ID is globally unique.
 */
const processedEvents = new Map<string, number>();
const MAX_PROCESSED = 10000;
const EVENT_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function isAlreadyProcessed(eventId: string): boolean {
  const ts = processedEvents.get(eventId);
  if (ts && Date.now() - ts < EVENT_TTL_MS) return true;

  // Cleanup old entries if map is getting large
  if (processedEvents.size > MAX_PROCESSED) {
    const cutoff = Date.now() - EVENT_TTL_MS;
    for (const [key, val] of processedEvents) {
      if (val < cutoff) processedEvents.delete(key);
    }
  }
  return false;
}

function markProcessed(eventId: string): void {
  processedEvents.set(eventId, Date.now());
}

export async function POST(request: NextRequest) {
  try {
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

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      logger.error({ err }, "Webhook signature verification failed");
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    // Idempotency check: skip if we already processed this event
    if (isAlreadyProcessed(event.id)) {
      logger.info({ eventId: event.id }, "Skipping duplicate webhook event");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const db = getDb();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        const planId = session.metadata?.planId;

        if (userId && session.subscription) {
          // Create or update subscription record
          const subscriptionId = typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;

          const planType = (planId === "guided" ? "professional" : "starter") as "free" | "starter" | "professional" | "enterprise";

          await db
            .insert(subscriptions)
            .values({
              userId,
              stripeSubscriptionId: subscriptionId,
              plan: planType,
              status: "active",
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            })
            .onConflictDoUpdate({
              target: subscriptions.stripeSubscriptionId,
              set: {
                plan: planType,
                status: "active",
                updatedAt: new Date(),
              },
            });

          // Record payment
          if (session.amount_total) {
            await db.insert(payments).values({
              userId,
              stripePaymentId: session.payment_intent as string,
              amount: (session.amount_total / 100).toFixed(2),
              currency: session.currency || "USD",
              status: "completed",
              description: `Subscription: ${planId}`,
            });

            // Send payment confirmation email (non-blocking)
            try {
              const [user] = await db
                .select({ email: users.email, fullName: users.fullName })
                .from(users)
                .where(eq(users.id, userId));

              if (user) {
                const amount = `$${(session.amount_total / 100).toFixed(2)}`;
                const planName = planId === "guided" ? "Professional" : "Starter";
                const emailPayload = paymentConfirmationEmail(
                  user.fullName || "User",
                  amount,
                  planName
                );
                emailPayload.to = user.email;
                sendEmail(emailPayload).catch(err => console.error("Payment confirmation email failed:", err));
              }
            } catch (emailError) {
              logger.error({ userId, error: emailError }, "Failed to send payment confirmation email");
            }
          }

          audit({
            action: "billing.subscription_created",
            userId,
            metadata: { planId, subscriptionId },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription & Record<string, unknown>;

        await db
          .update(subscriptions)
          .set({
            status: sub.status === "active" ? "active" : sub.status,
            currentPeriodStart: sub.current_period_start ? new Date((sub.current_period_start as number) * 1000) : undefined,
            currentPeriodEnd: sub.current_period_end ? new Date((sub.current_period_end as number) * 1000) : undefined,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.stripeSubscriptionId, sub.id));

        audit({
          action: "billing.subscription_updated",
          metadata: { subscriptionId: sub.id, status: sub.status },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const deletedSub = event.data.object as Stripe.Subscription;

        await db
          .update(subscriptions)
          .set({
            status: "canceled",
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.stripeSubscriptionId, deletedSub.id));

        audit({
          action: "billing.subscription_canceled",
          metadata: { subscriptionId: deletedSub.id },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice & Record<string, unknown>;
        const customerId = typeof invoice.customer === "string"
          ? invoice.customer
          : (invoice.customer as { id?: string })?.id;

        const invoiceSub = invoice.subscription as string | { id: string } | null;
        if (invoiceSub) {
          const subId = typeof invoiceSub === "string"
            ? invoiceSub
            : invoiceSub.id;

          await db
            .update(subscriptions)
            .set({
              status: "past_due",
              updatedAt: new Date(),
            })
            .where(eq(subscriptions.stripeSubscriptionId, subId));
        }

        // Record failed payment
        if (invoice.amount_due) {
          const userId = invoice.metadata?.userId;
          if (userId) {
            await db.insert(payments).values({
              userId,
              stripePaymentId: invoice.id,
              amount: (invoice.amount_due / 100).toFixed(2),
              currency: invoice.currency || "USD",
              status: "failed",
              description: "Invoice payment failed",
            });
          }
        }

        audit({
          action: "billing.payment_failed",
          metadata: { invoiceId: invoice.id, customerId },
        });
        break;
      }

      default:
        logger.info({ eventType: event.type }, "Unhandled webhook event type");
    }

    markProcessed(event.id);
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    logger.error({ error }, "Webhook processing error");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
