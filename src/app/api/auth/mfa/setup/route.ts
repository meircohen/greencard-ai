import { NextRequest, NextResponse } from "next/server";
import { generateMfaSetup, isMfaEnabled } from "@/lib/mfa";
import { safeErrorResponse } from "@/lib/errors";

/**
 * POST /api/auth/mfa/setup
 *
 * Initiates MFA setup for the authenticated user.
 * Returns a QR code data URL and backup codes.
 * User must then verify with a TOTP code to complete setup.
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const userId = request.headers.get("x-user-id");
    const userEmail = request.headers.get("x-user-email");

    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    if (await isMfaEnabled(userId)) {
      return NextResponse.json(
        { error: "MFA is already enabled. Disable it first to reconfigure." },
        { status: 400 }
      );
    }

    const { qrCodeDataUrl, backupCodes } = await generateMfaSetup(
      userId,
      userEmail
    );

    return NextResponse.json({
      qrCode: qrCodeDataUrl,
      backupCodes,
      message:
        "Scan the QR code with your authenticator app, then verify with a code to complete setup.",
    });
  } catch (error) {
    return safeErrorResponse(error, "MFA setup failed.");
  }
}
