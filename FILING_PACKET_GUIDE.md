# Filing Packet System and G-28 Form Generator

Auto-generated filing packets and G-28 form generator for USCIS immigration case submissions.

## Overview

This system automates the assembly of filing packets for immigration cases, including:
- Automatic cover letter generation
- Filing fee calculation based on forms
- Document checklists with compliance tracking
- Correct USCIS lockbox address routing
- G-28 Notice of Entry of Appearance form generation

## Files Created

### Library Files

1. **`src/lib/uscis-addresses.ts`**
   - USCIS lockbox addresses for all major form types
   - Includes: I-130, I-140, I-485, I-765, I-131, I-539, I-129, I-129F, N-400, I-90, I-131A, I-864, I-693
   - Geographic routing for different service centers
   - Address formatting utilities

2. **`src/lib/filing-packet.ts`**
   - `generateFilingPacket(caseId)` - Main packet generation function
   - Generates cover letters dynamically
   - Calculates filing fees from form combinations
   - Creates form ordering per USCIS requirements
   - Builds document checklists with required/optional tracking
   - Returns structured FilingPacket object

3. **`src/lib/g28-generator.ts`**
   - `generateG28(input)` - Generate from custom data
   - `generateG28FromCase(caseId)` - Generate from case data
   - `generateG28WithDefaults(clientName)` - Use Jeremy Knight defaults (Bar #1009132)
   - `renderG28AsHTML(formData)` - HTML output for display/printing
   - Handles attorney information from case or defaults

### API Routes

4. **`src/app/api/cases/[id]/packet/route.ts`**
   - GET endpoint to generate filing packet
   - Requires attorney or admin role
   - Returns complete FilingPacket as JSON
   - Input: case ID from URL
   - Output: FilingPacket object with all sections

5. **`src/app/api/cases/[id]/g28/route.ts`**
   - POST endpoint to generate G-28 form
   - Requires attorney or admin role
   - Optional request body:
     ```json
     {
       "useDefaults": true,
       "clientName": "Override Client Name",
       "clientANumber": "A123456789"
     }
     ```
   - Returns G28FormData object

### UI Component

6. **`src/components/FilingPacketButton.tsx`**
   - Reusable React component for attorney dashboard
   - Props: caseId, caseType (optional)
   - Features:
     - Click to generate filing packet
     - Modal display with all packet details
     - Cover letter preview
     - Forms list with status tracking
     - Fee breakdown table
     - Document checklist
     - Mailing address display
     - Download as HTML button
   - Uses shadcn/ui components (Dialog, ScrollArea, Button, Alert)

## Usage Examples

### Generate Filing Packet (API)

```bash
curl -X GET https://your-api.com/api/cases/uuid-here/packet \
  -H "x-user-id: user-uuid" \
  -H "x-user-role: attorney"
```

### Generate G-28 (API)

```bash
curl -X POST https://your-api.com/api/cases/uuid-here/g28 \
  -H "x-user-id: user-uuid" \
  -H "x-user-role: attorney" \
  -H "Content-Type: application/json" \
  -d '{
    "useDefaults": true,
    "clientName": "John Doe"
  }'
```

### Use Component in React

```tsx
import { FilingPacketButton } from "@/components/FilingPacketButton";

export function CaseDetails({ caseId, caseType }) {
  return (
    <div>
      <h1>{caseType} Case</h1>
      <FilingPacketButton caseId={caseId} caseType={caseType} />
    </div>
  );
}
```

## Features

### Filing Packet Generation

- **Cover Letter**: Auto-generated with case details, form list, and attorney info
- **Fee Calculation**: Sums all applicable form fees (verified against USCIS April 2025 rates)
- **Form Ordering**: Automatically orders forms per USCIS submission requirements
- **Document Checklist**: Tracks required vs uploaded documents
- **Lockbox Routing**: Determines correct USCIS mailing address based on primary form
- **Warning Notes**: Alerts about incomplete documents or forms in draft status

### G-28 Form Generation

- **Attorney Information**: Pulls from case assignment or uses Jeremy Knight defaults
- **Client Information**: Extracts from case and user profiles
- **Date Handling**: Automatic date formatting for signatures
- **HTML Rendering**: Clean HTML output for printing or PDF conversion
- **Flexible Input**: Accepts custom data or auto-generates from case data

## Attorney Default Information

Jeremy Knight default information (used when no attorney assigned):
- Name: Jeremy Knight
- Bar Number: 1009132
- Firm: Partner Immigration Law PLLC
- City: Fort Lauderdale
- State: FL
- Zip: 33312

To change defaults, edit `src/lib/g28-generator.ts` JEREMY_KNIGHT_DEFAULT constant.

## Data Flow

1. Attorney clicks "Generate Filing Packet" button
2. Component calls API endpoint with case ID
3. API handler:
   - Verifies attorney has access to case
   - Calls `generateFilingPacket(caseId)`
   - Generator fetches case, forms, documents from database
   - Calculates fees, generates cover letter, builds checklist
   - Returns structured packet object
4. Component displays packet in modal with preview options
5. Attorney can download as HTML for further processing

## Database Dependencies

Requires these tables in database:
- `cases` - Case information (ID, type, status, attorney assignment)
- `case_forms` - Forms attached to case (form number, status)
- `case_documents` - Documents uploaded (document type, file info)
- `users` - User information (name, email, phone)
- `user_profiles` - Client profiles (first/last name, A-number)
- `attorney_profiles` - Attorney info (bar number, firm name)

## Security

- Requires authentication (x-user-id header)
- Enforces attorney/admin role check
- Verifies user owns case or is assigned attorney
- No sensitive data in URLs
- No credit card or banking info in form

## Testing

All new files compile successfully without TypeScript errors. To verify:

```bash
npm run build
```

## Notes

- USCIS lockbox addresses verified as of April 2026
- Filing fees from USCIS April 2025 fee schedule
- Always verify current fees/addresses at uscis.gov before actual filing
- HTML export can be converted to PDF using browser print-to-PDF
- Component uses shadcn/ui - ensure components are installed in your project

## Future Enhancements

- PDF generation instead of HTML
- Email sending for cover letter
- Signature capture for G-28
- Multi-document bundling
- Filing status tracking
- Confirmation of USCIS receipt
