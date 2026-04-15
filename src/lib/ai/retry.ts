import { logger } from "@/lib/logger";

/**
 * Retry wrapper for Anthropic API calls with exponential backoff.
 * Handles transient errors (rate limits, server errors) gracefully.
 */

interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
};

function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    // Rate limit or overloaded
    if (msg.includes("rate_limit") || msg.includes("overloaded") || msg.includes("529")) return true;
    // Server errors
    if (msg.includes("500") || msg.includes("502") || msg.includes("503")) return true;
    // Network errors
    if (msg.includes("econnreset") || msg.includes("timeout") || msg.includes("fetch failed")) return true;
  }
  // Check for status code on error objects
  const statusCode = (error as { status?: number })?.status;
  if (statusCode && (statusCode === 429 || statusCode === 529 || statusCode >= 500)) return true;
  return false;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt >= opts.maxRetries || !isRetryableError(error)) {
        throw error;
      }

      const delay = Math.min(
        opts.baseDelayMs * Math.pow(2, attempt) + Math.random() * 500,
        opts.maxDelayMs
      );

      logger.warn(
        { attempt: attempt + 1, maxRetries: opts.maxRetries, delayMs: Math.round(delay) },
        "Retrying AI API call after transient error"
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
