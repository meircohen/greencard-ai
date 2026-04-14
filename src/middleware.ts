import { NextRequest, NextResponse } from "next/server";
import { getSession, COOKIE_NAME } from "@/lib/auth";

// Public routes that don't require authentication
const publicRoutes = [
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
  "/api",
];

// Protected routes that require authentication
const protectedRoutes = ["/dashboard", "/documents", "/cases"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is an API route
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Check if route is public
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === "/api") return pathname.startsWith("/api");
    return pathname === route || pathname.startsWith(route + "/");
  });

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtectedRoute) {
    // Verify session
    const session = await getSession(request);

    if (!session) {
      // Redirect to login
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }

    // Add user info to headers for server components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", session.user.id);
    requestHeaders.set("x-user-email", session.user.email);
    requestHeaders.set("x-user-role", session.user.role);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
