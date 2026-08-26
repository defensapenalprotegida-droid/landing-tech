import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readFileSync } from "fs";
import { join } from "path";

const ALLOWED_FILES = [
  "PAGINA_Poder_Simple.docx",
  "Pagina_Checklist_Arrendar_Propiedad.docx",
  "pagina_Checklist_Compra_Bien_Raiz.docx",
  "pagina_Declaracion_Jurada_Testigo.docx",
  "pagina_Mandato_Especial_Compraventa_Inmueble.docx",
  "paginaweb_Carta_Renuncia_Voluntaria.docx",
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, message: "Método no permitido" });
  }

  const { file } = req.query;

  if (!file || typeof file !== "string") {
    return res.status(400).json({ ok: false, message: "Archivo no especificado" });
  }

  if (!ALLOWED_FILES.includes(file)) {
    return res.status(403).json({ ok: false, message: "Archivo no permitido" });
  }

  try {
    const filePath = join(process.cwd(), "public", "planillasparapaginaweb", file);
    const fileContent = readFileSync(filePath);

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", `attachment; filename="${file}"`);
    res.setHeader("Content-Length", fileContent.length);

    return res.status(200).send(fileContent);
  } catch (err) {
    console.error(`Error descargando documento ${file}:`, err);
    return res.status(500).json({ ok: false, message: "Error descargando documento" });
  }
}
