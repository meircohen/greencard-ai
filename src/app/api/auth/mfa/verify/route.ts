import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyMfaCode, verifyBackupCode, isMfaEnabled } from "@/lib/mfa";
import { safeErrorResponse } from "@/lib/errors";

const verifySchema = z.object({
  code: z.string().min(6).max(8),
  type: z.enum(["totp", "backup"]).default("totp"),
});

/**
 * POST /api/auth/mfa/verify
 *
 * Verifies a TOTP code or backup code.
 * Used during:
 * 1. MFA setup completion (first verification enables MFA)
 * 2. Login flow (after password, before session is granted)
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = verifySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid code format." },
        { status: 400 }
      );
    }

    let isValid: boolean;

    if (parsed.data.type === "backup") {
      isValid = await verifyBackupCode(userId, parsed.data.code);
    } else {
      isValid = await verifyMfaCode(userId, parsed.data.code);
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid verification code." },
        { status: 401 }
      );
    }

    const mfaStatus = await isMfaEnabled(userId);

    return NextResponse.json({
      verified: true,
      mfaEnabled: mfaStatus,
      message: mfaStatus
        ? "MFA verification successful."
        : "MFA has been enabled on your account.",
    });
  } catch (error) {
    return safeErrorResponse(error, "MFA verification failed.");
  }
}
