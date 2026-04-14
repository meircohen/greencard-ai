import crypto from "crypto";

/**
 * JWT session denylist for token revocation.
 *
 * Current: in-memory Map (sufficient for single-instance dev/staging).
 * Production: replace with Redis SET + TTL or Postgres table.
 *
 * The denylist stores jti (JWT ID) values of revoked tokens.
 * On every authenticated request, middleware checks if the token's jti
 * is in the denylist. If so, the request is rejected as unauthorized.
 */

interface DenylistEntry {
  revokedAt: number;
  expiresAt: number; // When the original token expires (cleanup after this)
}

// TODO: Replace with Redis or Postgres in production
const denylist = new Map<string, DenylistEntry>();

// Cleanup expired entries every 10 minutes
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpired() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;

  for (const [jti, entry] of denylist) {
    if (now > entry.expiresAt) {
      denylist.delete(jti);
    }
  }
  lastCleanup = now;
}

/**
 * Generate a unique JWT ID for new tokens.
 */
export function generateJti(): string {
  return crypto.randomUUID();
}

/**
 * Revoke a specific token by its jti.
 * @param jti - The JWT ID to revoke
 * @param tokenExpiresAt - When the token naturally expires (for cleanup)
 */
export function revokeToken(jti: string, tokenExpiresAt: Date): void {
  denylist.set(jti, {
    revokedAt: Date.now(),
    expiresAt: tokenExpiresAt.getTime(),
  });
}

/**
 * Revoke all tokens for a user by storing their user ID with a timestamp.
 * Any token issued before this timestamp is considered revoked.
 */
const userRevocations = new Map<string, number>();

export function revokeAllUserTokens(userId: string): void {
  userRevocations.set(userId, Date.now());
}

/**
 * Check if a specific token has been revoked.
 */
export function isTokenRevoked(jti: string): boolean {
  cleanupExpired();
  return denylist.has(jti);
}

/**
 * Check if a token was issued before the user's last revocation.
 * @param userId - The user ID
 * @param issuedAt - When the token was issued (in ms)
 */
export function isUserTokenRevoked(userId: string, issuedAt: number): boolean {
  const revokedAt = userRevocations.get(userId);
  if (!revokedAt) return false;
  return issuedAt < revokedAt;
}
