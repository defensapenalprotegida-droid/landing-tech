/**
 * File upload types for document attachment submissions
 */

export type AcceptedMimeType =
  | "application/pdf"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  | "image/jpeg"
  | "image/png"
  | "video/mp4"
  | "video/quicktime"
  | "video/webm"
  | "text/plain";

export type AcceptedFileExtension = ".pdf" | ".docx" | ".xlsx" | ".jpg" | ".jpeg" | ".png" | ".mp4" | ".mov" | ".webm" | ".txt";

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  error?: string;
}

export interface PresignedUrlResponse {
  presignedUrl: string;
  fileKey: string;
  uploadId: string;
}

export const ACCEPTED_MIME_TYPES: Record<AcceptedFileExtension, AcceptedMimeType> = {
  ".pdf": "application/pdf",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
  ".txt": "text/plain",
};

export const DEFAULT_ACCEPTED_TYPES: AcceptedFileExtension[] = [
  ".pdf",
  ".docx",
  ".xlsx",
  ".jpg",
  ".jpeg",
  ".png",
  ".mp4",
  ".mov",
  ".webm",
  ".txt",
];

export const ACCEPT_STRING = Object.values(ACCEPTED_MIME_TYPES).join(",");
