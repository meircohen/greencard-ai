import { describe, it, expect, beforeEach } from "vitest";
import {
  rateLimit,
  resetRateLimit,
  clearRateLimits,
  getRateLimitStats,
  FREE_TIER,
  AUTH_TIER,
} from "@/lib/rate-limit";

describe("Token bucket rate limiter", () => {
  beforeEach(() => {
    clearRateLimits();
  });

  it("allows requests within the limit", () => {
    const result = rateLimit("user-1", 5, 60);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("tracks remaining tokens correctly", () => {
    for (let i = 0; i < 4; i++) {
      const result = rateLimit("user-2", 5, 60);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(4 - i);
    }
  });

  it("blocks requests after limit is exhausted", () => {
    for (let i = 0; i < 5; i++) {
      rateLimit("user-3", 5, 60);
    }
    const blocked = rateLimit("user-3", 5, 60);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("uses separate buckets per identifier", () => {
    for (let i = 0; i < 5; i++) {
      rateLimit("ip-a", 5, 60);
    }
    const resultA = rateLimit("ip-a", 5, 60);
    const resultB = rateLimit("ip-b", 5, 60);
    expect(resultA.success).toBe(false);
    expect(resultB.success).toBe(true);
  });

  it("provides reset timestamp", () => {
    const result = rateLimit("user-4", 10, 120);
    const now = Math.floor(Date.now() / 1000);
    expect(result.reset).toBeGreaterThanOrEqual(now);
    expect(result.reset).toBeLessThanOrEqual(now + 120);
  });

  it("resets a specific identifier", () => {
    for (let i = 0; i < 5; i++) {
      rateLimit("user-5", 5, 60);
    }
    expect(rateLimit("user-5", 5, 60).success).toBe(false);
    resetRateLimit("user-5");
    expect(rateLimit("user-5", 5, 60).success).toBe(true);
  });

  it("clears all buckets", () => {
    rateLimit("a", 1, 60);
    rateLimit("b", 1, 60);
    expect(rateLimit("a", 1, 60).success).toBe(false);
    clearRateLimits();
    expect(rateLimit("a", 1, 60).success).toBe(true);
  });

  it("returns null stats for unknown identifier", () => {
    expect(getRateLimitStats("unknown")).toBeNull();
  });

  it("returns stats for active bucket", () => {
    rateLimit("user-6", 10, 60);
    const stats = getRateLimitStats("user-6");
    expect(stats).not.toBeNull();
    expect(stats!.tokens).toBe(9);
    expect(stats!.lastRefillTime).toBeGreaterThan(0);
  });

  describe("preset tiers", () => {
    it("FREE_TIER allows 10 requests per minute", () => {
      expect(FREE_TIER.limit).toBe(10);
      expect(FREE_TIER.window).toBe(60);
    });

    it("AUTH_TIER allows 5 attempts per 15 minutes", () => {
      expect(AUTH_TIER.limit).toBe(5);
      expect(AUTH_TIER.window).toBe(900);
    });
  });

  it("uses default limit=10, window=60 when no args given", () => {
    const result = rateLimit("default-user");
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(9); // 10 - 1
  });
});
