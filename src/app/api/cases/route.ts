import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { cases, caseDeadlines } from "@/lib/db/schema";
import { eq, or, desc } from "drizzle-orm";
import { z } from "zod";
import crypto from "crypto";
import { generateDeadlines } from "@/lib/deadline-monitor";
import { logger } from "@/lib/logger";

const createCaseSchema = z.object({
  caseType: z.string().min(1, "caseType is required"),
  category: z.string().min(1, "category is required"),
});

export async function GET(request: NextRequest) {
  try {
    const actorId = request.headers.get("x-user-id");
    const actorRole = request.headers.get("x-user-role");

    if (!actorId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const db = getDb();
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "10")));
    const offset = (page - 1) * limit;

    // Users see only their own cases; attorneys see cases assigned to them; admins see all
    let userCases;
    if (actorRole === "admin") {
      userCases = await db
        .select()
        .from(cases)
        .orderBy(desc(cases.updatedAt))
        .limit(limit)
        .offset(offset);
    } else {
      userCases = await db
        .select()
        .from(cases)
        .where(
          or(
            eq(cases.userId, actorId),
            eq(cases.attorneyId, actorId)
          )
        )
        .orderBy(desc(cases.updatedAt))
        .limit(limit)
        .offset(offset);
    }

    return NextResponse.json({
      cases: userCases,
      page,
      limit,
    });
  } catch (error) {
    console.error("Failed to fetch cases:", error);
    return NextResponse.json(
      { error: "Failed to fetch cases" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const actorId = request.headers.get("x-user-id");

    if (!actorId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = createCaseSchema.parse(body);

    const db = getDb();
    const caseId = crypto.randomUUID();

    const [newCase] = await db
      .insert(cases)
      .values({
        id: caseId,
        userId: actorId,
        caseType: parsed.caseType,
        category: parsed.category,
        status: "draft",
      })
      .returning();

    // Auto-generate deadlines if case has approval date (for cases being created after approval)
    try {
      const deadlines = generateDeadlines(caseId, parsed.caseType);
      if (deadlines.length > 0) {
        await db.insert(caseDeadlines).values(deadlines);
        logger.info(
          { caseId, count: deadlines.length },
          'Auto-generated deadlines on case creation'
        );
      }
    } catch (deadlineError) {
      logger.error(
        { caseId, error: deadlineError },
        'Failed to auto-generate deadlines on case creation'
      );
      // Non-critical: continue returning case even if deadline generation fails
    }

    return NextResponse.json(newCase, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }
    console.error("Failed to create case:", error);
    return NextResponse.json(
      { error: "Failed to create case" },
      { status: 500 }
    );
  }
}
