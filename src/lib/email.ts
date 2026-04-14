import { Resend } from "resend";
import { logger } from "./logger";

/**
 * Email service using Resend.
 *
 * Set RESEND_API_KEY env var to enable real sending.
 * Without it, logs to console (dev mode).
 */

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const FROM_ADDRESS = process.env.EMAIL_FROM || "GreenCard.ai <noreply@greencard.ai>";

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Dev/staging: log instead of sending
    logger.info(
      { to: payload.to, subject: payload.subject },
      "Email stub (no RESEND_API_KEY): would send email"
    );
    return true;
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });

    if (error) {
      logger.error({ error, to: payload.to }, "Failed to send email via Resend");
      return false;
    }

    logger.info({ to: payload.to, subject: payload.subject }, "Email sent successfully");
    return true;
  } catch (err) {
    logger.error({ err, to: payload.to }, "Email sending error");
    return false;
  }
}

export function passwordResetEmail(resetUrl: string): EmailPayload & { subject: string; html: string } {
  return {
    to: "",
    subject: "Reset your GreenCard.ai password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a365d;">Password Reset Request</h2>
        <p>You requested a password reset for your GreenCard.ai account.</p>
        <p>Click the button below to set a new password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #64748b; font-size: 14px;">
          If you did not request this, you can safely ignore this email.
        </p>
        <p style="color: #64748b; font-size: 12px;">
          This link will expire in 1 hour for security reasons.
        </p>
      </div>
    `,
    text: `Reset your GreenCard.ai password: ${resetUrl}\n\nThis link expires in 1 hour. If you did not request this, ignore this email.`,
  };
}

export function emailVerificationEmail(verifyUrl: string): EmailPayload & { subject: string; html: string } {
  return {
    to: "",
    subject: "Verify your GreenCard.ai email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a365d;">Welcome to GreenCard.ai</h2>
        <p>Please verify your email address to activate your account.</p>
        <a href="${verifyUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #64748b; font-size: 14px;">
          This link expires in 24 hours.
        </p>
      </div>
    `,
    text: `Verify your GreenCard.ai email: ${verifyUrl}\n\nThis link expires in 24 hours.`,
  };
}
