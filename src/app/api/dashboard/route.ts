import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import {
  cases,
  caseDocuments,
  notifications,
  subscriptions,
  payments,
  attorneyProfiles,
} from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

interface CaseStep {
  step: number;
  label: string;
  completed: boolean;
  current: boolean;
}

interface Document {
  name: string;
  status: string;
  uploadedDate?: string;
}

interface Message {
  id: string;
  sender: string;
  senderRole: "team" | "attorney";
  content: string;
  timestamp: string;
}

interface PaymentInfo {
  plan: string;
  total: number;
  paid: number;
  payments: number;
  totalPayments: number;
  nextPayment?: number;
  nextPaymentDate?: string;
}

interface DashboardResponse {
  case: {
    id: string;
    caseType: string;
    category: string;
    status: string;
    attorneyId?: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  caseSteps: CaseStep[];
  documents: Record<string, Document[]>;
  messages: Message[];
  payment: PaymentInfo | null;
}

/**
 * Map case status to progress steps
 */
function calculateCaseSteps(status: string): CaseStep[] {
  const steps: CaseStep[] = [
    { step: 1, label: "Intake", completed: false, current: false },
    { step: 2, label: "Documents", completed: false, current: false },
    { step: 3, label: "Attorney Review", completed: false, current: false },
    { step: 4, label: "Filed", completed: false, current: false },
    { step: 5, label: "Processing", completed: false, current: false },
    { step: 6, label: "Approved", completed: false, current: false },
  ];

  switch (status) {
    case "draft":
      steps[0].current = true;
      break;
    case "intake":
      steps[0].completed = true;
      steps[1].current = true;
      break;
    case "documents_pending":
      steps[0].completed = true;
      steps[1].current = true;
      break;
    case "attorney_review":
      steps[0].completed = true;
      steps[1].completed = true;
      steps[2].current = true;
      break;
    case "submitted":
    case "filed":
      steps[0].completed = true;
      steps[1].completed = true;
      steps[2].completed = true;
      steps[3].current = true;
      break;
    case "processing":
      steps[0].completed = true;
      steps[1].completed = true;
      steps[2].completed = true;
      steps[3].completed = true;
      steps[4].current = true;
      break;
    case "approved":
      steps[0].completed = true;
      steps[1].completed = true;
      steps[2].completed = true;
      steps[3].completed = true;
      steps[4].completed = true;
      steps[5].current = true;
      break;
    default:
      steps[0].current = true;
  }

  return steps;
}

/**
 * Format document for display
 */
function formatDocument(doc: typeof caseDocuments.$inferSelect): Document {
  return {
    name: doc.fileName || doc.documentType,
    status: doc.status,
    uploadedDate: doc.createdAt
      ? new Date(doc.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : undefined,
  };
}

/**
 * Group documents by type
 */
function groupDocumentsByType(
  docs: (typeof caseDocuments.$inferSelect)[]
): Record<string, Document[]> {
  const grouped: Record<string, Document[]> = {
    marriage: [],
    immigration: [],
    financial: [],
  };

  docs.forEach((doc) => {
    const formatted = formatDocument(doc);
    const type = doc.documentType.toLowerCase();

    if (type.includes("marriage") || type.includes("wedding")) {
      grouped.marriage.push(formatted);
    } else if (
      type.includes("passport") ||
      type.includes("birth") ||
      type.includes("visa") ||
      type.includes("immigration") ||
      type.includes("i-94") ||
      type.includes("medical")
    ) {
      grouped.immigration.push(formatted);
    } else if (
      type.includes("tax") ||
      type.includes("income") ||
      type.includes("w-2") ||
      type.includes("affidavit") ||
      type.includes("bank") ||
      type.includes("financial")
    ) {
      grouped.financial.push(formatted);
    } else {
      // Default to financial for unknown types
      grouped.financial.push(formatted);
    }
  });

  return grouped;
}

/**
 * Format notification as a message
 */
function formatNotificationAsMessage(
  notification: typeof notifications.$inferSelect
): Message {
  const metadata = notification.metadata as Record<string, unknown> | null;
  return {
    id: notification.id,
    sender: (metadata?.senderName as string) || "Case Team",
    senderRole: (metadata?.senderRole as "team" | "attorney") || "team",
    content: notification.message,
    timestamp: notification.createdAt
      ? new Date(notification.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Recently",
  };
}

/**
 * GET /api/dashboard
 * Returns all dashboard data for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const db = getDb();
    const userId = session.user.id;

    // 1. Fetch the user's first/active case
    const [userCase] = await db
      .select()
      .from(cases)
      .where(eq(cases.userId, userId))
      .limit(1);

    if (!userCase) {
      // User has no case yet - return minimal dashboard
      return NextResponse.json({
        case: null,
        caseSteps: calculateCaseSteps("draft"),
        documents: { marriage: [], immigration: [], financial: [] },
        messages: [],
        payment: null,
      } as DashboardResponse);
    }

    // 2. Fetch documents for this case
    const caseDocsList = await db
      .select()
      .from(caseDocuments)
      .where(eq(caseDocuments.caseId, userCase.id));

    const documents = groupDocumentsByType(caseDocsList);

    // 3. Fetch recent notifications (max 10)
    const notificationsList = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(10);

    const messages = notificationsList.map(formatNotificationAsMessage);

    // 4. Fetch subscription and payment info
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    let paymentInfo: PaymentInfo | null = null;

    if (subscription) {
      // Fetch all payments for this user
      const userPayments = await db
        .select()
        .from(payments)
        .where(
          and(eq(payments.userId, userId), eq(payments.status, "completed"))
        )
        .orderBy(desc(payments.createdAt));

      // Calculate totals
      const totalPaid = userPayments.reduce(
        (sum, p) => sum + parseFloat(p.amount.toString()),
        0
      );

      // Mock plan info - in production, fetch from actual plan pricing
      const planNames: Record<string, string> = {
        free: "Free Plan",
        starter: "Starter Plan - $499",
        professional: "Professional Plan - $999",
        enterprise: "Enterprise Plan - Custom",
      };

      const planPrices: Record<string, number> = {
        free: 0,
        starter: 499,
        professional: 999,
        enterprise: 2500,
      };

      const totalPrice = planPrices[subscription.plan] || 999;

      paymentInfo = {
        plan:
          planNames[subscription.plan] ||
          "Professional Plan - Marriage Green Card",
        total: totalPrice,
        paid: totalPaid,
        payments: userPayments.length,
        totalPayments: 12, // Default installment count
        nextPayment:
          totalPrice > totalPaid ? totalPrice / 12 : undefined,
        nextPaymentDate: subscription.currentPeriodEnd
          ? new Date(subscription.currentPeriodEnd).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )
          : undefined,
      };
    }

    return NextResponse.json({
      case: {
        id: userCase.id,
        caseType: userCase.caseType,
        category: userCase.category,
        status: userCase.status,
        attorneyId: userCase.attorneyId || undefined,
        createdAt: userCase.createdAt.toISOString(),
        updatedAt: userCase.updatedAt.toISOString(),
      },
      caseSteps: calculateCaseSteps(userCase.status),
      documents,
      messages,
      payment: paymentInfo,
    } as DashboardResponse);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
