import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  );

  // Clear session cookie
  response.cookies.delete(COOKIE_NAME);

  return response;
}
