# GreenCard.ai Email Notification System - Setup Guide

## Overview

A comprehensive email notification system has been built for the GreenCard.ai platform. This system sends professionally designed, branded email notifications for critical case events and updates.

## Files Created/Modified

### 1. `/src/lib/email-templates.ts` (Expanded: 1006 lines)

**New Email Templates:**

- `caseStatusUpdateEmail(name, caseType, oldStatus, newStatus, nextSteps)` - Sent when case status changes (approved, denied, processing, etc.)
- `documentReceivedEmail(name, documentType, caseType)` - Sent when a document is uploaded and received
- `deadlineReminderEmailNew(name, deadlineType, deadlineDate, daysRemaining, caseType)` - Sent for upcoming deadlines with color-coded urgency
- `paymentReceiptEmail(name, amount, planName, date, receiptUrl)` - Payment confirmation with receipt link
- `welcomeEmailNew(name, caseType)` - Sent after signup or case creation
- `rfeAlertEmail(name, caseType, rfeDeadline, rfeDescription)` - RFE (Request for Evidence) received alert
- `caseApprovedEmail(name, caseType, approvalDate, nextSteps)` - Case approval celebration email

**Branding Updates:**

- Changed primary color to blue-900 (#1e3a8a) for professional legal appearance
- Added Partner Immigration Law, PLLC legal disclaimer
- Added WhatsApp contact link and phone number (555) 123-4567
- Professional header with white text on blue background
- Responsive mobile-friendly design with proper inline CSS
- Color-coded status indicators (green for success, red for urgent, orange for warning)

### 2. `/src/lib/notifications.ts` (New: 9.5 KB)

Notification service with the following functions:

**Core Functions:**

- `sendCaseUpdate(userId, caseId, oldStatus, newStatus, nextSteps): Promise<boolean>`
  - Sends email when case status changes
  - Looks up user email from database
  - Builds email from template
  - Logs success/failure

- `sendDocumentReceived(userId, caseId, documentType): Promise<boolean>`
  - Sent when documents are uploaded
  - Retrieves document and case details
  - Professional notification template

- `sendDeadlineReminder(userId, caseId, deadlineId): Promise<boolean>`
  - Sends deadline reminder with days remaining
  - Calculates urgency (7 days or less = urgent)
  - Color-coded for urgency level

- `sendPaymentReceipt(userId, paymentId): Promise<boolean>`
  - Sends payment confirmation
  - Retrieves payment details
  - Formats amount and date
  - Includes receipt link

- `sendWelcome(userId): Promise<boolean>`
  - Sent after registration/case creation
  - Includes onboarding steps
  - Feature highlights

- `sendRfeAlert(userId, caseId, rfeDeadline, rfeDescription): Promise<boolean>`
  - URGENT notification for RFE received
  - Includes deadline and requested documents
  - Recommends immediate attorney contact

- `sendCaseApproved(userId, caseId, nextSteps): Promise<boolean>`
  - Celebration email when case is approved
  - Includes next steps
  - Professional congratulations message

**Error Handling:**

- Gracefully handles missing users, cases, or deadlines
- Logs all errors without throwing
- Returns boolean indicating success/failure
- Warns vs errors appropriately

**Database Operations:**

- Integrates with existing Drizzle ORM setup
- Queries users, cases, caseDeadlines, payments tables
- Efficient single query per operation

### 3. `/src/lib/db/schema.ts` (Enhanced)

**New Enum:**

```typescript
export const notificationTypeEnum = pgEnum('notification_type', [
  'case_status_update',
  'document_received',
  'deadline_reminder',
  'payment_receipt',
  'welcome',
  'rfe_alert',
  'case_approved',
  'system_alert',
]);
```

**New Table:**

```typescript
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  caseId: uuid('case_id').references(() => cases.id, { onDelete: 'cascade' }),
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  metadata: jsonb('metadata'),
  read: boolean('read').notNull().default(false),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  // Plus comprehensive indexes for performance
});
```

**Relationships Added:**

- Users -> notifications (one-to-many)
- Cases -> notifications (one-to-many)
- Notifications relations defined

### 4. `/src/app/api/notifications/route.ts` (Completely Rewritten)

**GET Endpoint:**

```
GET /api/notifications?page=1&limit=10&type=case_status_update&unread=true
```

- Lists notifications for authenticated user
- Supports pagination (page, limit)
- Filters by type (optional)
- Filters by unread status (optional)
- Returns:
  ```json
  {
    "success": true,
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 42,
      "totalPages": 5
    }
  }
  ```

**POST Endpoint:**

```
POST /api/notifications (admin only)
```

- Create notification manually
- Requires admin role
- Request body:
  ```json
  {
    "userId": "uuid",
    "caseId": "uuid", // optional
    "type": "system_alert",
    "title": "Important Update",
    "message": "Your case requires attention",
    "metadata": {} // optional
  }
  ```

**PATCH Endpoint:**

```
PATCH /api/notifications
```

- Mark notification as read/unread
- Authenticated users can only modify their own notifications
- Request body:
  ```json
  {
    "notificationId": "uuid",
    "read": true
  }
  ```
- Updates readAt timestamp

## Email Design Features

### Professional Styling

- Blue-900 (#1e3a8a) branded header
- White body with dark text for accessibility
- Inline CSS for email client compatibility
- Responsive tables for mobile devices
- Proper spacing and typography

### Legal Compliance

- Partner Immigration Law, PLLC disclaimer
- Proper notification footer
- Privacy link included
- Support contact information
- 24/7 availability notice

### Call-to-Action Buttons

- Color-coded by action type
- Green for positive actions (case approved, view)
- Red for urgent actions (RFE, action required)
- Orange for warnings (deadline reminders)
- Blue for standard actions

### Contact Integration

- Email: support@greencard.ai
- Phone: (555) 123-4567
- WhatsApp: Contact link included
- 24/7 availability messaging

## Database Migration Required

Run the following migration to create the notifications table:

```sql
CREATE TYPE notification_type AS ENUM (
  'case_status_update',
  'document_received',
  'deadline_reminder',
  'payment_receipt',
  'welcome',
  'rfe_alert',
  'case_approved',
  'system_alert'
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT notifications_case_id_fkey FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_case_id ON notifications(case_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
```

## Integration Examples

### Send Case Status Update

```typescript
import { sendCaseUpdate } from '@/lib/notifications';

await sendCaseUpdate(
  userId,
  caseId,
  'submitted',
  'processing',
  'Your case is now being reviewed by USCIS. You will receive updates as your case progresses.'
);
```

### Send Deadline Reminder

```typescript
import { sendDeadlineReminder } from '@/lib/notifications';

await sendDeadlineReminder(userId, caseId, deadlineId);
```

### Send Welcome Email

```typescript
import { sendWelcome } from '@/lib/notifications';

await sendWelcome(userId);
```

### Send RFE Alert

```typescript
import { sendRfeAlert } from '@/lib/notifications';

await sendRfeAlert(
  userId,
  caseId,
  new Date('2025-05-15'),
  'USCIS is requesting additional documentation including: Employment verification letters, Educational credentials, Financial proof of support'
);
```

### Fetch User's Notifications

```typescript
// Fetch all unread notifications
const response = await fetch('/api/notifications?unread=true', {
  headers: {
    'x-user-id': userId
  }
});

// Fetch notifications filtered by type
const response = await fetch('/api/notifications?type=deadline_reminder&limit=5', {
  headers: {
    'x-user-id': userId
  }
});
```

### Mark Notification as Read

```typescript
const response = await fetch('/api/notifications', {
  method: 'PATCH',
  headers: {
    'x-user-id': userId,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    notificationId: 'uuid',
    read: true
  })
});
```

## Email Client Support

All templates are designed for:

- Gmail
- Outlook
- Apple Mail
- Yahoo Mail
- Mobile email clients (iOS Mail, Gmail App)
- Web-based email clients

## Color Palette

- Primary Brand: #1e3a8a (Blue-900)
- Accent: #3b82f6 (Blue-500)
- Success: #10b981 (Green-500)
- Warning: #f59e0b (Orange-400)
- Error: #dc2626 (Red-600)
- Dark Background: #0f172a (Slate-950)
- Text Primary: #f1f5f9 (Slate-50)
- Text Secondary: #cbd5e1 (Slate-300)

## Configuration

All email templates are environment-agnostic:

- Uses existing `sendEmail()` function from `/src/lib/email.ts`
- Falls back to console logging if RESEND_API_KEY not set (dev mode)
- No additional environment variables needed

## Security Notes

- All notifications are scoped to authenticated users
- Users can only view/modify their own notifications
- Admin-only endpoint for bulk notification creation
- Database queries use parameterized queries (Drizzle ORM)
- No sensitive data in email subjects
- URLs are safe and don't contain user credentials

## Performance Optimization

- Efficient database indexes on commonly queried fields
- Pagination support to limit result sets
- Lazy loading of case and user details
- Single database query per notification action
- Async email sending (non-blocking)

## Next Steps

1. Run database migration to create notifications table
2. Update any case status update endpoints to call `sendCaseUpdate()`
3. Update document upload endpoints to call `sendDocumentReceived()`
4. Set up deadline reminder job (consider using node-cron or similar)
5. Integrate payment confirmation to call `sendPaymentReceipt()`
6. Add welcome email trigger to user registration flow
7. Add RFE detection to case processing workflow
8. Add case approval trigger to case status update logic

## Support

For questions about the notification system, refer to:

- `/src/lib/notifications.ts` - Function signatures and logic
- `/src/lib/email-templates.ts` - Email template code and styling
- `/src/app/api/notifications/route.ts` - API endpoints and responses
- `/src/lib/db/schema.ts` - Database schema and relationships
