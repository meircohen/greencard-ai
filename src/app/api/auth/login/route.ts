import { NextRequest, NextResponse } from "next/server";
import { createJWT, COOKIE_NAME, SESSION_EXPIRY_DAYS, verifyPassword } from "@/lib/auth";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["immigrant", "attorney"]),
});

export async function POST(request: NextRequest) {
  try {
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

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password against hashed password in DB
    if (!user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = await createJWT({
      id: user.id,
      email: user.email,
      name: user.fullName || user.email.split("@")[0],
      role: user.role as "immigrant" | "attorney" | "admin",
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

    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
