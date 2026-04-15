import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, getGoogleProfile } from "@/lib/google-auth";
import { createJWT, COOKIE_NAME, SESSION_EXPIRY_DAYS } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { rateLimit, AUTH_TIER } from "@/lib/rate-limit";
import { audit, getClientInfo } from "@/lib/audit";

/**
 * GET /api/auth/google/callback
 * Handles Google OAuth callback
 * - Validates state parameter (CSRF protection)
 * - Exchanges authorization code for tokens
 * - Fetches user profile
 * - Creates or signs in user
 * - Sets JWT cookie
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting: 30 attempts per 15 minutes per IP
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = await rateLimit(`google_callback:${clientIp}`, AUTH_TIER.limit, AUTH_TIER.window);
    if (!rl.success) {
      return NextResponse.redirect(
        `/login?error=too_many_requests`
      );
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Handle user rejection or other OAuth errors
    if (error) {
      console.error("Google OAuth error:", error);
      return NextResponse.redirect(
        `/login?error=google_auth_failed`
      );
    }

    // Validate parameters
    if (!code || !state) {
      console.error("Missing code or state in callback");
      return NextResponse.redirect(
        `/login?error=google_auth_failed`
      );
    }

    // Validate CSRF state
    const storedState = request.cookies.get("google_oauth_state")?.value;
    if (!storedState || storedState !== state) {
      console.error("State mismatch - possible CSRF attack");
      const client = getClientInfo(request.headers);
      audit({
        action: "auth.google_csrf_failure",
        ip: client.ip,
        userAgent: client.userAgent,
      });
      return NextResponse.redirect(
        `/login?error=google_auth_failed`
      );
    }

    // Exchange code for tokens
    let tokens;
    try {
      tokens = await exchangeCodeForTokens(code);
    } catch (err) {
      console.error("Token exchange error:", err);
      const client = getClientInfo(request.headers);
      audit({
        action: "auth.google_token_exchange_failed",
        ip: client.ip,
        userAgent: client.userAgent,
      });
      return NextResponse.redirect(
        `/login?error=google_auth_failed`
      );
    }

    // Fetch user profile from Google
    let googleProfile;
    try {
      googleProfile = await getGoogleProfile(tokens.access_token);
    } catch (err) {
      console.error("Profile fetch error:", err);
      const client = getClientInfo(request.headers);
      audit({
        action: "auth.google_profile_fetch_failed",
        ip: client.ip,
        userAgent: client.userAgent,
      });
      return NextResponse.redirect(
        `/login?error=google_auth_failed`
      );
    }

    if (!googleProfile.email) {
      console.error("No email in Google profile");
      return NextResponse.redirect(
        `/login?error=google_auth_failed`
      );
    }

    // Get database connection
    const db = getDb();
    const emailLower = googleProfile.email.toLowerCase();

    // Look up user by email
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, emailLower))
      .limit(1);

    const client = getClientInfo(request.headers);

    if (existingUser) {
      // User exists, sign them in
      audit({
        action: "auth.google_login",
        userId: existingUser.id,
        ip: client.ip,
        userAgent: client.userAgent,
      });

      // Create JWT token
      const token = await createJWT({
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.fullName || existingUser.email.split("@")[0],
        role: existingUser.role as "client" | "attorney" | "admin",
      });

      // Create response
      const response = NextResponse.redirect("/dashboard");

      // Set httpOnly cookie with secure defaults
      response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
        path: "/",
      });

      // Clear OAuth state cookie
      response.cookies.delete("google_oauth_state");

      return response;
    } else {
      // Create new user with Google profile
      const [newUser] = await db
        .insert(users)
        .values({
          email: emailLower,
          fullName: googleProfile.name,
          avatarUrl: googleProfile.picture,
          role: "client", // Default new Google users to client role
          emailVerified: true, // Trust Google's email verification
          locale: googleProfile.locale || "en",
          onboardingCompleted: false,
          passwordHash: null, // OAuth users have no password
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      if (!newUser) {
        console.error("Failed to create user");
        audit({
          action: "auth.google_user_creation_failed",
          ip: client.ip,
          userAgent: client.userAgent,
          metadata: { email: emailLower },
        });
        return NextResponse.redirect(
          `/login?error=google_auth_failed`
        );
      }

      audit({
        action: "auth.google_signup",
        userId: newUser.id,
        ip: client.ip,
        userAgent: client.userAgent,
      });

      // Create JWT token
      const token = await createJWT({
        id: newUser.id,
        email: newUser.email,
        name: newUser.fullName || newUser.email.split("@")[0],
        role: newUser.role as "client" | "attorney" | "admin",
      });

      // Create response - redirect to onboarding or dashboard
      const response = NextResponse.redirect("/dashboard");

      // Set httpOnly cookie with secure defaults
      response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
        path: "/",
      });

      // Clear OAuth state cookie
      response.cookies.delete("google_oauth_state");

      return response;
    }
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(
      `/login?error=google_auth_failed`
    );
  }
}
