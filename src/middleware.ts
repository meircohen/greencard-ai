import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  generateCsrfToken,
  validateCsrf,
  setCsrfCookie,
  requiresCsrfValidation,
  isCsrfExempt,
} from "@/lib/csrf";

// Public page routes (no auth required)
const publicPageRoutes = [
  "/",
  "/login",
  "/signup",
  "/chat",
  "/assessment",
  "/visa-bulletin",
  "/cost-calculator",
  "/pricing",
  "/attorneys",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/blog",
  "/rfe-decoder",
  "/forms/i-485",
  "/interview-prep",
  "/guides",
  "/public-charge",
  "/referral",
  "/reset-password",
  "/tracker",
];

// Public API routes (no auth required)
const publicApiRoutes = [
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/logout",
  "/api/data/visa-bulletin",
  "/api/data/processing-times",
  "/api/data/fees",
  "/api/data/cost-calculator",
  "/api/contact",
  "/api/billing/webhook", // Stripe webhooks verify their own signature
  "/api/chat",            // Chat OPTIONS endpoint for health check
  "/api/health",          // Health check endpoint
  "/api/assess",          // Assessment endpoint (public)
  "/api/rfe-decoder",     // RFE decoder endpoint (public)
];

/**
 * Apply security headers to response
 */
function addSecurityHeaders(response: NextResponse): void {
  // Content Security Policy
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' cdnjs.cloudflare.com cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' cdnjs.cloudflare.com cdn.jsdelivr.net fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: cdnjs.cloudflare.com cdn.jsdelivr.net fonts.gstatic.com",
    "connect-src 'self' https://api.anthropic.com https://api.stripe.com https://wa.me wss:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join("; ");

  response.headers.set("Content-Security-Policy", cspDirectives);

  // Additional security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=(self)"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("X-DNS-Prefetch-Control", "on");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if API route
  if (pathname.startsWith("/api")) {
    // Allow public API routes
    const isPublicApi = publicApiRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    // For public API routes that are GET/OPTIONS, pass through
    if (isPublicApi && (request.method === "GET" || request.method === "OPTIONS" || request.method === "HEAD")) {
      const response = NextResponse.next();
      addSecurityHeaders(response);
      return response;
    }

    // For public API POST routes (login, signup, contact, webhook), skip auth but still set CSRF
    if (isPublicApi) {
      const response = NextResponse.next();
      // Set CSRF cookie if not present
      if (!request.cookies.get("gc-csrf")?.value) {
        setCsrfCookie(response, generateCsrfToken());
      }
      addSecurityHeaders(response);
      return response;
    }

    // All other API routes require authentication
    const session = await getSession(request);
    if (!session) {
      const response = NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
      addSecurityHeaders(response);
      return response;
    }

    // CSRF validation for state-changing requests on authenticated routes
    if (requiresCsrfValidation(request) && !isCsrfExempt(pathname)) {
      if (!validateCsrf(request)) {
        const response = NextResponse.json(
          { error: "Invalid or missing CSRF token" },
          { status: 403 }
        );
        addSecurityHeaders(response);
        return response;
      }
    }

    // Pass user info via headers (ID only, not email/PII)
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", session.user.id);
    requestHeaders.set("x-user-role", session.user.role);

    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    // Ensure CSRF cookie is always set for authenticated users
    if (!request.cookies.get("gc-csrf")?.value) {
      setCsrfCookie(response, generateCsrfToken());
    }

    addSecurityHeaders(response);
    return response;
  }

  // Check if page route is public
  const isPublicPage = publicPageRoutes.some((route) => {
    return pathname === route || pathname.startsWith(route + "/");
  });

  if (isPublicPage) {
    const response = NextResponse.next();
    // Set CSRF cookie on page loads so JS can read it
    if (!request.cookies.get("gc-csrf")?.value) {
      setCsrfCookie(response, generateCsrfToken());
    }
    addSecurityHeaders(response);
    return response;
  }

  // All other page routes require authentication
  const session = await getSession(request);

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    const response = NextResponse.redirect(url);
    addSecurityHeaders(response);
    return response;
  }

  // Pass non-PII user info for server components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-id", session.user.id);
  requestHeaders.set("x-user-role", session.user.role);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (!request.cookies.get("gc-csrf")?.value) {
    setCsrfCookie(response, generateCsrfToken());
  }

  addSecurityHeaders(response);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
