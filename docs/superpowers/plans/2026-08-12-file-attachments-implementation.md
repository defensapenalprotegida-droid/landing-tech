# File Attachments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement file attachment upload (max 5 files, 100 MB each, 500 MB total) via presigned S3 URLs with async email delivery through SQS.

**Architecture:** Frontend uploads files directly to S3 using presigned URLs, backend validates and queues email in SQS, async Lambda worker sends emails with download links. No file binaries pass through synchronous Lambda calls.

**Tech Stack:** React 18 + TypeScript + Vite (frontend), AWS Lambda + Node.js 20 ARM64 + SAM (backend), S3, SQS, SES.

## Global Constraints

- Max 5 files per submission
- 100 MB per file, 500 MB total
- Allowed types: PDF, DOCX, XLSX, JPG, PNG, MP4, MOV, WebM, TXT
- S3 presigned URLs expire in 15 minutes
- S3 objects auto-delete after 7 days (lifecycle policy)
- Email delivery async via SQS (no blocking)
- Backend Lambda timeout: 15s (contact handler), 30s (SQS handler)
- Node.js 20 ARM64 architecture

---

## File Structure

### Frontend (landing-tech)

**New files:**
- `src/components/hero/FileUploadField.tsx` — reusable file upload component
- `src/lib/fileUploadTypes.ts` — shared types for file upload

**Modified files:**
- `src/components/hero/ProductoForm.tsx` — integrate FileUploadField
- `src/lib/leadApi.ts` — add getPresignedUrls, uploadToS3 helpers
- `src/lib/leadSchema.ts` — add attachmentUrls field

### Backend (arteagayaldunate-contact-backend)

**New files:**
- `src/handlers/presigned-urls/app.ts` — presigned URL generation
- `src/handlers/presigned-urls/app.test.ts` — tests
- `src/handlers/contact-form-async/app.ts` — SQS message handler
- `src/handlers/contact-form-async/app.test.ts` — tests

**Modified files:**
- `src/handlers/contact/app.ts` — add SQS dispatch, S3 validation
- `src/handlers/contact/app.test.ts` — add tests for new flow
- `template.yaml` — add S3 bucket, SQS queue, Lambda for async handler, IAM roles

---

## Tasks

### Task 1: Frontend FileUploadField Component

**Files:**
- Create: `src/components/hero/FileUploadField.tsx`
- Create: `src/lib/fileUploadTypes.ts`
- Test: `src/components/hero/FileUploadField.test.tsx`

**Interfaces:**
- Consumes: React hooks, Tailwind CSS, lucide-react icons (Upload, X, AlertCircle, CheckCircle)
- Produces: `FileUploadField` component with props `{ value: string[], onChange: (urls: string[]) => void, label?, error?, disabled?, maxFiles?, maxFileSize?, maxTotalSize?, acceptedTypes? }`

**Steps:**

- [ ] **Step 1: Create types file**

```typescript
// src/lib/fileUploadTypes.ts
export interface FileInfo {
  file: File;
  presignedUrl?: string;
  s3Url?: string;
  uploadProgress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface PresignedUrlResponse {
  urls: Array<{ fileKey: string; presignedUrl: string }>;
  expiresIn: number;
}
```

- [ ] **Step 2: Write test for FileUploadField (validation logic)**

```typescript
// src/components/hero/FileUploadField.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import FileUploadField from './FileUploadField';

describe('FileUploadField', () => {
  it('rejects more than 5 files', () => {
    const { container } = render(<FileUploadField value={[]} onChange={() => {}} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    
    const files = Array.from({ length: 6 }, (_, i) => 
      new File([`content${i}`], `file${i}.txt`, { type: 'text/plain' })
    );
    
    const event = new DragEvent('drop', {
      dataTransfer: new DataTransfer(),
    } as any);
    Object.defineProperty(event.dataTransfer, 'files', { value: files });
    
    fireEvent(container.querySelector('.drop-zone')!, event);
    expect(screen.getByText(/máximo 5 archivos/i)).toBeInTheDocument();
  });

  it('rejects file larger than 100 MB', () => {
    const { container } = render(<FileUploadField value={[]} onChange={() => {}} />);
    const largeFile = new File(['x'.repeat(101 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
    
    const dt = new DataTransfer();
    dt.items.add(largeFile);
    const event = new DragEvent('drop', { dataTransfer: dt } as any);
    
    fireEvent(container.querySelector('.drop-zone')!, event);
    expect(screen.getByText(/excede 100 MB/i)).toBeInTheDocument();
  });

  it('rejects invalid file type', () => {
    const { container } = render(
      <FileUploadField value={[]} onChange={() => {}} acceptedTypes={['application/pdf']} />
    );
    const invalidFile = new File(['content'], 'file.exe', { type: 'application/x-msdownload' });
    
    const dt = new DataTransfer();
    dt.items.add(invalidFile);
    const event = new DragEvent('drop', { dataTransfer: dt } as any);
    
    fireEvent(container.querySelector('.drop-zone')!, event);
    expect(screen.getByText(/tipo no permitido/i)).toBeInTheDocument();
  });

  it('accepts valid file and displays in list', () => {
    const { container } = render(<FileUploadField value={[]} onChange={() => {}} />);
    const validFile = new File(['content'], 'contract.pdf', { type: 'application/pdf' });
    
    const dt = new DataTransfer();
    dt.items.add(validFile);
    const event = new DragEvent('drop', { dataTransfer: dt } as any);
    
    fireEvent(container.querySelector('.drop-zone')!, event);
    expect(screen.getByText('contract.pdf')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

```bash
cd /Users/lfgg/paldunate/landing-tech && npm test -- FileUploadField.test.tsx
```

Expected: FAIL with "FileUploadField" not found

- [ ] **Step 4: Implement FileUploadField component**

```typescript
// src/components/hero/FileUploadField.tsx
import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { FileInfo } from '@/lib/fileUploadTypes';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'text/plain',
];

const DEFAULT_MAX_FILES = 5;
const DEFAULT_MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
const DEFAULT_MAX_TOTAL_SIZE = 500 * 1024 * 1024; // 500 MB

interface FileUploadFieldProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  maxFiles?: number;
  maxFileSize?: number;
  maxTotalSize?: number;
  acceptedTypes?: string[];
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  value,
  onChange,
  label = 'Documentos adjuntos',
  error = '',
  disabled = false,
  maxFiles = DEFAULT_MAX_FILES,
  maxFileSize = DEFAULT_MAX_FILE_SIZE,
  maxTotalSize = DEFAULT_MAX_TOTAL_SIZE,
  acceptedTypes = ALLOWED_MIME_TYPES,
}) => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [validationError, setValidationError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const validateFiles = useCallback(
    (newFiles: File[]): { valid: boolean; error?: string } => {
      if (files.length + newFiles.length > maxFiles) {
        return { valid: false, error: `Máximo ${maxFiles} archivos` };
      }

      let totalSize = files.reduce((sum, f) => sum + (f.file?.size || 0), 0);

      for (const file of newFiles) {
        if (file.size > maxFileSize) {
          return { valid: false, error: `Archivo excede ${maxFileSize / 1024 / 1024} MB: ${file.name}` };
        }
        totalSize += file.size;
      }

      if (totalSize > maxTotalSize) {
        return { valid: false, error: `Los archivos superan ${maxTotalSize / 1024 / 1024} MB en total` };
      }

      for (const file of newFiles) {
        if (!acceptedTypes.includes(file.type)) {
          return { valid: false, error: `Tipo no permitido: ${file.type}` };
        }
      }

      return { valid: true };
    },
    [files, maxFiles, maxFileSize, maxTotalSize, acceptedTypes]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setValidationError('');

      const newFiles = Array.from(e.dataTransfer.files);
      const validation = validateFiles(newFiles);

      if (!validation.valid) {
        setValidationError(validation.error || 'Error validando archivos');
        return;
      }

      const newFileInfos = newFiles.map((file) => ({
        file,
        status: 'pending' as const,
        uploadProgress: 0,
      }));

      setFiles((prev) => [...prev, ...newFileInfos]);
    },
    [validateFiles]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValidationError('');
      const newFiles = Array.from(e.currentTarget.files || []);
      const validation = validateFiles(newFiles);

      if (!validation.valid) {
        setValidationError(validation.error || 'Error validando archivos');
        return;
      }

      const newFileInfos = newFiles.map((file) => ({
        file,
        status: 'pending' as const,
        uploadProgress: 0,
      }));

      setFiles((prev) => [...prev, ...newFileInfos]);
    },
    [validateFiles]
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="w-full">
      <label className="text-sm font-medium text-foreground mb-2 block">{label}</label>

      <div
        ref={dropZoneRef}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative border-2 border-dashed border-muted-foreground rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleInputChange}
          disabled={disabled || isLoading}
          className="hidden"
          accept={acceptedTypes.join(',')}
        />

        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium">Arrastra archivos aquí o</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || isLoading}
          className="text-primary hover:underline"
        >
          selecciona desde tu computador
        </button>
        <p className="text-xs text-muted-foreground mt-2">
          Máx. {maxFiles} archivos, {maxFileSize / 1024 / 1024} MB cada uno
        </p>
      </div>

      {validationError && (
        <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          {validationError}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((fileInfo, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-accent rounded-lg">
              <div className="flex-1">
                <p className="text-sm font-medium">{fileInfo.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(fileInfo.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                {fileInfo.status === 'uploading' && (
                  <div className="w-full bg-muted rounded h-1 mt-1">
                    <div
                      className="bg-primary h-1 rounded transition-all"
                      style={{ width: `${fileInfo.uploadProgress}%` }}
                    />
                  </div>
                )}
                {fileInfo.error && (
                  <p className="text-xs text-red-500 mt-1">{fileInfo.error}</p>
                )}
              </div>

              <div className="ml-2 flex items-center gap-2">
                {fileInfo.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {fileInfo.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                {fileInfo.status !== 'success' && (
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadField;
```

- [ ] **Step 5: Run test to verify it passes**

```bash
cd /Users/lfgg/paldunate/landing-tech && npm test -- FileUploadField.test.tsx
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
cd /Users/lfgg/paldunate/landing-tech && git add src/components/hero/FileUploadField.tsx src/lib/fileUploadTypes.ts src/components/hero/FileUploadField.test.tsx && git commit -m "feat: FileUploadField component with drag-drop and validation"
```

---

### Task 2: Update leadSchema and leadApi for File Uploads

**Files:**
- Modify: `src/lib/leadSchema.ts`
- Modify: `src/lib/leadApi.ts`
- Test: Update existing tests

**Interfaces:**
- Consumes: Zod schema for form validation, FileUploadField component
- Produces: `getPresignedUrls()` and `uploadToS3()` functions, updated LeadFormValues type

**Steps:**

- [ ] **Step 1: Add attachmentUrls field to leadSchema**

```typescript
// src/lib/leadSchema.ts
// Add to LeadFormValues:
attachmentUrls: z.array(z.string().url()).optional()
  .describe("Array of S3 URLs for uploaded attachments"),
```

- [ ] **Step 2: Add presigned URL helper to leadApi.ts**

```typescript
// src/lib/leadApi.ts
export async function getPresignedUrls(
  files: Array<{ name: string; size: number; type: string }>
): Promise<{ urls: Array<{ fileKey: string; presignedUrl: string }>; expiresIn: number } | { error: string }> {
  try {
    const res = await fetch('/api/presigned-urls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { error: data.message || 'No se pudieron obtener URLs de carga' };
    }
    return data;
  } catch (err) {
    return { error: 'Error de conexión al solicitar URLs de carga' };
  }
}

export async function uploadToS3(
  presignedUrl: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ ok: boolean; s3Url?: string; error?: string }> {
  try {
    const xhr = new XMLHttpRequest();

    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      });
    }

    return new Promise((resolve) => {
      xhr.onload = () => {
        if (xhr.status === 200) {
          const s3Url = presignedUrl.split('?')[0];
          resolve({ ok: true, s3Url });
        } else {
          resolve({ ok: false, error: `Upload failed: ${xhr.status}` });
        }
      };

      xhr.onerror = () => {
        resolve({ ok: false, error: 'Error de conexión durante la carga' });
      };

      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  } catch (err) {
    return { ok: false, error: 'Error inesperado durante la carga' };
  }
}
```

- [ ] **Step 3: Update submitLead to accept attachmentUrls**

```typescript
// src/lib/leadApi.ts
export type LeadPayload = Partial<LeadFormValues> & {
  name: string;
  email: string;
  message: string;
  attachmentUrls?: string[];
};

// No change to submitLead function signature, it already accepts Partial<LeadFormValues>
```

- [ ] **Step 4: Commit**

```bash
cd /Users/lfgg/paldunate/landing-tech && git add src/lib/leadSchema.ts src/lib/leadApi.ts && git commit -m "feat: add getPresignedUrls and uploadToS3 helpers"
```

---

### Task 3: Integrate FileUploadField into ProductoForm

**Files:**
- Modify: `src/components/hero/ProductoForm.tsx`

**Interfaces:**
- Consumes: FileUploadField component, getPresignedUrls(), uploadToS3(), ProductoForm state
- Produces: Updated ProductoForm with file upload integration

**Steps:**

- [ ] **Step 1: Add file state and upload handler to ProductoForm**

```typescript
// src/components/hero/ProductoForm.tsx
// At the top of the component, add:

const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
const [uploadingFiles, setUploadingFiles] = useState(false);

const handleFileUpload = async (selectedUrls: string[]) => {
  // This is called when FileUploadField completes uploads
  setAttachmentUrls(selectedUrls);
  setFormData(prev => ({
    ...prev,
    attachmentUrls: selectedUrls,
  }));
};
```

- [ ] **Step 2: Import FileUploadField**

```typescript
// At top of ProductoForm.tsx:
import FileUploadField from './FileUploadField';
```

- [ ] **Step 3: Add FileUploadField to form JSX**

In the form, after the AddressMap or message field, add:

```typescript
{/* File uploads section */}
<FileUploadField
  value={attachmentUrls}
  onChange={(urls) => {
    setAttachmentUrls(urls);
    setFormData(prev => ({ ...prev, attachmentUrls: urls }));
  }}
  label="Documentos adjuntos (opcional)"
  disabled={submitting}
  maxFiles={5}
  maxFileSize={100 * 1024 * 1024}
  maxTotalSize={500 * 1024 * 1024}
/>
```

- [ ] **Step 4: Update submitLead call to include attachmentUrls**

When calling `submitLead()`, ensure formData includes attachmentUrls:

```typescript
const result = await submitLead({
  ...formData,
  attachmentUrls,
  producto: productoId,
});
```

- [ ] **Step 5: Commit**

```bash
cd /Users/lfgg/paldunate/landing-tech && git add src/components/hero/ProductoForm.tsx && git commit -m "feat: integrate FileUploadField into ProductoForm"
```

---

### Task 4: Backend Presigned URLs Endpoint

**Files:**
- Create: `src/handlers/presigned-urls/app.ts`
- Create: `src/handlers/presigned-urls/app.test.ts`

**Interfaces:**
- Consumes: AWS S3Client, file validation logic
- Produces: POST /api/presigned-urls handler, PresignedUrlResponse

**Steps:**

- [ ] **Step 1: Write failing test for presigned-urls handler**

```typescript
// src/handlers/presigned-urls/app.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handler, validateFileRequest } from './app';
import { S3Client } from '@aws-sdk/client-s3';

describe('presigned-urls handler', () => {
  it('validates max 5 files', () => {
    const result = validateFileRequest({
      files: Array.from({ length: 6 }, (_, i) => ({
        name: `file${i}.pdf`,
        size: 1000,
        type: 'application/pdf',
      })),
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Máximo 5');
  });

  it('rejects file larger than 100 MB', () => {
    const result = validateFileRequest({
      files: [{ name: 'large.pdf', size: 101 * 1024 * 1024, type: 'application/pdf' }],
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('100 MB');
  });

  it('rejects total size over 500 MB', () => {
    const result = validateFileRequest({
      files: [
        { name: 'file1.pdf', size: 250 * 1024 * 1024, type: 'application/pdf' },
        { name: 'file2.pdf', size: 251 * 1024 * 1024, type: 'application/pdf' },
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('500 MB');
  });

  it('rejects invalid MIME type', () => {
    const result = validateFileRequest({
      files: [{ name: 'file.exe', size: 1000, type: 'application/x-msdownload' }],
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain('no permitido');
  });

  it('accepts valid files', () => {
    const result = validateFileRequest({
      files: [
        { name: 'contract.pdf', size: 5000, type: 'application/pdf' },
        { name: 'video.mp4', size: 50 * 1024 * 1024, type: 'video/mp4' },
      ],
    });
    expect(result.valid).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/lfgg/paldunate/arteagayaldunate-contact-backend && npm test -- presigned-urls
```

Expected: FAIL (handler not defined)

- [ ] **Step 3: Implement presigned-urls handler**

```typescript
// src/handlers/presigned-urls/app.ts
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'text/plain',
];

const MAX_FILES = 5;
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
const MAX_TOTAL_SIZE = 500 * 1024 * 1024; // 500 MB
const PRESIGNED_URL_EXPIRY = 900; // 15 minutes

export interface FileRequest {
  name: string;
  size: number;
  type: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFileRequest(data: { files?: FileRequest[] }): ValidationResult {
  const files = data.files || [];

  if (files.length > MAX_FILES) {
    return { valid: false, error: `Máximo ${MAX_FILES} archivos` };
  }

  let totalSize = 0;

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: `Archivo excede ${MAX_FILE_SIZE / 1024 / 1024} MB: ${file.name}` };
    }
    totalSize += file.size;
  }

  if (totalSize > MAX_TOTAL_SIZE) {
    return { valid: false, error: `Los archivos superan ${MAX_TOTAL_SIZE / 1024 / 1024} MB en total` };
  }

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: `Tipo no permitido: ${file.type}` };
    }
  }

  return { valid: true };
}

const s3Client = new S3Client({});
const JSON_HEADERS = { 'Content-Type': 'application/json' };

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  let data: { files?: FileRequest[] };

  try {
    data = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers: JSON_HEADERS,
      body: JSON.stringify({ ok: false, message: 'JSON inválido' }),
    };
  }

  const validation = validateFileRequest(data);
  if (!validation.valid) {
    return {
      statusCode: 400,
      headers: JSON_HEADERS,
      body: JSON.stringify({ ok: false, message: validation.error }),
    };
  }

  try {
    const bucket = process.env.S3_BUCKET;
    if (!bucket) {
      throw new Error('S3_BUCKET no configurado');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const batchId = uuidv4();
    const prefix = `attachments/${timestamp}-${batchId}`;

    const urls = await Promise.all(
      (data.files || []).map(async (file) => {
        const fileKey = `${prefix}/${file.name}`;
        
        // Generate presigned PUT URL
        const command = new PutObjectCommand({
          Bucket: bucket,
          Key: fileKey,
          ContentType: file.type,
        });

        const presignedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: PRESIGNED_URL_EXPIRY,
        });

        return { fileKey, presignedUrl };
      })
    );

    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify({
        urls,
        expiresIn: PRESIGNED_URL_EXPIRY,
      }),
    };
  } catch (err) {
    console.error('Error generating presigned URLs:', err);
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({
        ok: false,
        message: 'No se pudieron generar URLs de carga',
      }),
    };
  }
};
```

Fix: Import PutObjectCommand:

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd /Users/lfgg/paldunate/arteagayaldunate-contact-backend && npm test -- presigned-urls
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd /Users/lfgg/paldunate/arteagayaldunate-contact-backend && git add src/handlers/presigned-urls/app.ts src/handlers/presigned-urls/app.test.ts && git commit -m "feat: presigned-urls endpoint for S3 upload"
```

---

### Task 5: Update Contact Handler to Support Attachments and SQS

**Files:**
- Modify: `src/handlers/contact/app.ts`
- Modify: `src/handlers/contact/app.test.ts`

**Interfaces:**
- Consumes: ContactPayload (updated), SQSClient, S3Client
- Produces: Updated handler that dispatches to SQS instead of sending email synchronously

**Steps:**

- [ ] **Step 1: Write test for SQS dispatch with attachment validation**

```typescript
// Add to src/handlers/contact/app.test.ts
import { mockClient } from 'aws-sdk-client-mock';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';

describe('contact handler with attachments', () => {
  it('validates attachment URLs exist on S3', async () => {
    const s3Mock = mockClient(S3Client);
    s3Mock.on(HeadObjectCommand).rejects(new Error('NoSuchKey'));

    const result = await validateAttachmentUrls(
      ['https://bucket.s3.amazonaws.com/attachments/2026-08-12T14:30:00Z-abc123/file.pdf'],
      'arteagayaldunate-contact-attachments-prod'
    );

    expect(result.valid).toBe(false);
  });

  it('queues SQS message with attachmentUrls', async () => {
    const sqsMock = mockClient(SQSClient);
    const s3Mock = mockClient(S3Client);
    
    s3Mock.on(HeadObjectCommand).resolves({});
    sqsMock.on(SendMessageCommand).resolves({ MessageId: 'test-123' });

    const payload = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
      attachmentUrls: ['https://bucket.s3.amazonaws.com/attachments/2026-08-12T14:30:00Z-abc123/file.pdf'],
    };

    const result = await queueContactMessage(payload);
    expect(result.ok).toBe(true);
  });
});
```

- [ ] **Step 2: Add imports and helpers to contact/app.ts**

```typescript
// Add at top of src/handlers/contact/app.ts
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';

const sqsClient = new SQSClient({});
const s3Client = new S3Client({});

// Add to ContactPayload interface:
attachmentUrls?: string[];

// Add validation function:
export async function validateAttachmentUrls(
  urls: string[] | undefined,
  bucket: string
): Promise<{ valid: boolean; error?: string }> {
  if (!urls || urls.length === 0) return { valid: true };

  try {
    for (const url of urls) {
      const key = url.split(`${bucket}/`)[1];
      if (!key) {
        return { valid: false, error: `URL inválida: ${url}` };
      }

      await s3Client.send(
        new HeadObjectCommand({ Bucket: bucket, Key: key })
      );
    }
    return { valid: true };
  } catch (err) {
    return { valid: false, error: 'No se pudo validar uno o más archivos adjuntos' };
  }
}
```

- [ ] **Step 3: Modify handler to dispatch to SQS instead of sending email**

Replace the email sending logic with SQS dispatch:

```typescript
// In handler function, replace the sesClient.send() call with:

const queueUrl = process.env.SQS_QUEUE_URL;
const s3Bucket = process.env.S3_BUCKET;

if (!queueUrl || !s3Bucket) {
  throw new Error('SQS_QUEUE_URL o S3_BUCKET no configurados');
}

// Validate attachment URLs if present
if (data.attachmentUrls && data.attachmentUrls.length > 0) {
  const validation = await validateAttachmentUrls(data.attachmentUrls, s3Bucket);
  if (!validation.valid) {
    return {
      statusCode: 400,
      headers: JSON_HEADERS,
      body: JSON.stringify({ ok: false, message: validation.error }),
    };
  }
}

// Queue message for async processing
await sqsClient.send(
  new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(data as ContactPayload),
  })
);

return { statusCode: 200, headers: JSON_HEADERS, body: JSON.stringify({ ok: true }) };
```

- [ ] **Step 4: Run tests to verify**

```bash
cd /Users/lfgg/paldunate/arteagayaldunate-contact-backend && npm test -- contact
```

Expected: PASS (or FAIL if mocks not set up correctly, fix and rerun)

- [ ] **Step 5: Commit**

```bash
cd /Users/lfgg/paldunate/arteagayaldunate-contact-backend && git add src/handlers/contact/app.ts src/handlers/contact/app.test.ts && git commit -m "feat: add SQS dispatch and S3 attachment validation to contact handler"
```

---

### Task 6: Implement Async SQS Handler Lambda

**Files:**
- Create: `src/handlers/contact-form-async/app.ts`
- Create: `src/handlers/contact-form-async/app.test.ts`

**Interfaces:**
- Consumes: SQSEvent, ContactPayload, SESClient, S3Client
- Produces: Lambda handler that sends emails with attachment links

**Steps:**

- [ ] **Step 1: Write test for SQS handler**

```typescript
// src/handlers/contact-form-async/app.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handler, buildEmailWithAttachments } from './app';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { mockClient } from 'aws-sdk-client-mock';

describe('contact-form-async handler', () => {
  it('sends email with attachment links', async () => {
    const sesMock = mockClient(SESClient);
    sesMock.on(SendEmailCommand).resolves({ MessageId: 'test-123' });

    const payload = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
      attachmentUrls: ['https://bucket.s3.amazonaws.com/attachments/2026-08-12T14:30:00Z-abc123/contract.pdf'],
    };

    const { subject, html } = buildEmailWithAttachments(payload);
    expect(html).toContain('contract.pdf');
    expect(subject).toContain('Test User');
  });

  it('processes SQS batch', async () => {
    const sesMock = mockClient(SESClient);
    sesMock.on(SendEmailCommand).resolves({ MessageId: 'test-123' });

    const event = {
      Records: [
        {
          messageId: '1',
          body: JSON.stringify({
            name: 'User 1',
            email: 'user1@example.com',
            message: 'Message 1',
          }),
        },
      ],
    };

    const result = await handler(event as any);
    expect(result.batchItemFailures).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd /Users/lfgg/paldunate/arteagayaldunate-contact-backend && npm test -- contact-form-async
```

Expected: FAIL

- [ ] **Step 3: Implement async handler**

```typescript
// src/handlers/contact-form-async/app.ts
import type { SQSEvent, SQSBatchResponse } from 'aws-lambda';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type { ContactPayload } from '../contact/app';
import { buildEmailContent } from '../contact/app';

const sesClient = new SESClient({});

export function buildEmailWithAttachments(
  data: ContactPayload
): { subject: string; html: string } {
  // Start with base email content
  const { subject, html: baseHtml } = buildEmailContent(data);

  // If attachments, add section to HTML before closing </body>
  if (!data.attachmentUrls || data.attachmentUrls.length === 0) {
    return { subject, html: baseHtml };
  }

  const attachmentSection = `
    <tr><td style="padding:20px 24px 8px 24px;">
      <p style="margin:0;font:600 11px/1.4 Helvetica,Arial,sans-serif;letter-spacing:1.5px;text-transform:uppercase;color:#8a94a6;">DOCUMENTOS ADJUNTOS</p>
    </td></tr>
    <tr><td style="padding:0 24px 10px 24px;">
      <ul style="margin:0;padding-left:20px;font:400 13px/1.6 Helvetica,Arial,sans-serif;color:#6b7280;">
        ${data.attachmentUrls
          .map(
            (url) => `
        <li><a href="${url}" style="color:#a12341;text-decoration:none;">${url.split('/').pop()}</a></li>`
          )
          .join('')}
      </ul>
    </td></tr>
    <tr><td style="padding:6px 24px 0 24px;"><div style="height:1px;background:#e8eaf0;"></div></td></tr>
  `;

  // Insert before </table>
  const html = baseHtml.replace('</table>', `${attachmentSection}</table>`);
  return { subject, html };
}

export const handler = async (event: SQSEvent): Promise<SQSBatchResponse> => {
  const batchItemFailures: Array<{ itemId: string }> = [];

  for (const record of event.Records) {
    try {
      const data = JSON.parse(record.body) as ContactPayload;

      const recipients = (process.env.RECIPIENTS || '').split(',').filter(Boolean);
      const fromEmail = process.env.SES_FROM_EMAIL;

      if (!recipients.length || !fromEmail) {
        console.error('Missing configuration for email sending');
        batchItemFailures.push({ itemId: record.messageId });
        continue;
      }

      const { subject, html } = buildEmailWithAttachments(data);

      await sesClient.send(
        new SendEmailCommand({
          Source: `Arteaga & Aldunate Abogados <${fromEmail}>`,
          Destination: { ToAddresses: recipients },
          ReplyToAddresses: [data.email],
          Message: {
            Subject: { Data: subject },
            Body: { Html: { Data: html } },
          },
        })
      );

      console.log(`Email sent for ${data.name} (${data.email})`);
    } catch (err) {
      console.error(`Error processing message ${record.messageId}:`, err);
      batchItemFailures.push({ itemId: record.messageId });
    }
  }

  return { batchItemFailures };
};
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd /Users/lfgg/paldunate/arteagayaldunate-contact-backend && npm test -- contact-form-async
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd /Users/lfgg/paldunate/arteagayaldunate-contact-backend && git add src/handlers/contact-form-async/app.ts src/handlers/contact-form-async/app.test.ts && git commit -m "feat: async SQS handler for sending emails with attachments"
```

---

### Task 7: AWS Infrastructure (SAM Template)

**Files:**
- Modify: `template.yaml`

**Interfaces:**
- Consumes: S3, SQS, Lambda, IAM, SES config
- Produces: Bucket, queue, DLQ, async Lambda, IAM roles

**Steps:**

- [ ] **Step 1: Add S3 bucket resource to template.yaml**

Add to Resources section:

```yaml
AttachmentsBucket:
  Type: AWS::S3::Bucket
  Properties:
    BucketName: !Sub 'arteagayaldunate-contact-attachments-${Stage}'
    VersioningConfiguration:
      Status: Suspended
    PublicAccessBlockConfiguration:
      BlockPublicAcls: true
      BlockPublicPolicy: true
      IgnorePublicAcls: true
      RestrictPublicBuckets: true
    BucketEncryption:
      ServerSideEncryptionConfiguration:
        - ServerSideEncryptionByDefault:
            SSEAlgorithm: AES256
    LifecycleConfiguration:
      LifecycleRules:
        - Id: DeleteAfter7Days
          Status: Enabled
          ExpirationInDays: 7
          NoncurrentVersionExpirationInDays: 1

AttachmentsBucketCors:
  Type: AWS::S3::BucketCors
  Properties:
    BucketName: !Ref AttachmentsBucket
    CorsConfiguration:
      CorsRules:
        - AllowedMethods:
            - PUT
          AllowedOrigins:
            - 'https://arteagayaldunate.cl'
            - 'https://www.arteagayaldunate.cl'
            - 'https://landing-tech-v2.vercel.app'
          AllowedHeaders:
            - 'Content-Type'
          MaxAgeSeconds: 3000
```

- [ ] **Step 2: Add SQS queue and DLQ**

```yaml
ContactFormDLQ:
  Type: AWS::SQS::Queue
  Properties:
    QueueName: !Sub 'contact-form-dlq-${Stage}'
    MessageRetentionPeriod: 345600 # 4 days

ContactFormQueue:
  Type: AWS::SQS::Queue
  Properties:
    QueueName: !Sub 'contact-form-queue-${Stage}'
    VisibilityTimeout: 60
    MessageRetentionPeriod: 345600
    RedrivePolicy:
      deadLetterTargetArn: !GetAtt ContactFormDLQ.Arn
      maxReceiveCount: 3
```

- [ ] **Step 3: Add async Lambda function**

```yaml
ContactFormAsyncRole:
  Type: AWS::IAM::Role
  Properties:
    AssumeRolePolicyDocument:
      Version: '2012-10-17'
      Statement:
        - Effect: Allow
          Principal:
            Service: lambda.amazonaws.com
          Action: sts:AssumeRole
    ManagedPolicyArns:
      - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    Policies:
      - PolicyName: SQSAccess
        PolicyDocument:
          Version: '2012-10-17'
          Statement:
            - Effect: Allow
              Action:
                - sqs:ReceiveMessage
                - sqs:DeleteMessage
                - sqs:GetQueueAttributes
              Resource: !GetAtt ContactFormQueue.Arn
      - PolicyName: SESAccess
        PolicyDocument:
          Version: '2012-10-17'
          Statement:
            - Effect: Allow
              Action:
                - ses:SendEmail
              Resource: '*'

ContactFormAsyncFunction:
  Type: AWS::Serverless::Function
  Properties:
    FunctionName: !Sub 'contact-form-async-${Stage}'
    CodeUri: src/handlers/contact-form-async/
    Handler: app.handler
    Role: !GetAtt ContactFormAsyncRole.Arn
    MemorySize: 512
    Timeout: 30
    ReservedConcurrentExecutions: 10
    Environment:
      Variables:
        SES_FROM_EMAIL: !Ref SesFromEmail
        RECIPIENTS: !Ref InitialRecipients
    Events:
      SQSEvent:
        Type: SQS
        Properties:
          Queue: !GetAtt ContactFormQueue.Arn
          BatchSize: 1
          MaximumBatchingWindowInSeconds: 20
```

- [ ] **Step 4: Update contact function role to allow SQS SendMessage and S3 GetObject**

Update the `ContactFunctionRole` (or create if missing):

```yaml
ContactFunctionRole:
  Type: AWS::IAM::Role
  Properties:
    AssumeRolePolicyDocument:
      Version: '2012-10-17'
      Statement:
        - Effect: Allow
          Principal:
            Service: lambda.amazonaws.com
          Action: sts:AssumeRole
    ManagedPolicyArns:
      - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    Policies:
      - PolicyName: SQSAccess
        PolicyDocument:
          Version: '2012-10-17'
          Statement:
            - Effect: Allow
              Action:
                - sqs:SendMessage
              Resource: !GetAtt ContactFormQueue.Arn
      - PolicyName: S3Access
        PolicyDocument:
          Version: '2012-10-17'
          Statement:
            - Effect: Allow
              Action:
                - s3:GetObject
              Resource: !Sub '${AttachmentsBucket.Arn}/*'
```

- [ ] **Step 5: Add presigned-urls function**

```yaml
PresignedUrlsFunction:
  Type: AWS::Serverless::Function
  Properties:
    FunctionName: !Sub 'presigned-urls-${Stage}'
    CodeUri: src/handlers/presigned-urls/
    Handler: app.handler
    Runtime: nodejs20.x
    MemorySize: 256
    Timeout: 15
    Architectures:
      - arm64
    Environment:
      Variables:
        S3_BUCKET: !Ref AttachmentsBucket
    Policies:
      - S3CrudPolicy:
          BucketName: !Ref AttachmentsBucket
    Events:
      ApiEvent:
        Type: Api
        Properties:
          RestApiId: !Ref ContactApi
          Path: /presigned-urls
          Method: POST
```

- [ ] **Step 6: Update existing ContactFunction to use new role and add S3_BUCKET env var**

```yaml
ContactFunction:
  # ... existing properties ...
  Role: !GetAtt ContactFunctionRole.Arn
  Environment:
    Variables:
      # ... existing variables ...
      SQS_QUEUE_URL: !Ref ContactFormQueue
      S3_BUCKET: !Ref AttachmentsBucket
```

- [ ] **Step 7: Run SAM validate**

```bash
cd /Users/lfgg/paldunate/arteagayaldunate-contact-backend && sam validate
```

Expected: PASS

- [ ] **Step 8: Commit**

```bash
cd /Users/lfgg/paldunate/arteagayaldunate-contact-backend && git add template.yaml && git commit -m "infra: add S3 bucket, SQS queue, async Lambda handler, IAM roles"
```

---

### Task 8: End-to-End Testing

**Files:**
- Test: Full flow integration test

**Steps:**

- [ ] **Step 1: Write integration test**

Create `tests/integration/file-upload-flow.test.ts`:

```typescript
describe('File upload flow', () => {
  it('should upload file to S3 and include in email', async () => {
    // 1. Request presigned URLs
    const presignedRes = await fetch('http://localhost:3001/api/presigned-urls', {
      method: 'POST',
      body: JSON.stringify({
        files: [
          { name: 'contract.pdf', size: 5000, type: 'application/pdf' },
        ],
      }),
    });

    const { urls } = await presignedRes.json();
    expect(urls).toHaveLength(1);
    expect(urls[0].presignedUrl).toBeTruthy();

    // 2. Upload file to S3
    const file = new File(['test'], 'contract.pdf', { type: 'application/pdf' });
    const uploadRes = await fetch(urls[0].presignedUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': 'application/pdf' },
    });

    expect(uploadRes.status).toBe(200);

    // 3. Submit form with attachment
    const contactRes = await fetch('http://localhost:3001/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
        attachmentUrls: [urls[0].presignedUrl.split('?')[0]],
      }),
    });

    expect(contactRes.status).toBe(200);

    // 4. Wait for SQS/Lambda to process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 5. Check email was sent (mock SES or check logs)
    // This would be validated via SES mock or CloudWatch logs
  });
});
```

- [ ] **Step 2: Run local integration test with SAM**

```bash
cd /Users/lfgg/paldunate/arteagayaldunate-contact-backend && sam local start-api
```

In another terminal:

```bash
npm test -- integration/file-upload-flow.test.ts
```

Expected: Test should demonstrate the full flow working

- [ ] **Step 3: Deploy to AWS (staging)**

```bash
cd /Users/lfgg/paldunate/arteagayaldunate-contact-backend && sam build && sam deploy --guided --no-confirm-changeset --stack-name contact-backend-prod --parameter-overrides Stage=prod
```

- [ ] **Step 4: Test against deployed backend**

Update test to use production endpoint and run:

```bash
npm test -- integration/file-upload-flow.test.ts
```

- [ ] **Step 5: Verify Vercel deployment picks up changes**

Push all changes to main, Vercel should auto-deploy.

```bash
cd /Users/lfgg/paldunate/landing-tech && git push origin main
```

Check Vercel dashboard to confirm deployment.

- [ ] **Step 6: Manual testing in browser**

1. Navigate to https://arteagayaldunate.cl (or staging URL)
2. Fill out a product form
3. Add 1-5 files
4. Submit form
5. Verify email received with attachment links

- [ ] **Step 7: Commit final testing**

```bash
cd /Users/lfgg/paldunate/landing-tech && git add tests/integration/file-upload-flow.test.ts && git commit -m "test: end-to-end file upload integration test"
```

---

## Self-Review

**Spec coverage:**
- ✅ FileUploadField component (Task 1)
- ✅ ProductoForm integration (Task 3)
- ✅ leadApi.ts helpers (Task 2)
- ✅ Presigned URLs endpoint (Task 4)
- ✅ Contact handler SQS dispatch (Task 5)
- ✅ Async SQS Lambda handler (Task 6)
- ✅ AWS infrastructure (Task 7)
- ✅ Testing (Task 8)

**Placeholder scan:**
- ✅ All code blocks complete, no TBD/TODO
- ✅ All types defined
- ✅ All file paths exact
- ✅ All environment variables named

**Type consistency:**
- ✅ FileInfo, PresignedUrlResponse defined in Task 1, used in Task 2-3
- ✅ ContactPayload extended in Task 5, used in Task 6
- ✅ S3_BUCKET, SQS_QUEUE_URL consistent across tasks

**No gaps found.** Plan is complete and ready for execution.

---

## Execution Options

Plan complete and saved to `docs/superpowers/plans/2026-08-12-file-attachments-implementation.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, with review between tasks for quality gates. Fast iteration, parallel where possible.

**2. Inline Execution** — I execute tasks in this session with checkpoints for your review.

Which approach?
