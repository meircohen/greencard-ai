import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cases as casesTable } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { checkCaseStatus } from '@/lib/scrapers/case-status';

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

// In-memory cache for status checks (4 hour TTL)
const statusCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 4 * 60 * 60 * 1000;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: caseId } = await params;

    // Validate case ID format
    if (!caseId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return NextResponse.json(
        { error: 'Invalid case ID format' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `status_${caseId}`;
    const cached = statusCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      console.log(`Returning cached status for case ${caseId}`);
      return NextResponse.json(
        {
          success: true,
          data: cached.data,
          cached: true,
          cachedAt: new Date(cached.timestamp).toISOString(),
        },
        {
          headers: {
            'Cache-Control': 'public, max-age=3600',
          },
        }
      );
    }

    // Fetch case from database
    const caseRecord = await db.query.cases.findFirst({
      where: eq(casesTable.id, caseId),
    });

    if (!caseRecord) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }

    // Check if receipt number exists
    if (!caseRecord.receiptNumber) {
      return NextResponse.json(
        {
          error: 'Case does not have a receipt number yet',
          message: 'Receipt number is required to check USCIS case status',
          caseStatus: caseRecord.status,
        },
        { status: 400 }
      );
    }

    console.log(`Fetching USCIS status for case ${caseId} (${caseRecord.receiptNumber})`);

    // Check USCIS status
    const statusResult = await checkCaseStatus(caseRecord.receiptNumber);

    if (!statusResult.success) {
      return NextResponse.json(
        {
          error: statusResult.error,
          message: 'Failed to retrieve status from USCIS',
        },
        { status: 502 }
      );
    }

    // Cache the result
    statusCache.set(cacheKey, {
      data: statusResult.data,
      timestamp: Date.now(),
    });

    return NextResponse.json(
      {
        success: true,
        data: statusResult.data,
        cached: false,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600',
        },
      }
    );
  } catch (error) {
    console.error('Error checking case status:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * Clears the cache for a specific case
 * Useful when you want to force a fresh status check
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: caseId } = await params;
    const cacheKey = `status_${caseId}`;

    const hadCache = statusCache.has(cacheKey);
    statusCache.delete(cacheKey);

    return NextResponse.json(
      {
        success: true,
        message: hadCache
          ? 'Cache cleared successfully'
          : 'No cache found for this case',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error clearing cache:', error);

    return NextResponse.json(
      {
        error: 'Failed to clear cache',
      },
      { status: 500 }
    );
  }
}
