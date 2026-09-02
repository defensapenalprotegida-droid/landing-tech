import { motion } from "framer-motion";
import {
  Scale,
  AlertTriangle,
  Briefcase,
  Heart,
  Building2,
  Landmark,
  ReceiptText,
  Download,
} from "lucide-react";

const documentsByArea = [
  {
    icon: AlertTriangle,
    area: "Derecho Penal",
    color: "from-red-500/20 to-red-600/20",
    documents: [
      { name: "Declaración Jurada Testigo", file: "pagina_Declaracion_Jurada_Testigo.docx" }
    ],
  },
  {
    icon: Scale,
    area: "Derecho Civil",
    color: "from-blue-500/20 to-blue-600/20",
    documents: [
      { name: "Poder Simple", file: "PAGINA_Poder_Simple.docx" }
    ],
  },
  {
    icon: Briefcase,
    area: "Derecho Laboral",
    color: "from-green-500/20 to-green-600/20",
    documents: [
      { name: "Carta de Renuncia Voluntaria", file: "paginaweb_Carta_Renuncia_Voluntaria.docx" }
    ],
  },
  {
    icon: Heart,
    area: "Derecho de Familia",
    color: "from-pink-500/20 to-pink-600/20",
    documents: [],
  },
  {
    icon: Building2,
    area: "Derecho Corporativo",
    color: "from-amber-500/20 to-amber-600/20",
    documents: [
      { name: "Poder Simple", file: "PAGINA_Poder_Simple.docx" }
    ],
  },
  {
    icon: Landmark,
    area: "Derecho Inmobiliario",
    color: "from-purple-500/20 to-purple-600/20",
    documents: [
      { name: "Checklist Compra Bien Raíz", file: "pagina_Checklist_Compra_Bien_Raiz.docx" },
      { name: "Checklist Arrendar Propiedad", file: "Pagina_Checklist_Arrendar_Propiedad.docx" },
      { name: "Mandato Especial Compraventa Inmueble", file: "pagina_Mandato_Especial_Compraventa_Inmueble.docx" }
    ],
  },
  {
    icon: ReceiptText,
    area: "Derecho Tributario",
    color: "from-orange-500/20 to-orange-600/20",
    documents: [],
  },
];

const DocumentsDownload = () => {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <p className="text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-4">
            Recursos útiles
          </p>

          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Descarga plantillas y documentos editables
          </h2>

          <div className="w-20 h-[2px] bg-gradient-to-r from-[#A12341] to-[#0F3B47] mx-auto mb-8" />

          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            Accede a plantillas, checklists y formularios para cada área de práctica.
            Todos nuestros documentos están en formato editable para que los personalices según tus necesidades.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documentsByArea.map((item, index) => {
            const Icon = item.icon;
            const hasDocuments = item.documents.length > 0;

            return (
              <motion.div
                key={item.area}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className={`rounded-2xl border border-border overflow-hidden transition-all hover:shadow-hover ${
                  hasDocuments ? "bg-card" : "bg-card/50 opacity-75"
                }`}
              >
                <div className={`h-1 bg-gradient-to-r ${item.color}`} />

                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-foreground">
                        {item.area}
                      </h3>
                    </div>
                  </div>

                  {hasDocuments ? (
                    <div className="space-y-2">
                      {item.documents.map((doc) => (
                        <a
                          key={doc.file}
                          href={`/planillasparapaginaweb/${encodeURIComponent(doc.file)}`}
                          download
                          className="flex items-center gap-3 rounded-lg bg-background border border-primary/20 hover:border-primary/50 hover:bg-background/80 p-3 transition-all group"
                        >
                          <Download className="w-4 h-4 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <span className="text-foreground text-sm font-medium flex-1 group-hover:text-primary transition-colors">
                            {doc.name}
                          </span>
                          <span className="text-muted-foreground text-xs">.docx</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm italic">
                      Sin documentos disponibles en este momento
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-8 text-center"
        >
          <p className="text-foreground font-medium mb-4">
            ¿No encuentras el documento que necesitas?
          </p>
          <p className="text-muted-foreground mb-6">
            Contacta con nuestro equipo para que creemos una plantilla personalizada según tu caso específico.
          </p>
          <button className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-primary-foreground font-semibold shadow-soft hover:opacity-90 transition">
            Solicitar documento personalizado
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default DocumentsDownload;
