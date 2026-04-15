import { NextRequest, NextResponse } from "next/server";

const CSRF_COOKIE_NAME = "gc-csrf";
const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_TOKEN_LENGTH = 32;

/**
 * Double-submit cookie CSRF protection.
 *
 * How it works:
 * 1. Middleware sets a random CSRF token as a non-httpOnly cookie on every response
 * 2. Client JS reads the cookie and sends it back as a header on state-changing requests
 * 3. Middleware compares cookie value to header value; rejects mismatches
 *
 * This works because an attacker on another origin cannot read our cookies
 * (same-origin policy), so they can't set the header correctly.
 */

export function generateCsrfToken(): string {
  // Use Web Crypto API (Edge-compatible) instead of Node crypto
  const bytes = new Uint8Array(CSRF_TOKEN_LENGTH);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function getCsrfTokenFromRequest(request: NextRequest): {
  cookieToken: string | undefined;
  headerToken: string | undefined;
} {
  return {
    cookieToken: request.cookies.get(CSRF_COOKIE_NAME)?.value,
    headerToken: request.headers.get(CSRF_HEADER_NAME) || undefined,
  };
}

export function validateCsrf(request: NextRequest): boolean {
  const { cookieToken, headerToken } = getCsrfTokenFromRequest(request);

  if (!cookieToken || !headerToken) {
    return false;
  }

  // Constant-time comparison to prevent timing attacks
  if (cookieToken.length !== headerToken.length) {
    return false;
  }

  // Edge-compatible constant-time compare
  const encoder = new TextEncoder();
  const a = encoder.encode(cookieToken);
  const b = encoder.encode(headerToken);
  if (a.byteLength !== b.byteLength) return false;
  // Use subtle crypto if available, else fallback to basic XOR compare
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}

export function setCsrfCookie(response: NextResponse, token: string): void {
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Must be readable by JS
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

// Methods that require CSRF validation
const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function requiresCsrfValidation(request: NextRequest): boolean {
  return STATE_CHANGING_METHODS.has(request.method);
}

// Routes exempt from CSRF (they have their own auth mechanisms)
const CSRF_EXEMPT_ROUTES = [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/logout",
  "/api/billing/webhook", // Stripe verifies its own signature
  "/api/contact",         // Public form, rate-limited separately
];

export function isCsrfExempt(pathname: string): boolean {
  return CSRF_EXEMPT_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}
