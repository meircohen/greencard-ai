import pino from "pino";

/**
 * Structured logger using pino.
 *
 * Features:
 * - JSON output in production (machine-parseable for log aggregation)
 * - Pretty output in development
 * - PII redaction on sensitive fields
 * - Request context (requestId, userId) via child loggers
 *
 * Usage:
 *   import { logger } from "@/lib/logger";
 *   logger.info({ userId, action: "login" }, "User logged in");
 *
 *   // Per-request child logger
 *   const log = logger.child({ requestId: "abc123", userId: "user-1" });
 *   log.info("Processing case submission");
 */

const isDev = process.env.NODE_ENV !== "production";

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),

  // Redact PII from logs
  redact: {
    paths: [
      "email",
      "password",
      "passwordHash",
      "ssn",
      "socialSecurityNumber",
      "dateOfBirth",
      "dob",
      "passportNumber",
      "alienNumber",
      "req.headers.authorization",
      "req.headers.cookie",
      "*.email",
      "*.password",
      "*.ssn",
      "*.passportNumber",
    ],
    censor: "[REDACTED]",
  },

  // Pretty print in development
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:HH:MM:ss",
          ignore: "pid,hostname",
        },
      }
    : undefined,

  // Base fields included in every log line
  base: {
    service: "greencard-ai",
    env: process.env.NODE_ENV || "development",
  },

  // Timestamp format
  timestamp: pino.stdTimeFunctions.isoTime,
});

/**
 * Create a request-scoped child logger.
 * Use in API routes for correlated logging.
 */
export function createRequestLogger(requestId: string, userId?: string) {
  return logger.child({
    requestId,
    ...(userId ? { userId } : {}),
  });
}

export default logger;
