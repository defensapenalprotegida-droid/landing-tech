import { describe, test, beforeEach, afterEach, vi, expect } from "vitest";
import {
  getPresignedUrls,
  uploadToS3,
  submitLead,
} from "@/lib/leadApi";

/**
 * End-to-end integration test for the complete file upload flow:
 * 1. Request presigned URLs for files
 * 2. Upload files to S3 via presigned URLs
 * 3. Submit form with attachment URLs
 * 4. Verify successful response
 */
describe("File Upload Flow - E2E Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Step 1: Request Presigned URLs", () => {
    test("requests presigned URLs for 1 file", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          urls: [
            {
              filename: "document.pdf",
              url: "https://bucket.s3.us-east-1.amazonaws.com/attachments/2026-08-12T143000Z-abc123/document.pdf?X-Amz-Signature=xyz",
            },
          ],
          expiresIn: 900,
        }),
      });
      vi.stubGlobal("fetch", mockFetch);

      const files = [
        { name: "document.pdf", size: 1024 * 100, type: "application/pdf" },
      ];

      const result = await getPresignedUrls(files);

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/presigned-urls",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ files }),
        })
      );

      expect(result).toHaveProperty("urls");
      expect(result).toHaveProperty("expiresIn");
      if ("urls" in result) {
        expect(result.urls).toHaveLength(1);
        expect(result.urls[0].filename).toBe("document.pdf");
        expect(result.urls[0].url).toContain("X-Amz-Signature");
      }
    });

    test("requests presigned URLs for multiple files", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          urls: [
            {
              filename: "document1.pdf",
              url: "https://bucket.s3.us-east-1.amazonaws.com/attachments/2026-08-12T143000Z-abc123/document1.pdf?X-Amz-Signature=xyz",
            },
            {
              filename: "photo.jpg",
              url: "https://bucket.s3.us-east-1.amazonaws.com/attachments/2026-08-12T143000Z-abc124/photo.jpg?X-Amz-Signature=uvw",
            },
          ],
          expiresIn: 900,
        }),
      });
      vi.stubGlobal("fetch", mockFetch);

      const files = [
        { name: "document1.pdf", size: 1024 * 100, type: "application/pdf" },
        { name: "photo.jpg", size: 1024 * 500, type: "image/jpeg" },
      ];

      const result = await getPresignedUrls(files);

      if ("urls" in result) {
        expect(result.urls).toHaveLength(2);
        expect(result.urls[0].filename).toBe("document1.pdf");
        expect(result.urls[1].filename).toBe("photo.jpg");
      }
    });

    test("handles error response when requesting presigned URLs", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          ok: false,
          message: "File size exceeds maximum of 100MB",
        }),
      });
      vi.stubGlobal("fetch", mockFetch);

      const files = [
        { name: "huge.pdf", size: 200 * 1024 * 1024, type: "application/pdf" },
      ];

      const result = await getPresignedUrls(files);

      expect(result).toHaveProperty("error");
      if ("error" in result) {
        expect(result.error).toContain("File size exceeds");
      }
    });

    test("handles connection error when requesting presigned URLs", async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error("Network error"));
      vi.stubGlobal("fetch", mockFetch);

      const files = [
        { name: "document.pdf", size: 1024 * 100, type: "application/pdf" },
      ];

      const result = await getPresignedUrls(files);

      expect(result).toHaveProperty("error");
      if ("error" in result) {
        expect(result.error).toContain("conexión");
      }
    });
  });

  describe("Step 2: Upload Files to S3", () => {
    test("uploads file to S3 via presigned URL", async () => {
      const mockFile = new File(["test content"], "document.pdf", {
        type: "application/pdf",
      });
      const presignedUrl =
        "https://bucket.s3.us-east-1.amazonaws.com/attachments/xyz/document.pdf?X-Amz-Signature=abc";

      // Mock XMLHttpRequest
      const mockXhr = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(function (this: any) {
          // Simulate successful upload
          setTimeout(() => {
            this.status = 200;
            this.onload?.();
          }, 0);
        }),
        upload: { addEventListener: vi.fn() },
        status: 200,
        onload: null as any,
        onerror: null as any,
      };

      vi.stubGlobal(
        "XMLHttpRequest",
        vi.fn(() => mockXhr) as any
      );

      const result = await uploadToS3(presignedUrl, mockFile);

      expect(mockXhr.open).toHaveBeenCalledWith("PUT", presignedUrl);
      expect(mockXhr.setRequestHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/pdf"
      );
      expect(mockXhr.send).toHaveBeenCalledWith(mockFile);
      expect(result.ok).toBe(true);
      expect(result.s3Url).toBe(
        "https://bucket.s3.us-east-1.amazonaws.com/attachments/xyz/document.pdf"
      );
    });

    test("handles upload error to S3", async () => {
      const mockFile = new File(["test content"], "document.pdf", {
        type: "application/pdf",
      });
      const presignedUrl =
        "https://bucket.s3.us-east-1.amazonaws.com/attachments/xyz/document.pdf?X-Amz-Signature=abc";

      const mockXhr = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(function (this: any) {
          setTimeout(() => {
            this.status = 403;
            this.onload?.();
          }, 0);
        }),
        upload: { addEventListener: vi.fn() },
        status: 403,
        onload: null as any,
        onerror: null as any,
      };

      vi.stubGlobal(
        "XMLHttpRequest",
        vi.fn(() => mockXhr) as any
      );

      const result = await uploadToS3(presignedUrl, mockFile);

      expect(result.ok).toBe(false);
      expect(result.error).toContain("Error en la carga");
    });

    test("tracks upload progress", async () => {
      const mockFile = new File(["test content"], "document.pdf", {
        type: "application/pdf",
      });
      const presignedUrl =
        "https://bucket.s3.us-east-1.amazonaws.com/attachments/xyz/document.pdf?X-Amz-Signature=abc";
      const progressValues: number[] = [];

      const mockXhr = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(function (this: any) {
          setTimeout(() => {
            this.status = 200;
            this.onload?.();
          }, 0);
        }),
        upload: {
          addEventListener: vi.fn(function (
            this: any,
            event: string,
            callback: Function
          ) {
            if (event === "progress") {
              // Simulate progress events
              callback({ lengthComputable: true, loaded: 50, total: 100 });
              callback({ lengthComputable: true, loaded: 100, total: 100 });
            }
          }),
        },
        status: 200,
        onload: null as any,
        onerror: null as any,
      };

      vi.stubGlobal(
        "XMLHttpRequest",
        vi.fn(() => mockXhr) as any
      );

      const result = await uploadToS3(presignedUrl, mockFile, (percent) => {
        progressValues.push(percent);
      });

      expect(result.ok).toBe(true);
      expect(progressValues).toContain(50);
      expect(progressValues).toContain(100);
    });
  });

  describe("Step 3: Submit Form with Attachment URLs", () => {
    test("submits form with attachment URLs successfully", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true }),
      });
      vi.stubGlobal("fetch", mockFetch);

      const payload = {
        name: "Juan Pérez",
        email: "juan@example.com",
        message: "Necesito asesoría legal",
        area: "penal",
        attachmentUrls: [
          "https://bucket.s3.us-east-1.amazonaws.com/attachments/xyz/document1.pdf",
          "https://bucket.s3.us-east-1.amazonaws.com/attachments/xyz/document2.pdf",
        ],
      };

      const result = await submitLead(payload as any);

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/contact",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      );
      expect(result.ok).toBe(true);
    });

    test("submits form without attachment URLs", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ ok: true }),
      });
      vi.stubGlobal("fetch", mockFetch);

      const payload = {
        name: "Ana López",
        email: "ana@example.com",
        message: "Consulta sin documentos",
      };

      const result = await submitLead(payload as any);

      expect(result.ok).toBe(true);
    });

    test("handles form submission error", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          ok: false,
          message: "Attachment URL not accessible",
        }),
      });
      vi.stubGlobal("fetch", mockFetch);

      const payload = {
        name: "Juan Pérez",
        email: "juan@example.com",
        message: "Consulta",
        attachmentUrls: ["https://bucket.s3.us-east-1.amazonaws.com/invalid.pdf"],
      };

      const result = await submitLead(payload as any);

      expect(result.ok).toBe(false);
      expect(result.message).toContain("not accessible");
    });

    test("handles connection error during form submission", async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error("Network error"));
      vi.stubGlobal("fetch", mockFetch);

      const payload = {
        name: "Juan Pérez",
        email: "juan@example.com",
        message: "Consulta",
      };

      const result = await submitLead(payload as any);

      expect(result.ok).toBe(false);
      expect(result.message).toContain("conexión");
    });

    test("handles malformed JSON response during form submission", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });
      vi.stubGlobal("fetch", mockFetch);

      const payload = {
        name: "Juan Pérez",
        email: "juan@example.com",
        message: "Consulta",
      };

      const result = await submitLead(payload as any);

      expect(result.ok).toBe(false);
    });
  });

  describe("Complete E2E Flow", () => {
    test("complete flow: request URLs → upload files → submit form", async () => {
      const mockFetch = vi
        .fn()
        .mockImplementation((url: string, options: any) => {
          if (url === "/api/presigned-urls") {
            return Promise.resolve({
              ok: true,
              json: async () => ({
                urls: [
                  {
                    filename: "document.pdf",
                    url: "https://bucket.s3.us-east-1.amazonaws.com/attachments/xyz/document.pdf?X-Amz-Signature=sig",
                  },
                ],
                expiresIn: 900,
              }),
            });
          } else if (url === "/api/contact") {
            return Promise.resolve({
              ok: true,
              json: async () => ({ ok: true }),
            });
          }
          return Promise.reject(new Error("Unknown endpoint"));
        });

      vi.stubGlobal("fetch", mockFetch);

      const mockXhr = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(function (this: any) {
          setTimeout(() => {
            this.status = 200;
            this.onload?.();
          }, 0);
        }),
        upload: { addEventListener: vi.fn() },
        status: 200,
        onload: null as any,
        onerror: null as any,
      };

      vi.stubGlobal(
        "XMLHttpRequest",
        vi.fn(() => mockXhr) as any
      );

      // Step 1: Request presigned URLs
      const files = [
        { name: "document.pdf", size: 1024 * 100, type: "application/pdf" },
      ];
      const urlsResult = await getPresignedUrls(files);

      expect("urls" in urlsResult).toBe(true);
      if (!("urls" in urlsResult)) throw new Error("No URLs in result");

      const presignedUrl = urlsResult.urls[0].url;

      // Step 2: Upload file to S3
      const mockFile = new File(["test content"], "document.pdf", {
        type: "application/pdf",
      });
      const uploadResult = await uploadToS3(presignedUrl, mockFile);

      expect(uploadResult.ok).toBe(true);
      const s3Url = uploadResult.s3Url;

      // Step 3: Submit form with attachment URLs
      const payload = {
        name: "Juan Pérez",
        email: "juan@example.com",
        message: "Necesito asesoría",
        attachmentUrls: [s3Url],
      };

      const submitResult = await submitLead(payload as any);

      expect(submitResult.ok).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(2); // presigned-urls + contact
    });

    test("complete flow with error in URL request", async () => {
      const mockFetch = vi
        .fn()
        .mockImplementation((url: string) => {
          if (url === "/api/presigned-urls") {
            return Promise.resolve({
              ok: false,
              json: async () => ({
                ok: false,
                message: "MIME type not allowed",
              }),
            });
          }
          return Promise.reject(new Error("Unexpected"));
        });

      vi.stubGlobal("fetch", mockFetch);

      const files = [
        {
          name: "malware.exe",
          size: 1024 * 50,
          type: "application/x-msdownload",
        },
      ];
      const result = await getPresignedUrls(files);

      expect("error" in result).toBe(true);
      if ("error" in result) {
        expect(result.error).toContain("MIME type not allowed");
      }
    });

    test("complete flow with error in S3 upload", async () => {
      const mockFetch = vi
        .fn()
        .mockResolvedValue({
          ok: true,
          json: async () => ({
            urls: [
              {
                filename: "document.pdf",
                url: "https://bucket.s3.us-east-1.amazonaws.com/attachments/xyz/document.pdf?X-Amz-Signature=sig",
              },
            ],
            expiresIn: 900,
          }),
        });

      vi.stubGlobal("fetch", mockFetch);

      const mockXhr = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(function (this: any) {
          setTimeout(() => {
            this.status = 403; // Access denied
            this.onload?.();
          }, 0);
        }),
        upload: { addEventListener: vi.fn() },
        status: 403,
        onload: null as any,
        onerror: null as any,
      };

      vi.stubGlobal(
        "XMLHttpRequest",
        vi.fn(() => mockXhr) as any
      );

      const files = [
        { name: "document.pdf", size: 1024 * 100, type: "application/pdf" },
      ];
      const urlsResult = await getPresignedUrls(files);

      expect("urls" in urlsResult).toBe(true);
      if (!("urls" in urlsResult)) throw new Error("No URLs");

      const mockFile = new File(["content"], "document.pdf", {
        type: "application/pdf",
      });
      const uploadResult = await uploadToS3(urlsResult.urls[0].url, mockFile);

      expect(uploadResult.ok).toBe(false);
      expect(uploadResult.error).toContain("Error en la carga");
    });
  });
});
