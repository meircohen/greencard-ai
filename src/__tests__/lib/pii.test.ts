import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  encryptPii,
  decryptPii,
  encryptProfileFields,
  decryptProfileFields,
  PII_FIELDS,
} from "@/lib/pii";

const TEST_KEY = Buffer.from("a]F9s+Kq2L7mB3hN5pR8tV0wX4yA6cE1", "utf8").toString("base64");

describe("PII helpers", () => {
  beforeEach(() => {
    vi.stubEnv("PII_ENCRYPTION_KEY", TEST_KEY);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("encryptPii", () => {
    it("encrypts a string value", () => {
      const result = encryptPii("123-45-6789");
      expect(result).not.toBeNull();
      expect(result!.v).toBe(1);
      expect(result!.encrypted).toBeTruthy();
    });

    it("returns null for null input", () => {
      expect(encryptPii(null)).toBeNull();
    });

    it("returns null for undefined input", () => {
      expect(encryptPii(undefined)).toBeNull();
    });

    it("returns null for empty string", () => {
      expect(encryptPii("")).toBeNull();
    });
  });

  describe("decryptPii", () => {
    it("decrypts an encrypted value", () => {
      const encrypted = encryptPii("A-123456789");
      const decrypted = decryptPii(encrypted);
      expect(decrypted).toBe("A-123456789");
    });

    it("returns null for null input", () => {
      expect(decryptPii(null)).toBeNull();
    });

    it("returns plaintext string as-is (pre-migration data)", () => {
      expect(decryptPii("plain-text-value")).toBe("plain-text-value");
    });

    it("returns stringified object for non-encrypted objects", () => {
      const obj = { some: "data" };
      expect(decryptPii(obj)).toBe(JSON.stringify(obj));
    });
  });

  describe("encryptProfileFields", () => {
    it("encrypts only PII fields, passes through others", () => {
      const profile = {
        name: "John Doe",
        email: "john@example.com",
        aNumber: "A-123456789",
        address: "123 Main St",
      };

      const encrypted = encryptProfileFields(profile);
      // Non-PII fields unchanged
      expect(encrypted.name).toBe("John Doe");
      expect(encrypted.email).toBe("john@example.com");
      // PII fields encrypted
      expect(encrypted.aNumber).not.toBe("A-123456789");
      expect(typeof encrypted.aNumber).toBe("object");
      expect(encrypted.address).not.toBe("123 Main St");
    });

    it("handles null PII field values", () => {
      const profile = {
        name: "Jane",
        aNumber: null as string | null,
        address: "456 Oak Ave",
      };
      const encrypted = encryptProfileFields(profile);
      expect(encrypted.aNumber).toBeNull();
      expect(typeof encrypted.address).toBe("object"); // encrypted
    });

    it("supports custom PII field list", () => {
      const data = { secret: "hidden", public: "visible" };
      const encrypted = encryptProfileFields(data, ["secret"]);
      expect(encrypted.public).toBe("visible");
      expect(typeof encrypted.secret).toBe("object");
    });
  });

  describe("decryptProfileFields", () => {
    it("round-trips with encryptProfileFields", () => {
      const original = {
        name: "John",
        aNumber: "A-123456789",
        address: "123 Main St",
        role: "client",
      };
      const encrypted = encryptProfileFields(original);
      const decrypted = decryptProfileFields(encrypted);
      expect(decrypted.name).toBe("John");
      expect(decrypted.aNumber).toBe("A-123456789");
      expect(decrypted.address).toBe("123 Main St");
      expect(decrypted.role).toBe("client");
    });
  });

  describe("PII_FIELDS constant", () => {
    it("includes expected sensitive fields", () => {
      expect(PII_FIELDS).toContain("aNumber");
      expect(PII_FIELDS).toContain("address");
    });
  });
});
