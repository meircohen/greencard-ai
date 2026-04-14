import { NextRequest, NextResponse } from "next/server";
import { createJWT, COOKIE_NAME, SESSION_EXPIRY_DAYS, verifyPassword } from "@/lib/auth";
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
  }
>();

// Initialize with demo user
mockUsers.set("demo@example.com", {
  id: "user-1",
  email: "demo@example.com",
  name: "John Doe",
  hashedPassword: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVG", // 'demo123' hashed
  role: "immigrant",
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["immigrant", "attorney"]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role } = loginSchema.parse(body);

    // For demo: accept 'demo123' password for any user, or check mock store
    let user = mockUsers.get(email.toLowerCase());

    if (!user) {
      // Create user on first login with demo password
      if (password === "demo123") {
        const newUser = {
          id: `user-${Date.now()}`,
          email: email.toLowerCase(),
          name: email.split("@")[0],
          hashedPassword: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/TVG",
          role: role as "immigrant" | "attorney",
        };
        mockUsers.set(email.toLowerCase(), newUser);
        user = newUser;
      } else {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }
    } else {
      // Verify password for existing user
      const isValidPassword = await verifyPassword(
        password,
        user.hashedPassword
      );

      if (!isValidPassword && password !== "demo123") {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }
    }

    // Create JWT token
    const token = await createJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Create response
    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
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

    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
