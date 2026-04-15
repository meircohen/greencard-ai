import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { cases, caseDeadlines, users } from "@/lib/db/schema";
import { eq, and, or } from "drizzle-orm";
import { z } from "zod";
import { generateDeadlines, getCaseDeadlines } from "@/lib/deadline-monitor";
import { logger } from "@/lib/logger";
import { sendEmail, caseStatusUpdateEmail } from "@/lib/email";

/**
 * Helper: fetch a case with ownership check.
 * Returns the case if the actor owns it, is the assigned attorney, or is an admin.
 * Returns null otherwise (caller should return 404 to avoid leaking case existence).
 */
async function getCaseForActor(caseId: string, actorId: string, actorRole: string | null) {
  const db = getDb();

  if (actorRole === "admin") {
    return db.query.cases.findFirst({
      where: eq(cases.id, caseId),
    });
  }

  return db.query.cases.findFirst({
    where: and(
      eq(cases.id, caseId),
      or(
        eq(cases.userId, actorId),
        eq(cases.attorneyId, actorId)
      )
    ),
  });
}

const updateCaseSchema = z.object({
  caseType: z.string().optional(),
  category: z.string().optional(),
  status: z.enum(["draft", "submitted", "processing", "approved", "denied", "abandoned", "completed"]).optional(),
}).strict();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const actorId = request.headers.get("x-user-id");
    const actorRole = request.headers.get("x-user-role");

    if (!actorId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const caseData = await getCaseForActor(id, actorId, actorRole);
    if (!caseData) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    return NextResponse.json(caseData, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("Failed to fetch case:", error);
    return NextResponse.json(
      { error: "Failed to fetch case" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const actorId = request.headers.get("x-user-id");
    const actorRole = request.headers.get("x-user-role");

    if (!actorId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Verify ownership before allowing update
    const existing = await getCaseForActor(id, actorId, actorRole);
    if (!existing) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = updateCaseSchema.parse(body);

    const db = getDb();
    const [updated] = await db
      .update(cases)
      .set({
        ...parsed,
        updatedAt: new Date(),
      })
      .where(eq(cases.id, id))
      .returning();

    // Send email if status changed
    if (parsed.status && parsed.status !== existing.status) {
      try {
        const [caseUser] = await db
          .select({ email: users.email, fullName: users.fullName })
          .from(users)
          .where(eq(users.id, existing.userId));

        if (caseUser) {
          const emailPayload = caseStatusUpdateEmail(
            caseUser.fullName || "User",
            existing.caseType || "Case",
            existing.status || "draft",
            parsed.status
          );
          emailPayload.to = caseUser.email;
          sendEmail(emailPayload).catch(err => console.error("Case status email failed:", err));
        }
      } catch (emailError) {
        logger.error({ caseId: id, error: emailError }, "Failed to send case status email");
      }
    }

    // Handle deadline generation on status changes
    if (parsed.status) {
      try {
        if (parsed.status === 'approved') {
          // Check if deadlines already exist
          const existingDeadlines = await getCaseDeadlines(id);
          if (existingDeadlines.length === 0) {
            // Generate deadlines based on case type
            const deadlines = generateDeadlines(
              id,
              updated.caseType,
              updated.priorityDate ? new Date(updated.priorityDate) : new Date()
            );
            if (deadlines.length > 0) {
              await db.insert(caseDeadlines).values(deadlines);
              logger.info(
                { caseId: id, count: deadlines.length },
                'Auto-generated deadlines on case approval'
              );
            }
          }
        } else if (parsed.status === 'denied' || parsed.status === 'abandoned') {
          // Mark deadlines as irrelevant for denied/abandoned cases
          logger.info(
            { caseId: id, newStatus: parsed.status },
            'Case status changed - review deadlines for relevance'
          );
        }
      } catch (deadlineError) {
        logger.error(
          { caseId: id, error: deadlineError },
          'Failed to handle deadline logic on status change'
        );
        // Non-critical: continue returning updated case even if deadline logic fails
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }
    console.error("Failed to update case:", error);
    return NextResponse.json(
      { error: "Failed to update case" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const actorId = request.headers.get("x-user-id");
    const actorRole = request.headers.get("x-user-role");

    if (!actorId) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Only case owner or admin can delete
    const existing = await getCaseForActor(id, actorId, actorRole);
    if (!existing) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const db = getDb();
    await db
      .update(cases)
      .set({ status: "abandoned", updatedAt: new Date() })
      .where(eq(cases.id, id));

    return NextResponse.json({
      success: true,
      message: "Case archived successfully",
    });
  } catch (error) {
    console.error("Failed to archive case:", error);
    return NextResponse.json(
      { error: "Failed to archive case" },
      { status: 500 }
    );
  }
}
