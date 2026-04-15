# Notifications System - Quick Reference

## Email Templates Available

### 1. Case Status Update
**When:** Case status changes (draft > submitted > processing > approved/denied)
```typescript
caseStatusUpdateEmail(
  name: string,           // "John Doe"
  caseType: string,       // "EB-3"
  oldStatus: string,      // "submitted"
  newStatus: string,      // "processing"
  nextSteps: string       // "Your case is now under review..."
)
```

### 2. Document Received
**When:** User uploads a document to their case
```typescript
documentReceivedEmail(
  name: string,           // "John Doe"
  documentType: string,   // "Passport Scan"
  caseType: string        // "EB-3"
)
```

### 3. Deadline Reminder
**When:** Upcoming deadline (typically sent 3, 7, and 14 days before)
```typescript
deadlineReminderEmailNew(
  name: string,           // "John Doe"
  deadlineType: string,   // "USCIS Response Required"
  deadlineDate: string,   // "May 15, 2025"
  daysRemaining: number,  // 7
  caseType: string        // "EB-3"
)
```

### 4. Payment Receipt
**When:** Successful payment processed
```typescript
paymentReceiptEmail(
  name: string,           // "John Doe"
  amount: string,         // "$299.99"
  planName: string,       // "Professional Plan"
  date: string,           // "April 15, 2026"
  receiptUrl: string      // "https://greencard.ai/receipts/uuid"
)
```

### 5. Welcome Email
**When:** User registers or creates first case
```typescript
welcomeEmailNew(
  name: string,           // "John Doe"
  caseType: string        // "Family-Based EB-2"
)
```

### 6. RFE Alert (Request for Evidence)
**When:** USCIS issues an RFE
```typescript
rfeAlertEmail(
  name: string,           // "John Doe"
  caseType: string,       // "EB-3"
  rfeDeadline: string,    // "June 15, 2025"
  rfeDescription: string  // "Please provide employment verification..."
)
```

### 7. Case Approved
**When:** Case receives approval
```typescript
caseApprovedEmail(
  name: string,           // "John Doe"
  caseType: string,       // "EB-3"
  approvalDate: string,   // "April 15, 2026"
  nextSteps: string       // "Proceed to visa interview..."
)
```

## Notification Service Functions

```typescript
sendCaseUpdate(userId, caseId, oldStatus, newStatus, nextSteps): Promise<boolean>
sendDocumentReceived(userId, caseId, documentType): Promise<boolean>
sendDeadlineReminder(userId, caseId, deadlineId): Promise<boolean>
sendPaymentReceipt(userId, paymentId): Promise<boolean>
sendWelcome(userId): Promise<boolean>
sendRfeAlert(userId, caseId, rfeDeadline, rfeDescription): Promise<boolean>
sendCaseApproved(userId, caseId, nextSteps): Promise<boolean>
```

All return Promise<boolean> - true if successful, false if failed.

## API Endpoints

### GET /api/notifications
Fetch user's notifications with pagination and filtering

Query params: page, limit (max 50), type, unread

### PATCH /api/notifications
Mark notification as read/unread

Body: { notificationId, read }

### POST /api/notifications (admin)
Create notification manually

Body: { userId, caseId, type, title, message, metadata }

## Email Styling
- Primary: #1e3a8a (Blue-900)
- Success: #10b981
- Warning: #f59e0b
- Error: #dc2626
- Mobile responsive with inline CSS
- Professional legal footer with Partner Immigration Law disclaimer

## Database
Notifications table with indexes on: user_id, case_id, type, read, created_at

## Integration Examples

```typescript
// Case status change
await sendCaseUpdate(userId, caseId, 'submitted', 'processing', nextSteps);

// Document upload
await sendDocumentReceived(userId, caseId, 'Passport');

// Deadline reminder
await sendDeadlineReminder(userId, caseId, deadlineId);

// Payment confirmation
await sendPaymentReceipt(userId, paymentId);

// New user
await sendWelcome(userId);

// RFE received
await sendRfeAlert(userId, caseId, new Date('2025-05-15'), 'Employment docs needed');

// Case approved
await sendCaseApproved(userId, caseId, 'Proceed to visa interview');
```

## All Done
The notification system is production-ready. Run the database migration and integrate the functions into your application workflows.
