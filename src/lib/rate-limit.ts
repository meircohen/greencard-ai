import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

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
 * Used as fallback when Redis is not configured.
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

/**
 * Redis-backed rate limiter using Upstash.
 * Uses sliding window algorithm via Upstash Ratelimit.
 */
class RedisRateLimiter {
  private rateLimiters: Map<string, Ratelimit> = new Map();

  private getRateLimiter(tokens: number, window: number): Ratelimit {
    const key = `${tokens}-${window}`;
    if (!this.rateLimiters.has(key)) {
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      });

      this.rateLimiters.set(
        key,
        new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(tokens, `${window}s`),
          analytics: true,
          prefix: "rl",
        })
      );
    }

    return this.rateLimiters.get(key)!;
  }

  async check(
    identifier: string,
    limit: number = 10,
    window: number = 60
  ): Promise<RateLimitResult> {
    try {
      const limiter = this.getRateLimiter(limit, window);
      const result = await limiter.limit(identifier);

      // result.reset is already a Unix timestamp in milliseconds
      const resetSeconds = Math.floor(result.reset / 1000);

      return {
        success: result.success,
        remaining: Math.max(0, result.remaining),
        reset: resetSeconds,
      };
    } catch (error) {
      console.error("Redis rate limiter error:", error);
      // Fallback to in-memory on Redis error
      return inMemoryFallback.check(identifier, limit, window);
    }
  }

  async reset(identifier: string): Promise<void> {
    // No-op: Redis handles TTL automatically
  }

  async clear(): Promise<void> {
    // No-op: Redis handles TTL automatically
  }

  async getStats(
    identifier: string
  ): Promise<TokenBucket | null> {
    // Not implemented for Redis mode
    return null;
  }
}

// Initialize fallback in-memory limiter
const inMemoryFallback = new InMemoryRateLimiter();

// Determine which limiter to use
const useRedis =
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN;
const redisLimiter = useRedis ? new RedisRateLimiter() : null;

/**
 * Rate limit check using sliding window algorithm.
 * Uses Upstash Redis if configured, falls back to in-memory for local development.
 * @param identifier - Unique identifier (user ID, IP, API key, etc.)
 * @param limit - Maximum requests per window (default: 10)
 * @param window - Time window in seconds (default: 60)
 */
export async function rateLimit(
  identifier: string,
  limit: number = 10,
  window: number = 60
): Promise<RateLimitResult> {
  if (redisLimiter) {
    return redisLimiter.check(identifier, limit, window);
  }
  return inMemoryFallback.check(identifier, limit, window);
}

/**
 * Reset rate limit for an identifier.
 * Note: For Redis mode, this is a no-op as Redis handles TTL automatically.
 */
export async function resetRateLimit(identifier: string): Promise<void> {
  if (redisLimiter) {
    return redisLimiter.reset(identifier);
  }
  inMemoryFallback.reset(identifier);
}

/**
 * Clear all rate limits.
 * Note: For Redis mode, this is a no-op as Redis handles TTL automatically.
 */
export async function clearRateLimits(): Promise<void> {
  if (redisLimiter) {
    return redisLimiter.clear();
  }
  inMemoryFallback.clear();
}

/**
 * Get rate limit statistics.
 * Note: Only works for in-memory mode; returns null for Redis.
 */
export async function getRateLimitStats(
  identifier: string
): Promise<TokenBucket | null> {
  if (redisLimiter) {
    return redisLimiter.getStats(identifier);
  }
  return inMemoryFallback.getStats(identifier);
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
