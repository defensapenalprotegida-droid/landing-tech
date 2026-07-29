import nodemailer from "nodemailer";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { buildLeadEmail } from "./emailTemplate";

type AnyRecord = Record<string, any>;

function escapeHtml(value: unknown) {
  const str = String(value ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

async function handlePOST(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("API /api/contact llamada");

    const data = (req.body || {}) as AnyRecord;

    const required = ["name", "email", "message"];

    for (const key of required) {
      if (data[key] === undefined || data[key] === null || data[key] === "") {
        return res.status(400).json({
          ok: false,
          message: `Falta el campo: ${key}`,
        });
      }
    }

    const SMTP_HOST = process.env.SMTP_HOST;
    const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
    const SMTP_SECURE = process.env.SMTP_SECURE === "true";
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;
    const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || SMTP_USER;

    if (
      !SMTP_HOST ||
      !SMTP_USER ||
      !SMTP_PASS ||
      !CONTACT_TO_EMAIL ||
      !CONTACT_FROM_EMAIL
    ) {
      return res.status(500).json({
        ok: false,
        message: "Falta configuración SMTP en variables de entorno.",
      });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const { subject, text, html } = buildLeadEmail(data as any);

    await transporter.sendMail({
      from: `Arteaga & Aldunate Abogados <${CONTACT_FROM_EMAIL}>`,
      to: CONTACT_TO_EMAIL,
      subject,
      text,
      html,
      replyTo: data.email,
    });

    return res.status(200).json({
      ok: true,
      message: "Consulta enviada correctamente. Te contactaremos pronto.",
    });
  } catch (err) {
    console.error("Error en /api/contact:", err);

    const message =
      err instanceof Error ? err.message : "Error interno enviando el correo.";

    return res.status(500).json({
      ok: false,
      message,
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