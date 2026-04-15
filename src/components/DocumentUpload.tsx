'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X, FileText, Image, AlertCircle, CheckCircle } from 'lucide-react';

interface DocumentUploadProps {
  caseId: string;
  documentType: string;
  onUploadComplete?: (document: any) => void;
}

interface UploadProgress {
  isUploading: boolean;
  progress: number;
  fileName?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  caseId,
  documentType,
  onUploadComplete,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    isUploading: false,
    progress: 0,
  });
  const [preview, setPreview] = useState<{
    type: 'image' | 'pdf';
    src: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/heic'];

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only PDF, JPEG, PNG, and HEIC files are allowed';
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !['pdf', 'jpg', 'jpeg', 'png', 'heic'].includes(extension)) {
      return 'Invalid file extension';
    }

    return null;
  };

  const createPreview = (file: File): void => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (file.type === 'application/pdf') {
        setPreview({ type: 'pdf', src: file.name });
      } else {
        setPreview({ type: 'image', src: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadFile = async (file: File): Promise<void> => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSuccess(null);
    setUploadProgress({
      isUploading: true,
      progress: 0,
      fileName: file.name,
    });

    try {
      createPreview(file);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('caseId', caseId);
      formData.append('documentType', documentType);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress({
            isUploading: true,
            progress: percentComplete,
            fileName: file.name,
          });
        }
      });

      await new Promise((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status === 201) {
            const document = JSON.parse(xhr.responseText);
            setUploadProgress({
              isUploading: false,
              progress: 100,
              fileName: file.name,
            });
            setSuccess(`${file.name} uploaded successfully`);
            onUploadComplete?.(document);
            resolve(document);
          } else {
            const errorData = JSON.parse(xhr.responseText);
            reject(new Error(errorData.error || 'Upload failed'));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('POST', '/api/documents/upload');
        xhr.send(formData);
      });

      setTimeout(() => {
        setUploadProgress({ isUploading: false, progress: 0 });
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      setUploadProgress({ isUploading: false, progress: 0 });
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const clearPreview = () => {
    setPreview(null);
    setSuccess(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-blue-900 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-blue-900'
        } ${uploadProgress.isUploading || preview ? 'opacity-50' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleChange}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.heic"
          disabled={uploadProgress.isUploading}
        />

        <div className="flex flex-col items-center gap-3">
          <Upload className="w-8 h-8 text-blue-900" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              Drag and drop your document here
            </p>
            <p className="text-xs text-gray-600 mt-1">
              or{' '}
              <button
                onClick={handleClick}
                disabled={uploadProgress.isUploading}
                className="text-blue-900 hover:underline font-medium disabled:opacity-50"
              >
                click to browse
              </button>
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Supported formats: PDF, JPEG, PNG, HEIC (Max 10MB)
          </p>
        </div>

        {uploadProgress.isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-white bg-opacity-95">
            <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-900 animate-spin" />
            <p className="mt-4 text-sm font-medium text-gray-900">
              Uploading... {Math.round(uploadProgress.progress)}%
            </p>
            {uploadProgress.fileName && (
              <p className="text-xs text-gray-600 mt-1">{uploadProgress.fileName}</p>
            )}
          </div>
        )}
      </div>

      {preview && (
        <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
          {preview.type === 'image' ? (
            <img
              src={preview.src}
              alt="Preview"
              className="w-full h-auto max-h-64 object-contain bg-gray-100"
            />
          ) : (
            <div className="flex items-center gap-3 p-4 bg-gray-100">
              <FileText className="w-8 h-8 text-red-600 flex-shrink-0" />
              <span className="text-sm font-medium text-gray-900 truncate">
                {preview.src}
              </span>
            </div>
          )}
          <div className="bg-white p-3 border-t border-gray-200 flex justify-between items-center">
            <span className="text-xs text-gray-600">Document preview</span>
            <button
              onClick={clearPreview}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Clear preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Upload failed</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-900">Success</p>
            <p className="text-sm text-green-700 mt-1">{success}</p>
          </div>
        </div>
      )}
    </div>
  );
};
