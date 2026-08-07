import { motion } from "framer-motion";

const reasons = [
  { n: "01", title: "Trayectoria y especialización",
    desc: "Abogados con experiencia real en tribunales, especializados por área. Sabemos dónde y cómo se gana cada caso." },
  { n: "02", title: "Atención directa del abogado",
    desc: "Hablas siempre con el abogado que lleva tu causa, no con intermediarios. Sin derivaciones a terceros." },
  { n: "03", title: "Protocolo de respuesta inmediata",
    desc: "En materia penal cada hora cuenta. Tenemos disponibilidad para actuar desde el primer minuto, incluso 24/7 en urgencias." },
  { n: "04", title: "Confidencialidad absoluta",
    desc: "Toda tu información está protegida por el secreto profesional. Tu caso se trata con la máxima reserva." },
];

const WhyChooseUs = () => (
  <section id="por-que-elegirnos" className="section-padding bg-background">
    <div className="max-w-7xl mx-auto container-padding">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <p className="text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-4">Por qué elegirnos</p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
          Razones para confiar su caso a nuestro estudio
        </h2>
        <div className="w-20 h-[2px] bg-gradient-to-r from-[#A12341] to-[#0F3B47] mx-auto" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {reasons.map((r, i) => (
          <motion.div key={r.n}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
            className="bg-card border border-border rounded-2xl p-7 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
            <span className="font-heading text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#A12341] to-[#0F3B47]">{r.n}</span>
            <h3 className="font-heading text-xl font-semibold text-foreground mt-4 mb-2">{r.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{r.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
