import { describe, test, beforeEach, afterEach, vi, expect } from "vitest";
import { submitLead } from "@/lib/leadApi";
import { subirAdjuntos } from "@/lib/uploadAdjuntos";

/**
 * Flujo completo de adjuntos: subir a S3 y enviar la consulta con las URLs.
 *
 * La versión anterior de este archivo probaba `getPresignedUrls` y
 * `uploadToS3`, que enviaban `name`/`type` cuando el backend lee
 * `filename`/`mimeType`, y tipaban la respuesta como `fileKey`/`presignedUrl`
 * cuando el backend devuelve `filename`/`url`. Las pruebas pasaban porque el
 * mock devolvía lo que el frontend suponía: verificaban la ficción, no el
 * contrato. Por eso la función nunca funcionó en producción pese a estar
 * "cubierta por tests".
 *
 * Ahora se ejercita `subirAdjuntos`, que habla el contrato real.
 */

const BUCKET =
  "https://arteagayaldunate-contact-attachments-prod.s3.us-east-1.amazonaws.com";

const archivo = (nombre: string) =>
  new File(["contenido"], nombre, { type: "application/pdf" });

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("flujo completo: subir y enviar", () => {
  test("sube el documento y envía la consulta con la URL del objeto", async () => {
    fetchMock.mockImplementation((url: string) => {
      if (url === "/api/presigned-urls") {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            urls: [
              {
                filename: "demanda.pdf",
                url: `${BUCKET}/abc/demanda.pdf?X-Amz-Signature=sig`,
              },
            ],
            expiresIn: 900,
          }),
        });
      }
      if (url === "/api/contact") {
        return Promise.resolve({ ok: true, json: async () => ({ ok: true }) });
      }
      // El PUT va directo a S3.
      return Promise.resolve({ ok: true });
    });

    const subida = await subirAdjuntos([archivo("demanda.pdf")]);
    expect(subida).toEqual({ urls: [`${BUCKET}/abc/demanda.pdf`] });

    const resultado = await submitLead({
      name: "Juan Pérez",
      email: "juan@ejemplo.cl",
      message: "Necesito asesoría",
      attachmentUrls: (subida as { urls: string[] }).urls,
    } as never);

    expect(resultado.ok).toBe(true);

    // La URL que viaja al backend no lleva firma: con ella, el HeadObject de
    // validación buscaría un objeto llamado "demanda.pdf?X-Amz-Signature=..."
    // y rechazaría la consulta entera.
    const envio = fetchMock.mock.calls.find(([u]) => u === "/api/contact");
    expect(envio?.[1].body).toContain(`${BUCKET}/abc/demanda.pdf"`);
    expect(envio?.[1].body).not.toContain("X-Amz-Signature");
  });

  test("no envía la consulta si la subida falla", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Maximum 5 files allowed" }),
    });

    const subida = await subirAdjuntos([archivo("demanda.pdf")]);

    expect(subida).toHaveProperty("error");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("envío de la consulta", () => {
  test("envía correctamente sin adjuntos", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });

    const resultado = await submitLead({
      name: "Juan Pérez",
      email: "juan@ejemplo.cl",
      message: "Consulta sin documentos",
    } as never);

    expect(resultado.ok).toBe(true);
  });

  test("propaga el error del backend", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ ok: false, message: "URL no reconocida" }),
    });

    const resultado = await submitLead({
      name: "Juan Pérez",
      email: "juan@ejemplo.cl",
      message: "Consulta",
    } as never);

    expect(resultado.ok).toBe(false);
    expect(resultado.message).toContain("URL no reconocida");
  });

  test("no da por enviada una consulta ante un fallo de red", async () => {
    fetchMock.mockRejectedValue(new Error("network down"));

    const resultado = await submitLead({
      name: "Juan Pérez",
      email: "juan@ejemplo.cl",
      message: "Consulta",
    } as never);

    expect(resultado.ok).toBe(false);
  });
});
