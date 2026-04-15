import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { cases, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const onboardingSchema = z.object({
  purpose: z.string().min(1, "Purpose is required"),
  countryOfBirth: z.string().optional(),
  immigrationStatus: z.string().optional(),
  currentLocation: z.string().optional(),
  needs: z.array(z.string()).optional(),
  caseDescription: z.string().optional(),
  budget: z.string().optional(),
  familyServiceType: z.string().optional(),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

// Map purpose to caseType
function mapPurposeToCaseType(purpose: string): string {
  const mapping: Record<string, string> = {
    greencard: "I-485",
    visa: "I-140",
    citizen: "N-400",
    help: "General",
    attorney: "Attorney",
  };
  return mapping[purpose] || "General";
}

// Map purpose to category
function mapPurposeToCategory(purpose: string): string {
  const mapping: Record<string, string> = {
    greencard: "marriage-based",
    visa: "employment-based",
    citizen: "naturalization",
    help: "general",
    attorney: "attorney",
  };
  return mapping[purpose] || "general";
}

/**
 * POST /api/onboarding
 * Completes onboarding for an authenticated user
 * - Creates a case
 * - Sets onboardingCompleted to true
 * - Returns the created case
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const data = onboardingSchema.parse(body) as OnboardingData;

    const db = getDb();
    const userId = session.user.id;

    // Create case
    const caseType = mapPurposeToCaseType(data.purpose);
    const category = mapPurposeToCategory(data.purpose);

    const [newCase] = await db
      .insert(cases)
      .values({
        userId,
        caseType,
        category,
        status: "draft",
        assessment: {
          purpose: data.purpose,
          countryOfBirth: data.countryOfBirth,
          immigrationStatus: data.immigrationStatus,
          currentLocation: data.currentLocation,
          needs: data.needs,
          caseDescription: data.caseDescription,
          budget: data.budget,
          familyServiceType: data.familyServiceType,
        },
      })
      .returning();

    // Update user's onboardingCompleted flag
    await db
      .update(users)
      .set({ onboardingCompleted: true })
      .where(eq(users.id, userId));

    return NextResponse.json(
      {
        message: "Onboarding completed successfully",
        case: {
          id: newCase.id,
          caseType: newCase.caseType,
          category: newCase.category,
          status: newCase.status,
          createdAt: newCase.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "Validation error" },
        { status: 400 }
      );
    }

    console.error("Onboarding error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
