import { NextRequest, NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/google-auth";
import { rateLimit, AUTH_TIER } from "@/lib/rate-limit";
import { audit, getClientInfo } from "@/lib/audit";

/**
 * GET /api/auth/google
 * Initiates Google OAuth flow by redirecting to Google's consent screen
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting: 30 attempts per 15 minutes per IP
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = await rateLimit(`google_auth:${clientIp}`, AUTH_TIER.limit, AUTH_TIER.window);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(AUTH_TIER.window) },
        }
      );
    }

    // Generate random state for CSRF protection
    const state = Buffer.from(Math.random().toString()).toString("base64");

    // Get OAuth URL
    const authUrl = getGoogleAuthUrl(state);

    // Create response and store state in cookie
    const response = NextResponse.redirect(authUrl);
    response.cookies.set("google_oauth_state", state, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 10 * 60, // 10 minutes
      path: "/",
    });

    const client = getClientInfo(request.headers);
    audit({ action: "auth.google_initiated", ip: client.ip, userAgent: client.userAgent });

    return response;
  } catch (error) {
    console.error("Google OAuth initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate Google login" },
      { status: 500 }
    );
  }
}
