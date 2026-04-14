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
];

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
      return NextResponse.next();
    }

    // For public API POST routes (login, signup, contact, webhook), skip auth but still set CSRF
    if (isPublicApi) {
      const response = NextResponse.next();
      // Set CSRF cookie if not present
      if (!request.cookies.get("gc-csrf")?.value) {
        setCsrfCookie(response, generateCsrfToken());
      }
      return response;
    }

    // All other API routes require authentication
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // CSRF validation for state-changing requests on authenticated routes
    if (requiresCsrfValidation(request) && !isCsrfExempt(pathname)) {
      if (!validateCsrf(request)) {
        return NextResponse.json(
          { error: "Invalid or missing CSRF token" },
          { status: 403 }
        );
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
    return response;
  }

  // All other page routes require authentication
  const session = await getSession(request);

  if (!session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
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

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
