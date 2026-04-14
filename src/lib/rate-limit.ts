interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

interface TokenBucket {
  tokens: number;
  lastRefillTime: number;
}

/**
 * In-memory token bucket implementation for rate limiting.
 * Designed for development; production should use Cloudflare KV.
 */
class InMemoryRateLimiter {
  private buckets: Map<string, TokenBucket> = new Map();

  /**
   * Check if request is within rate limit.
   * @param identifier - Unique identifier (user ID, IP, API key, etc.)
   * @param limit - Maximum requests per window (default: 10)
   * @param window - Time window in seconds (default: 60)
   */
  check(
    identifier: string,
    limit: number = 10,
    window: number = 60
  ): RateLimitResult {
    const now = Date.now();
    const bucket = this.buckets.get(identifier);

    // Initialize bucket if it doesn't exist
    if (!bucket) {
      this.buckets.set(identifier, {
        tokens: limit - 1,
        lastRefillTime: now,
      });

      return {
        success: true,
        remaining: limit - 1,
        reset: Math.floor(now / 1000) + window,
      };
    }

    // Calculate elapsed time and refill tokens
    const elapsedSeconds = (now - bucket.lastRefillTime) / 1000;
    const tokensToAdd = (elapsedSeconds / window) * limit;

    // Update bucket
    bucket.tokens = Math.min(limit, bucket.tokens + tokensToAdd);
    bucket.lastRefillTime = now;

    // Check if request is allowed
    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return {
        success: true,
        remaining: Math.floor(bucket.tokens),
        reset: Math.floor(now / 1000) + window,
      };
    }

    return {
      success: false,
      remaining: 0,
      reset: Math.floor(now / 1000) + window,
    };
  }

  /**
   * Reset rate limit for an identifier.
   */
  reset(identifier: string): void {
    this.buckets.delete(identifier);
  }

  /**
   * Clear all buckets.
   */
  clear(): void {
    this.buckets.clear();
  }

  /**
   * Get bucket statistics for debugging.
   */
  getStats(identifier: string): TokenBucket | null {
    return this.buckets.get(identifier) || null;
  }
}

// Singleton instance
const limiter = new InMemoryRateLimiter();

/**
 * Rate limit check using token bucket algorithm.
 * @param identifier - Unique identifier (user ID, IP, API key, etc.)
 * @param limit - Maximum requests per window (default: 10)
 * @param window - Time window in seconds (default: 60)
 */
export function rateLimit(
  identifier: string,
  limit?: number,
  window?: number
): RateLimitResult {
  return limiter.check(identifier, limit, window);
}

/**
 * Reset rate limit for an identifier.
 */
export function resetRateLimit(identifier: string): void {
  limiter.reset(identifier);
}

/**
 * Clear all rate limits.
 */
export function clearRateLimits(): void {
  limiter.clear();
}

/**
 * Get rate limit statistics.
 */
export function getRateLimitStats(identifier: string): TokenBucket | null {
  return limiter.getStats(identifier);
}

// Rate limit presets
export const FREE_TIER = {
  limit: 10,
  window: 60, // 10 requests per minute
};

export const PAID_TIER = {
  limit: 60,
  window: 60, // 60 requests per minute
};

export const API_TIER = {
  limit: 120,
  window: 60, // 120 requests per minute
};

/** Auth endpoints: 5 attempts per 15 minutes (brute force protection) */
export const AUTH_TIER = {
  limit: 5,
  window: 900, // 15 minutes
};

/** Password reset: 3 requests per hour */
export const PASSWORD_RESET_TIER = {
  limit: 3,
  window: 3600, // 1 hour
};

/** File upload: 10 per 5 minutes */
export const UPLOAD_TIER = {
  limit: 10,
  window: 300, // 5 minutes
};

/** Chat/AI: 30 requests per minute */
export const CHAT_TIER = {
  limit: 30,
  window: 60,
};
