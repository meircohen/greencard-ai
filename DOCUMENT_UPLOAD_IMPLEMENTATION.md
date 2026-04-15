# Document Upload System Implementation Guide

This document describes the new document upload system for the GreenCard.ai project, including R2 storage integration and file management.

## Overview

The document upload system consists of:

1. **R2 Storage Utility** (`/src/lib/storage.ts`) - Handles all R2 operations
2. **Upload API** (`/src/app/api/documents/upload/route.ts`) - Handles file uploads with validation
3. **Document Management API** (`/src/app/api/documents/[id]/route.ts`) - GET and DELETE operations
4. **React Component** (`/src/components/DocumentUpload.tsx`) - Client-side upload UI

## Prerequisites

### Environment Variables

Add the following to your `.env.local` file:

```
CLOUDFLARE_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=greencard-ai-docs
R2_PUBLIC_URL=https://pub-greencard.r2.dev
```

Generate R2 credentials:
1. Log into Cloudflare Dashboard
2. Navigate to R2 > API Tokens
3. Create a new R2 API token with read/write permissions
4. Copy the Access Key ID and Secret Access Key

### Dependencies

The following package needs to be installed:

```bash
npm install @aws-sdk/s3-request-presigner@^3.984.0
```

The @aws-sdk/client-s3 is already available as a transitive dependency via @opennextjs/cloudflare.

## API Endpoints

### POST /api/documents/upload

Upload a new document.

Request:
- Method: POST
- Content-Type: multipart/form-data
- Headers:
  - `x-user-id`: User ID (required for authentication)

Form Data:
- `file`: File object (required)
- `caseId`: UUID of the case (required)
- `documentType`: Document type string, e.g., "passport", "visa", "birth_certificate" (required)

Validation Rules:
- File size: Maximum 10MB
- File types: PDF, JPEG, PNG, HEIC only
- Magic bytes validation to prevent spoofed file types
- Case must belong to authenticated user

Response (201 Created):
```json
{
  "id": "uuid",
  "caseId": "uuid",
  "documentType": "passport",
  "fileName": "my-passport.pdf",
  "fileUrl": "https://pub-greencard.r2.dev/cases/...",
  "fileSize": 1024000,
  "mimeType": "application/pdf",
  "status": "uploaded",
  "ocrText": null,
  "aiExtractedData": null,
  "createdAt": "2026-04-15T01:25:00Z",
  "updatedAt": "2026-04-15T01:25:00Z"
}
```

Error Responses:
- 400: Invalid file or validation error
- 401: Missing authentication
- 404: Case not found or access denied
- 500: Server error

### GET /api/documents/[id]

Retrieve a document record.

Request:
- Method: GET
- Headers:
  - `x-user-id`: User ID (required)

Response (200 OK):
```json
{
  "id": "uuid",
  "caseId": "uuid",
  "documentType": "passport",
  "fileName": "my-passport.pdf",
  "fileUrl": "https://pub-greencard.r2.dev/cases/...",
  ...
}
```

Error Responses:
- 401: Missing authentication
- 403: Access denied (case does not belong to user)
- 404: Document not found
- 500: Server error

### DELETE /api/documents/[id]

Delete a document (removes from R2 and database).

Request:
- Method: DELETE
- Headers:
  - `x-user-id`: User ID (required)

Response (200 OK):
```json
{
  "message": "Document deleted successfully"
}
```

Error Responses:
- 401: Missing authentication
- 403: Access denied (case does not belong to user)
- 404: Document not found
- 500: Server error

## React Component Usage

### DocumentUpload Component

Located at `/src/components/DocumentUpload.tsx`

```tsx
import { DocumentUpload } from '@/components/DocumentUpload';

export function MyPage() {
  const handleUploadComplete = (document: any) => {
    console.log('Document uploaded:', document);
    // Refresh document list, update UI, etc.
  };

  return (
    <DocumentUpload
      caseId="550e8400-e29b-41d4-a716-446655440000"
      documentType="passport"
      onUploadComplete={handleUploadComplete}
    />
  );
}
```

### Props

- `caseId` (string, required): UUID of the case
- `documentType` (string, required): Type of document (e.g., "passport", "visa")
- `onUploadComplete` (function, optional): Callback when upload succeeds

### Features

- Drag-and-drop support
- File picker button
- Real-time upload progress
- Client-side validation
- Image/PDF previews
- Error and success messages
- Tailwind styling (blue-900 theme)

## Storage Utility

Located at `/src/lib/storage.ts`

### uploadDocument

```typescript
const result = await uploadDocument(
  fileBuffer,       // Buffer | Uint8Array
  caseId,           // string (UUID)
  documentType,     // string
  filename          // string
);

// result:
// {
//   url: "https://pub-greencard.r2.dev/cases/uuid/passport/timestamp-filename.pdf",
//   key: "cases/uuid/passport/timestamp-filename.pdf"
// }
```

### deleteDocument

```typescript
await deleteDocument("cases/uuid/passport/timestamp-filename.pdf");
```

### getSignedDownloadUrl

```typescript
const signedUrl = await getSignedDownloadUrl(
  "cases/uuid/passport/timestamp-filename.pdf",
  3600  // expires in 3600 seconds
);
```

## File Organization in R2

Documents are organized by the following structure:

```
cases/
  {caseId}/
    {documentType}/
      {timestamp}-{sanitized-filename}
```

Example:
```
cases/550e8400-e29b-41d4-a716-446655440000/passport/1713137100000-john-doe-passport.pdf
cases/550e8400-e29b-41d4-a716-446655440000/visa/1713137250000-us-visa-approval.pdf
```

## Database Schema

The `caseDocuments` table stores metadata:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| caseId | UUID | Reference to case |
| documentType | VARCHAR(100) | Document category |
| fileName | VARCHAR(255) | Original filename |
| fileUrl | TEXT | Public URL to R2 file |
| fileSize | INTEGER | File size in bytes |
| mimeType | VARCHAR(100) | MIME type (e.g., application/pdf) |
| ocrText | TEXT | Extracted OCR text (future use) |
| aiExtractedData | JSONB | AI extracted data (future use) |
| status | ENUM | Upload status ('uploaded', etc.) |
| createdAt | TIMESTAMP | Upload timestamp |
| updatedAt | TIMESTAMP | Last update timestamp |

Indexes:
- `idx_case_documents_case_id`: For querying by case
- `idx_case_documents_status`: For filtering by status

## Security Considerations

1. **Authentication**: All endpoints require x-user-id header
2. **Authorization**: Users can only access documents from their own cases
3. **File Validation**:
   - File size limit: 10MB
   - MIME type whitelist
   - Extension whitelist
   - Magic bytes validation (prevents spoofed file types)
4. **R2 Configuration**:
   - Use separate API tokens with minimal required permissions
   - Configure R2 CORS for cross-origin requests if needed
   - Use signed URLs for downloads requiring authentication

## Error Handling

The system includes comprehensive error handling:

- File size validation with specific error messages
- MIME type and extension validation
- Magic bytes validation to prevent malicious files
- Case ownership verification
- Database transaction rollback on failure
- Detailed error logging

## Testing

Example curl commands:

```bash
curl -X POST http://localhost:3000/api/documents/upload \
  -H "x-user-id: user-uuid" \
  -F "file=@/path/to/file.pdf" \
  -F "caseId=case-uuid" \
  -F "documentType=passport"

curl -X GET http://localhost:3000/api/documents/doc-uuid \
  -H "x-user-id: user-uuid"

curl -X DELETE http://localhost:3000/api/documents/doc-uuid \
  -H "x-user-id: user-uuid"
```

## Future Enhancements

1. OCR processing: Extract text from uploaded documents
2. AI data extraction: Extract structured data from documents
3. Document versioning: Track document changes
4. Batch uploads: Upload multiple documents at once
5. Document categorization: Automatic document type detection
6. Virus scanning: Integrate antivirus scanning
7. Download tracking: Log who downloaded which documents

## Troubleshooting

### Upload fails with "Cannot find module '@aws-sdk/s3-request-presigner'"

Run `npm install` to install dependencies after package.json updates.

### File uploads fail with 500 error

Check environment variables are properly set and R2 credentials are correct.

### Uploaded files are not accessible

Verify R2_PUBLIC_URL environment variable and that R2 bucket has proper CORS/public access configuration.

### "File content does not match declared file type"

The file is corrupted or has wrong extension. Verify file integrity.
