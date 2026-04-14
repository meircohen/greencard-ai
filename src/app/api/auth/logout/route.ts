import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { COOKIE_NAME } from "@/lib/auth";
import { revokeToken } from "@/lib/session";

export async function POST(request: NextRequest) {
  // Revoke the current token so it can't be reused even if the cookie is replayed
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
      const { payload } = await jwtVerify(token, secret);
      if (payload.jti && payload.exp) {
        await revokeToken(payload.jti, new Date(payload.exp * 1000));
      }
    } catch {
      // Token already invalid, just clear the cookie
    }
  }

  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  );

  response.cookies.delete(COOKIE_NAME);

  return response;
}
