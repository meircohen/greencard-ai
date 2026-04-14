import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { cases, users } from "@/lib/db/schema";
import { eq, and, desc, count, sql } from "drizzle-orm";
import { safeErrorResponse } from "@/lib/errors";
import { audit, getClientInfo } from "@/lib/audit";

/**
 * GET /api/attorney/cases
 *
 * Returns all cases assigned to the authenticated attorney.
 * Requires role: attorney
 */
export async function GET(request: NextRequest): Promise<Response> {
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

    // Get cases assigned to this attorney with client info
    const attorneyCases = await db
      .select({
        id: cases.id,
        caseType: cases.caseType,
        category: cases.category,
        status: cases.status,
        priorityDate: cases.priorityDate,
        receiptNumber: cases.receiptNumber,
        serviceCenter: cases.serviceCenter,
        score: cases.score,
        createdAt: cases.createdAt,
        updatedAt: cases.updatedAt,
        clientName: users.fullName,
        clientEmail: users.email,
      })
      .from(cases)
      .leftJoin(users, eq(cases.userId, users.id))
      .where(eq(cases.attorneyId, userId))
      .orderBy(desc(cases.updatedAt));

    return NextResponse.json({
      cases: attorneyCases,
      total: attorneyCases.length,
    });
  } catch (error) {
    return safeErrorResponse(error, "Failed to load attorney cases.");
  }
}

/**
 * PATCH /api/attorney/cases
 *
 * Assign a case to the authenticated attorney (claim a case).
 * Body: { caseId: string }
 */
export async function PATCH(request: NextRequest): Promise<Response> {
  try {
    const userId = request.headers.get("x-user-id");
    const userRole = request.headers.get("x-user-role");

    if (!userId || (userRole !== "attorney" && userRole !== "admin")) {
      return NextResponse.json({ error: "Attorney access required." }, { status: 403 });
    }

    const body = await request.json();
    const caseId = body.caseId;

    if (!caseId || typeof caseId !== "string") {
      return NextResponse.json({ error: "caseId is required." }, { status: 400 });
    }

    const db = getDb();

    // Only assign if case has no attorney yet
    const [updated] = await db
      .update(cases)
      .set({ attorneyId: userId, updatedAt: new Date() })
      .where(and(eq(cases.id, caseId), sql`${cases.attorneyId} IS NULL`))
      .returning({ id: cases.id });

    if (!updated) {
      return NextResponse.json(
        { error: "Case not found or already assigned to an attorney." },
        { status: 404 }
      );
    }

    const client = getClientInfo(request.headers);
    audit({
      action: "case.updated",
      userId,
      targetId: caseId,
      ip: client.ip,
      metadata: { change: "attorney_assigned" },
    });

    return NextResponse.json({ message: "Case assigned successfully.", caseId: updated.id });
  } catch (error) {
    return safeErrorResponse(error, "Failed to assign case.");
  }
}
