import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/lib/db";
import { users, auditEvents } from "@/lib/db/schema";
import { eq, and, lt, sql } from "drizzle-orm";
import { safeErrorResponse } from "@/lib/errors";

const VERIFY_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Store a verification token (called from signup route).
 * Now async since it uses DB.
 */
export async function createVerificationToken(userId: string, email: string): Promise<string> {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const expiresAt = Date.now() + VERIFY_TOKEN_EXPIRY_MS;

  await getDb()
    .insert(auditEvents)
    .values({
      action: "email_verification_token",
      userId,
      targetId: tokenHash,
      metadata: {
        email,
        expiresAt,
      },
    });

  return rawToken;
}

/**
 * GET /api/auth/verify-email?token=...
 *
 * Verifies the email and marks the user as verified.
 */
export async function GET(request: NextRequest): Promise<Response> {
  try {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required." },
        { status: 400 }
      );
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const entry = await getDb()
      .query.auditEvents.findFirst({
        where: and(
          eq(auditEvents.action, "email_verification_token"),
          eq(auditEvents.targetId, tokenHash)
        ),
      });

    if (!entry || !entry.metadata || Date.now() > (entry.metadata as any).expiresAt) {
      return NextResponse.json(
        { error: "Verification link is invalid or has expired." },
        { status: 400 }
      );
    }

    // Mark user as verified in DB
    await getDb()
      .update(users)
      .set({ emailVerified: true })
      .where(eq(users.id, entry.userId!));

    console.log(`[email-verify] User ${entry.userId} (${(entry.metadata as any).email}) verified.`);

    // Delete used token
    await getDb()
      .delete(auditEvents)
      .where(eq(auditEvents.id, entry.id));

    // Redirect to login with success message
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/login?verified=true`);
  } catch (error) {
    return safeErrorResponse(error, "Email verification failed.");
  }
}
