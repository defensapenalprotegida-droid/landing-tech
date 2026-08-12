# File Attachments for Lead Forms — Design Spec

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow users to upload up to 5 documents (PDFs, videos, images, Office files) to support their lead submissions, with direct S3 upload and async email delivery.

**Architecture:** Frontend uploads files directly to S3 via presigned URLs (no binary through Lambda). Backend generates presigned URLs for validation, receives form with S3 URLs, queues email processing to SQS, and returns immediately. Async Lambda worker picks up SQS messages and sends emails with download links.

**Tech Stack:** React/TypeScript (frontend), AWS Lambda/Node.js 20 (backend), S3 for storage, SQS for async queue, SES for email delivery.

## Global Constraints

- **Max files:** 5 per submission
- **Max size per file:** 100 MB
- **Max total size:** 500 MB (5 files)
- **Allowed types:** PDF, DOCX, XLSX, JPG, PNG, MP4, MOV, WebM, TXT
- **S3 lifecycle:** Delete after 7 days (not permanent storage)
- **Presigned URL expiry:** 15 minutes
- **Email delivery:** Async via SQS (no blocking on client)
- **Backend:** AWS SAM, Node.js 20 ARM64
- **Frontend:** React 18 + TypeScript + Tailwind

---

## Frontend Changes (landing-tech)

### Component: FileUploadField.tsx (new)

Reusable file upload component with drag-drop, validation, and progress tracking.

**Responsibilities:**
- Accept files via click or drag-drop
- Validate file types, individual size, and total size
- Display selected files with size preview
- Manage presigned URL retrieval from backend
- Upload files to S3 in parallel
- Show per-file progress bars
- Return array of S3 URLs to parent form

**Props:**
```typescript
interface FileUploadFieldProps {
  value: string[]; // Array of S3 URLs
  onChange: (urls: string[]) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  maxFiles?: number; // default 5
  maxFileSize?: number; // bytes, default 100MB
  maxTotalSize?: number; // bytes, default 500MB
  acceptedTypes?: string[]; // MIME types
}
```

**Exported types from FileUploadField:**
```typescript
export interface FileInfo {
  file: File;
  presignedUrl?: string;
  s3Url?: string;
  uploadProgress: number; // 0-100
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface PresignedUrlResponse {
  urls: Array<{ fileKey: string; presignedUrl: string }>;
  expiresIn: number; // seconds
}
```

**Error handling:**
- File type not allowed: "Tipo de archivo no permitido: .xyz"
- File too large: "El archivo excede 100 MB"
- Total size exceeded: "Los 5 archivos superan 500 MB en total"
- Upload failed: "No se pudo subir [filename]. Intenta nuevamente."

---

### Modify: ProductoForm.tsx

Add FileUploadField after the address/message fields.

**New form fields (in leadSchema):**
```typescript
attachmentUrls?: string[]; // Array of validated S3 URLs
```

**Integration:**
- Import FileUploadField
- Add field to form layout with label "Documentos adjuntos (opcional)"
- Pass form state to component
- Include attachmentUrls in submitLead payload

---

### Modify: leadApi.ts

Add two new functions:

```typescript
export async function getPresignedUrls(
  files: Array<{ name: string; size: number; type: string }>
): Promise<PresignedUrlResponse | { error: string }> {
  // POST /api/presigned-urls
  // Body: { files: [{ name, size, type }, ...] }
  // Returns: { urls: [{ fileKey, presignedUrl }, ...], expiresIn }
}

export async function uploadToS3(
  presignedUrl: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ ok: boolean; s3Url?: string; error?: string }> {
  // PUT request to presignedUrl with file binary
  // No Content-Type override (S3 presigned URLs handle this)
  // Returns S3 object URL
}
```

Modify `submitLead()` to accept attachmentUrls in payload.

---

### Modify: leadSchema.ts

Add optional field to LeadFormValues:

```typescript
attachmentUrls: z.array(z.string().url()).optional()
  .describe("Array of S3 URLs for uploaded attachments")
```

---

## Backend Changes (arteagayaldunate-contact-backend)

### New Endpoint: POST /api/presigned-urls

**Request body:**
```json
{
  "files": [
    { "name": "contract.pdf", "size": 2048000, "type": "application/pdf" },
    { "name": "video.mp4", "size": 51200000, "type": "video/mp4" }
  ]
}
```

**Response (200):**
```json
{
  "urls": [
    { "fileKey": "attachments/2026-08-12T14:30:00Z-abc123/contract.pdf", "presignedUrl": "https://bucket.s3.amazonaws.com/..." },
    { "fileKey": "attachments/2026-08-12T14:30:00Z-abc123/video.mp4", "presignedUrl": "https://bucket.s3.amazonaws.com/..." }
  ],
  "expiresIn": 900
}
```

**Error responses (400):**
- Too many files: `{ ok: false, message: "Máximo 5 archivos" }`
- File too large: `{ ok: false, message: "Archivo excede 100 MB: video.mp4" }`
- Total size exceeded: `{ ok: false, message: "Los archivos superan 500 MB en total" }`
- Invalid type: `{ ok: false, message: "Tipo no permitido: application/x-msdownload" }`

**Implementation:**
- Validate file count, individual size, total size
- Validate MIME types against allowed list
- Generate presigned URLs with 15-min expiry
- Use S3 PutObject with ACL private
- Store fileKey with timestamp + random hash (prevent collisions, enable cleanup)
- Return URLs + expiry time

---

### Modify: POST /api/contact Handler

Add validation and SQS dispatch:

**New ContactPayload field:**
```typescript
attachmentUrls?: string[]; // Array of validated S3 URLs
```

**Changes to handler:**
1. Accept attachmentUrls in payload (optional)
2. If attachmentUrls provided:
   - Validate each URL points to expected S3 bucket
   - Make HEAD request to S3 (verify object exists before queuing)
   - If HEAD fails, return 400 (user may have cleared cache)
3. Send SQS message with full payload + attachmentUrls
4. Return 200 OK immediately (do NOT wait for SES)

**New SQS message format:**
```json
{
  "name": "...",
  "email": "...",
  "message": "...",
  "attachmentUrls": ["https://bucket.s3.amazonaws.com/..."],
  "consent": {...},
  "recaptchaToken": "...",
  "...other fields..."
}
```

---

### New Lambda: SQS Message Handler

Triggered by SQS events (contact-form-queue).

**Responsibilities:**
- Poll SQS for messages
- For each message:
  - Parse JSON payload
  - Validate attachmentUrls (second HEAD check, in case object was deleted)
  - Build email HTML with attachment section
  - Send via SES with download links
  - Delete message from queue on success
  - DLQ on failure after 3 retries
- Log all steps

**Email attachment section (added to existing buildEmailContent):**
```html
<tr><td style="padding:20px 24px 8px 24px;">
  <p style="margin:0;font:600 11px/1.4 Helvetica,Arial,sans-serif;...">DOCUMENTOS ADJUNTOS</p>
</td></tr>
<tr><td style="padding:0 24px 10px 24px;">
  <ul style="margin:0;padding-left:20px;...">
    <li><a href="https://bucket.s3.amazonaws.com/..." style="color:#a12341;">contract.pdf</a></li>
    <li><a href="https://bucket.s3.amazonaws.com/..." style="color:#a12341;">video.mp4</a></li>
  </ul>
</td></tr>
```

**Environment variables:**
- `SQS_QUEUE_URL` — full URL to contact-form-queue
- `S3_BUCKET` — bucket name for validation
- `AWS_REGION` — for S3 client

---

### AWS Infrastructure (template.yaml)

**New Resources:**

1. **S3 Bucket for Attachments**
   - Name: `arteagayaldunate-contact-attachments-${Stage}`
   - Versioning: disabled
   - Public access: BLOCKED
   - Lifecycle: Delete objects after 7 days
   - Encryption: SSE-S3
   - CORS: Allow PUT from landing-tech domain(s)

2. **SQS Queue**
   - Name: `contact-form-queue-${Stage}`
   - Visibility timeout: 60 seconds
   - Message retention: 4 days
   - Dead Letter Queue: `contact-form-dlq-${Stage}` (max 3 retries)

3. **Lambda: SQS Handler**
   - Function name: `contact-form-async-${Stage}`
   - Runtime: Node.js 20 ARM64
   - Memory: 512 MB
   - Timeout: 30 seconds
   - Reserved concurrency: 10 (prevent runaway)
   - Trigger: SQS (batch size 1, wait time 20s)
   - IAM role: SQS receive + delete, SES send, S3 head, CloudWatch logs

4. **IAM Permissions**
   - Contact handler Lambda: SQS SendMessage, S3 GetObject (HEAD)
   - SQS handler Lambda: SQS ReceiveMessage/DeleteMessage, SES SendEmail, S3 GetObject
   - Frontend CloudFront (via CORS): S3 PutObject (via presigned URL only)

---

## Security & Validation

**Frontend validation (UX, not security):**
- File type check via `accept` attribute
- File size check before upload
- Visual error messages

**Backend validation (enforced):**
- File type whitelist (MIME type check on presigned-urls)
- Individual file size limit (100 MB)
- Total size limit (500 MB)
- File count limit (5)
- S3 HEAD validation before email send (object must exist)
- Presigned URL expiry (15 min)

**S3 Security:**
- Bucket private (block public access)
- Objects use timestamp + hash prefixes (prevent enumeration)
- Lifecycle: auto-delete after 7 days
- No cross-origin read (links only valid for 1 hour when clicked)

**Attack surface mitigation:**
- Presigned URL scope: specific object, specific verb (PUT only)
- HEAD validation prevents "dead link" emails if client clears cache mid-upload
- SQS DLQ catches malformed messages
- CloudWatch logs all upload/send events

---

## Testing

**Frontend (ProductoForm + FileUploadField):**
- Upload 5 files, validate success
- Upload 6 files, expect error
- Individual file exceeds 100 MB, expect error
- Total exceeds 500 MB, expect error
- Invalid file type, expect error
- Network error during presigned URL fetch, expect retry
- Network error during S3 upload, expect retry
- Form submit with and without attachments

**Backend (presigned-urls endpoint):**
- Valid request returns 2 presigned URLs
- Too many files (>5) returns 400
- File too large (>100 MB) returns 400
- Total size exceeded (>500 MB) returns 400
- Invalid MIME type returns 400

**Backend (contact handler):**
- Attachment URLs present, S3 HEAD succeeds → SQS message queued
- Attachment URLs present, S3 HEAD fails → 400 error returned
- No attachment URLs → normal flow (backward compatible)
- SQS message format valid

**Backend (SQS handler):**
- Valid message → email sent, message deleted
- S3 HEAD fails on SQS handler → DLQ after retries
- Invalid JSON → DLQ
- SES error → DLQ after retries
- Logs contain all operations

---

## Rollout & Monitoring

**Monitoring:**
- CloudWatch: SQS queue depth (alert if > 100)
- CloudWatch: SQS DLQ messages (alert on any)
- CloudWatch: Lambda error rate (alert if > 1%)
- CloudWatch: S3 objects created/deleted (track lifecycle)

**Backward compatibility:**
- attachmentUrls is optional
- Existing leads without attachments work unchanged
- Email template handles missing attachment section gracefully

---

## Open Questions (None — Design is Complete)
