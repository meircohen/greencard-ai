import { authenticator } from "otplib";
import * as QRCode from "qrcode";
import crypto from "crypto";
import { getDb } from "./db";
import { mfaSettings } from "./db/schema";
import { eq } from "drizzle-orm";
import { encryptField, decryptField, type EncryptedField } from "./encryption";

/**
 * TOTP-based Multi-Factor Authentication.
 *
 * Uses otplib v12 (RFC 6238 compliant TOTP) with QR code generation.
 * Compatible with Google Authenticator, Authy, 1Password, etc.
 *
 * MFA secrets are encrypted at rest using AES-256-GCM (via encryption.ts)
 * and stored in the mfa_settings DB table.
 */

const APP_NAME = "GreenCard.ai";

// In-memory fallback for environments without PII_ENCRYPTION_KEY (dev)
const devStore = new Map<string, { secret: string; enabled: boolean; backupCodes: string[] }>();

function useDb(): boolean {
  return !!process.env.PII_ENCRYPTION_KEY && !!process.env.DATABASE_URL;
}

/**
 * Generate a new TOTP secret and QR code for a user.
 */
export async function generateMfaSetup(
  userId: string,
  userEmail: string
): Promise<{ secret: string; qrCodeDataUrl: string; backupCodes: string[] }> {
  const secret = authenticator.generateSecret();

  const backupCodes: string[] = [];
  for (let i = 0; i < 8; i++) {
    backupCodes.push(crypto.randomBytes(4).toString("hex"));
  }

  if (useDb()) {
    const encrypted = encryptField(secret);
    const db = getDb();
    await db
      .insert(mfaSettings)
      .values({
        userId,
        secret: JSON.stringify(encrypted),
        enabled: false,
        backupCodes,
      })
      .onConflictDoUpdate({
        target: mfaSettings.userId,
        set: {
          secret: JSON.stringify(encrypted),
          enabled: false,
          backupCodes,
          updatedAt: new Date(),
        },
      });
  } else {
    devStore.set(userId, { secret, enabled: false, backupCodes: [...backupCodes] });
  }

  const otpauthUrl = authenticator.keyuri(userEmail, APP_NAME, secret);
  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

  return { secret, qrCodeDataUrl, backupCodes };
}

async function getRecord(userId: string): Promise<{ secret: string; enabled: boolean; backupCodes: string[] } | null> {
  if (useDb()) {
    const db = getDb();
    const [row] = await db.select().from(mfaSettings).where(eq(mfaSettings.userId, userId)).limit(1);
    if (!row) return null;

    let secret: string;
    try {
      const parsed = JSON.parse(row.secret) as EncryptedField;
      secret = decryptField(parsed);
    } catch {
      secret = row.secret; // Fallback for unencrypted dev data
    }
    return { secret, enabled: row.enabled, backupCodes: (row.backupCodes || []) as string[] };
  }
  return devStore.get(userId) || null;
}

/**
 * Verify a TOTP code and enable MFA if this is the setup verification.
 */
export async function verifyMfaCode(userId: string, code: string): Promise<boolean> {
  const record = await getRecord(userId);
  if (!record) return false;

  const isValid = authenticator.verify({ token: code, secret: record.secret });

  if (isValid && !record.enabled) {
    if (useDb()) {
      const db = getDb();
      await db.update(mfaSettings).set({ enabled: true, updatedAt: new Date() }).where(eq(mfaSettings.userId, userId));
    } else {
      record.enabled = true;
    }
  }

  return isValid;
}

/**
 * Verify a backup code (one-time use).
 */
export async function verifyBackupCode(userId: string, code: string): Promise<boolean> {
  const record = await getRecord(userId);
  if (!record) return false;

  const normalized = code.toLowerCase().replace(/\s/g, "");
  const idx = record.backupCodes.indexOf(normalized);
  if (idx === -1) return false;

  record.backupCodes.splice(idx, 1);

  if (useDb()) {
    const db = getDb();
    await db.update(mfaSettings).set({ backupCodes: record.backupCodes, updatedAt: new Date() }).where(eq(mfaSettings.userId, userId));
  }

  return true;
}

/**
 * Check if a user has MFA enabled.
 */
export async function isMfaEnabled(userId: string): Promise<boolean> {
  const record = await getRecord(userId);
  return record?.enabled ?? false;
}

/**
 * Disable MFA for a user.
 */
export async function disableMfa(userId: string): Promise<void> {
  if (useDb()) {
    const db = getDb();
    await db.delete(mfaSettings).where(eq(mfaSettings.userId, userId));
  } else {
    devStore.delete(userId);
  }
}

/**
 * Get remaining backup codes count.
 */
export async function getBackupCodesCount(userId: string): Promise<number> {
  const record = await getRecord(userId);
  return record?.backupCodes.length ?? 0;
}
