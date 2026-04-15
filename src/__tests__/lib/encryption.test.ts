import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { encryptField, decryptField, encryptFields, decryptFields } from "@/lib/encryption";

const TEST_KEY = Buffer.from("a]F9s+Kq2L7mB3hN5pR8tV0wX4yA6cE1", "utf8").toString("base64");

describe("Field-level AES-256-GCM encryption", () => {
  beforeEach(() => {
    vi.stubEnv("PII_ENCRYPTION_KEY", TEST_KEY);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("encrypts and decrypts a string round-trip", () => {
    const plaintext = "123-45-6789";
    const encrypted = encryptField(plaintext);
    expect(encrypted.v).toBe(1);
    expect(encrypted.encrypted).toBeTruthy();
    expect(encrypted.encrypted).not.toBe(plaintext);
    const decrypted = decryptField(encrypted);
    expect(decrypted).toBe(plaintext);
  });

  it("produces different ciphertext for the same plaintext (unique DEK+IV)", () => {
    const plaintext = "same-data";
    const a = encryptField(plaintext);
    const b = encryptField(plaintext);
    expect(a.encrypted).not.toBe(b.encrypted);
    expect(decryptField(a)).toBe(plaintext);
    expect(decryptField(b)).toBe(plaintext);
  });

  it("handles unicode and emoji", () => {
    const cases = ["Héctor García", "田中太郎", "שלום עולם"];
    for (const text of cases) {
      const encrypted = encryptField(text);
      expect(decryptField(encrypted)).toBe(text);
    }
  });

  it("handles empty string", () => {
    const encrypted = encryptField("");
    expect(decryptField(encrypted)).toBe("");
  });

  it("handles long strings", () => {
    const long = "A".repeat(10000);
    const encrypted = encryptField(long);
    expect(decryptField(encrypted)).toBe(long);
  });

  it("rejects tampered ciphertext", () => {
    const encrypted = encryptField("secret");
    const buf = Buffer.from(encrypted.encrypted, "base64");
    buf[20] ^= 0xff; // flip a byte in the ciphertext
    encrypted.encrypted = buf.toString("base64");
    expect(() => decryptField(encrypted)).toThrow();
  });

  it("rejects unsupported version", () => {
    const encrypted = encryptField("test");
    (encrypted as { v: number }).v = 2;
    expect(() => decryptField(encrypted)).toThrow("Unsupported encryption version");
  });

  it("throws when PII_ENCRYPTION_KEY is missing", () => {
    vi.stubEnv("PII_ENCRYPTION_KEY", "");
    expect(() => encryptField("data")).toThrow("PII_ENCRYPTION_KEY");
  });

  it("throws when PII_ENCRYPTION_KEY is wrong length", () => {
    vi.stubEnv("PII_ENCRYPTION_KEY", Buffer.from("short").toString("base64"));
    expect(() => encryptField("data")).toThrow("32 bytes");
  });

  describe("encryptFields / decryptFields", () => {
    it("encrypts multiple fields and decrypts them back", () => {
      const fields = {
        ssn: "123-45-6789",
        passport: "AB1234567",
        address: "123 Main St, Fort Lauderdale, FL",
      };
      const encrypted = encryptFields(fields);
      expect(Object.keys(encrypted)).toEqual(Object.keys(fields));
      for (const key of Object.keys(encrypted)) {
        expect(encrypted[key].v).toBe(1);
        expect(encrypted[key].encrypted).toBeTruthy();
      }
      const decrypted = decryptFields(encrypted);
      expect(decrypted).toEqual(fields);
    });

    it("skips falsy values in encryptFields", () => {
      const fields = { ssn: "123-45-6789", empty: "" };
      const encrypted = encryptFields(fields);
      expect(encrypted).toHaveProperty("ssn");
      expect(encrypted).not.toHaveProperty("empty");
    });
  });
});
