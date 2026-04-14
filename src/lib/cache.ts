interface CacheEntry<T> {
  value: T;
  expiresAt: number | null;
}

/**
 * Simple LRU (Least Recently Used) in-memory cache for development.
 * Designed to match Cloudflare KV API for easy migration.
 * Production should use Cloudflare KV.
 */
class LRUCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  /**
   * Get a value from cache.
   * Returns null if key doesn't exist or has expired.
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.value as T;
  }

  /**
   * Set a value in cache with optional TTL (in seconds).
   */
  set(key: string, value: any, ttl?: number): void {
    // Remove if exists (to update position)
    this.cache.delete(key);

    const entry: CacheEntry<any> = {
      value,
      expiresAt: ttl ? Date.now() + ttl * 1000 : null,
    };

    this.cache.set(key, entry);

    // Evict oldest entry if over maxSize
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
  }

  /**
   * Delete a value from cache.
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size (number of entries).
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Check if key exists and hasn't expired.
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (entry.expiresAt && entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }
}

// Singleton instance
const cache = new LRUCache();

/**
 * Get value from cache.
 */
export function cacheGet<T>(key: string): T | null {
  return cache.get<T>(key);
}

/**
 * Set value in cache with optional TTL (in seconds).
 */
export function cacheSet(key: string, value: any, ttl?: number): void {
  cache.set(key, value, ttl);
}

/**
 * Delete value from cache.
 */
export function cacheDelete(key: string): void {
  cache.delete(key);
}

/**
 * Clear all cache entries.
 */
export function cacheClear(): void {
  cache.clear();
}

/**
 * Check if key exists in cache.
 */
export function cacheHas(key: string): boolean {
  return cache.has(key);
}

/**
 * Get cache size.
 */
export function getCacheSize(): number {
  return cache.size();
}

// Cache key constants
export const CACHE_KEYS = {
  VISA_BULLETIN: "visa_bulletin",
  PROCESSING_TIMES: "processing_times",
  FORM_FEES: "form_fees",
  APPROVAL_RATES: "approval_rates",
  JUDGE_STATS: "judge_stats",
  POVERTY_GUIDELINES: "poverty_guidelines",
} as const;

// Default TTL values (in seconds)
export const CACHE_TTL = {
  VISA_BULLETIN: 24 * 60 * 60, // 24 hours
  PROCESSING_TIMES: 24 * 60 * 60, // 24 hours
  FORM_FEES: 7 * 24 * 60 * 60, // 7 days
  APPROVAL_RATES: 7 * 24 * 60 * 60, // 7 days
  JUDGE_STATS: 7 * 24 * 60 * 60, // 7 days
  POVERTY_GUIDELINES: 30 * 24 * 60 * 60, // 30 days
} as const;
