import { logger } from "./logger";

/**
 * Audit trail for security-sensitive and compliance-relevant events.
 *
 * Emits structured log entries that can be ingested by SIEM tools
 * (Datadog, Splunk, AWS CloudWatch, etc.) for monitoring and compliance.
 *
 * Production: also write to a dedicated audit_events DB table for
 * queryable history and regulatory compliance (SOC 2, etc.).
 */

export type AuditAction =
  | "auth.login"
  | "auth.login_failed"
  | "auth.signup"
  | "auth.logout"
  | "auth.password_reset_request"
  | "auth.password_reset_complete"
  | "auth.email_verified"
  | "auth.mfa_setup"
  | "auth.mfa_verified"
  | "auth.mfa_failed"
  | "auth.token_revoked"
  | "case.created"
  | "case.updated"
  | "case.status_changed"
  | "case.deleted"
  | "case.viewed"
  | "document.uploaded"
  | "document.reviewed"
  | "document.deleted"
  | "ai.chat"
  | "ai.assessment"
  | "ai.form_fill"
  | "ai.interview_prep"
  | "ai.prompt_injection_attempt"
  | "admin.user_role_changed"
  | "admin.case_reassigned"
  | "billing.checkout_started"
  | "billing.payment_received"
  | "billing.subscription_created"
  | "billing.subscription_updated"
  | "billing.subscription_canceled"
  | "billing.payment_failed"
  | "rate_limit.exceeded"
  | "pii.detected_and_redacted";

export interface AuditEntry {
  action: AuditAction;
  userId?: string;
  targetId?: string; // e.g. case ID, document ID
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

const auditLogger = logger.child({ component: "audit" });

/**
 * Record an audit event.
 * Logs immediately; in production, also write to DB.
 */
export function audit(entry: AuditEntry): void {
  auditLogger.info(
    {
      audit: true,
      action: entry.action,
      userId: entry.userId,
      targetId: entry.targetId,
      ip: entry.ip,
      userAgent: entry.userAgent,
      ...entry.metadata,
    },
    `audit:${entry.action}`
  );

  // Store in memory for dev queryability
  auditStore.push({
    ...entry,
    timestamp: new Date().toISOString(),
    id: `audit_${Date.now()}_${++auditIdCounter}`,
  });
  if (auditStore.length > MAX_AUDIT_STORE) {
    auditStore.splice(0, auditStore.length - MAX_AUDIT_STORE);
  }

  // Write to audit_events DB table if available
  if (process.env.DATABASE_URL) {
    writeAuditToDb(entry).catch((err) => {
      auditLogger.error({ err }, "Failed to write audit event to database");
    });
  }
}

async function writeAuditToDb(entry: AuditEntry): Promise<void> {
  try {
    const { getDb } = await import("@/lib/db/index");
    const { auditEvents } = await import("@/lib/db/schema");
    const db = getDb();
    await db.insert(auditEvents).values({
      action: entry.action,
      userId: entry.userId || null,
      targetId: entry.targetId || null,
      ip: entry.ip || null,
      userAgent: entry.userAgent || null,
      metadata: entry.metadata || null,
    });
  } catch {
    // Silently fail; in-memory store is the fallback
  }
}

// In-memory audit store for development queries
const auditStore: Array<AuditEntry & { timestamp: string; id: string }> = [];
const MAX_AUDIT_STORE = 5000;
let auditIdCounter = 0;

/**
 * Query recent audit events (in-memory, for dev/admin).
 */
export function queryAuditLog(filters?: {
  userId?: string;
  action?: AuditAction;
  limit?: number;
}): Array<AuditEntry & { timestamp: string; id: string }> {
  let results = [...auditStore];
  if (filters?.userId) results = results.filter((e) => e.userId === filters.userId);
  if (filters?.action) results = results.filter((e) => e.action === filters.action);
  results.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return results.slice(0, filters?.limit || 100);
}

/** Clear audit store (for testing) */
export function clearAuditStore(): void {
  auditStore.length = 0;
}

/**
 * Helper to extract client info from request headers.
 */
export function getClientInfo(headers: Headers): { ip: string; userAgent: string } {
  return {
    ip: headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown",
    userAgent: headers.get("user-agent") || "unknown",
  };
}
