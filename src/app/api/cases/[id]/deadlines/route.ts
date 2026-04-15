import { NextRequest, NextResponse } from 'next/server';
import { getDb, cases } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { logger } from '@/lib/logger';
import {
  getCaseDeadlines,
  generateDeadlines,
  addDeadlineForCase,
  getDaysUntilDeadline,
} from '@/lib/deadline-monitor';
import { z } from 'zod';

const generateDeadlinesSchema = z.object({
  caseType: z.string(),
  approvalDate: z.string().datetime().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const caseId = id;
    const db = getDb();

    // Verify user owns the case
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

    const caseData = caseRecord[0];

    // Check access: user is owner or is attorney assigned to case
    const hasAccess =
      caseData.userId === userId || caseData.attorneyId === userId;

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Not authorized to view deadlines for this case' },
        { status: 403 }
      );
    }

    // Get case deadlines
    const deadlines = await getCaseDeadlines(caseId);

    const now = new Date();
    const deadlinesWithStatus = deadlines.map(deadline => ({
      ...deadline,
      daysUntilDeadline: getDaysUntilDeadline(deadline),
      isOverdue: deadline.deadlineDate <= now && !deadline.completed,
      status: deadline.completed
        ? 'completed'
        : deadline.deadlineDate <= now
          ? 'overdue'
          : 'upcoming',
    }));

    return NextResponse.json({
      success: true,
      caseId,
      data: deadlinesWithStatus,
      summary: {
        total: deadlines.length,
        completed: deadlines.filter(d => d.completed).length,
        overdue: deadlines.filter(
          d => d.deadlineDate <= now && !d.completed
        ).length,
        upcoming: deadlines.filter(
          d => d.deadlineDate > now && !d.completed
        ).length,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Error fetching case deadlines');
    return NextResponse.json(
      { error: 'Failed to fetch case deadlines' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get('x-user-id');
    const userRole = request.headers.get('x-user-role');

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const caseId = id;
    const db = getDb();

    // Verify case exists and user has access
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

    const caseData = caseRecord[0];

    // Check access: user is owner or attorney
    const hasAccess =
      caseData.userId === userId || caseData.attorneyId === userId;

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Not authorized to manage deadlines for this case' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { caseType, approvalDate } = generateDeadlinesSchema.parse(body);

    // Generate deadlines based on case type
    const generatedDeadlines = generateDeadlines(
      caseId,
      caseType,
      approvalDate ? new Date(approvalDate) : undefined
    );

    if (generatedDeadlines.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No deadlines generated for this case type',
        data: [],
      });
    }

    // Add deadlines to database
    const addedDeadlines = [];
    let addedCount = 0;

    for (const deadline of generatedDeadlines) {
      const added = await addDeadlineForCase(
        caseId,
        deadline.deadlineType,
        deadline.deadlineDate,
        deadline.description || undefined
      );

      if (added) {
        addedDeadlines.push(added);
        addedCount++;
      }
    }

    logger.info(
      { caseId, caseType, count: addedCount },
      'Deadlines generated and added to case'
    );

    return NextResponse.json(
      {
        success: true,
        message: `Generated and added ${addedCount} deadlines`,
        data: addedDeadlines,
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

    logger.error({ error }, 'Error generating case deadlines');
    return NextResponse.json(
      { error: 'Failed to generate case deadlines' },
      { status: 500 }
    );
  }
}
