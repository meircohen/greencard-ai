import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { cases } from "@/lib/db/schema";
import { eq, and, count, sql } from "drizzle-orm";
import { safeErrorResponse } from "@/lib/errors";

/**
 * GET /api/attorney/dashboard
 *
 * Returns dashboard stats for the authenticated attorney:
 * - Total assigned cases
 * - Cases by status breakdown
 * - Recent activity
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

    // Count cases by status
    const statusCounts = await db
      .select({
        status: cases.status,
        count: count(),
      })
      .from(cases)
      .where(eq(cases.attorneyId, userId))
      .groupBy(cases.status);

    const totalCases = statusCounts.reduce((sum, s) => sum + s.count, 0);

    const statusMap: Record<string, number> = {};
    for (const row of statusCounts) {
      statusMap[row.status] = row.count;
    }

    // Count unassigned cases (available to claim)
    const [unassigned] = await db
      .select({ count: count() })
      .from(cases)
      .where(sql`${cases.attorneyId} IS NULL AND ${cases.status} != 'abandoned'`);

    return NextResponse.json({
      totalAssigned: totalCases,
      byStatus: statusMap,
      availableToClaim: unassigned?.count ?? 0,
    });
  } catch (error) {
    return safeErrorResponse(error, "Failed to load dashboard.");
  }
}
