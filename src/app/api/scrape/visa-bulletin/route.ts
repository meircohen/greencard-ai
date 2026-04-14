import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { runScrape } from '@/lib/scrapers/visa-bulletin';

/**
 * POST /api/scrape/visa-bulletin
 *
 * Triggers visa bulletin scraping
 * Requires admin authentication
 *
 * Response: Scraped visa bulletin data
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check for admin role (may be 'attorney' in schema context for now)
    if (session.user.role !== 'attorney' && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Admin role required' },
        { status: 403 }
      );
    }

    console.log('Admin-triggered visa bulletin scrape by:', session.user.email);

    // Run the scrape
    const bulletinData = await runScrape();

    // Log completion
    console.log(`Visa bulletin scraped successfully for ${bulletinData.monthYear}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Visa bulletin scraped successfully',
        data: bulletinData,
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Error scraping visa bulletin:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to scrape visa bulletin',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/scrape/visa-bulletin
 *
 * Returns status and info about visa bulletin scraping
 */
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(
      {
        success: true,
        message: 'Visa bulletin scraping endpoint',
        usage: {
          method: 'POST',
          requiresAuth: true,
          requiresRole: 'admin',
          description: 'Triggers a new visa bulletin scrape from travel.state.gov',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in GET handler:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
