# Deadline Monitoring System Integration Guide

## Overview

The deadline monitoring system automatically tracks critical immigration case deadlines and sends timely reminders to users. This is a core feature of the Guardian Plan subscription.

## Components

### 1. Core Monitoring Library (`src/lib/deadline-monitor.ts`)

Main functions:

- `generateDeadlines(caseId, caseType, approvalDate)`: Auto-generates deadlines based on case type and dates
- `checkUpcomingDeadlines()`: Scans all cases for reminders due
- `sendReminderEmail(alert, userEmail, userName)`: Sends deadline reminder emails
- `getCaseDeadlines(caseId)`: Gets all deadlines for a specific case
- `markDeadlineCompleted(deadlineId)`: Marks a deadline as completed

### 2. API Routes

#### GET/POST `/api/deadlines`
- List all deadlines for authenticated user's cases
- POST: Add manual deadline (attorney only)

#### POST `/api/deadlines/check`
- Trigger deadline check (use with cron job)
- Returns summary of alerts processed
- Sends reminder emails

#### GET/POST `/api/cases/[id]/deadlines`
- GET: List deadlines for specific case
- POST: Auto-generate deadlines based on case type

### 3. React Component (`src/components/DeadlineWidget.tsx`)

Displays deadlines with:
- Timeline view with color coding
- Green (60+ days), Amber (30-60 days), Red (<30 days)
- Compact mode for dashboards
- Full view for dedicated pages

## Immigration Deadline Rules

### Implemented Deadlines

1. **I-751 (Remove Conditions)**
   - Due: 90 days before 2-year anniversary of conditional green card
   - Critical: Failing to file means automatic green card loss

2. **N-400 (Citizenship)**
   - Eligible: 90 days before anniversary
   - Marriage-based: 3 years from green card
   - Employment-based: 5 years from green card

3. **I-90 (Green Card Renewal)**
   - Due: 6 months before 10-year expiration
   - Note: Can file up to 6 months before expiration

4. **RFE Response (Request for Evidence)**
   - Due: 87 days from RFE issue date
   - Critical: Automatic denial if missed

5. **I-765 (EAD Renewal)**
   - Due: 180 days before expiration
   - Usually 2-year validity from approval

6. **I-131 (Travel Document)**
   - Must file before international travel
   - Typically valid for 2 years

7. **AR-11 (Address Change)**
   - Due: Within 10 days of moving
   - Required even for temporary moves

## Reminder Schedule

Reminders are sent at these intervals before deadlines:

- 90 days: First reminder
- 60 days: Second reminder
- 30 days: Urgent reminder
- 14 days: Critical reminder
- 7 days: Final warning

## Integration Points

### On Case Creation

When a case is created with status='submitted', auto-generate deadlines:

```typescript
const approvalDate = new Date(); // Or get from case data
const deadlines = generateDeadlines(caseId, 'I-485', approvalDate);
// Save to database
```

### On Status Change

When case status changes to 'approved', generate deadlines if not exists:

```typescript
if (newStatus === 'approved' && !deadlines.length) {
  const generated = generateDeadlines(caseId, caseType, approvalDate);
  // Save to database
}
```

### Scheduled Deadline Check

Set up a cron job to run every hour or daily:

```bash
# Example: Run every day at 2 AM
0 2 * * * curl -X POST https://app.greencard.ai/api/deadlines/check \
  -H "Authorization: Bearer ${INTERNAL_API_KEY}"
```

### Dashboard Integration

Add deadline widget to case detail page:

```tsx
import { DeadlineWidget, DeadlineSummary } from '@/components/DeadlineWidget';

export default function CaseDetails() {
  const [deadlines, setDeadlines] = useState([]);

  useEffect(() => {
    fetchDeadlines(caseId);
  }, [caseId]);

  return (
    <>
      <DeadlineSummary deadlines={deadlines} />
      <DeadlineWidget deadlines={deadlines} caseId={caseId} />
    </>
  );
}
```

## Environment Variables

```bash
# Email service
RESEND_API_KEY=your_resend_api_key

# Internal API security
INTERNAL_API_KEY=your_internal_api_key

# Database
DATABASE_URL=your_database_url
```

## Database

Existing `caseDeadlines` table is used:

```sql
CREATE TABLE case_deadlines (
  id UUID PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  deadline_type VARCHAR(100) NOT NULL,
  deadline_date TIMESTAMP NOT NULL,
  description TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_case_deadlines_case_id ON case_deadlines(case_id);
CREATE INDEX idx_case_deadlines_deadline_date ON case_deadlines(deadline_date);
```

## Error Handling

The system handles:

- Missing approval dates (deadline generation skipped)
- Case not found errors
- User not found errors
- Email sending failures (logged, not retried)
- Database connection issues (logged)
- Invalid deadline types (skipped)

All errors are logged via the logger utility and do not break the reminder check process.

## Testing

Run the test suite:

```typescript
import { runAllTests } from '@/lib/deadline-monitor.test';

runAllTests('test-case-id');
```

Tests verify:
- Deadline calculation accuracy
- Reminder schedule correctness
- Status color coding
- Edge cases (overdue, completed, today)

## Guardian Plan Features

The deadline monitoring system supports the Guardian Plan subscription:

- Unlimited deadline tracking
- Daily automated checks
- Email reminders at 5 intervals
- Dashboard visibility
- Case-level deadline management
- Attorney oversight and manual deadline addition

## Future Enhancements

Potential improvements:

1. SMS reminders for critical deadlines
2. Push notifications to mobile app
3. Calendar export (iCal/Google Calendar)
4. Recurring deadline templates
5. Team/attorney deadline delegation
6. RFE deadline auto-detection from documents
7. Integration with USCIS status API for automatic deadline adjustments
8. Deadline impact analysis (consequences of missing)

## Support and Debugging

For issues:

1. Check `INTERNAL_API_KEY` is set (required for deadline checks)
2. Verify email service is configured (`RESEND_API_KEY`)
3. Check database indexes exist for performance
4. Review logs in `/var/log/greencard-ai/` for errors
5. Test API endpoint: GET `/api/deadlines/check` returns status

## Legal Disclaimer

This system provides automated reminders but does not constitute legal advice. Immigration law compliance requires review by a licensed immigration attorney. Users are ultimately responsible for meeting all USCIS deadlines.
