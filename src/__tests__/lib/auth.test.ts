import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  hashPassword,
  verifyPassword,
  createJWT,
  verifyJWT,
  COOKIE_NAME,
  SESSION_EXPIRY_DAYS,
  type AuthUser,
} from "@/lib/auth";

// Mock the session module to avoid DB dependency
vi.mock("@/lib/session", () => ({
  generateJti: () => "test-jti-" + Math.random().toString(36).slice(2),
  isTokenRevoked: vi.fn().mockResolvedValue(false),
  isUserTokenRevoked: vi.fn().mockResolvedValue(false),
}));

const TEST_SECRET = "test-secret-at-least-32-characters-long!!";

describe("Auth module", () => {
  beforeEach(() => {
    vi.stubEnv("NEXTAUTH_SECRET", TEST_SECRET);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  describe("password hashing", () => {
    it("hashes a password and verifies it", async () => {
      const password = "SecurePass123!";
      const hash = await hashPassword(password);
      expect(hash).not.toBe(password);
      expect(hash.startsWith("$2")).toBe(true); // bcrypt prefix
      const valid = await verifyPassword(password, hash);
      expect(valid).toBe(true);
    });

    it("rejects wrong password", async () => {
      const hash = await hashPassword("CorrectPassword!");
      const valid = await verifyPassword("WrongPassword!", hash);
      expect(valid).toBe(false);
    });

    it("produces different hashes for same password (salted)", async () => {
      const password = "SamePassword123!";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);
      expect(hash1).not.toBe(hash2);
      // Both should still verify
      expect(await verifyPassword(password, hash1)).toBe(true);
      expect(await verifyPassword(password, hash2)).toBe(true);
    });
  });

  describe("JWT creation and verification", () => {
    const testUser: AuthUser = {
      id: "user-abc-123",
      email: "test@example.com",
      name: "Test User",
      role: "client",
    };

    it("creates a valid JWT and verifies it", async () => {
      const token = await createJWT(testUser);
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3); // header.payload.signature

      const verified = await verifyJWT(token);
      expect(verified).not.toBeNull();
      expect(verified!.id).toBe(testUser.id);
      expect(verified!.email).toBe(testUser.email);
      expect(verified!.name).toBe(testUser.name);
      expect(verified!.role).toBe(testUser.role);
    });

    it("returns null for invalid token", async () => {
      const result = await verifyJWT("invalid.token.here");
      expect(result).toBeNull();
    });

    it("returns null for empty token", async () => {
      const result = await verifyJWT("");
      expect(result).toBeNull();
    });

    it("preserves all user fields through JWT round-trip", async () => {
      const attorney: AuthUser = {
        id: "att-456",
        email: "attorney@lawfirm.com",
        name: "Jane Attorney",
        role: "attorney",
      };
      const token = await createJWT(attorney);
      const verified = await verifyJWT(token);
      expect(verified).toEqual(attorney);
    });

    it("returns null when token is revoked", async () => {
      const { isTokenRevoked } = await import("@/lib/session");
      vi.mocked(isTokenRevoked).mockResolvedValueOnce(true);

      const token = await createJWT(testUser);
      const verified = await verifyJWT(token);
      expect(verified).toBeNull();
    });

    it("returns null when user tokens are globally revoked", async () => {
      const { isUserTokenRevoked } = await import("@/lib/session");
      vi.mocked(isUserTokenRevoked).mockResolvedValueOnce(true);

      const token = await createJWT(testUser);
      const verified = await verifyJWT(token);
      expect(verified).toBeNull();
    });

    it("throws when NEXTAUTH_SECRET is missing", async () => {
      vi.stubEnv("NEXTAUTH_SECRET", "");
      await expect(createJWT(testUser)).rejects.toThrow("NEXTAUTH_SECRET");
    });
  });

  describe("constants", () => {
    it("uses correct cookie name", () => {
      expect(COOKIE_NAME).toBe("greencard-session");
    });

    it("sessions expire in 7 days", () => {
      expect(SESSION_EXPIRY_DAYS).toBe(7);
    });
  });
});
