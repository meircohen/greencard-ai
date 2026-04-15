# Document Upload Usage Examples

## Basic Page Implementation

```tsx
// app/dashboard/[caseId]/documents/page.tsx

'use client';

import { useState } from 'react';
import { DocumentUpload } from '@/components/DocumentUpload';
import { useRouter } from 'next/navigation';

interface Document {
  id: string;
  documentType: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
}

export default function DocumentsPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const router = useRouter();
  const [caseId, setCaseId] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadComplete = async (newDocument: Document) => {
    setDocuments([...documents, newDocument]);
    await router.refresh();
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': 'user-uuid-here',
        },
      });

      if (response.ok) {
        setDocuments(documents.filter((doc) => doc.id !== documentId));
        alert('Document deleted successfully');
      }
    } catch (error) {
      alert('Failed to delete document');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Case Documents</h1>

      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
        <DocumentUpload
          caseId={caseId}
          documentType="general"
          onUploadComplete={handleUploadComplete}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Uploaded Documents</h2>
        {documents.length === 0 ? (
          <p className="text-gray-600">No documents uploaded yet</p>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-900">{doc.fileName}</p>
                  <p className="text-sm text-gray-600">
                    {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-xs text-gray-500">
                    Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

## Multiple Document Types

```tsx
// app/dashboard/[caseId]/upload/page.tsx

'use client';

import { useState } from 'react';
import { DocumentUpload } from '@/components/DocumentUpload';

const DOCUMENT_TYPES = [
  { value: 'passport', label: 'Passport' },
  { value: 'visa', label: 'Visa' },
  { value: 'birth_certificate', label: 'Birth Certificate' },
  { value: 'marriage_certificate', label: 'Marriage Certificate' },
  { value: 'employment_letter', label: 'Employment Letter' },
  { value: 'tax_return', label: 'Tax Return' },
  { value: 'medical_exam', label: 'Medical Exam' },
  { value: 'police_clearance', label: 'Police Clearance' },
];

export default function UploadPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const [selectedType, setSelectedType] = useState(DOCUMENT_TYPES[0].value);
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);
  const [caseId, setCaseId] = useState('');

  const handleUploadComplete = (document: any) => {
    setUploadedDocs([...uploadedDocs, document.documentType]);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Upload Case Documents</h1>

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Document Type
        </label>
        <select
          value={selectedType}
          onChange={handleTypeChange}
          className="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 hover:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900"
        >
          {DOCUMENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <DocumentUpload
        caseId={caseId}
        documentType={selectedType}
        onUploadComplete={handleUploadComplete}
      />

      {uploadedDocs.length > 0 && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">
            Successfully Uploaded:
          </h3>
          <ul className="list-disc list-inside text-green-800">
            {uploadedDocs.map((doc, i) => (
              <li key={i}>{doc}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

## With Authentication Context

```tsx
// components/DocumentUploadWithAuth.tsx

'use client';

import { useAuth } from '@/hooks/useAuth';
import { DocumentUpload } from '@/components/DocumentUpload';

interface Props {
  caseId: string;
  documentType: string;
  onUploadComplete?: (doc: any) => void;
}

export function DocumentUploadWithAuth({
  caseId,
  documentType,
  onUploadComplete,
}: Props) {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          Please log in to upload documents
        </p>
      </div>
    );
  }

  return (
    <DocumentUpload
      caseId={caseId}
      documentType={documentType}
      onUploadComplete={onUploadComplete}
    />
  );
}
```

## API Usage Examples

### Using fetch

```typescript
// Upload a document
const formData = new FormData();
formData.append('file', fileObject);
formData.append('caseId', 'case-uuid');
formData.append('documentType', 'passport');

const response = await fetch('/api/documents/upload', {
  method: 'POST',
  headers: {
    'x-user-id': 'user-uuid',
  },
  body: formData,
});

const document = await response.json();
```

### Retrieving document metadata

```typescript
const response = await fetch('/api/documents/doc-uuid', {
  headers: {
    'x-user-id': 'user-uuid',
  },
});

const document = await response.json();
```

### Deleting a document

```typescript
const response = await fetch('/api/documents/doc-uuid', {
  method: 'DELETE',
  headers: {
    'x-user-id': 'user-uuid',
  },
});

if (response.ok) {
  console.log('Document deleted');
}
```

## Integration with Middleware

Ensure your middleware passes the user ID header:

```typescript
// middleware.ts

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const userId = request.cookies.get('user_id')?.value;
  if (userId) {
    response.headers.set('x-user-id', userId);
  }

  return response;
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
};
```

## Error Handling Examples

```tsx
// Handle upload errors
const handleUploadError = (error: string) => {
  if (error.includes('exceeds maximum')) {
    alert('File is too large. Maximum size is 10MB.');
  } else if (error.includes('not allowed')) {
    alert('File type not supported. Use PDF, JPEG, PNG, or HEIC.');
  } else {
    alert('Upload failed: ' + error);
  }
};

// Usage
<DocumentUpload
  caseId={caseId}
  documentType={documentType}
  onError={handleUploadError}
/>
```

## Styling Customization

The component uses Tailwind classes with the blue-900 theme. Customize by:

1. Modifying the component's className values
2. Using Tailwind configuration to adjust blue-900
3. Wrapping the component in a custom container div

Example wrapper:

```tsx
<div className="p-6 bg-white rounded-lg shadow">
  <DocumentUpload
    caseId={caseId}
    documentType={documentType}
    onUploadComplete={handleUploadComplete}
  />
</div>
```
