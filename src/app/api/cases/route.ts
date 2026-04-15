import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { cases, caseDocuments, caseForms, caseDeadlines } from "@/lib/db/schema";
import { eq, and, count, gt, SQL } from "drizzle-orm";

/**
 * GET /api/cases
 * Returns all cases for the authenticated user with aggregated data
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
    const userRole = session.user.role;

    // Build where condition based on role
    let whereCondition: SQL | undefined;
    if (userRole === "client") {
      whereCondition = eq(cases.userId, userId);
    } else if (userRole === "attorney") {
      whereCondition = eq(cases.attorneyId, userId);
    }
    // admins see all (undefined = no filter)

    const userCases = await db
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
        createdAt: cases.createdAt,
        updatedAt: cases.updatedAt,
        documentCount: count(caseDocuments.id),
        formCount: count(caseForms.id),
      })
      .from(cases)
      .leftJoin(caseDocuments, eq(caseDocuments.caseId, cases.id))
      .leftJoin(caseForms, eq(caseForms.caseId, cases.id))
      .where(whereCondition)
      .groupBy(
        cases.id,
        cases.userId,
        cases.attorneyId,
        cases.caseType,
        cases.category,
        cases.status,
        cases.priorityDate,
        cases.receiptNumber,
        cases.serviceCenter,
        cases.score,
        cases.createdAt,
        cases.updatedAt
      );

    // Get next upcoming deadline for each case
    const casesWithDeadlines = await Promise.all(
      userCases.map(async (caseItem) => {
        const [nextDeadline] = await db
          .select({
            deadlineDate: caseDeadlines.deadlineDate,
            deadlineType: caseDeadlines.deadlineType,
            description: caseDeadlines.description,
          })
          .from(caseDeadlines)
          .where(
            and(
              eq(caseDeadlines.caseId, caseItem.id),
              eq(caseDeadlines.completed, false),
              gt(caseDeadlines.deadlineDate, new Date())
            )
          )
          .orderBy(caseDeadlines.deadlineDate)
          .limit(1);

        return {
          ...caseItem,
          nextDeadline: nextDeadline || null,
        };
      })
    );

    return NextResponse.json({
      cases: casesWithDeadlines,
      total: casesWithDeadlines.length,
    });
  } catch (error) {
    console.error("Error fetching cases:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
