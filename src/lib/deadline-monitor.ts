import { getDb, CaseDeadline, NewCaseDeadline } from './db';
import { cases, caseDeadlines } from './db/schema';
import { sendEmail } from './email';
import { deadlineReminderEmail } from './email-templates';
import { logger } from './logger';
import { eq, lte, gt, and, not } from 'drizzle-orm';

export interface DeadlineAlert {
  caseId: string;
  deadlineId: string;
  deadlineType: string;
  deadlineDate: Date;
  daysUntilDeadline: number;
  reminderLevel: 'first' | 'second' | 'urgent' | 'critical' | 'final';
  userEmail: string;
  userName: string;
}

export interface DeadlineConfig {
  type: string;
  offsetDays: number; // How many days before a reference date
  description: string;
}

// Immigration deadline rules
const DEADLINE_RULES: Record<string, DeadlineConfig> = {
  'I-751': {
    type: 'I-751 (Remove Conditions)',
    offsetDays: -90, // 90 days BEFORE 2-year anniversary
    description: 'Remove Conditions on Green Card must be filed 90 days before the 2-year anniversary of your conditional green card',
  },
  'N-400': {
    type: 'N-400 (Citizenship Application)',
    offsetDays: -90, // 90 days BEFORE anniversary
    description: 'Citizenship application can be filed 90 days before your anniversary (3 years for marriage-based, 5 years for other)',
  },
  'I-90': {
    type: 'I-90 (Green Card Renewal)',
    offsetDays: -180, // 6 months BEFORE expiration
    description: 'Green Card renewal should be filed 6 months before expiration',
  },
  'RFE': {
    type: 'RFE Response',
    offsetDays: 87, // 87 days FROM RFE issue date
    description: 'Request for Evidence response must be submitted within 87 days of issue',
  },
  'I-765': {
    type: 'I-765 (EAD Renewal)',
    offsetDays: -180, // 180 days BEFORE expiration
    description: 'Employment Authorization Document renewal should be filed 180 days before expiration',
  },
  'I-131': {
    type: 'I-131 (Travel Document)',
    offsetDays: 0, // File before travel
    description: 'Travel document should be filed before any international travel',
  },
  'AR-11': {
    type: 'AR-11 (Address Change)',
    offsetDays: 10, // 10 days AFTER move
    description: 'Address change notification must be submitted within 10 days of moving',
  },
};

// Reminder schedule: days before deadline
const REMINDER_SCHEDULE = {
  first: 90,
  second: 60,
  urgent: 30,
  critical: 14,
  final: 7,
};

type ReminderLevel = keyof typeof REMINDER_SCHEDULE;

export function generateDeadlines(
  caseId: string,
  caseType: string,
  approvalDate?: Date
): NewCaseDeadline[] {
  const deadlines: NewCaseDeadline[] = [];
  const referenceDate = approvalDate || new Date();

  // I-751: 90 days before 2-year anniversary
  if (caseType.includes('I-485') || caseType.includes('conditional')) {
    const twoYearAnniversary = new Date(referenceDate);
    twoYearAnniversary.setFullYear(twoYearAnniversary.getFullYear() + 2);
    const i751Deadline = new Date(twoYearAnniversary);
    i751Deadline.setDate(i751Deadline.getDate() - 90);

    deadlines.push({
      caseId,
      deadlineType: 'I-751',
      deadlineDate: i751Deadline,
      description: DEADLINE_RULES['I-751'].description,
      reminderSent: false,
      completed: false,
      createdAt: new Date(),
    });
  }

  // N-400: 90 days before anniversary (3 or 5 years)
  if (caseType.includes('I-485') || caseType.includes('green-card')) {
    // Assuming marriage-based = 3 years, other = 5 years (use 3 as default)
    const anniversaryYears = caseType.includes('marriage') ? 3 : 5;
    const anniversary = new Date(referenceDate);
    anniversary.setFullYear(anniversary.getFullYear() + anniversaryYears);
    const n400Deadline = new Date(anniversary);
    n400Deadline.setDate(n400Deadline.getDate() - 90);

    deadlines.push({
      caseId,
      deadlineType: 'N-400',
      deadlineDate: n400Deadline,
      description: DEADLINE_RULES['N-400'].description,
      reminderSent: false,
      completed: false,
      createdAt: new Date(),
    });
  }

  // I-90: 6 months before 10-year expiration
  if (caseType.includes('I-485') || caseType.includes('green-card')) {
    const tenYearExpiration = new Date(referenceDate);
    tenYearExpiration.setFullYear(tenYearExpiration.getFullYear() + 10);
    const i90Deadline = new Date(tenYearExpiration);
    i90Deadline.setDate(i90Deadline.getDate() - 180);

    deadlines.push({
      caseId,
      deadlineType: 'I-90',
      deadlineDate: i90Deadline,
      description: DEADLINE_RULES['I-90'].description,
      reminderSent: false,
      completed: false,
      createdAt: new Date(),
    });
  }

  // EAD Renewal (I-765): 180 days before expiration
  if (caseType.includes('I-765') || caseType.includes('EAD')) {
    if (approvalDate) {
      // Assuming 2-year EAD validity
      const eadExpiration = new Date(approvalDate);
      eadExpiration.setFullYear(eadExpiration.getFullYear() + 2);
      const eadDeadline = new Date(eadExpiration);
      eadDeadline.setDate(eadDeadline.getDate() - 180);

      deadlines.push({
        caseId,
        deadlineType: 'I-765',
        deadlineDate: eadDeadline,
        description: DEADLINE_RULES['I-765'].description,
        reminderSent: false,
        completed: false,
        createdAt: new Date(),
      });
    }
  }

  return deadlines;
}

export async function addDeadlineForCase(
  caseId: string,
  deadlineType: string,
  deadlineDate: Date,
  description?: string
): Promise<CaseDeadline | null> {
  try {
    const db = getDb();
    const config = DEADLINE_RULES[deadlineType];

    const result = await db
      .insert(caseDeadlines)
      .values({
        caseId,
        deadlineType,
        deadlineDate,
        description: description || config?.description || '',
        reminderSent: false,
        completed: false,
        createdAt: new Date(),
      })
      .returning();

    return result[0] || null;
  } catch (error) {
    logger.error({ error, caseId, deadlineType }, 'Failed to add deadline for case');
    return null;
  }
}

export async function getUpcomingDeadlines(caseId: string): Promise<CaseDeadline[]> {
  try {
    const db = getDb();
    const now = new Date();

    const deadlines = await db
      .select()
      .from(caseDeadlines)
      .where(
        and(
          eq(caseDeadlines.caseId, caseId),
          gt(caseDeadlines.deadlineDate, now),
          eq(caseDeadlines.completed, false)
        )
      )
      .orderBy(caseDeadlines.deadlineDate);

    return deadlines;
  } catch (error) {
    logger.error({ error, caseId }, 'Failed to fetch upcoming deadlines');
    return [];
  }
}

export async function getAllUpcomingDeadlines(): Promise<CaseDeadline[]> {
  try {
    const db = getDb();
    const now = new Date();

    const deadlines = await db
      .select()
      .from(caseDeadlines)
      .where(
        and(
          gt(caseDeadlines.deadlineDate, now),
          eq(caseDeadlines.completed, false)
        )
      )
      .orderBy(caseDeadlines.deadlineDate);

    return deadlines;
  } catch (error) {
    logger.error({ error }, 'Failed to fetch all upcoming deadlines');
    return [];
  }
}

function getReminderLevel(daysUntilDeadline: number): ReminderLevel | null {
  if (daysUntilDeadline <= 7 && daysUntilDeadline > 0) return 'final';
  if (daysUntilDeadline <= 14 && daysUntilDeadline > 7) return 'critical';
  if (daysUntilDeadline <= 30 && daysUntilDeadline > 14) return 'urgent';
  if (daysUntilDeadline <= 60 && daysUntilDeadline > 30) return 'second';
  if (daysUntilDeadline <= 90 && daysUntilDeadline > 60) return 'first';
  return null;
}

export async function checkUpcomingDeadlines(): Promise<DeadlineAlert[]> {
  try {
    const db = getDb();
    const now = new Date();
    const alerts: DeadlineAlert[] = [];

    // Get all upcoming deadlines
    const upcomingDeadlines = await getAllUpcomingDeadlines();

    for (const deadline of upcomingDeadlines) {
      const daysUntilDeadline = Math.ceil(
        (deadline.deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      const reminderLevel = getReminderLevel(daysUntilDeadline);

      // Skip if no reminder is due at this time
      if (!reminderLevel) {
        continue;
      }

      // Get case and user info
      const caseRecord = await db
        .select()
        .from(cases)
        .where(eq(cases.id, deadline.caseId));

      if (!caseRecord.length) {
        logger.warn(
          { caseId: deadline.caseId, deadlineId: deadline.id },
          'Case not found for deadline'
        );
        continue;
      }

      const caseData = caseRecord[0];

      // Get user info (we would need user data here)
      // For now, we'll create the alert structure
      const alert: DeadlineAlert = {
        caseId: deadline.caseId,
        deadlineId: deadline.id,
        deadlineType: deadline.deadlineType,
        deadlineDate: deadline.deadlineDate,
        daysUntilDeadline,
        reminderLevel,
        userEmail: '', // Will be populated by calling code
        userName: '', // Will be populated by calling code
      };

      alerts.push(alert);
    }

    return alerts;
  } catch (error) {
    logger.error({ error }, 'Error checking upcoming deadlines');
    return [];
  }
}

export async function sendReminderEmail(
  alert: DeadlineAlert,
  userEmail: string,
  userName: string
): Promise<boolean> {
  try {
    const template = deadlineReminderEmail(
      userName,
      alert.deadlineType,
      alert.deadlineDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      `Case ${alert.caseId.substring(0, 8)}`
    );

    const success = await sendEmail({
      to: userEmail,
      subject: template.subject,
      html: template.html,
    });

    if (success) {
      // Mark reminder as sent in database
      try {
        const db = getDb();
        await db
          .update(caseDeadlines)
          .set({ reminderSent: true })
          .where(eq(caseDeadlines.id, alert.deadlineId));
      } catch (updateError) {
        logger.warn(
          { error: updateError, deadlineId: alert.deadlineId },
          'Failed to mark reminder as sent in database'
        );
      }
    }

    return success;
  } catch (error) {
    logger.error({ error, deadlineId: alert.deadlineId }, 'Failed to send reminder email');
    return false;
  }
}

export async function markDeadlineCompleted(deadlineId: string): Promise<boolean> {
  try {
    const db = getDb();
    await db
      .update(caseDeadlines)
      .set({ completed: true })
      .where(eq(caseDeadlines.id, deadlineId));
    return true;
  } catch (error) {
    logger.error({ error, deadlineId }, 'Failed to mark deadline as completed');
    return false;
  }
}

export async function getCaseDeadlines(caseId: string): Promise<CaseDeadline[]> {
  try {
    const db = getDb();
    return await db
      .select()
      .from(caseDeadlines)
      .where(eq(caseDeadlines.caseId, caseId))
      .orderBy(caseDeadlines.deadlineDate);
  } catch (error) {
    logger.error({ error, caseId }, 'Failed to fetch case deadlines');
    return [];
  }
}

export function isDeadlineOverdue(deadline: CaseDeadline): boolean {
  return deadline.deadlineDate < new Date() && !deadline.completed;
}

export function getDaysUntilDeadline(deadline: CaseDeadline): number {
  return Math.ceil(
    (deadline.deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function getDeadlineStatusColor(
  daysUntilDeadline: number,
  completed: boolean
): 'green' | 'amber' | 'red' {
  if (completed) return 'green';
  if (daysUntilDeadline < 0) return 'red'; // Overdue
  if (daysUntilDeadline < 30) return 'red';
  if (daysUntilDeadline < 60) return 'amber';
  return 'green';
}
