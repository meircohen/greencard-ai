/**
 * USCIS Mailing Addresses for Form Submissions
 *
 * Lockbox addresses for different form types and service centers.
 * NOTE: Addresses may vary based on state of residence and other factors.
 * Always verify current addresses at uscis.gov before mailing.
 *
 * Last Updated: April 2026
 * Source: https://www.uscis.gov/forms/all-forms
 */

export interface USCISAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  attention?: string;
}

export interface LockboxInfo {
  name: string;
  addresses: USCISAddress[];
  forms: string[];
  notes?: string;
}

export const uscisLockboxes: Record<string, LockboxInfo> = {
  "dallas-lockbox": {
    name: "USCIS Dallas Lockbox",
    addresses: [
      {
        name: "USCIS",
        attention: "N-400 Applications / I-130 / I-485",
        line1: "PO Box 660867",
        city: "Dallas",
        state: "TX",
        zip: "75266",
      },
    ],
    forms: ["N-400", "I-130", "I-485"],
    notes: "Primary lockbox for family-based immigration petitions and naturalization",
  },

  "chicago-lockbox": {
    name: "USCIS Chicago Lockbox",
    addresses: [
      {
        name: "USCIS",
        attention: "I-485 Applications",
        line1: "131 South Dearborn Street",
        line2: "Chicago, IL 60603",
        city: "Chicago",
        state: "IL",
        zip: "60603",
      },
    ],
    forms: ["I-485"],
    notes: "Concurrent I-485 filing address for Midwest region",
  },

  "phoenix-lockbox": {
    name: "USCIS Phoenix Lockbox",
    addresses: [
      {
        name: "USCIS",
        attention: "I-765 / I-131 Applications",
        line1: "PO Box 52280",
        city: "Phoenix",
        state: "AZ",
        zip: "85072-2280",
      },
    ],
    forms: ["I-765", "I-131"],
    notes: "Employment authorization and advance parole documents",
  },

  "california-lockbox": {
    name: "USCIS California Service Center",
    addresses: [
      {
        name: "USCIS",
        attention: "I-140 / EB Petitions",
        line1: "PO Box 10140",
        city: "Laguna Niguel",
        state: "CA",
        zip: "92677-0140",
      },
    ],
    forms: ["I-140", "I-864", "I-131"],
    notes: "Employment-based immigrant petitions processing center",
  },

  "vermont-lockbox": {
    name: "USCIS Vermont Service Center",
    addresses: [
      {
        name: "USCIS",
        attention: "I-129 / L-1 / H-1B Petitions",
        line1: "75 Lower Welden Street",
        city: "St. Albans",
        state: "VT",
        zip: "05479",
      },
    ],
    forms: ["I-129", "I-129F"],
    notes: "Nonimmigrant visa petitions and specialty occupation worker petitions",
  },

  "texas-lockbox": {
    name: "USCIS Texas Service Center",
    addresses: [
      {
        name: "USCIS",
        attention: "Employment Authorization Documents",
        line1: "PO Box 852355",
        city: "Dallas",
        state: "TX",
        zip: "75285",
      },
    ],
    forms: ["I-765", "I-131", "I-539"],
    notes: "Work authorization and extension/change of status filings",
  },
};

export const formToLockbox: Record<string, string> = {
  "I-130": "dallas-lockbox",
  "I-140": "california-lockbox",
  "I-485": "dallas-lockbox",
  "I-765": "phoenix-lockbox",
  "I-131": "phoenix-lockbox",
  "I-539": "texas-lockbox",
  "I-129": "vermont-lockbox",
  "I-129F": "vermont-lockbox",
  "N-400": "dallas-lockbox",
  "I-90": "texas-lockbox",
  "I-131A": "phoenix-lockbox",
  "I-864": "california-lockbox",
  "I-693": "dallas-lockbox",
};

/**
 * Get the appropriate USCIS mailing address for a form type
 */
export function getLockboxAddress(formNumber: string): USCISAddress | null {
  const lockboxKey = formToLockbox[formNumber];
  if (!lockboxKey) return null;

  const lockbox = uscisLockboxes[lockboxKey];
  if (!lockbox || lockbox.addresses.length === 0) return null;

  return lockbox.addresses[0];
}

/**
 * Get all lockbox info for a form type
 */
export function getLockboxInfo(formNumber: string): LockboxInfo | null {
  const lockboxKey = formToLockbox[formNumber];
  if (!lockboxKey) return null;

  return uscisLockboxes[lockboxKey] || null;
}

/**
 * Format address for envelope/document
 */
export function formatAddressForEnvelope(address: USCISAddress): string {
  const lines = [];

  if (address.attention) {
    lines.push(address.attention);
  }

  lines.push(address.name);
  lines.push(address.line1);

  if (address.line2) {
    lines.push(address.line2);
  } else {
    lines.push(`${address.city}, ${address.state} ${address.zip}`);
  }

  return lines.join("\n");
}
