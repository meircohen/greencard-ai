import { authenticator } from "otplib";
import * as QRCode from "qrcode";
import crypto from "crypto";

/**
 * TOTP-based Multi-Factor Authentication.
 *
 * Uses otplib v12 (RFC 6238 compliant TOTP) with QR code generation.
 * Compatible with Google Authenticator, Authy, 1Password, etc.
 *
 * Production: store MFA secrets encrypted in DB (use encryption.ts).
 * Current: in-memory for development.
 */

const APP_NAME = "GreenCard.ai";

interface MfaRecord {
  secret: string;
  enabled: boolean;
  backupCodes: string[];
}

// TODO: Replace with DB storage (mfa_settings table, secret encrypted with encryption.ts)
const mfaStore = new Map<string, MfaRecord>();

/**
 * Generate a new TOTP secret and QR code for a user.
 * Call this when user initiates MFA setup.
 */
export async function generateMfaSetup(
  userId: string,
  userEmail: string
): Promise<{ secret: string; qrCodeDataUrl: string; backupCodes: string[] }> {
  const secret = authenticator.generateSecret();

  // Generate backup codes (8 codes, 8 chars each)
  const backupCodes: string[] = [];
  for (let i = 0; i < 8; i++) {
    const code = crypto.randomBytes(4).toString("hex");
    backupCodes.push(code);
  }

  // Store secret (not yet enabled, user must verify first)
  mfaStore.set(userId, {
    secret,
    enabled: false,
    backupCodes,
  });

  // Generate otpauth URI
  const otpauthUrl = authenticator.keyuri(userEmail, APP_NAME, secret);

  // Generate QR code as data URL
  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

  return { secret, qrCodeDataUrl, backupCodes };
}

/**
 * Verify a TOTP code and enable MFA if this is the setup verification.
 */
export function verifyMfaCode(userId: string, code: string): boolean {
  const record = mfaStore.get(userId);
  if (!record) return false;

  const isValid = authenticator.verify({ token: code, secret: record.secret });

  if (isValid && !record.enabled) {
    record.enabled = true;
  }

  return isValid;
}

/**
 * Verify a backup code (one-time use).
 */
export function verifyBackupCode(userId: string, code: string): boolean {
  const record = mfaStore.get(userId);
  if (!record) return false;

  const normalizedCode = code.toLowerCase().replace(/\s/g, "");
  const index = record.backupCodes.indexOf(normalizedCode);

  if (index === -1) return false;

  // Remove used backup code
  record.backupCodes.splice(index, 1);
  return true;
}

/**
 * Check if a user has MFA enabled.
 */
export function isMfaEnabled(userId: string): boolean {
  const record = mfaStore.get(userId);
  return record?.enabled ?? false;
}

/**
 * Disable MFA for a user (e.g., after password reset or admin action).
 */
export function disableMfa(userId: string): void {
  mfaStore.delete(userId);
}

/**
 * Get remaining backup codes count.
 */
export function getBackupCodesCount(userId: string): number {
  const record = mfaStore.get(userId);
  return record?.backupCodes.length ?? 0;
}
