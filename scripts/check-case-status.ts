import * as cheerio from 'cheerio';

interface CaseStatus {
  receiptNumber: string;
  statusTitle: string;
  statusDescription: string;
  lastUpdated: string | null;
  details?: {
    [key: string]: string;
  };
}

interface CaseStatusCheckResult {
  success: boolean;
  data?: CaseStatus;
  error?: string;
}

// Rate limiting: 1 request per 5 seconds
let lastRequestTime = 0;
const RATE_LIMIT_MS = 5000;

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < RATE_LIMIT_MS) {
    const waitTime = RATE_LIMIT_MS - timeSinceLastRequest;
    console.log(`Rate limiting: waiting ${waitTime}ms...`);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
  }

  lastRequestTime = Date.now();
  return fetch(url);
}

async function checkCaseStatus(receiptNumber: string): Promise<CaseStatusCheckResult> {
  try {
    if (!receiptNumber || receiptNumber.trim() === '') {
      return {
        success: false,
        error: 'Receipt number is required',
      };
    }

    const cleanReceiptNumber = receiptNumber.trim().toUpperCase();

    // Validate receipt number format (e.g., WAC2590012345)
    if (!cleanReceiptNumber.match(/^[A-Z]{3}\d{7,10}$/)) {
      return {
        success: false,
        error: `Invalid receipt number format: ${cleanReceiptNumber}. Expected format: ABC1234567`,
      };
    }

    console.log(`Checking case status for: ${cleanReceiptNumber}`);

    // USCIS Case Status URL
    const url = `https://egov.uscis.gov/casestatus/mycasestatus.do?receipt=${cleanReceiptNumber}`;

    const response = await rateLimitedFetch(url);

    if (!response.ok) {
      return {
        success: false,
        error: `USCIS server returned ${response.status}. Please try again later.`,
      };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Look for status container
    const statusElement = $('h1, .case-status-title, [class*="status"]').first();
    const statusTitle = statusElement.text().trim() || 'Status Unknown';

    // Look for description
    const descriptionElement = $('p, .case-details, [class*="description"]').first();
    const statusDescription = descriptionElement.text().trim() || '';

    // Look for last updated date
    let lastUpdated: string | null = null;
    const dateElements = $('*');
    dateElements.each((_index, element) => {
      const text = $(element).text();
      if (text.includes('Last Updated') || text.includes('updated')) {
        const dateMatch = text.match(/(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
          lastUpdated = dateMatch[1];
        }
      }
    });

    const result: CaseStatus = {
      receiptNumber: cleanReceiptNumber,
      statusTitle,
      statusDescription,
      lastUpdated,
    };

    // Extract any additional details
    const details: { [key: string]: string } = {};
    const detailsElements = $('table tr, div[class*="detail"]');

    detailsElements.each((_index, element) => {
      const cells = $(element).find('td, th, label, span');
      if (cells.length >= 2) {
        const key = $(cells[0]).text().trim();
        const value = $(cells[1]).text().trim();
        if (key && value && !key.includes('class')) {
          details[key] = value;
        }
      }
    });

    if (Object.keys(details).length > 0) {
      result.details = details;
    }

    console.log(`✓ Status retrieved: ${statusTitle}`);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`✗ Failed to check case status: ${errorMessage}`);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

async function checkMultipleCases(receiptNumbers: string[]): Promise<CaseStatusCheckResult[]> {
  const results: CaseStatusCheckResult[] = [];

  for (const receiptNumber of receiptNumbers) {
    const result = await checkCaseStatus(receiptNumber);
    results.push(result);
  }

  return results;
}

// Export functions for use in API routes
export { checkCaseStatus, checkMultipleCases, type CaseStatus, type CaseStatusCheckResult };

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: tsx check-case-status.ts <receipt_number> [receipt_number2] ...');
    console.log('Example: tsx check-case-status.ts WAC2590012345 WAC2590054321');
    process.exit(1);
  }

  checkMultipleCases(args)
    .then((results) => {
      console.log('\n=== Case Status Results ===\n');
      results.forEach((result, index) => {
        if (result.success && result.data) {
          console.log(`[${index + 1}] ${result.data.receiptNumber}`);
          console.log(`    Status: ${result.data.statusTitle}`);
          console.log(`    Description: ${result.data.statusDescription}`);
          if (result.data.lastUpdated) {
            console.log(`    Last Updated: ${result.data.lastUpdated}`);
          }
          if (result.data.details) {
            console.log('    Details:');
            Object.entries(result.data.details).forEach(([key, value]) => {
              console.log(`      ${key}: ${value}`);
            });
          }
        } else {
          console.log(`[${index + 1}] Error: ${result.error}`);
        }
        console.log();
      });

      process.exit(results.every((r) => r.success) ? 0 : 1);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}
