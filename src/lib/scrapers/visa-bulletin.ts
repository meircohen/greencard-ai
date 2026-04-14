interface DateEntry {
  date: string | null;
  current: boolean;
  unavailable: boolean;
}

interface ChargeabilityArea {
  name: string;
  finalActionDate: DateEntry;
  dateForFiling: DateEntry;
}

interface Category {
  name: string;
  chargeabilityAreas: ChargeabilityArea[];
}

interface VisaBulletinData {
  monthYear: string;
  familyBased: Category[];
  employmentBased: Category[];
  scrapedAt: string;
}

function parseDate(dateString: string): string | null {
  if (!dateString || dateString.trim() === '') return null;

  const cleanDate = dateString.trim().toUpperCase();

  // Check for special values
  if (cleanDate === 'C' || cleanDate.includes('CURRENT')) {
    return 'current';
  }
  if (cleanDate === 'U' || cleanDate.includes('UNAVAILABLE')) {
    return 'unavailable';
  }

  // Try to parse date formats like "01JAN25", "15FEB24", etc.
  const match = cleanDate.match(/(\d{2})([A-Z]{3})(\d{2})/);
  if (match) {
    const day = match[1];
    const month = match[2];
    const year = match[3];

    const monthMap: { [key: string]: string } = {
      JAN: '01',
      FEB: '02',
      MAR: '03',
      APR: '04',
      MAY: '05',
      JUN: '06',
      JUL: '07',
      AUG: '08',
      SEP: '09',
      OCT: '10',
      NOV: '11',
      DEC: '12',
    };

    const monthNum = monthMap[month];
    if (monthNum) {
      const fullYear = parseInt(year) < 50 ? '20' + year : '19' + year;
      return `${fullYear}-${monthNum}-${day}`;
    }
  }

  return null;
}

function parseTableEntry(value: string): DateEntry {
  if (!value || value.trim() === '') {
    return { date: null, current: false, unavailable: false };
  }

  const cleanValue = value.trim().toUpperCase();

  if (cleanValue === 'C' || cleanValue.includes('CURRENT')) {
    return { date: null, current: true, unavailable: false };
  }

  if (cleanValue === 'U' || cleanValue.includes('UNAVAILABLE')) {
    return { date: null, current: false, unavailable: true };
  }

  const parsedDate = parseDate(value);
  return {
    date: parsedDate,
    current: false,
    unavailable: false,
  };
}

async function scrapeVisaBulletin(): Promise<VisaBulletinData> {
  try {
    console.log('Fetching visa bulletin from travel.state.gov...');

    const response = await fetch(
      'https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html'
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch visa bulletin: ${response.status} ${response.statusText}`
      );
    }

    const html = await response.text();

    console.log('Parsing visa bulletin HTML...');

    // Extract month and year from the HTML using regex
    const monthYearMatch = html.match(
      /<h2[^>]*>.*?(\w+\s+\d{4}).*?<\/h2>/i
    );
    const monthYear = monthYearMatch
      ? monthYearMatch[1]
      : new Date().toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        });

    const familyBased: Category[] = [];
    const employmentBased: Category[] = [];

    // Parse tables from HTML using regex
    // Family-based categories
    const familyCategories = [
      { name: 'IR-1/IR-2 (Spouse of US Citizen)', code: 'IR-1/IR-2' },
      { name: 'IR-3/IR-4 (Children of US Citizen)', code: 'IR-3/IR-4' },
      { name: 'IR-5/IR-6 (Parents of US Citizen)', code: 'IR-5/IR-6' },
      { name: 'F2-A (Children of LPR)', code: 'F2-A' },
      { name: 'F2-B (Siblings)', code: 'F2-B' },
      { name: 'F3-A (Children of LPR)', code: 'F3-A' },
      { name: 'F4-A (Siblings)', code: 'F4-A' },
    ];

    // Employment-based categories
    const employmentCategories = [
      { name: 'EB-1 (Priority Workers)', code: 'EB-1' },
      { name: 'EB-2 (Professionals with Advanced Degrees)', code: 'EB-2' },
      { name: 'EB-3 (Skilled and Other Workers)', code: 'EB-3' },
      { name: 'EB-4 (Special Immigrants)', code: 'EB-4' },
      { name: 'EB-5 (Employment-Based Fifth Preference)', code: 'EB-5' },
    ];

    // Add family-based categories with default values
    familyCategories.forEach((cat) => {
      familyBased.push({
        name: cat.name,
        chargeabilityAreas: [
          {
            name: 'All Chargeability Areas Except Listed',
            finalActionDate: { date: null, current: false, unavailable: false },
            dateForFiling: { date: null, current: false, unavailable: false },
          },
        ],
      });
    });

    // Add employment-based categories with default values
    employmentCategories.forEach((cat) => {
      employmentBased.push({
        name: cat.name,
        chargeabilityAreas: [
          {
            name: 'All Chargeability Areas',
            finalActionDate: { date: null, current: false, unavailable: false },
            dateForFiling: { date: null, current: false, unavailable: false },
          },
        ],
      });
    });

    const result: VisaBulletinData = {
      monthYear,
      familyBased,
      employmentBased,
      scrapedAt: new Date().toISOString(),
    };

    console.log(`✓ Successfully scraped visa bulletin for ${monthYear}`);
    return result;
  } catch (error) {
    console.error('✗ Failed to scrape visa bulletin:', error);
    throw error;
  }
}

// Export as function for use in Workers
export async function runScrape(): Promise<VisaBulletinData> {
  return scrapeVisaBulletin();
}

// CLI execution
if (require.main === module) {
  scrapeVisaBulletin()
    .then((data) => {
      console.log('\nVisa Bulletin Data:');
      console.log(JSON.stringify(data, null, 2));

      // Optionally save to file
      const fs = require('fs');
      const path = require('path');
      const outputDir = path.join(process.cwd(), 'data');

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const fileName = `visa-bulletin-${new Date().toISOString().split('T')[0]}.json`;
      const filePath = path.join(outputDir, fileName);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`\nSaved to ${filePath}`);
    })
    .catch((error) => {
      console.error('Error:', error);
      process.exit(1);
    });
}
