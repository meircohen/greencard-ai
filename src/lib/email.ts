/**
 * Email sending stub.
 *
 * Production: replace with SendGrid, AWS SES, Resend, or Postmark.
 * For now, logs to console so the rest of the auth flow can be built end-to-end.
 */

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const provider = process.env.EMAIL_PROVIDER; // e.g. "sendgrid", "ses", "resend"

  if (!provider) {
    // Dev/staging: log instead of sending
    console.log(`[email-stub] To: ${payload.to}`);
    console.log(`[email-stub] Subject: ${payload.subject}`);
    console.log(`[email-stub] Body (text): ${payload.text ?? "(html only)"}`);
    return true;
  }

  // TODO: Implement real providers
  // switch (provider) {
  //   case "sendgrid": ...
  //   case "resend": ...
  // }

  console.warn(`[email] Unknown provider "${provider}", email not sent.`);
  return false;
}

export function passwordResetEmail(resetUrl: string): EmailPayload & { subject: string; html: string } {
  return {
    to: "", // caller fills this in
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
