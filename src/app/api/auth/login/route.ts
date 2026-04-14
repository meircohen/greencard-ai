import { NextRequest, NextResponse } from "next/server";
import { createJWT, COOKIE_NAME, SESSION_EXPIRY_DAYS, verifyPassword } from "@/lib/auth";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { rateLimit, AUTH_TIER } from "@/lib/rate-limit";
import { safeErrorResponse } from "@/lib/errors";
import { audit, getClientInfo } from "@/lib/audit";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["client", "attorney"]).optional(),  // Role not needed for login, kept for backward compat
});

export async function POST(request: NextRequest) {
  try {
    // Brute force protection: 5 attempts per 15 minutes per IP
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const rl = rateLimit(`login:${clientIp}`, AUTH_TIER.limit, AUTH_TIER.window);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(AUTH_TIER.window) },
        }
      );
    }

    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const db = getDb();
    const emailLower = email.toLowerCase();

    // Look up user in database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, emailLower))
      .limit(1);

    const client = getClientInfo(request.headers);

    if (!user) {
      audit({ action: "auth.login_failed", ip: client.ip, userAgent: client.userAgent, metadata: { reason: "user_not_found" } });
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password against hashed password in DB
    if (!user.passwordHash) {
      audit({ action: "auth.login_failed", userId: user.id, ip: client.ip, userAgent: client.userAgent, metadata: { reason: "no_password_hash" } });
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      audit({ action: "auth.login_failed", userId: user.id, ip: client.ip, userAgent: client.userAgent, metadata: { reason: "wrong_password" } });
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    audit({ action: "auth.login", userId: user.id, ip: client.ip, userAgent: client.userAgent });

    // Create JWT token
    const token = await createJWT({
      id: user.id,
      email: user.email,
      name: user.fullName || user.email.split("@")[0],
      role: user.role as "client" | "attorney" | "admin",
    });

    // Create response
    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Set httpOnly cookie with secure defaults
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: SESSION_EXPIRY_DAYS * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || "Validation error" },
        { status: 400 }
      );
    }

    return safeErrorResponse(error, "Login failed. Please try again.");
  }
}
