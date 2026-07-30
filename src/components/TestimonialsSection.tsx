import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { initials: "M.R.", area: "Derecho Penal", stars: 5,
    text: "Desde la primera llamada me explicaron todo con claridad y estuvieron disponibles cuando más lo necesitaba. Me sentí acompañada en todo el proceso." },
  { initials: "J.C.", area: "Derecho Laboral", stars: 5,
    text: "Respondieron rápido y siempre supe en qué etapa estaba mi caso. Trato directo con el abogado, sin vueltas." },
  { initials: "P.S.", area: "Derecho de Familia", stars: 5,
    text: "Un tema muy delicado tratado con respeto y reserva. Agradezco la cercanía y la honestidad en cada consejo." },
  { initials: "A.G.", area: "Derecho Civil", stars: 5,
    text: "Profesionales, claros con los honorarios y con los tiempos. Recomiendo el estudio sin dudarlo." },
  { initials: "R.M.", area: "Derecho Penal", stars: 5,
    text: "Actuaron de inmediato en una situación urgente. Su rapidez marcó la diferencia." },
  { initials: "C.V.", area: "Derecho Tributario", stars: 5,
    text: "Me orientaron con paciencia frente al SII y entendí cada paso. Excelente asesoría." },
];

const TestimonialsSection = () => (
  <section id="testimonios" className="section-padding bg-card">
    <div className="max-w-7xl mx-auto container-padding">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <p className="text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-4">Testimonios</p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
          Lo que dicen quienes confiaron en nosotros
        </h2>
        <div className="w-20 h-[2px] bg-gradient-to-r from-[#A12341] to-[#0F3B47] mx-auto mb-6" />
        <p className="text-muted-foreground">
          Testimonios reales de clientes, anonimizados para resguardar su privacidad y el secreto profesional.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}
            className="bg-background border border-border rounded-2xl p-7 shadow-soft flex flex-col">
            <Quote className="w-8 h-8 text-primary/30 mb-3" />
            <p className="text-muted-foreground leading-relaxed flex-grow">"{t.text}"</p>
            <div className="flex items-center gap-1 my-4">
              {Array.from({ length: t.stars }).map((_, s) => (
                <Star key={s} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <div className="flex items-center gap-3 border-t border-border pt-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#A12341] to-[#0F3B47] text-white flex items-center justify-center font-semibold text-sm">
                {t.initials}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">Cliente {t.initials}</p>
                <p className="text-muted-foreground text-xs">{t.area}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
