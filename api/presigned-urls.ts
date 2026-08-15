import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Proxy hacia el backend AWS para pedir URLs de carga de adjuntos.
 *
 * Existe por la misma razón que `contact.ts`: la clave del API vive en el
 * servidor y no puede viajar al navegador.
 *
 * Sin este archivo la petición no daba 404: el catch-all de `vercel.json`
 * la atrapaba y devolvía el HTML de la SPA con status 200, así que el
 * frontend fallaba al parsear JSON y mostraba "error de conexión" cuando en
 * realidad el endpoint no existía.
 */

function setCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

async function handlePOST(req: VercelRequest, res: VercelResponse) {
  const backendUrl = process.env.PRESIGNED_URLS_BACKEND_URL;
  const backendApiKey = process.env.CONTACT_BACKEND_API_KEY;

  if (!backendUrl || !backendApiKey) {
    return res.status(500).json({
      ok: false,
      message: "Falta configuración del backend de adjuntos.",
    });
  }

  try {
    const backendRes = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": backendApiKey,
      },
      body: JSON.stringify(req.body || {}),
    });

    const data = await backendRes.json().catch(() => ({}));
    return res.status(backendRes.status).json(data);
  } catch (err) {
    console.error("Error reenviando /api/presigned-urls al backend AWS:", err);
    return res.status(500).json({
      ok: false,
      message: "Error de conexión con el backend de adjuntos.",
    });
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    return handlePOST(req, res);
  }

  return res.status(405).json({
    ok: false,
    message: "Método no permitido",
  });
}
