import { jwtVerify, SignJWT } from "jose";
import * as bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

// Types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "immigrant" | "attorney" | "admin";
}

export interface Session {
  user: AuthUser;
  expires: string;
}

// Constants
export const COOKIE_NAME = "greencard-session";
export const SESSION_EXPIRY_DAYS = 7;

// Get the JWT secret - MUST be set via environment variable
const getSecret = (): Uint8Array => {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error(
      "NEXTAUTH_SECRET environment variable is required. " +
      "Generate one with: openssl rand -base64 32"
    );
  }
  return new TextEncoder().encode(secret);
};

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Create JWT token
export async function createJWT(user: AuthUser): Promise<string> {
  const secret = getSecret();
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  const token = await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresAt)
    .sign(secret);

  return token;
}

// Verify JWT token
export async function verifyJWT(token: string): Promise<AuthUser | null> {
  try {
    const secret = getSecret();
    const verified = await jwtVerify(token, secret);
    return verified.payload as unknown as AuthUser;
  } catch {
    return null;
  }
}

// Create session (returns token and session data)
export async function createSession(user: AuthUser): Promise<Session> {
  const token = await createJWT(user);
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  return {
    user,
    expires: expiresAt.toISOString(),
  };
}

// Get session from request
export async function getSession(request: NextRequest): Promise<Session | null> {
  try {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const user = await verifyJWT(token);

    if (!user) {
      return null;
    }

    const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

    return {
      user,
      expires: expiresAt.toISOString(),
    };
  } catch {
    return null;
  }
}
