import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import {
  cases,
  caseDocuments,
  caseForms,
  caseDeadlines,
  caseEvents,
  caseNotes,
  users,
} from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";

/**
 * GET /api/cases/[id]/detail
 * Returns full case detail for a single case with all related data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const db = getDb();
    const { id: caseId } = await params;
    const userId = session.user.id;
    const userRole = session.user.role;

    // Fetch the case
    const [caseData] = await db
      .select()
      .from(cases)
      .where(eq(cases.id, caseId))
      .limit(1);

    if (!caseData) {
      return NextResponse.json(
        { error: "Case not found" },
        { status: 404 }
      );
    }

    // Check authorization
    if (
      userRole === "client" &&
      caseData.userId !== userId
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    if (
      userRole === "attorney" &&
      caseData.attorneyId !== userId
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Fetch all related data
    const [documents, forms, deadlines, events, notes] = await Promise.all([
      db
        .select()
        .from(caseDocuments)
        .where(eq(caseDocuments.caseId, caseId)),
      db
        .select()
        .from(caseForms)
        .where(eq(caseForms.caseId, caseId)),
      db
        .select()
        .from(caseDeadlines)
        .where(eq(caseDeadlines.caseId, caseId))
        .orderBy(caseDeadlines.deadlineDate),
      db
        .select()
        .from(caseEvents)
        .where(eq(caseEvents.caseId, caseId))
        .orderBy(caseEvents.eventDate),
      db
        .select({
          id: caseNotes.id,
          caseId: caseNotes.caseId,
          authorId: caseNotes.authorId,
          content: caseNotes.content,
          visibility: caseNotes.visibility,
          createdAt: caseNotes.createdAt,
          author: {
            id: users.id,
            fullName: users.fullName,
            avatarUrl: users.avatarUrl,
          },
        })
        .from(caseNotes)
        .innerJoin(users, eq(caseNotes.authorId, users.id))
        .where(eq(caseNotes.caseId, caseId))
        .orderBy(caseNotes.createdAt),
    ]);

    // Get next upcoming deadline
    const [nextDeadline] = await db
      .select()
      .from(caseDeadlines)
      .where(
        and(
          eq(caseDeadlines.caseId, caseId),
          eq(caseDeadlines.completed, false),
          gt(caseDeadlines.deadlineDate, new Date())
        )
      )
      .orderBy(caseDeadlines.deadlineDate)
      .limit(1);

    return NextResponse.json({
      case: caseData,
      documents,
      forms,
      deadlines,
      events,
      notes,
      nextDeadline: nextDeadline || null,
    });
  } catch (error) {
    console.error("Error fetching case detail:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
