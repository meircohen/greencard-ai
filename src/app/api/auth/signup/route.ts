import { NextRequest, NextResponse } from "next/server";
import { createJWT, hashPassword, COOKIE_NAME, SESSION_EXPIRY_DAYS } from "@/lib/auth";
import { z } from "zod";

// Mock user store (replace with DB in production)
const mockUsers = new Map<
  string,
  {
    id: string;
    email: string;
    name: string;
    hashedPassword: string;
    role: "immigrant" | "attorney";
    barNumber?: string;
    barState?: string;
    firmName?: string;
  }
>();

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["immigrant", "attorney"]),
  barNumber: z.string().optional(),
  barState: z.string().optional(),
  firmName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsedData = signupSchema.parse(body);

    const emailLower = parsedData.email.toLowerCase();

    // Check if user already exists
    if (mockUsers.has(emailLower)) {
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

    // Create user
    const userId = `user-${Date.now()}`;
    const newUser = {
      id: userId,
      email: emailLower,
      name: parsedData.name,
      hashedPassword,
      role: parsedData.role as "immigrant" | "attorney",
      barNumber: parsedData.barNumber,
      barState: parsedData.barState,
      firmName: parsedData.firmName,
    };

    mockUsers.set(emailLower, newUser);

    // Create JWT token
    const token = await createJWT({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    // Create response
    const response = NextResponse.json(
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      },
      { status: 201 }
    );

    // Set httpOnly cookie
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
