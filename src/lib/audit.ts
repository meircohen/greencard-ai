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
  | "rate_limit.exceeded";

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

  // TODO: Write to audit_events DB table for persistent history
  // await db.insert(auditEvents).values({
  //   action: entry.action,
  //   userId: entry.userId,
  //   targetId: entry.targetId,
  //   ip: entry.ip,
  //   metadata: entry.metadata,
  //   createdAt: new Date(),
  // });
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
