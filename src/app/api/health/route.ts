import { NextRequest, NextResponse } from "next/server";

/**
 * Health check endpoint for monitoring and load balancers.
 * Returns service status, uptime, and dependency checks.
 */

const startTime = Date.now();

export async function GET(request: NextRequest): Promise<Response> {
  const uptime = Math.floor((Date.now() - startTime) / 1000);

  const checks: Record<string, { status: "ok" | "degraded" | "down"; latencyMs?: number }> = {};

  // Check Anthropic API key is configured
  checks.anthropic = {
    status: process.env.ANTHROPIC_API_KEY ? "ok" : "down",
  };

  // Check DB connection string is configured
  checks.database = {
    status: process.env.DATABASE_URL ? "ok" : "down",
  };

  // Check Stripe key
  checks.stripe = {
    status: process.env.STRIPE_SECRET_KEY ? "ok" : "down",
  };

  const allOk = Object.values(checks).every((c) => c.status === "ok");
  const anyDown = Object.values(checks).some((c) => c.status === "down");

  return NextResponse.json(
    {
      status: anyDown ? "degraded" : "healthy",
      uptime,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "0.1.0",
      checks,
    },
    { status: allOk ? 200 : 503 }
  );
}
