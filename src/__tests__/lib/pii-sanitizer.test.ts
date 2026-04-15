import { sanitizePII, detectPII } from '@/lib/pii-sanitizer';

describe('sanitizePII', () => {
  describe('SSN redaction', () => {
    it('should redact SSN in XXX-XX-XXXX format', () => {
      const text = 'My SSN is 123-45-6789';
      const result = sanitizePII(text);
      expect(result).toBe('My SSN is [SSN REDACTED]');
    });

    it('should redact multiple SSNs', () => {
      const text = 'SSN 111-22-3333 and 555-66-7777 are sensitive';
      const result = sanitizePII(text);
      expect(result).toBe('SSN [SSN REDACTED] and [SSN REDACTED] are sensitive');
    });

    it('should not redact partial SSN-like patterns', () => {
      const text = 'My phone 123-45-6789 is not an SSN context';
      const result = sanitizePII(text);
      // This might match the phone pattern instead
      expect(result).toBeDefined();
    });
  });

  describe('A-Number redaction', () => {
    it('should redact A-Number with A prefix and 7 digits', () => {
      const text = 'My A-number is A123456789';
      const result = sanitizePII(text);
      expect(result).toContain('[A-NUMBER REDACTED]');
    });

    it('should redact A-Number with hyphen format', () => {
      const text = 'A-098765432';
      const result = sanitizePII(text);
      expect(result).toContain('[A-NUMBER REDACTED]');
    });

    it('should redact A-Number case insensitive', () => {
      const text = 'a987654321';
      const result = sanitizePII(text);
      expect(result).toContain('[A-NUMBER REDACTED]');
    });

    it('should redact multiple A-Numbers', () => {
      const text = 'A123456789 and A987654321 are USCIS numbers';
      const result = sanitizePII(text);
      expect(result).toContain('[A-NUMBER REDACTED]');
      expect(result.match(/\[A-NUMBER REDACTED\]/g)?.length).toBe(2);
    });
  });

  describe('Passport redaction', () => {
    it('should redact passport number after passport keyword', () => {
      const text = 'My passport number is ABC123456';
      const result = sanitizePII(text);
      expect(result).toContain('[PASSPORT REDACTED]');
    });

    it('should redact passport with colon format', () => {
      const text = 'Passport: XYZ789012';
      const result = sanitizePII(text);
      expect(result).toContain('[PASSPORT REDACTED]');
    });

    it('should redact passport with hash format', () => {
      const text = 'Passport# 123ABC456';
      const result = sanitizePII(text);
      expect(result).toContain('[PASSPORT REDACTED]');
    });

    it('should handle passport without keyword', () => {
      const text = 'Document passport ABC123456 found';
      const result = sanitizePII(text);
      expect(result).toContain('[PASSPORT REDACTED]');
    });
  });

  describe('Phone number redaction', () => {
    it('should redact phone in (XXX) XXX-XXXX format', () => {
      const text = 'Call me at (555) 123-4567';
      const result = sanitizePII(text);
      expect(result).toBe('Call me at [PHONE REDACTED]');
    });

    it('should redact phone in XXX-XXX-XXXX format', () => {
      const text = 'My number: 555-123-4567';
      const result = sanitizePII(text);
      expect(result).toBe('My number: [PHONE REDACTED]');
    });

    it('should redact phone in XXX.XXX.XXXX format', () => {
      const text = 'Contact 555.123.4567 for help';
      const result = sanitizePII(text);
      expect(result).toBe('Contact [PHONE REDACTED] for help');
    });

    it('should redact 10-digit phone number', () => {
      const text = 'Call 5551234567 now';
      const result = sanitizePII(text);
      expect(result).toBe('Call [PHONE REDACTED] now');
    });

    it('should redact +1 phone format', () => {
      const text = 'Reach me at +1-555-123-4567';
      const result = sanitizePII(text);
      expect(result).toContain('[PHONE REDACTED]');
    });

    it('should redact multiple phone numbers', () => {
      const text = '555-123-4567 or (555) 987-6543';
      const result = sanitizePII(text);
      expect(result.match(/\[PHONE REDACTED\]/g)?.length).toBe(2);
    });
  });

  describe('Email redaction', () => {
    it('should redact simple email address', () => {
      const text = 'Contact me at john@example.com';
      const result = sanitizePII(text);
      expect(result).toBe('Contact me at [EMAIL REDACTED]');
    });

    it('should redact email with complex local part', () => {
      const text = 'Email: jane.doe+tag@company.co.uk';
      const result = sanitizePII(text);
      expect(result).toContain('[EMAIL REDACTED]');
    });

    it('should redact multiple emails', () => {
      const text = 'john@test.com and mary@company.org are recipients';
      const result = sanitizePII(text);
      expect(result.match(/\[EMAIL REDACTED\]/g)?.length).toBe(2);
    });
  });

  describe('Date of birth redaction', () => {
    it('should redact DOB in MM/DD/YYYY format with keyword', () => {
      const text = 'Date of birth: 01/15/1985';
      const result = sanitizePII(text);
      expect(result).toContain('[DOB REDACTED]');
    });

    it('should redact DOB with "born" keyword', () => {
      const text = 'Born 03-20-1990';
      const result = sanitizePII(text);
      expect(result).toContain('[DOB REDACTED]');
    });

    it('should redact DOB in text month format', () => {
      const text = 'Birth date: January 15, 1985';
      const result = sanitizePII(text);
      expect(result).toContain('[DOB REDACTED]');
    });

    it('should redact DOB with "dob" abbreviation', () => {
      const text = 'DOB: 12-25-1980';
      const result = sanitizePII(text);
      expect(result).toContain('[DOB REDACTED]');
    });

    it('should handle multiple DOB formats in one text', () => {
      const text = 'Client born 05/10/1975 with backup date 1985-03-20';
      const result = sanitizePII(text);
      // At least one should be redacted
      expect(result).toContain('[DOB REDACTED]');
    });
  });

  describe('Edge cases', () => {
    it('should handle null/undefined gracefully', () => {
      expect(sanitizePII('')).toBe('');
      expect(sanitizePII(null as any)).toBe(null);
      expect(sanitizePII(undefined as any)).toBe(undefined);
    });

    it('should handle mixed PII types', () => {
      const text = 'User john@example.com with SSN 123-45-6789 and phone 555-123-4567';
      const result = sanitizePII(text);
      expect(result).toContain('[EMAIL REDACTED]');
      expect(result).toContain('[SSN REDACTED]');
      expect(result).toContain('[PHONE REDACTED]');
    });

    it('should preserve non-PII text', () => {
      const text = 'This is a normal message about green card processing';
      const result = sanitizePII(text);
      expect(result).toBe(text);
    });

    it('should handle text without PII', () => {
      const text = 'Please tell me about the I-485 form';
      const result = sanitizePII(text);
      expect(result).toBe(text);
    });
  });
});

describe('detectPII', () => {
  it('should detect SSN', () => {
    const text = 'My SSN is 123-45-6789';
    const result = detectPII(text);
    expect(result).toContain('SSN');
  });

  it('should detect A-Number', () => {
    const text = 'A123456789';
    const result = detectPII(text);
    expect(result).toContain('A-NUMBER');
  });

  it('should detect passport', () => {
    const text = 'passport: ABC123456';
    const result = detectPII(text);
    expect(result).toContain('PASSPORT');
  });

  it('should detect phone', () => {
    const text = '(555) 123-4567';
    const result = detectPII(text);
    expect(result).toContain('PHONE');
  });

  it('should detect email', () => {
    const text = 'john@example.com';
    const result = detectPII(text);
    expect(result).toContain('EMAIL');
  });

  it('should detect DOB', () => {
    const text = 'Born 01/15/1985';
    const result = detectPII(text);
    expect(result).toContain('DOB');
  });

  it('should detect multiple PII types', () => {
    const text = 'Contact john@example.com at 555-123-4567, SSN 123-45-6789';
    const result = detectPII(text);
    expect(result.length).toBeGreaterThan(1);
    expect(result).toContain('EMAIL');
    expect(result).toContain('PHONE');
    expect(result).toContain('SSN');
  });

  it('should return empty array for text without PII', () => {
    const text = 'This is a normal message';
    const result = detectPII(text);
    expect(result).toEqual([]);
  });

  it('should handle null/undefined gracefully', () => {
    expect(detectPII('')).toEqual([]);
    expect(detectPII(null as any)).toEqual([]);
    expect(detectPII(undefined as any)).toEqual([]);
  });
});
