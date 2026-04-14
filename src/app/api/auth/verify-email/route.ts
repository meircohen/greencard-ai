import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { safeErrorResponse } from "@/lib/errors";

/**
 * Email verification tokens.
 * Production: store in DB (email_verification_tokens table).
 * Current: in-memory for development.
 */
interface VerificationToken {
  userId: string;
  email: string;
  tokenHash: string;
  expiresAt: number;
}

// TODO: Replace with DB table
export const verificationTokens = new Map<string, VerificationToken>();

const VERIFY_TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Store a verification token (called from signup route).
 */
export function createVerificationToken(userId: string, email: string): string {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  verificationTokens.set(tokenHash, {
    userId,
    email,
    tokenHash,
    expiresAt: Date.now() + VERIFY_TOKEN_EXPIRY_MS,
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
    const entry = verificationTokens.get(tokenHash);

    if (!entry || Date.now() > entry.expiresAt) {
      return NextResponse.json(
        { error: "Verification link is invalid or has expired." },
        { status: 400 }
      );
    }

    // TODO: Mark user as verified in DB
    // await db.update(users).set({ emailVerified: true }).where(eq(users.id, entry.userId));
    console.log(`[email-verify] User ${entry.userId} (${entry.email}) verified.`);

    // Delete used token
    verificationTokens.delete(tokenHash);

    // Redirect to login with success message
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/login?verified=true`);
  } catch (error) {
    return safeErrorResponse(error, "Email verification failed.");
  }
}
