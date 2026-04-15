import { NextRequest, NextResponse } from "next/server";
import { generateFilingPacket } from "@/lib/filing-packet";
import { getDb } from "@/lib/db";
import { cases } from "@/lib/db/schema";
import { eq, and, or } from "drizzle-orm";

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

/**
 * GET /api/cases/[id]/packet
 *
 * Generates and returns a filing packet for a case.
 * Only attorneys and admins can access this.
 */
export async function GET(
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

    // Only attorneys and admins can generate filing packets
    if (actorRole !== "attorney" && actorRole !== "admin") {
      return NextResponse.json(
        { error: "Only attorneys can generate filing packets" },
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

    // Generate the filing packet
    const packet = await generateFilingPacket(id);

    return NextResponse.json(packet, { status: 200 });
  } catch (error) {
    console.error("Failed to generate filing packet:", error);

    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate filing packet" },
      { status: 500 }
    );
  }
}
