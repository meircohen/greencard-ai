import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  cases,
  caseDocuments,
  caseForms,
  caseNotes,
  caseDeadlines,
  conversations,
  messages,
  users,
  payments,
} from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { safeErrorResponse } from "@/lib/errors";
import { audit, getClientInfo } from "@/lib/audit";

/**
 * GET /api/attorney/cases/[id]
 *
 * Returns full case details for an attorney to review.
 * Includes: case data, client info, documents, forms, notes, conversations, deadlines, payments.
 * Requires: authenticated attorney assigned to the case, or admin role
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id: caseId } = await params;
  try {
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    if (!userId) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    if (userRole !== "attorney" && userRole !== "admin") {
      return NextResponse.json({ error: "Attorney access required." }, { status: 403 });
    }

    const db = getDb();

    // Get case with client info
    const [caseData] = await db
      .select({
        id: cases.id,
        userId: cases.userId,
        attorneyId: cases.attorneyId,
        caseType: cases.caseType,
        category: cases.category,
        status: cases.status,
        priorityDate: cases.priorityDate,
        receiptNumber: cases.receiptNumber,
        serviceCenter: cases.serviceCenter,
        score: cases.score,
        assessment: cases.assessment,
        createdAt: cases.createdAt,
        updatedAt: cases.updatedAt,
        clientId: users.id,
        clientName: users.fullName,
        clientEmail: users.email,
        clientPhone: users.phone,
      })
      .from(cases)
      .leftJoin(users, eq(cases.userId, users.id))
      .where(eq(cases.id, caseId));

    if (!caseData) {
      return NextResponse.json({ error: "Case not found." }, { status: 404 });
    }

    // Check authorization: must be assigned attorney or admin
    if (userRole !== "admin" && caseData.attorneyId !== userId) {
      return NextResponse.json(
        { error: "You are not assigned to this case." },
        { status: 403 }
      );
    }

    // Get all documents
    const caseDocsList = await db
      .select()
      .from(caseDocuments)
      .where(eq(caseDocuments.caseId, caseId))
      .orderBy(desc(caseDocuments.createdAt));

    // Get all forms
    const caseFormsList = await db
      .select()
      .from(caseForms)
      .where(eq(caseForms.caseId, caseId))
      .orderBy(desc(caseForms.createdAt));

    // Get case notes
    const caseNotesList = await db
      .select({
        id: caseNotes.id,
        content: caseNotes.content,
        visibility: caseNotes.visibility,
        isPrivileged: caseNotes.isPrivileged,
        createdAt: caseNotes.createdAt,
        authorName: users.fullName,
      })
      .from(caseNotes)
      .leftJoin(users, eq(caseNotes.authorId, users.id))
      .where(eq(caseNotes.caseId, caseId))
      .orderBy(desc(caseNotes.createdAt));

    // Get case deadlines
    const caseDeadlinesList = await db
      .select()
      .from(caseDeadlines)
      .where(eq(caseDeadlines.caseId, caseId))
      .orderBy(caseDeadlines.deadlineDate);

    // Get conversations and messages
    const caseConversations = await db
      .select({
        id: conversations.id,
        type: conversations.type,
        createdAt: conversations.createdAt,
        messagesCount: conversations.messagesCount,
      })
      .from(conversations)
      .where(eq(conversations.caseId, caseId))
      .orderBy(desc(conversations.createdAt));

    // Get payment info
    const paymentInfo = await db
      .select()
      .from(payments)
      .where(eq(payments.userId, caseData.userId))
      .orderBy(desc(payments.createdAt));

    return NextResponse.json({
      case: caseData,
      documents: caseDocsList,
      forms: caseFormsList,
      notes: caseNotesList,
      deadlines: caseDeadlinesList,
      conversations: caseConversations,
      payments: paymentInfo,
    });
  } catch (error) {
    return safeErrorResponse(error, "Failed to load case details.");
  }
}

/**
 * PATCH /api/attorney/cases/[id]
 *
 * Update case status, add notes, or assign/unassign attorney.
 * Body: { status?: string, notes?: string, attorneyId?: string | null }
 * Requires: authenticated attorney assigned to case or admin
 */
export async function PATCH(
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
    const { status, notes, attorneyId } = body;

    const db = getDb();

    // Verify case exists and check authorization
    const [caseRecord] = await db
      .select({ attorneyId: cases.attorneyId })
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

    // Build update object
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (status) updateData.status = status;
    if (attorneyId !== undefined) updateData.attorneyId = attorneyId;

    // Update case
    await db.update(cases).set(updateData).where(eq(cases.id, caseId));

    // Add note if provided
    if (notes && notes.trim()) {
      await db.insert(caseNotes).values({
        caseId,
        authorId: userId,
        content: notes,
        visibility: "private",
        isPrivileged: true,
      });
    }

    const client = getClientInfo(request.headers);
    audit({
      action: "case.updated",
      userId,
      targetId: caseId,
      ip: client.ip,
      metadata: { status, hasNotes: !!notes, attorneyId },
    });

    return NextResponse.json({ message: "Case updated successfully." });
  } catch (error) {
    return safeErrorResponse(error, "Failed to update case.");
  }
}
