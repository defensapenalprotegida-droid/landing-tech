import nodemailer from "nodemailer";
import type { VercelRequest, VercelResponse } from "@vercel/node";

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

    const subject = `Nueva consulta legal - ${data.name}`;

    const text = [
      "Nueva consulta legal desde el sitio web",
      "",
      "--- Datos de contacto ---",
      `Nombre: ${data.name}`,
      `Teléfono: ${data.phone || "No informado"}`,
      `Email: ${data.email}`,
      "",
      "--- Descripción del caso ---",
      data.message || "",
    ].join("\n");

    const html = `
      <html>
        <body style="margin:0;padding:0;background:#f5f5f3;font-family:Inter,Arial,sans-serif;color:#111827;">
          <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td align="center" style="padding:32px 18px;">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:720px;background:#ffffff;border-radius:26px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 24px 70px rgba(15,23,42,0.12);">
                  
                  <!-- HEADER -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#0F3B47 0%,#A12341 100%);padding:38px 36px;text-align:center;color:#ffffff;">
                      <p style="margin:0;font-size:12px;letter-spacing:0.22em;text-transform:uppercase;opacity:0.82;">
                        Arteaga & Aldunate Abogados y Asociados
                      </p>

                      <h1 style="margin:14px 0 0;font-size:30px;line-height:1.15;font-weight:800;">
                        Nueva consulta legal
                      </h1>

                      <p style="margin:12px 0 0;font-size:15px;opacity:0.9;">
                        Un potencial cliente ha enviado su caso desde el formulario web.
                      </p>
                    </td>
                  </tr>

                  <!-- CONTACTO -->
                  <tr>
                    <td style="padding:34px 36px 0;">
                      <h2 style="margin:0 0 18px;font-size:20px;color:#0F3B47;">
                        Datos del solicitante
                      </h2>

                      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;">
                        <tr>
                          <td style="padding:12px 0;color:#6b7280;width:170px;font-weight:700;vertical-align:top;">
                            Nombre
                          </td>
                          <td style="padding:12px 0;color:#111827;font-weight:500;">
                            ${escapeHtml(data.name)}
                          </td>
                        </tr>

                        <tr>
                          <td style="padding:12px 0;color:#6b7280;font-weight:700;vertical-align:top;">
                            Teléfono
                          </td>
                          <td style="padding:12px 0;color:#111827;font-weight:500;">
                            ${escapeHtml(data.phone || "No informado")}
                          </td>
                        </tr>

                        <tr>
                          <td style="padding:12px 0;color:#6b7280;font-weight:700;vertical-align:top;">
                            Correo electrónico
                          </td>
                          <td style="padding:12px 0;color:#111827;font-weight:500;">
                            ${escapeHtml(data.email)}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- CASO -->
                  <tr>
                    <td style="padding:30px 36px 0;">
                      <h2 style="margin:0 0 18px;font-size:20px;color:#0F3B47;">
                        Descripción del caso
                      </h2>

                      <div style="padding:22px;background:#f8fafc;border:1px solid #e5e7eb;border-left:5px solid #A12341;border-radius:18px;color:#111827;line-height:1.75;white-space:pre-wrap;font-size:15px;">
                        ${escapeHtml(data.message)}
                      </div>
                    </td>
                  </tr>

                  <!-- CONFIDENCIALIDAD -->
                  <tr>
                    <td style="padding:30px 36px 0;">
                      <div style="background:#f3f4f6;border-radius:18px;padding:20px 22px;border:1px solid #e5e7eb;">
                        <p style="margin:0;color:#374151;font-size:14px;line-height:1.7;">
                          <strong style="color:#0F3B47;">Confidencialidad:</strong>
                          La información remitida por el solicitante debe ser tratada con reserva profesional.
                        </p>
                      </div>
                    </td>
                  </tr>

                  <!-- CTA INTERNO -->
                  <tr>
                    <td style="padding:32px 36px 36px;">
                      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                          <td align="center" style="background:#0F3B47;border-radius:16px;padding:18px;">
                            <a href="mailto:${escapeHtml(data.email)}" style="color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;">
                              Responder consulta
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:22px 0 0;text-align:center;color:#6b7280;font-size:13px;">
                        Este correo fue generado automáticamente desde el formulario de contacto del sitio web.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

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