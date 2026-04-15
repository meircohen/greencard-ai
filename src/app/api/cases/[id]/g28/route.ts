import { NextRequest, NextResponse } from "next/server";
import { generateG28FromCase, generateG28WithDefaults } from "@/lib/g28-generator";
import { getDb } from "@/lib/db";
import { cases } from "@/lib/db/schema";
import { eq, and, or } from "drizzle-orm";
import { z } from "zod";

/**
 * Helper: fetch a case with ownership check.
 * Returns the case if the actor owns it, is the assigned attorney, or is an admin.
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

const g28RequestSchema = z.object({
  useDefaults: z.boolean().optional(),
  clientName: z.string().optional(),
  clientANumber: z.string().optional(),
});

/**
 * POST /api/cases/[id]/g28
 *
 * Generates G-28 form data for a case.
 * Only attorneys and admins can access this.
 *
 * Request body (optional):
 * {
 *   useDefaults: boolean - if true, uses Jeremy Knight's default attorney info
 *   clientName: string - override client name
 *   clientANumber: string - override A-number
 * }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const actorId = request.headers.get("x-user-id");
    const actorRole = request.headers.get("x-user-role");

    if (!actorId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Only attorneys and admins can generate G-28 forms
    if (actorRole !== "attorney" && actorRole !== "admin") {
      return NextResponse.json(
        { error: "Only attorneys can generate G-28 forms" },
        { status: 403 }
      );
    }

    // Verify case access
    const caseRecord = await getCaseForActor(id, actorId, actorRole);
    if (!caseRecord) {
      return NextResponse.json(
        { error: "Case not found" },
        { status: 404 }
      );
    }

    // Parse request body
    let body = {};
    if (request.body) {
      try {
        body = await request.json();
      } catch {
        // Empty or invalid JSON, use defaults
      }
    }

    const parsed = g28RequestSchema.parse(body);

    // Generate the G-28 form data
    let formData;

    if (parsed.useDefaults && parsed.clientName) {
      // Use defaults with optional client name override
      formData = generateG28WithDefaults(
        parsed.clientName,
        parsed.clientANumber
      );
    } else {
      // Generate from case data (uses assigned attorney or Jeremy Knight defaults)
      formData = await generateG28FromCase(id);

      // Override client info if provided
      if (parsed.clientName) {
        formData.applicantName = parsed.clientName;
      }
      if (parsed.clientANumber) {
        formData.applicantANumber = parsed.clientANumber;
      }
    }

    return NextResponse.json(formData, { status: 200 });
  } catch (error) {
    console.error("Failed to generate G-28 form:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate G-28 form" },
      { status: 500 }
    );
  }
}
