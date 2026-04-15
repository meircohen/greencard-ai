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

export function welcomeEmail(name: string): EmailPayload & { subject: string; html: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://greencard.ai";
  return {
    to: "",
    subject: "Welcome to GreenCard.ai - Your Immigration Journey Starts Here",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #10b981; text-align: center; margin-bottom: 30px;">Welcome to GreenCard.ai</h1>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hello ${name},</p>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Thank you for signing up! We're excited to help you navigate your immigration case with confidence.
        </p>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          <strong>Here's what's next:</strong>
        </p>

        <ul style="color: #374151; font-size: 16px; line-height: 1.8;">
          <li>Complete your profile with your immigration case details</li>
          <li>Connect with an immigration attorney on our platform</li>
          <li>Track your case status and important deadlines</li>
          <li>Securely upload and manage your documents</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/onboarding" style="display: inline-block; background: #10b981; color: white; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            Complete Your Profile
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          If you have any questions, our support team is here to help. Visit our <a href="${siteUrl}/help" style="color: #10b981; text-decoration: none;">Help Center</a> or contact Yirmi@LadyLibertyLawyers.com.
        </p>

        <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 20px;">
          &copy; 2024 GreenCard.ai. All rights reserved.
        </p>
      </div>
    `,
    text: `Welcome to GreenCard.ai, ${name}!\n\nThank you for signing up. Complete your profile to get started: ${siteUrl}/onboarding\n\nYou can now connect with attorneys, track your case, and upload documents securely.`,
  };
}

export function caseStatusUpdateEmail(
  name: string,
  caseType: string,
  oldStatus: string,
  newStatus: string
): EmailPayload & { subject: string; html: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://greencard.ai";
  const statusDisplay = newStatus.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return {
    to: "",
    subject: `Your ${caseType} Case Status Updated`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #10b981; text-align: center; margin-bottom: 30px;">Case Status Updated</h1>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hello ${name},</p>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Good news! Your <strong>${caseType}</strong> case status has been updated.
        </p>

        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <p style="color: #374151; margin: 0 0 10px 0;">
            <strong>Previous Status:</strong> <span style="color: #6b7280;">${oldStatus.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</span>
          </p>
          <p style="color: #374151; margin: 0;">
            <strong>Current Status:</strong> <span style="color: #10b981; font-weight: bold;">${statusDisplay}</span>
          </p>
        </div>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Log in to your dashboard to see more details about your case and any actions needed from you.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/dashboard" style="display: inline-block; background: #10b981; color: white; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            View Your Dashboard
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
          If you have questions about your case status, please contact your assigned attorney or our support team.
        </p>

        <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 20px;">
          &copy; 2024 GreenCard.ai. All rights reserved.
        </p>
      </div>
    `,
    text: `Your ${caseType} case status has been updated!\n\nPrevious: ${oldStatus}\nNew: ${statusDisplay}\n\nView details: ${siteUrl}/dashboard`,
  };
}

export function newMessageEmail(
  name: string,
  senderName: string,
  messagePreview: string
): EmailPayload & { subject: string; html: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://greencard.ai";
  const preview = messagePreview.length > 100 ? messagePreview.substring(0, 100) + "..." : messagePreview;

  return {
    to: "",
    subject: `New message from ${senderName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #10b981; text-align: center; margin-bottom: 30px;">New Message</h1>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hello ${name},</p>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          <strong>${senderName}</strong> sent you a message.
        </p>

        <div style="background: #f9fafb; border-left: 4px solid #10b981; border-radius: 4px; padding: 16px; margin: 20px 0;">
          <p style="color: #374151; margin: 0; font-style: italic;">
            "${preview}"
          </p>
        </div>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Log in to read the full message and respond.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/messages" style="display: inline-block; background: #10b981; color: white; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            View Message
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
          Don't miss important updates - check your messages regularly on your dashboard.
        </p>

        <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 20px;">
          &copy; 2024 GreenCard.ai. All rights reserved.
        </p>
      </div>
    `,
    text: `New message from ${senderName}\n\n"${preview}"\n\nRead the full message: ${siteUrl}/messages`,
  };
}

export function documentUploadConfirmEmail(
  name: string,
  documentName: string
): EmailPayload & { subject: string; html: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://greencard.ai";

  return {
    to: "",
    subject: `Document Received: ${documentName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #10b981; text-align: center; margin-bottom: 30px;">Document Received</h1>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hello ${name},</p>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          We've successfully received your document:
        </p>

        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <p style="color: #374151; margin: 0; font-weight: bold;">
            <span style="color: #10b981;">✓</span> ${documentName}
          </p>
        </div>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Your document has been uploaded and is now available in your case file. Your attorney will review it as part of your case.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/documents" style="display: inline-block; background: #10b981; color: white; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            View Your Documents
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
          If you need to upload additional documents, you can do so from your dashboard at any time.
        </p>

        <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 20px;">
          &copy; 2024 GreenCard.ai. All rights reserved.
        </p>
      </div>
    `,
    text: `Your document has been received: ${documentName}\n\nView all your documents: ${siteUrl}/documents`,
  };
}

export function reviewDecisionEmail(
  name: string,
  caseType: string,
  decision: "approve" | "request_changes" | "reject",
  notes: string | undefined
): EmailPayload & { subject: string; html: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://greencard.ai";

  let title = "";
  let statusColor = "#10b981";
  let statusText = "";
  let bgColor = "#f0fdf4";
  let borderColor = "#86efac";
  let message = "";

  switch (decision) {
    case "approve":
      title = "Your Case Has Been Approved";
      statusText = "Approved";
      message = "Congratulations! Your case has been reviewed and approved by your attorney. It is now ready for the next steps in your immigration process.";
      break;
    case "request_changes":
      title = "Additional Documents Needed";
      statusColor = "#f59e0b";
      bgColor = "#fffbeb";
      borderColor = "#fcd34d";
      statusText = "Documents Requested";
      message = "Your attorney has reviewed your case and requests additional documents. Please upload the requested documents as soon as possible so we can move forward with your case.";
      break;
    case "reject":
      title = "Your Case Review";
      statusColor = "#ef4444";
      bgColor = "#fef2f2";
      borderColor = "#fca5a5";
      statusText = "Review Complete";
      message = "Your case has been reviewed. Please contact your attorney to discuss the outcome and next steps.";
      break;
  }

  return {
    to: "",
    subject: title,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: ${statusColor}; text-align: center; margin-bottom: 30px;">${title}</h1>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hello ${name},</p>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Your <strong>${caseType}</strong> case review is complete.
        </p>

        <div style="background: ${bgColor}; border: 1px solid ${borderColor}; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <p style="color: #374151; margin: 0;">
            <strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${statusText}</span>
          </p>
        </div>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          ${message}
        </p>

        ${notes ? `<div style="background: #f9fafb; border-left: 4px solid ${statusColor}; border-radius: 4px; padding: 16px; margin: 20px 0;">
          <p style="color: #374151; margin: 0 0 8px 0; font-weight: bold;">Attorney Notes:</p>
          <p style="color: #374151; margin: 0; white-space: pre-wrap;">${notes}</p>
        </div>` : ""}

        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/dashboard" style="display: inline-block; background: ${statusColor}; color: white; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            View Your Case
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
          If you have questions or need clarification, please contact your assigned attorney.
        </p>

        <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 20px;">
          &copy; 2024 GreenCard.ai. All rights reserved.
        </p>
      </div>
    `,
    text: `${title}\n\nYour ${caseType} case review is complete.\n\n${message}\n\n${notes ? `Attorney Notes:\n${notes}\n\n` : ""}View your case: ${siteUrl}/dashboard`,
  };
}

export function paymentConfirmationEmail(
  name: string,
  amount: string,
  planName: string
): EmailPayload & { subject: string; html: string } {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://greencard.ai";

  return {
    to: "",
    subject: `Payment Confirmation - GreenCard.ai ${planName} Plan`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #10b981; text-align: center; margin-bottom: 30px;">Payment Confirmed</h1>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hello ${name},</p>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Thank you for your payment! Your subscription has been confirmed.
        </p>

        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; color: #374151;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #d1fae5;">
                <strong>Plan:</strong>
              </td>
              <td style="text-align: right; padding: 8px 0; border-bottom: 1px solid #d1fae5;">
                ${planName}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #d1fae5;">
                <strong>Amount Paid:</strong>
              </td>
              <td style="text-align: right; padding: 8px 0; border-bottom: 1px solid #d1fae5;">
                ${amount}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <strong>Status:</strong>
              </td>
              <td style="text-align: right; padding: 8px 0;">
                <span style="color: #10b981; font-weight: bold;">Active</span>
              </td>
            </tr>
          </table>
        </div>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Your account is now active and you have full access to all features of your plan.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/dashboard" style="display: inline-block; background: #10b981; color: white; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            Go to Dashboard
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
          Your subscription will automatically renew. You can manage your subscription settings from your account page at any time.
        </p>

        <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 20px;">
          &copy; 2024 GreenCard.ai. All rights reserved.
        </p>
      </div>
    `,
    text: `Payment Confirmed - ${planName} Plan\n\nThank you for your payment!\n\nPlan: ${planName}\nAmount: ${amount}\nStatus: Active\n\nYour subscription is now active. Manage your account: ${siteUrl}/dashboard`,
  };
}

export function contactConfirmationEmail(
  name: string,
  ticketId: string
): EmailPayload {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://greencard.ai";

  return {
    to: "",
    subject: `We received your message - ${ticketId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #10b981; text-align: center; margin-bottom: 30px;">Message Received</h1>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hello ${name},</p>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          Thank you for reaching out to GreenCard.ai. We have received your message and our team will get back to you within 1 business day.
        </p>

        <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <p style="color: #374151; margin: 0;">
            <strong>Reference:</strong> ${ticketId}
          </p>
        </div>

        <p style="color: #374151; font-size: 16px; line-height: 1.6;">
          In the meantime, you can start your free eligibility assessment to get an instant overview of your immigration options.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${siteUrl}/assessment" style="display: inline-block; background: #10b981; color: white; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: bold;">
            Start Free Assessment
          </a>
        </div>

        <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 20px;">
          &copy; 2024 GreenCard.ai. All rights reserved.
        </p>
      </div>
    `,
    text: `Message Received\n\nHello ${name},\n\nThank you for reaching out. We received your message and will get back to you within 1 business day.\n\nReference: ${ticketId}\n\nStart your free assessment: ${siteUrl}/assessment`,
  };
}

export function contactNotificationEmail(
  name: string,
  email: string,
  phone: string | undefined,
  caseType: string,
  message: string,
  ticketId: string
): EmailPayload {
  return {
    to: "",
    subject: `New Contact Form: ${ticketId} - ${caseType || "General"}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #10b981; text-align: center; margin-bottom: 30px;">New Contact Form Submission</h1>

        <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin: 20px 0;">
          <table style="width: 100%; color: #374151;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; width: 120px;">Ticket:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${ticketId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Name:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Phone:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${phone || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Case Type:</td>
              <td style="padding: 8px 0;">${caseType || "Not specified"}</td>
            </tr>
          </table>
        </div>

        <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px; margin: 20px 0;">
          <p style="color: #374151; font-weight: bold; margin: 0 0 8px 0;">Message:</p>
          <p style="color: #374151; margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `,
    text: `New Contact Form Submission\n\nTicket: ${ticketId}\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "Not provided"}\nCase Type: ${caseType || "Not specified"}\n\nMessage:\n${message}`,
  };
}
