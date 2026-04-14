import crypto from "crypto";
import { NextResponse } from "next/server";
import { logger } from "./logger";

/**
 * Standard error response that never leaks internal details.
 * Logs the real error server-side with a request ID for debugging.
 */
export function safeErrorResponse(
  error: unknown,
  userMessage: string = "An error occurred. Please try again.",
  status: number = 500
) {
  const requestId = crypto.randomUUID().slice(0, 8);
  logger.error(
    { requestId, err: error instanceof Error ? error : { message: String(error) } },
    userMessage
  );

  return NextResponse.json(
    {
      error: userMessage,
      requestId,
    },
    { status }
  );
}
