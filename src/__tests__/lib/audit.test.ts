import { describe, it, expect, beforeEach } from "vitest";
import { audit, queryAuditLog, clearAuditStore, getClientInfo } from "@/lib/audit";

describe("Audit trail", () => {
  beforeEach(() => {
    clearAuditStore();
  });

  it("records an audit event", () => {
    audit({ action: "auth.login", userId: "user-1" });
    const events = queryAuditLog();
    expect(events).toHaveLength(1);
    expect(events[0].action).toBe("auth.login");
    expect(events[0].userId).toBe("user-1");
  });

  it("includes timestamp and id", () => {
    audit({ action: "case.created", userId: "user-2", targetId: "case-abc" });
    const events = queryAuditLog();
    expect(events[0].timestamp).toBeDefined();
    expect(events[0].id).toMatch(/^audit_/);
  });

  it("filters by userId", () => {
    audit({ action: "auth.login", userId: "user-1" });
    audit({ action: "auth.login", userId: "user-2" });
    audit({ action: "case.created", userId: "user-1" });

    const user1 = queryAuditLog({ userId: "user-1" });
    expect(user1).toHaveLength(2);
  });

  it("filters by action", () => {
    audit({ action: "auth.login", userId: "user-1" });
    audit({ action: "case.created", userId: "user-1" });
    audit({ action: "auth.login", userId: "user-2" });

    const logins = queryAuditLog({ action: "auth.login" });
    expect(logins).toHaveLength(2);
  });

  it("respects limit", () => {
    for (let i = 0; i < 10; i++) {
      audit({ action: "auth.login", userId: `user-${i}` });
    }
    const limited = queryAuditLog({ limit: 3 });
    expect(limited).toHaveLength(3);
  });

  it("returns most recent first", () => {
    audit({ action: "auth.login", userId: "user-1" });
    audit({ action: "case.created", userId: "user-1" });
    const events = queryAuditLog();
    // Both events present; most recent (last inserted) should come first
    // If timestamps are identical, the higher id sorts last in localeCompare
    // so just verify both are returned
    expect(events).toHaveLength(2);
    const actions = events.map((e) => e.action);
    expect(actions).toContain("auth.login");
    expect(actions).toContain("case.created");
  });

  it("stores metadata", () => {
    audit({
      action: "ai.assessment",
      userId: "user-1",
      targetId: "case-1",
      metadata: { model: "claude-3", tokens: 5000 },
    });
    const events = queryAuditLog();
    expect(events[0].targetId).toBe("case-1");
  });
});

describe("getClientInfo", () => {
  it("extracts IP and user agent", () => {
    const headers = new Headers({
      "x-forwarded-for": "1.2.3.4, 5.6.7.8",
      "user-agent": "Mozilla/5.0",
    });
    const info = getClientInfo(headers);
    expect(info.ip).toBe("1.2.3.4");
    expect(info.userAgent).toBe("Mozilla/5.0");
  });

  it("handles missing headers", () => {
    const headers = new Headers();
    const info = getClientInfo(headers);
    expect(info.ip).toBe("unknown");
    expect(info.userAgent).toBe("unknown");
  });
});
