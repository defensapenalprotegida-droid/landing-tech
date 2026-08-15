import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { subirAdjuntos } from "./uploadAdjuntos";

/**
 * La subida de adjuntos nunca existió: el formulario guardaba el nombre del
 * archivo y lo enviaba como si fuera una URL de S3. Estas pruebas fijan el
 * contrato real del backend, que no coincidía con el que suponía el frontend.
 */

const archivo = (nombre: string, tipo = "application/pdf") =>
  new File(["contenido"], nombre, { type: tipo });

const URL_FIRMADA =
  "https://arteagayaldunate-contact-attachments-prod.s3.us-east-1.amazonaws.com/abc-123/demanda.pdf?X-Amz-Signature=deadbeef&X-Amz-Expires=900";

const URL_LIMPIA =
  "https://arteagayaldunate-contact-attachments-prod.s3.us-east-1.amazonaws.com/abc-123/demanda.pdf";

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

/** Respuesta del endpoint de URLs firmadas. */
const respondePresigned = (urls: Array<{ filename: string; url: string }>) =>
  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ urls, expiresIn: 900 }),
  });

/** Respuesta del PUT a S3. */
const respondeS3 = (ok = true) => fetchMock.mockResolvedValueOnce({ ok });

describe("subirAdjuntos", () => {
  it("pide las URLs con el contrato que el backend espera", async () => {
    respondePresigned([{ filename: "demanda.pdf", url: URL_FIRMADA }]);
    respondeS3();

    await subirAdjuntos([archivo("demanda.pdf")]);

    const [ruta, opciones] = fetchMock.mock.calls[0];
    expect(ruta).toBe("/api/presigned-urls");
    // El backend lee `filename` y `mimeType`; con `name`/`type` los ignoraba.
    expect(JSON.parse(opciones.body)).toEqual({
      files: [{ filename: "demanda.pdf", size: 9, mimeType: "application/pdf" }],
    });
  });

  it("sube cada archivo a S3 con su Content-Type", async () => {
    respondePresigned([{ filename: "demanda.pdf", url: URL_FIRMADA }]);
    respondeS3();

    await subirAdjuntos([archivo("demanda.pdf")]);

    const [url, opciones] = fetchMock.mock.calls[1];
    expect(url).toBe(URL_FIRMADA);
    expect(opciones.method).toBe("PUT");
    // Debe coincidir con el tipo que se firmó, o S3 rechaza la subida.
    expect(opciones.headers["Content-Type"]).toBe("application/pdf");
  });

  it("devuelve la URL del objeto, sin la firma", async () => {
    respondePresigned([{ filename: "demanda.pdf", url: URL_FIRMADA }]);
    respondeS3();

    const resultado = await subirAdjuntos([archivo("demanda.pdf")]);

    // Con la query, el backend busca un objeto llamado
    // "demanda.pdf?X-Amz-Signature=..." y el HeadObject falla.
    expect(resultado).toEqual({ urls: [URL_LIMPIA] });
  });

  it("no llama al backend si no hay archivos", async () => {
    const resultado = await subirAdjuntos([]);

    expect(resultado).toEqual({ urls: [] });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("informa el progreso de cada archivo", async () => {
    respondePresigned([{ filename: "demanda.pdf", url: URL_FIRMADA }]);
    respondeS3();

    const eventos: Array<{ filename: string; estado: string }> = [];
    await subirAdjuntos([archivo("demanda.pdf")], (e) => eventos.push(e));

    expect(eventos).toEqual([
      { filename: "demanda.pdf", estado: "subiendo" },
      { filename: "demanda.pdf", estado: "listo" },
    ]);
  });
});

describe("cuando algo falla", () => {
  it("informa el error del endpoint de URLs firmadas", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Maximum 5 files allowed" }),
    });

    const resultado = await subirAdjuntos([archivo("a.pdf")]);

    expect(resultado).toEqual({ error: "Maximum 5 files allowed" });
  });

  it("nombra el archivo que no se pudo subir", async () => {
    respondePresigned([{ filename: "demanda.pdf", url: URL_FIRMADA }]);
    respondeS3(false);

    const resultado = await subirAdjuntos([archivo("demanda.pdf")]);

    // Con varios archivos, un error genérico no dice cuál reintentar.
    expect(resultado).toEqual({
      error: expect.stringContaining("demanda.pdf"),
    });
  });

  it("marca el archivo como error en el progreso", async () => {
    respondePresigned([{ filename: "demanda.pdf", url: URL_FIRMADA }]);
    respondeS3(false);

    const eventos: Array<{ filename: string; estado: string }> = [];
    await subirAdjuntos([archivo("demanda.pdf")], (e) => eventos.push(e));

    expect(eventos.at(-1)).toEqual({
      filename: "demanda.pdf",
      estado: "error",
    });
  });

  it("falla si el backend no devuelve URL para un archivo", async () => {
    respondePresigned([{ filename: "otro.pdf", url: URL_FIRMADA }]);

    const resultado = await subirAdjuntos([archivo("demanda.pdf")]);

    expect(resultado).toEqual({
      error: expect.stringContaining("demanda.pdf"),
    });
  });

  it("no deja pasar un error de red como éxito", async () => {
    fetchMock.mockRejectedValueOnce(new Error("network down"));

    const resultado = await subirAdjuntos([archivo("a.pdf")]);

    expect(resultado).toHaveProperty("error");
  });
});
