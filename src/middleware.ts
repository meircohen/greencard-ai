import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

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
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if API route
  if (pathname.startsWith("/api")) {
    // Allow public API routes
    const isPublicApi = publicApiRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (isPublicApi) {
      return NextResponse.next();
    }

    // All other API routes require authentication
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Pass user info via headers (ID only, not email/PII)
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", session.user.id);
    requestHeaders.set("x-user-role", session.user.role);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // Check if page route is public
  const isPublicPage = publicPageRoutes.some((route) => {
    return pathname === route || pathname.startsWith(route + "/");
  });

  if (isPublicPage) {
    return NextResponse.next();
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

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
