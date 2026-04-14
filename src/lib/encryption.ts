import crypto from "crypto";

/**
 * Field-level AES-256-GCM envelope encryption for PII.
 *
 * Architecture:
 * - A master key (from env) wraps per-record Data Encryption Keys (DEKs).
 * - Each field is encrypted with its own random DEK + IV.
 * - The DEK is encrypted with the master key and stored alongside the ciphertext.
 * - This allows key rotation by re-wrapping DEKs without re-encrypting data.
 *
 * Production: swap master key source for AWS KMS / GCP Cloud KMS envelope encrypt.
 */

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV recommended for GCM
const AUTH_TAG_LENGTH = 16;
const DEK_LENGTH = 32; // 256-bit DEK

function getMasterKey(): Buffer {
  const key = process.env.PII_ENCRYPTION_KEY;
  if (!key) {
    throw new Error(
      "PII_ENCRYPTION_KEY environment variable is required. " +
        "Generate one with: openssl rand -base64 32"
    );
  }
  const buf = Buffer.from(key, "base64");
  if (buf.length !== 32) {
    throw new Error("PII_ENCRYPTION_KEY must be exactly 32 bytes (base64-encoded).");
  }
  return buf;
}

/** Encrypt a DEK with the master key. */
function wrapDek(dek: Buffer): { wrappedDek: Buffer; wrapIv: Buffer; wrapTag: Buffer } {
  const masterKey = getMasterKey();
  const wrapIv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, masterKey, wrapIv);
  const encrypted = Buffer.concat([cipher.update(dek), cipher.final()]);
  const wrapTag = cipher.getAuthTag();
  return { wrappedDek: encrypted, wrapIv, wrapTag };
}

/** Decrypt a DEK with the master key. */
function unwrapDek(wrappedDek: Buffer, wrapIv: Buffer, wrapTag: Buffer): Buffer {
  const masterKey = getMasterKey();
  const decipher = crypto.createDecipheriv(ALGORITHM, masterKey, wrapIv);
  decipher.setAuthTag(wrapTag);
  return Buffer.concat([decipher.update(wrappedDek), decipher.final()]);
}

export interface EncryptedField {
  /** Base64: IV + ciphertext + authTag + wrapIv + wrappedDek + wrapTag */
  encrypted: string;
  /** Version tag for future algorithm changes */
  v: 1;
}

/**
 * Encrypt a plaintext string. Returns a self-contained blob that
 * can be stored in a single DB column (TEXT/JSONB).
 */
export function encryptField(plaintext: string): EncryptedField {
  const dek = crypto.randomBytes(DEK_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);

  // Encrypt data with DEK
  const cipher = crypto.createCipheriv(ALGORITHM, dek, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // Wrap DEK with master key
  const { wrappedDek, wrapIv, wrapTag } = wrapDek(dek);

  // Pack everything into a single buffer:
  // [iv(12)] [ciphertext(var)] [authTag(16)] [wrapIv(12)] [wrappedDek(32)] [wrapTag(16)]
  // We also store the ciphertext length as a 4-byte uint so we can unpack.
  const ctLen = Buffer.alloc(4);
  ctLen.writeUInt32BE(ciphertext.length);

  const packed = Buffer.concat([
    ctLen,
    iv,
    ciphertext,
    authTag,
    wrapIv,
    wrappedDek,
    wrapTag,
  ]);

  return { encrypted: packed.toString("base64"), v: 1 };
}

/**
 * Decrypt a field previously encrypted with encryptField.
 */
export function decryptField(field: EncryptedField): string {
  if (field.v !== 1) {
    throw new Error(`Unsupported encryption version: ${field.v}`);
  }

  const packed = Buffer.from(field.encrypted, "base64");
  let offset = 0;

  const ctLen = packed.readUInt32BE(offset);
  offset += 4;

  const iv = packed.subarray(offset, offset + IV_LENGTH);
  offset += IV_LENGTH;

  const ciphertext = packed.subarray(offset, offset + ctLen);
  offset += ctLen;

  const authTag = packed.subarray(offset, offset + AUTH_TAG_LENGTH);
  offset += AUTH_TAG_LENGTH;

  const wrapIv = packed.subarray(offset, offset + IV_LENGTH);
  offset += IV_LENGTH;

  const wrappedDek = packed.subarray(offset, offset + DEK_LENGTH);
  offset += DEK_LENGTH;

  const wrapTag = packed.subarray(offset, offset + AUTH_TAG_LENGTH);

  // Unwrap DEK
  const dek = unwrapDek(wrappedDek, wrapIv, wrapTag);

  // Decrypt data
  const decipher = crypto.createDecipheriv(ALGORITHM, dek, iv);
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

/**
 * Encrypt multiple fields at once. Useful for encrypting a user profile.
 * Returns a map of field name to encrypted value.
 */
export function encryptFields(
  fields: Record<string, string>
): Record<string, EncryptedField> {
  const result: Record<string, EncryptedField> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (value) {
      result[key] = encryptField(value);
    }
  }
  return result;
}

/**
 * Decrypt multiple fields at once.
 */
export function decryptFields(
  fields: Record<string, EncryptedField>
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields)) {
    result[key] = decryptField(value);
  }
  return result;
}
