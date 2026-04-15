import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/auth/me
 * Returns the current authenticated user's profile
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

    // Fetch full user from DB for the most up-to-date info
    const db = getDb();
    const [dbUser] = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        role: users.role,
        avatarUrl: users.avatarUrl,
        emailVerified: users.emailVerified,
        onboardingCompleted: users.onboardingCompleted,
        locale: users.locale,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: dbUser.id,
        email: dbUser.email,
        fullName: dbUser.fullName,
        role: dbUser.role,
        avatarUrl: dbUser.avatarUrl,
        emailVerified: dbUser.emailVerified,
        onboardingCompleted: dbUser.onboardingCompleted,
        locale: dbUser.locale,
        createdAt: dbUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
