// Dynamic imports for DB to avoid pulling drizzle-orm into Edge middleware bundle
// Node crypto replaced with Web Crypto API for Edge compatibility

/**
 * JWT session denylist for token revocation.
 *
 * Uses DB-backed storage (revoked_tokens and user_revocations tables)
 * when DATABASE_URL is available, with in-memory fallback for dev.
 */

// In-memory fallback for dev environments without DB
const memDenylist = new Map<string, { revokedAt: number; expiresAt: number }>();
const memUserRevocations = new Map<string, number>();

function useDb(): boolean {
  return !!process.env.DATABASE_URL;
}

export function generateJti(): string {
  return globalThis.crypto.randomUUID();
}

/**
 * Revoke a specific token by its jti.
 */
export async function revokeToken(jti: string, tokenExpiresAt: Date): Promise<void> {
  if (useDb()) {
    const { getDb } = await import("./db");
    const { revokedTokens } = await import("./db/schema");
    const db = getDb();
    await db.insert(revokedTokens).values({
      jti,
      expiresAt: tokenExpiresAt,
    }).onConflictDoNothing();
  } else {
    memDenylist.set(jti, { revokedAt: Date.now(), expiresAt: tokenExpiresAt.getTime() });
  }
}

/**
 * Revoke all tokens for a user issued before now.
 */
export async function revokeAllUserTokens(userId: string): Promise<void> {
  if (useDb()) {
    const { getDb } = await import("./db");
    const { userRevocations: userRevocationsTable } = await import("./db/schema");
    const { eq: _eq } = await import("drizzle-orm");
    const db = getDb();
    await db
      .insert(userRevocationsTable)
      .values({ userId })
      .onConflictDoUpdate({
        target: userRevocationsTable.userId,
        set: { revokedAt: new Date() },
      });
  } else {
    memUserRevocations.set(userId, Date.now());
  }
}

/**
 * Check if a specific token has been revoked.
 */
export async function isTokenRevoked(jti: string): Promise<boolean> {
  if (useDb()) {
    const { getDb } = await import("./db");
    const { revokedTokens } = await import("./db/schema");
    const { eq } = await import("drizzle-orm");
    const db = getDb();
    const [row] = await db.select({ jti: revokedTokens.jti }).from(revokedTokens).where(eq(revokedTokens.jti, jti)).limit(1);
    return !!row;
  }
  return memDenylist.has(jti);
}

/**
 * Check if a token was issued before the user's last revocation.
 */
export async function isUserTokenRevoked(userId: string, issuedAt: number): Promise<boolean> {
  if (useDb()) {
    const { getDb } = await import("./db");
    const { userRevocations: userRevocationsTable } = await import("./db/schema");
    const { eq } = await import("drizzle-orm");
    const db = getDb();
    const [row] = await db.select({ revokedAt: userRevocationsTable.revokedAt }).from(userRevocationsTable).where(eq(userRevocationsTable.userId, userId)).limit(1);
    if (!row) return false;
    return issuedAt < row.revokedAt.getTime();
  }
  const revokedAt = memUserRevocations.get(userId);
  if (!revokedAt) return false;
  return issuedAt < revokedAt;
}
