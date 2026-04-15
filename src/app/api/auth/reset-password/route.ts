import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { hashPassword } from "@/lib/auth";
import { sendEmail, passwordResetEmail } from "@/lib/email";
import { revokeAllUserTokens } from "@/lib/session";
import { safeErrorResponse } from "@/lib/errors";
import { rateLimit, PASSWORD_RESET_TIER } from "@/lib/rate-limit";

/**
 * Password reset tokens.
 * Production: store in DB (e.g. password_reset_tokens table with user_id, token_hash, expires_at).
 * Current: in-memory for development.
 */
interface ResetToken {
  userId: string;
  email: string;
  tokenHash: string;
  expiresAt: number;
}

// TODO: Replace with DB table
const resetTokens = new Map<string, ResetToken>();

const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

// Clean expired tokens periodically
function cleanupTokens() {
  const now = Date.now();
  for (const [key, entry] of resetTokens) {
    if (now > entry.expiresAt) {
      resetTokens.delete(key);
    }
  }
}

/**
 * POST /api/auth/reset-password
 *
 * Two modes:
 * 1. Request reset: { email: "user@example.com" }
 *    - Generates token, sends email, returns 200 (always, to prevent enumeration)
 * 2. Complete reset: { token: "...", newPassword: "..." }
 *    - Validates token, updates password, revokes all sessions
 */

const requestSchema = z.object({
  email: z.string().email(),
});

const resetSchema = z.object({
  token: z.string().min(1),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long"),
});

export async function POST(request: NextRequest): Promise<Response> {
  try {
    cleanupTokens();

    // Rate limit: 3 resets per hour per IP
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = await rateLimit(`reset:${clientIp}`, PASSWORD_RESET_TIER.limit, PASSWORD_RESET_TIER.window);
    if (!rl.success) {
      // Still return 200 to prevent enumeration
      return NextResponse.json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    const body = await request.json();

    // Mode 1: Request a reset link
    if (body.email && !body.token) {
      const parsed = requestSchema.safeParse(body);
      if (!parsed.success) {
        // Always return 200 to prevent email enumeration
        return NextResponse.json({
          message: "If that email exists, a reset link has been sent.",
        });
      }

      // TODO: Look up user in DB by email
      // const user = await db.query.users.findFirst({ where: eq(users.email, parsed.data.email) });
      // For now, simulate:
      const mockUserId = "user-lookup-placeholder";

      // Generate a cryptographically secure token
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      resetTokens.set(tokenHash, {
        userId: mockUserId,
        email: parsed.data.email,
        tokenHash,
        expiresAt: Date.now() + RESET_TOKEN_EXPIRY_MS,
      });

      // Build reset URL
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const resetUrl = `${baseUrl}/reset-password?token=${rawToken}`;

      const emailPayload = passwordResetEmail(resetUrl);
      emailPayload.to = parsed.data.email;
      await sendEmail(emailPayload);

      // Always return same response regardless of whether email exists
      return NextResponse.json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    // Mode 2: Complete the reset
    if (body.token && body.newPassword) {
      const parsed = resetSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid request." },
          { status: 400 }
        );
      }

      // Hash the incoming token to look up
      const tokenHash = crypto
        .createHash("sha256")
        .update(parsed.data.token)
        .digest("hex");

      const entry = resetTokens.get(tokenHash);
      if (!entry || Date.now() > entry.expiresAt) {
        return NextResponse.json(
          { error: "Reset link is invalid or has expired." },
          { status: 400 }
        );
      }

      // Hash the new password
      const hashedPassword = await hashPassword(parsed.data.newPassword);

      // TODO: Update password in DB
      // await db.update(users).set({ password: hashedPassword }).where(eq(users.id, entry.userId));
      console.log(
        `[password-reset] Password updated for user ${entry.userId}, hash: ${hashedPassword.slice(0, 10)}...`
      );

      // Revoke all existing sessions for this user
      revokeAllUserTokens(entry.userId);

      // Delete the used token
      resetTokens.delete(tokenHash);

      return NextResponse.json({
        message: "Password has been reset. Please log in with your new password.",
      });
    }

    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  } catch (error) {
    return safeErrorResponse(error, "Password reset failed. Please try again.");
  }
}
