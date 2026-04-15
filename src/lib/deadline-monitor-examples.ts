/**
 * Implementation Examples for Deadline Monitoring System
 * Reference code for integrating the deadline system throughout GreenCard.ai
 */

// ============================================================================
// Example 1: Auto-generate deadlines when a case is created
// ============================================================================

import {
  generateDeadlines,
  getCaseDeadlines,
  checkUpcomingDeadlines,
} from './deadline-monitor';
import { getDb } from './db';
import { cases, caseDeadlines } from './db/schema';

async function exampleCreateCaseWithDeadlines(
  caseId: string,
  caseType: string,
  approvalDate?: Date
) {
  try {
    // Generate deadlines based on case type
    const generatedDeadlines = generateDeadlines(
      caseId,
      caseType,
      approvalDate
    );

    // Save to database
    const db = getDb();
    for (const deadline of generatedDeadlines) {
      await db.insert(caseDeadlines).values(deadline);
    }

    console.log(`Created ${generatedDeadlines.length} deadlines for case`);
    return generatedDeadlines;
  } catch (error) {
    console.error('Error creating deadlines:', error);
    throw error;
  }
}

// ============================================================================
// Example 2: Display deadlines on case detail page
// ============================================================================

// React component example (TypeScript/TSX)
async function exampleCaseDetailPage(caseId: string) {
  // This would be in a Next.js page component

  // Fetch deadlines
  const response = await fetch(`/api/cases/${caseId}/deadlines`, {
    headers: {
      'x-user-id': 'user-id-from-auth',
    },
  });

  const data = await response.json();
  const deadlines = data.data;

  // Render component
  return `
    <div>
      <h2>Case Deadlines</h2>

      {/* Summary stats */}
      <DeadlineSummary deadlines={deadlines} />

      {/* Full deadline list */}
      <DeadlineWidget
        deadlines={deadlines}
        caseId={caseId}
        compact={false}
      />
    </div>
  `;
}

// ============================================================================
// Example 3: Add deadline widget to dashboard
// ============================================================================

async function exampleDashboardWithDeadlines(userId: string) {
  // Fetch user's deadlines
  const response = await fetch('/api/deadlines', {
    headers: {
      'x-user-id': userId,
    },
  });

  const data = await response.json();
  const userDeadlines = data.data;

  // Render component
  return `
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Other dashboard widgets */}

      {/* Deadline widget */}
      <div className="col-span-1 md:col-span-2">
        <h3>Upcoming Deadlines</h3>
        <DeadlineWidget
          deadlines={userDeadlines}
          compact={true}
        />
      </div>

      {/* Case stats */}
      <div>
        <h3>Summary</h3>
        <DeadlineSummary deadlines={userDeadlines} />
      </div>
    </div>
  `;
}

// ============================================================================
// Example 4: Set up cron job to check deadlines
// ============================================================================

// This would be in a cron job handler or scheduled task

async function exampleDailyDeadlineCheck() {
  try {
    // Call the deadline check API
    const response = await fetch(
      'https://your-domain.com/api/deadlines/check',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.INTERNAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await response.json();
    console.log(`Deadline check completed:`, result);
    // {
    //   success: true,
    //   message: 'Processed 5 deadline alerts',
    //   processed: 5,
    //   failed: 0,
    //   alerts: 5
    // }

    return result;
  } catch (error) {
    console.error('Error in daily deadline check:', error);
    throw error;
  }
}

// Example cron schedule (using node-cron or similar):
// 0 2 * * * - Run daily at 2 AM
// 0 */6 * * * - Run every 6 hours
// */15 * * * * - Run every 15 minutes

// ============================================================================
// Example 5: Attorney adding manual deadline
// ============================================================================

async function exampleAttorneyAddDeadline(
  caseId: string,
  deadlineType: string,
  deadlineDate: Date
) {
  try {
    const response = await fetch('/api/deadlines', {
      method: 'POST',
      headers: {
        'x-user-id': 'attorney-user-id',
        'x-user-role': 'attorney',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        caseId,
        deadlineType,
        deadlineDate: deadlineDate.toISOString(),
        description: 'Manually added by attorney',
      }),
    });

    const result = await response.json();
    console.log('Deadline added:', result.data);
    return result.data;
  } catch (error) {
    console.error('Error adding deadline:', error);
    throw error;
  }
}

// ============================================================================
// Example 6: Get deadline status for a case
// ============================================================================

async function exampleGetCaseDeadlines(caseId: string) {
  try {
    // Fetch deadlines for specific case
    const response = await fetch(`/api/cases/${caseId}/deadlines`, {
      headers: {
        'x-user-id': 'user-id',
      },
    });

    const data = await response.json();
    // {
    //   success: true,
    //   caseId: 'case-id',
    //   data: [
    //     {
    //       id: 'deadline-id',
    //       caseId: 'case-id',
    //       deadlineType: 'I-751',
    //       deadlineDate: '2026-02-15T00:00:00Z',
    //       daysUntilDeadline: 335,
    //       isOverdue: false,
    //       status: 'upcoming',
    //       ...
    //     }
    //   ],
    //   summary: {
    //     total: 5,
    //     completed: 1,
    //     overdue: 0,
    //     upcoming: 4
    //   }
    // }

    return data;
  } catch (error) {
    console.error('Error fetching case deadlines:', error);
    throw error;
  }
}

// ============================================================================
// Example 7: Auto-generate deadlines for existing cases
// ============================================================================

async function exampleBatchGenerateDeadlines() {
  try {
    const db = getDb();

    // Get all cases without deadlines
    const casesWithDeadlines = await db
      .select({ caseId: caseDeadlines.caseId })
      .from(caseDeadlines);

    const existingCaseIds = new Set(casesWithDeadlines.map(d => d.caseId));

    const allCases = await db.select().from(cases);
    const casesWithoutDeadlines = allCases.filter(
      c => !existingCaseIds.has(c.id)
    );

    let generatedCount = 0;

    for (const caseRecord of casesWithoutDeadlines) {
      // Generate deadlines
      const deadlines = generateDeadlines(
        caseRecord.id,
        caseRecord.caseType,
        caseRecord.priorityDate || undefined
      );

      // Save to database
      if (deadlines.length > 0) {
        await db.insert(caseDeadlines).values(deadlines);
        generatedCount += deadlines.length;
      }
    }

    console.log(`Generated ${generatedCount} deadlines for ${casesWithoutDeadlines.length} cases`);
    return generatedCount;
  } catch (error) {
    console.error('Error generating deadlines:', error);
    throw error;
  }
}

// ============================================================================
// Example 8: Monitor deadline system health
// ============================================================================

async function exampleMonitorDeadlineSystem() {
  try {
    // Check system status
    const response = await fetch(
      'https://your-domain.com/api/deadlines/check',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.INTERNAL_API_KEY}`,
        },
      }
    );

    const status = await response.json();
    // {
    //   success: true,
    //   status: 'operational',
    //   totalAlerts: 12,
    //   alertsByLevel: {
    //     first: 2,
    //     second: 3,
    //     urgent: 4,
    //     critical: 2,
    //     final: 1
    //   },
    //   lastCheck: '2026-04-15T10:30:00Z'
    // }

    // Check for issues
    if (status.totalAlerts > 100) {
      console.warn('High number of pending alerts');
    }

    if (status.alertsByLevel.critical > 10 || status.alertsByLevel.final > 5) {
      console.warn('Many critical/final deadlines approaching');
    }

    return status;
  } catch (error) {
    console.error('Error monitoring deadline system:', error);
    throw error;
  }
}

// ============================================================================
// Example 9: Integration with case status changes
// ============================================================================

async function exampleOnCaseStatusChange(
  caseId: string,
  newStatus: string,
  caseData: any
) {
  // When case status changes to 'approved'
  if (newStatus === 'approved') {
    // Check if deadlines already exist
    const existingDeadlines = await getCaseDeadlines(caseId);

    // If no deadlines, generate them
    if (existingDeadlines.length === 0) {
      const deadlines = generateDeadlines(
        caseId,
        caseData.caseType,
        new Date() // Current date as approval date
      );

      const db = getDb();
      for (const deadline of deadlines) {
        await db.insert(caseDeadlines).values(deadline);
      }

      console.log(`Generated ${deadlines.length} deadlines on case approval`);
    }
  }

  // When case is denied or abandoned
  if (newStatus === 'denied' || newStatus === 'abandoned') {
    // Optionally mark all deadlines as irrelevant or complete
    // This prevents sending reminders for cases that are no longer active
    console.log(`Case status changed to ${newStatus} - review deadlines`);
  }
}

// ============================================================================
// Example 10: Email template customization
// ============================================================================

// The system uses the existing deadlineReminderEmail template
// from src/lib/email-templates.ts
//
// To customize, modify the template function:
// export function deadlineReminderEmail(
//   name: string,
//   deadlineType: string,
//   deadlineDate: string,
//   caseName: string
// ): EmailTemplate

// Or create case-specific templates:

function exampleCustomCriticalDeadlineEmail(
  userName: string,
  deadlineType: string,
  deadlineDate: string,
  daysRemaining: number
) {
  if (daysRemaining <= 7) {
    // Use urgent template
    return `FINAL WARNING: ${deadlineType} due ${deadlineDate}`;
  } else if (daysRemaining <= 14) {
    // Use critical template
    return `CRITICAL: ${deadlineType} deadline approaching`;
  } else {
    // Use standard template
    return `Reminder: ${deadlineType} deadline`;
  }
}

// ============================================================================
// Export for reference
// ============================================================================

export {
  exampleCreateCaseWithDeadlines,
  exampleCaseDetailPage,
  exampleDashboardWithDeadlines,
  exampleDailyDeadlineCheck,
  exampleAttorneyAddDeadline,
  exampleGetCaseDeadlines,
  exampleBatchGenerateDeadlines,
  exampleMonitorDeadlineSystem,
  exampleOnCaseStatusChange,
  exampleCustomCriticalDeadlineEmail,
};
