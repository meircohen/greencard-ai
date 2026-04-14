import { NextRequest, NextResponse } from "next/server";
import { createJWT, hashPassword, COOKIE_NAME, SESSION_EXPIRY_DAYS } from "@/lib/auth";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(["immigrant", "attorney"]),
  barNumber: z.string().optional(),
  barState: z.string().optional(),
  firmName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedData = signupSchema.parse(body);

    const db = getDb();
    const emailLower = parsedData.email.toLowerCase();

    // Check if user already exists
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, emailLower))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Validate attorney fields if applicable
    if (parsedData.role === "attorney") {
      if (!parsedData.barNumber || !parsedData.barState) {
        return NextResponse.json(
          { error: "Bar number and state are required for attorneys" },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(parsedData.password);

    // Create user with cryptographically random ID
    const userId = crypto.randomUUID();

    const [newUser] = await db
      .insert(users)
      .values({
        id: userId,
        email: emailLower,
        fullName: parsedData.name,
        passwordHash: hashedPassword,
        role: parsedData.role === "attorney" ? "attorney" : "client",
      })
      .returning({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        role: users.role,
      });

    // Create JWT token
    const token = await createJWT({
      id: newUser.id,
      email: newUser.email,
      name: newUser.fullName || parsedData.name,
      role: newUser.role as "immigrant" | "attorney" | "admin",
    });

    // Create response
    const response = NextResponse.json(
      { user: newUser },
      { status: 201 }
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

    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
