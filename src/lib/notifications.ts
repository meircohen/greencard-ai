import { db } from "./db";
import { users, cases, caseDeadlines, payments } from "./db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "./email";
import {
  caseStatusUpdateEmail,
  documentReceivedEmail,
  deadlineReminderEmailNew,
  paymentReceiptEmail,
  welcomeEmailNew,
  rfeAlertEmail,
  caseApprovedEmail,
} from "./email-templates";
import { logger } from "./logger";

export interface NotificationPayload {
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  read?: boolean;
}

/**
 * Send case status update notification via email and in-app
 */
export async function sendCaseUpdate(
  userId: string,
  caseId: string,
  oldStatus: string,
  newStatus: string,
  nextSteps: string
): Promise<boolean> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || !user.email) {
      logger.warn({ userId }, "User not found or has no email");
      return false;
    }

    const caseRecord = await db.query.cases.findFirst({
      where: eq(cases.id, caseId),
    });

    if (!caseRecord) {
      logger.warn({ caseId }, "Case not found");
      return false;
    }

    const emailTemplate = caseStatusUpdateEmail(
      user.fullName || "User",
      caseRecord.caseType,
      oldStatus,
      newStatus,
      nextSteps
    );

    const emailSent = await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (emailSent) {
      logger.info({ userId, caseId }, "Case update notification sent");
    }

    return emailSent;
  } catch (error) {
    logger.error({ error, userId, caseId }, "Error sending case update notification");
    return false;
  }
}

/**
 * Send document received notification
 */
export async function sendDocumentReceived(
  userId: string,
  caseId: string,
  documentType: string
): Promise<boolean> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || !user.email) {
      logger.warn({ userId }, "User not found or has no email");
      return false;
    }

    const caseRecord = await db.query.cases.findFirst({
      where: eq(cases.id, caseId),
    });

    if (!caseRecord) {
      logger.warn({ caseId }, "Case not found");
      return false;
    }

    const emailTemplate = documentReceivedEmail(
      user.fullName || "User",
      documentType,
      caseRecord.caseType
    );

    const emailSent = await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (emailSent) {
      logger.info({ userId, caseId, documentType }, "Document received notification sent");
    }

    return emailSent;
  } catch (error) {
    logger.error(
      { error, userId, caseId, documentType },
      "Error sending document received notification"
    );
    return false;
  }
}

/**
 * Send deadline reminder notification
 */
export async function sendDeadlineReminder(
  userId: string,
  caseId: string,
  deadlineId: string
): Promise<boolean> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || !user.email) {
      logger.warn({ userId }, "User not found or has no email");
      return false;
    }

    const caseRecord = await db.query.cases.findFirst({
      where: eq(cases.id, caseId),
    });

    if (!caseRecord) {
      logger.warn({ caseId }, "Case not found");
      return false;
    }

    const deadline = await db.query.caseDeadlines.findFirst({
      where: eq(caseDeadlines.id, deadlineId),
    });

    if (!deadline) {
      logger.warn({ deadlineId }, "Deadline not found");
      return false;
    }

    const now = new Date();
    const deadlineTime = new Date(deadline.deadlineDate);
    const daysRemaining = Math.ceil(
      (deadlineTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    const deadlineDateStr = deadlineTime.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const emailTemplate = deadlineReminderEmailNew(
      user.fullName || "User",
      deadline.deadlineType,
      deadlineDateStr,
      Math.max(0, daysRemaining),
      caseRecord.caseType
    );

    const emailSent = await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (emailSent) {
      logger.info({ userId, caseId, deadlineId }, "Deadline reminder notification sent");
    }

    return emailSent;
  } catch (error) {
    logger.error(
      { error, userId, caseId, deadlineId },
      "Error sending deadline reminder notification"
    );
    return false;
  }
}

/**
 * Send payment receipt notification
 */
export async function sendPaymentReceipt(userId: string, paymentId: string): Promise<boolean> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || !user.email) {
      logger.warn({ userId }, "User not found or has no email");
      return false;
    }

    const payment = await db.query.payments.findFirst({
      where: eq(payments.id, paymentId),
    });

    if (!payment) {
      logger.warn({ paymentId }, "Payment not found");
      return false;
    }

    const amount = `$${Number(payment.amount).toFixed(2)}`;
    const planName = "GreenCard.ai Premium";
    const receiptDate = new Date(payment.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const emailTemplate = paymentReceiptEmail(
      user.fullName || "User",
      amount,
      planName,
      receiptDate,
      `https://greencard.ai/receipts/${paymentId}`
    );

    const emailSent = await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (emailSent) {
      logger.info({ userId, paymentId }, "Payment receipt notification sent");
    }

    return emailSent;
  } catch (error) {
    logger.error({ error, userId, paymentId }, "Error sending payment receipt notification");
    return false;
  }
}

/**
 * Send welcome notification after registration
 */
export async function sendWelcome(userId: string): Promise<boolean> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || !user.email) {
      logger.warn({ userId }, "User not found or has no email");
      return false;
    }

    const userCase = await db.query.cases.findFirst({
      where: eq(cases.userId, userId),
    });

    const caseType = userCase?.caseType || "Immigration";

    const emailTemplate = welcomeEmailNew(user.fullName || "User", caseType);

    const emailSent = await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (emailSent) {
      logger.info({ userId }, "Welcome notification sent");
    }

    return emailSent;
  } catch (error) {
    logger.error({ error, userId }, "Error sending welcome notification");
    return false;
  }
}

/**
 * Send RFE alert notification
 */
export async function sendRfeAlert(
  userId: string,
  caseId: string,
  rfeDeadline: Date,
  rfeDescription: string
): Promise<boolean> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || !user.email) {
      logger.warn({ userId }, "User not found or has no email");
      return false;
    }

    const caseRecord = await db.query.cases.findFirst({
      where: eq(cases.id, caseId),
    });

    if (!caseRecord) {
      logger.warn({ caseId }, "Case not found");
      return false;
    }

    const deadlineStr = rfeDeadline.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const emailTemplate = rfeAlertEmail(
      user.fullName || "User",
      caseRecord.caseType,
      deadlineStr,
      rfeDescription
    );

    const emailSent = await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (emailSent) {
      logger.info({ userId, caseId }, "RFE alert notification sent");
    }

    return emailSent;
  } catch (error) {
    logger.error({ error, userId, caseId }, "Error sending RFE alert notification");
    return false;
  }
}

/**
 * Send case approved notification
 */
export async function sendCaseApproved(
  userId: string,
  caseId: string,
  nextSteps: string
): Promise<boolean> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || !user.email) {
      logger.warn({ userId }, "User not found or has no email");
      return false;
    }

    const caseRecord = await db.query.cases.findFirst({
      where: eq(cases.id, caseId),
    });

    if (!caseRecord) {
      logger.warn({ caseId }, "Case not found");
      return false;
    }

    const approvalDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const emailTemplate = caseApprovedEmail(
      user.fullName || "User",
      caseRecord.caseType,
      approvalDate,
      nextSteps
    );

    const emailSent = await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    if (emailSent) {
      logger.info({ userId, caseId }, "Case approved notification sent");
    }

    return emailSent;
  } catch (error) {
    logger.error({ error, userId, caseId }, "Error sending case approved notification");
    return false;
  }
}
