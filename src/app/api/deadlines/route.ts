import { NextRequest, NextResponse } from 'next/server';
import { getDb, caseDeadlines, cases } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import { getCaseDeadlines, getDaysUntilDeadline } from '@/lib/deadline-monitor';
import { z } from 'zod';

const addDeadlineSchema = z.object({
  caseId: z.string().uuid(),
  deadlineType: z.string(),
  deadlineDate: z.string().datetime(),
  description: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const db = getDb();

    // Get all cases for this user
    const userCases = await db
      .select({ id: cases.id })
      .from(cases)
      .where(eq(cases.userId, userId));

    const caseIds = userCases.map(c => c.id);

    if (caseIds.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        summary: {
          total: 0,
          upcoming: 0,
          overdue: 0,
        },
      });
    }

    // Get all deadlines for user's cases
    const allDeadlines = await db
      .select()
      .from(caseDeadlines)
      .where(
        and(
          ...caseIds.map(caseId => eq(caseDeadlines.caseId, caseId))
        )
      )
      .orderBy(caseDeadlines.deadlineDate);

    const now = new Date();
    const upcoming = allDeadlines.filter(
      d => d.deadlineDate > now && !d.completed
    );
    const overdue = allDeadlines.filter(
      d => d.deadlineDate <= now && !d.completed
    );

    const deadlinesWithDays = allDeadlines.map(deadline => ({
      ...deadline,
      daysUntilDeadline: getDaysUntilDeadline(deadline),
      isOverdue: deadline.deadlineDate <= now && !deadline.completed,
    }));

    return NextResponse.json({
      success: true,
      data: deadlinesWithDays,
      summary: {
        total: allDeadlines.length,
        upcoming: upcoming.length,
        overdue: overdue.length,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Error fetching deadlines');
    return NextResponse.json(
      { error: 'Failed to fetch deadlines' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only attorneys can manually add deadlines
    if (userRole !== 'attorney') {
      return NextResponse.json(
        { error: 'Only attorneys can add deadlines' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { caseId, deadlineType, deadlineDate, description } =
      addDeadlineSchema.parse(body);

    const db = getDb();

    // Verify the case exists and attorney has access
    const caseRecord = await db
      .select()
      .from(cases)
      .where(eq(cases.id, caseId));

    if (!caseRecord.length) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    // Check attorney access to case
    const caseData = caseRecord[0];
    if (caseData.attorneyId !== userId) {
      return NextResponse.json(
        { error: 'Not authorized to add deadlines for this case' },
        { status: 403 }
      );
    }

    // Add the deadline
    const result = await db
      .insert(caseDeadlines)
      .values({
        caseId,
        deadlineType,
        deadlineDate: new Date(deadlineDate),
        description: description || '',
        reminderSent: false,
        completed: false,
        createdAt: new Date(),
      })
      .returning();

    if (!result.length) {
      return NextResponse.json(
        { error: 'Failed to create deadline' },
        { status: 500 }
      );
    }

    logger.info(
      { caseId, deadlineType },
      'Deadline added by attorney'
    );

    return NextResponse.json(
      {
        success: true,
        data: result[0],
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.issues },
        { status: 400 }
      );
    }

    logger.error({ error }, 'Error creating deadline');
    return NextResponse.json(
      { error: 'Failed to create deadline' },
      { status: 500 }
    );
  }
}
