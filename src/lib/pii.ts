import { encryptField, decryptField, type EncryptedField } from "./encryption";

/**
 * PII field helpers.
 *
 * These wrap the low-level encryption module to provide a clean interface
 * for encrypting/decrypting sensitive profile fields before DB storage.
 *
 * Sensitive fields: aNumber, SSN, passport number, date of birth (when combined
 * with name), address details, phone numbers.
 */

/** Fields in user_profiles that contain PII and should be encrypted at rest. */
export const PII_FIELDS = [
  "aNumber",
  "address",
] as const;

/** Fields in cases that may contain PII in their JSONB assessment blob. */
export const CASE_PII_FIELDS = ["assessment"] as const;

/**
 * Check whether a value looks like an already-encrypted EncryptedField blob.
 * This prevents double-encryption if a field is already encrypted.
 */
function isEncrypted(value: unknown): value is EncryptedField {
  return (
    typeof value === "object" &&
    value !== null &&
    "encrypted" in value &&
    "v" in value &&
    (value as EncryptedField).v === 1
  );
}

/**
 * Encrypt a single PII value for storage.
 * If the value is null/undefined, returns null (nullable columns).
 * If already encrypted, returns as-is.
 */
export function encryptPii(value: string | null | undefined): EncryptedField | null {
  if (value == null || value === "") return null;
  return encryptField(value);
}

/**
 * Decrypt a single PII value from storage.
 * Handles null columns and plaintext (not-yet-encrypted) values gracefully.
 */
export function decryptPii(stored: unknown): string | null {
  if (stored == null) return null;
  if (isEncrypted(stored)) {
    return decryptField(stored);
  }
  // If it's a plain string (pre-migration data), return as-is
  if (typeof stored === "string") return stored;
  // JSONB object that isn't encrypted, return stringified
  if (typeof stored === "object") return JSON.stringify(stored);
  return null;
}

/**
 * Encrypt a set of fields in a profile-like object before INSERT/UPDATE.
 * Only encrypts fields listed in `piiFields`. Non-PII fields pass through.
 */
export function encryptProfileFields<T extends Record<string, unknown>>(
  data: T,
  piiFields: readonly string[] = PII_FIELDS
): T {
  const result = { ...data };
  for (const field of piiFields) {
    if (field in result && result[field] != null) {
      const val = result[field];
      const str = typeof val === "string" ? val : JSON.stringify(val);
      (result as Record<string, unknown>)[field] = encryptPii(str);
    }
  }
  return result;
}

/**
 * Decrypt a set of fields in a profile-like object after SELECT.
 * Only decrypts fields listed in `piiFields`. Non-PII fields pass through.
 */
export function decryptProfileFields<T extends Record<string, unknown>>(
  data: T,
  piiFields: readonly string[] = PII_FIELDS
): T {
  const result = { ...data };
  for (const field of piiFields) {
    if (field in result && result[field] != null) {
      (result as Record<string, unknown>)[field] = decryptPii(result[field]);
    }
  }
  return result;
}
