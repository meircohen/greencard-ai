import { NextRequest, NextResponse } from 'next/server';
import { getDb, users, cases } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import {
  checkUpcomingDeadlines,
  sendReminderEmail,
} from '@/lib/deadline-monitor';

export const maxDuration = 60; // Allow up to 60 seconds for this endpoint

export async function POST(request: NextRequest) {
  try {
    // This endpoint should be called by a cron job or system process
    // Verify it's a valid internal request (can be done via API key in production)
    const authHeader = request.headers.get('authorization');
    const apiKey = process.env.INTERNAL_API_KEY;

    // Allow requests without auth in development
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    logger.info('Starting deadline check');

    const db = getDb();

    // Get all upcoming deadlines that need reminders
    const alerts = await checkUpcomingDeadlines();

    if (alerts.length === 0) {
      logger.info('No deadlines require reminders at this time');
      return NextResponse.json({
        success: true,
        message: 'No reminders needed',
        processed: 0,
      });
    }

    let sentCount = 0;
    let failedCount = 0;

    // Send reminder emails for each alert
    for (const alert of alerts) {
      try {
        // Get case and user details
        const caseRecord = await db
          .select()
          .from(cases)
          .where(eq(cases.id, alert.caseId));

        if (!caseRecord.length) {
          logger.warn(
            { caseId: alert.caseId },
            'Case not found for deadline alert'
          );
          failedCount++;
          continue;
        }

        const caseData = caseRecord[0];

        // Get user details
        const userRecord = await db
          .select()
          .from(users)
          .where(eq(users.id, caseData.userId));

        if (!userRecord.length) {
          logger.warn(
            { userId: caseData.userId },
            'User not found for deadline alert'
          );
          failedCount++;
          continue;
        }

        const userData = userRecord[0];

        // Send reminder email
        const emailSent = await sendReminderEmail(
          {
            ...alert,
            userEmail: userData.email,
            userName: userData.fullName || 'User',
          },
          userData.email,
          userData.fullName || 'User'
        );

        if (emailSent) {
          sentCount++;
          logger.info(
            { caseId: alert.caseId, userId: caseData.userId },
            `Deadline reminder sent: ${alert.deadlineType}`
          );
        } else {
          failedCount++;
          logger.warn(
            { caseId: alert.caseId },
            `Failed to send deadline reminder: ${alert.deadlineType}`
          );
        }
      } catch (alertError) {
        failedCount++;
        logger.error(
          { error: alertError, deadlineId: alert.deadlineId },
          'Error processing deadline alert'
        );
      }
    }

    logger.info(
      { total: alerts.length, sent: sentCount, failed: failedCount },
      'Deadline check completed'
    );

    return NextResponse.json({
      success: true,
      message: `Processed ${alerts.length} deadline alerts`,
      processed: sentCount,
      failed: failedCount,
      alerts: alerts.length,
    });
  } catch (error) {
    logger.error({ error }, 'Error during deadline check');
    return NextResponse.json(
      { error: 'Failed to process deadline checks' },
      { status: 500 }
    );
  }
}

// GET endpoint for manual testing and status
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const apiKey = process.env.INTERNAL_API_KEY;

    // Allow requests without auth in development
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const db = getDb();

    // Get summary statistics
    const allAlerts = await checkUpcomingDeadlines();

    const alertsByLevel = {
      first: allAlerts.filter(a => a.reminderLevel === 'first').length,
      second: allAlerts.filter(a => a.reminderLevel === 'second').length,
      urgent: allAlerts.filter(a => a.reminderLevel === 'urgent').length,
      critical: allAlerts.filter(a => a.reminderLevel === 'critical').length,
      final: allAlerts.filter(a => a.reminderLevel === 'final').length,
    };

    return NextResponse.json({
      success: true,
      status: 'operational',
      totalAlerts: allAlerts.length,
      alertsByLevel,
      lastCheck: new Date().toISOString(),
    });
  } catch (error) {
    logger.error({ error }, 'Error getting deadline check status');
    return NextResponse.json(
      { error: 'Failed to get status' },
      { status: 500 }
    );
  }
}
