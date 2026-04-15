import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  cases,
  caseNotes,
  notifications,
  users,
  caseDocuments,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { safeErrorResponse } from "@/lib/errors";
import { audit, getClientInfo } from "@/lib/audit";
import { sendEmail, reviewDecisionEmail } from "@/lib/email";

type ReviewDecision = "approve" | "request_changes" | "reject";

/**
 * POST /api/attorney/cases/[id]/review
 *
 * Submit a case review decision.
 * Body: {
 *   decision: "approve" | "request_changes" | "reject",
 *   notes: string,
 *   requestedDocuments?: string[]
 * }
 *
 * - approve: changes status to "submitted" or "filed"
 * - request_changes: changes status to "documents_pending" and creates notification
 * - reject: changes status to "rejected"
 *
 * Requires: authenticated attorney assigned to case or admin
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id: caseId } = await params;
  try {
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    if (!userId || (userRole !== "attorney" && userRole !== "admin")) {
      return NextResponse.json({ error: "Attorney access required." }, { status: 403 });
    }

    const body = await request.json();
    const { decision, notes, requestedDocuments } = body;

    if (!decision || !["approve", "request_changes", "reject"].includes(decision)) {
      return NextResponse.json(
        { error: "Invalid decision. Must be 'approve', 'request_changes', or 'reject'." },
        { status: 400 }
      );
    }

    const db = getDb();

    // Verify case exists and check authorization
    const [caseRecord] = await db
      .select({
        attorneyId: cases.attorneyId,
        userId: cases.userId,
        status: cases.status,
      })
      .from(cases)
      .where(eq(cases.id, caseId));

    if (!caseRecord) {
      return NextResponse.json({ error: "Case not found." }, { status: 404 });
    }

    if (userRole !== "admin" && caseRecord.attorneyId !== userId) {
      return NextResponse.json(
        { error: "You are not assigned to this case." },
        { status: 403 }
      );
    }

    // Determine new status based on decision
    let newStatus: "draft" | "submitted" | "processing" | "approved" | "denied" | "abandoned" | "completed";
    let notificationMessage: string = "";
    let notificationTitle: string = "";

    switch (decision) {
      case "approve":
        newStatus = "submitted";
        notificationTitle = "Case Approved";
        notificationMessage = `Your case has been reviewed and approved by your attorney. It is now ready for filing.`;
        break;
      case "request_changes":
        newStatus = "processing";
        const docList =
          requestedDocuments && requestedDocuments.length > 0
            ? requestedDocuments.join(", ")
            : "additional documents";
        notificationTitle = "Documents Requested";
        notificationMessage = `Your attorney has requested the following: ${docList}. Please upload these documents as soon as possible.`;
        break;
      case "reject":
        newStatus = "denied";
        notificationTitle = "Case Rejected";
        notificationMessage = `Your case has been reviewed and rejected by your attorney. Please contact your attorney to discuss next steps.`;
        break;
      default:
        return NextResponse.json({ error: "Invalid decision." }, { status: 400 });
    }

    // Update case status
    await db
      .update(cases)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(cases.id, caseId));

    // Add attorney notes (private)
    if (notes && notes.trim()) {
      await db.insert(caseNotes).values({
        caseId,
        authorId: userId,
        content: notes,
        visibility: "private",
        isPrivileged: true,
      });
    }

    // Create notification for client (unless rejection)
    let notificationCreated = false;
    if (decision !== "reject") {
      await db.insert(notifications).values({
        userId: caseRecord.userId,
        caseId,
        type: decision === "approve" ? "case_approved" : "document_received",
        title: notificationTitle,
        message: notificationMessage,
        metadata: {
          decision,
          requestedDocuments: requestedDocuments || [],
        },
      });
      notificationCreated = true;
    }

    // Send email notification (non-blocking)
    try {
      const [client] = await db
        .select({ email: users.email, fullName: users.fullName, caseType: cases.caseType })
        .from(users)
        .innerJoin(cases, eq(users.id, cases.userId))
        .where(eq(cases.id, caseId));

      if (client) {
        const emailPayload = reviewDecisionEmail(
          client.fullName || "User",
          client.caseType || "Case",
          decision,
          notes
        );
        emailPayload.to = client.email;
        sendEmail(emailPayload).catch(err => console.error("Review decision email failed:", err));
      }
    } catch (emailError) {
      console.error("Failed to send review decision email:", emailError);
    }

    const clientInfo = getClientInfo(request.headers);
    audit({
      action: "case.updated",
      userId,
      targetId: caseId,
      ip: clientInfo.ip,
      metadata: {
        decision,
        newStatus,
        requestedDocuments: requestedDocuments || [],
      },
    });

    return NextResponse.json({
      message: "Review submitted successfully.",
      newStatus,
      notificationSent: notificationCreated,
    });
  } catch (error) {
    return safeErrorResponse(error, "Failed to submit case review.");
  }
}
