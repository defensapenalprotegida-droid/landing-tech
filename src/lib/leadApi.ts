import type { LeadFormValues } from "./leadSchema";

export type LeadPayload = Partial<LeadFormValues> & {
  name: string; email: string; message: string;
};

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

export async function submitLead(
  payload: LeadPayload
): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      return { ok: false, message: data.message || "No se pudo enviar tu consulta." };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: "Error de conexión. Intenta nuevamente." };
  }
}
