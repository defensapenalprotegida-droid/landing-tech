import type { VercelRequest, VercelResponse } from "@vercel/node";

function setCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

async function handlePOST(req: VercelRequest, res: VercelResponse) {
  const backendUrl = process.env.CONTACT_BACKEND_URL;
  const backendApiKey = process.env.CONTACT_BACKEND_API_KEY;

  if (!backendUrl || !backendApiKey) {
    return res.status(500).json({
      ok: false,
      message: "Falta configuración del backend de contacto.",
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
    console.error("Error reenviando /api/contact al backend AWS:", err);
    return res.status(500).json({
      ok: false,
      message: "Error de conexión con el backend de contacto.",
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
