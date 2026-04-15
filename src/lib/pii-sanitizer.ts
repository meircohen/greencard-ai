/**
 * PII Sanitizer
 * 
 * Strips personally identifiable information from text before sending to AI APIs.
 * Required for CCPA compliance until Zero Data Retention agreement is in place.
 * 
 * Detects and redacts:
 * - Social Security Numbers (XXX-XX-XXXX format)
 * - A-Numbers (USCIS form numbers: A + 7-9 digits)
 * - Passport numbers (alphanumeric 6-9 chars near "passport" keyword)
 * - Phone numbers (various US formats)
 * - Email addresses
 * - Dates of birth (various formats near DOB/birth keywords)
 */

/**
 * Redacts all PII from text
 * @param text - The input text potentially containing PII
 * @returns Text with all PII replaced with redaction markers
 */
export function sanitizePII(text: string): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let sanitized = text;

  // Social Security Numbers: XXX-XX-XXXX
  sanitized = sanitized.replace(
    /\b\d{3}-\d{2}-\d{4}\b/g,
    '[SSN REDACTED]'
  );

  // A-Numbers: A followed by 7-9 digits (with optional hyphens)
  sanitized = sanitized.replace(
    /\bA-?\d{7,9}\b/gi,
    '[A-NUMBER REDACTED]'
  );

  // Passport numbers: Look for "passport" keyword followed by alphanumeric 6-9 chars
  sanitized = sanitized.replace(
    /passport\s+(?:number|#|:)?\s*([A-Z0-9]{6,9})\b/gi,
    'passport [PASSPORT REDACTED]'
  );
  // Also match standalone passport-like patterns after context
  sanitized = sanitized.replace(
    /\bpassport\b\s*[:\-#]?\s*\b([A-Z0-9]{6,9})\b/gi,
    'passport [PASSPORT REDACTED]'
  );

  // Phone numbers: Various US formats
  // (123) 456-7890
  sanitized = sanitized.replace(
    /\(\d{3}\)\s*\d{3}-\d{4}\b/g,
    '[PHONE REDACTED]'
  );
  // 123-456-7890
  sanitized = sanitized.replace(
    /\b\d{3}-\d{3}-\d{4}\b/g,
    '[PHONE REDACTED]'
  );
  // 123.456.7890
  sanitized = sanitized.replace(
    /\b\d{3}\.\d{3}\.\d{4}\b/g,
    '[PHONE REDACTED]'
  );
  // 1234567890 (10 digit)
  sanitized = sanitized.replace(
    /\b\d{10}\b/g,
    '[PHONE REDACTED]'
  );
  // +1 123-456-7890 or +1 (123) 456-7890
  sanitized = sanitized.replace(
    /\+1\s*[\(\-]?\d{3}[\)\-\s]?\d{3}[-\s]?\d{4}\b/g,
    '[PHONE REDACTED]'
  );

  // Email addresses
  sanitized = sanitized.replace(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    '[EMAIL REDACTED]'
  );

  // Dates of birth: Multiple formats near DOB/birth keywords
  // Matches patterns like: "01/15/1985", "1985-01-15", "January 15, 1985", "01-15-1985"
  // Look for context first (DOB, birth date, born, etc.)
  sanitized = sanitized.replace(
    /(?:date\s+of\s+birth|dob|born|birth\s+date)\s*[:=]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/gi,
    'date of birth [DOB REDACTED]'
  );
  sanitized = sanitized.replace(
    /(?:date\s+of\s+birth|dob|born|birth\s+date)\s*[:=]?\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4})/gi,
    'date of birth [DOB REDACTED]'
  );
  // Standalone date patterns that look like DOB (4 digit year in past)
  // Only if preceded by certain keywords to avoid false positives
  sanitized = sanitized.replace(
    /(?:born|dob|birth\s+date)\s+(?:on\s+)?(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/gi,
    'born [DOB REDACTED]'
  );

  return sanitized;
}

/**
 * Check if text contains any detectable PII patterns
 * Useful for logging/auditing purposes
 * @param text - The text to check
 * @returns Array of PII types found
 */
export function detectPII(text: string): string[] {
  if (!text || typeof text !== 'string') {
    return [];
  }

  const detected: string[] = [];

  if (/\b\d{3}-\d{2}-\d{4}\b/.test(text)) {
    detected.push('SSN');
  }

  if (/\bA-?\d{7,9}\b/i.test(text)) {
    detected.push('A-NUMBER');
  }

  if (/passport\s*(?:number|#|:)?\s*([A-Z0-9]{6,9})\b/i.test(text) ||
      /\bpassport\b\s*[:\-#]?\s*\b([A-Z0-9]{6,9})\b/i.test(text)) {
    detected.push('PASSPORT');
  }

  if (/\(\d{3}\)\s*\d{3}-\d{4}\b/.test(text) ||
      /\b\d{3}-\d{3}-\d{4}\b/.test(text) ||
      /\b\d{3}\.\d{3}\.\d{4}\b/.test(text) ||
      /\b\d{10}\b/.test(text) ||
      /\+1\s*[\(\-]?\d{3}[\)\-\s]?\d{3}[-\s]?\d{4}\b/.test(text)) {
    detected.push('PHONE');
  }

  if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text)) {
    detected.push('EMAIL');
  }

  if (/(?:date\s+of\s+birth|dob|born|birth\s+date)\s*[:=]?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i.test(text) ||
      /(?:date\s+of\s+birth|dob|born|birth\s+date)\s*[:=]?\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i.test(text)) {
    detected.push('DOB');
  }

  return detected;
}
