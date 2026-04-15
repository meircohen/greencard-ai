import { NextRequest, NextResponse } from "next/server";
import { createJWT, hashPassword, COOKIE_NAME, SESSION_EXPIRY_DAYS } from "@/lib/auth";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { createVerificationToken } from "@/app/api/auth/verify-email/route";
import { sendEmail, emailVerificationEmail, welcomeEmail } from "@/lib/email";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(["client", "attorney"]),
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
        role: parsedData.role,  // Already validated as "client" | "attorney" by Zod
      })
      .returning({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        role: users.role,
      });

    // Send verification email
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const rawToken = await createVerificationToken(newUser.id, newUser.email);
    const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${rawToken}`;
    const emailPayload = emailVerificationEmail(verifyUrl);
    emailPayload.to = newUser.email;
    await sendEmail(emailPayload);

    // Send welcome email (non-blocking)
    const welcomeEmailPayload = welcomeEmail(newUser.fullName || parsedData.name);
    welcomeEmailPayload.to = newUser.email;
    sendEmail(welcomeEmailPayload).catch(err => console.error("Welcome email failed:", err));

    // Create JWT token (user can use the app, but some features may require verification)
    const token = await createJWT({
      id: newUser.id,
      email: newUser.email,
      name: newUser.fullName || parsedData.name,
      role: newUser.role as "client" | "attorney" | "admin",
    });

    // Create response
    const response = NextResponse.json(
      { user: newUser, message: "Account created. Please check your email to verify your address." },
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
