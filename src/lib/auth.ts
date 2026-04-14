import { jwtVerify, SignJWT } from "jose";
import * as bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { generateJti, isTokenRevoked, isUserTokenRevoked } from "./session";

// Types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "client" | "attorney" | "admin";  // Must match DB enum: userRoleEnum
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

// Create JWT token with jti for revocation support
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
    .setJti(generateJti())
    .setIssuedAt()
    .setIssuer("greencard-ai")
    .setAudience("greencard-ai")
    .setExpirationTime(expiresAt)
    .sign(secret);

  return token;
}

// Verify JWT token with revocation checks
export async function verifyJWT(token: string): Promise<AuthUser | null> {
  try {
    const secret = getSecret();
    const verified = await jwtVerify(token, secret, {
      issuer: "greencard-ai",
      audience: "greencard-ai",
    });

    const payload = verified.payload;

    // Check if this specific token has been revoked by jti
    if (payload.jti && await isTokenRevoked(payload.jti)) {
      return null;
    }

    // Check if all tokens for this user were revoked (e.g. password change)
    const userId = payload.id as string;
    const issuedAt = (payload.iat ?? 0) * 1000; // jose uses seconds, we use ms
    if (userId && await isUserTokenRevoked(userId, issuedAt)) {
      return null;
    }

    return {
      id: userId,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as "client" | "attorney" | "admin",
    };
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
