import { motion } from "framer-motion";
import { ShieldCheck, Scale, Landmark, LockKeyhole } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Compromiso",
    desc: "Asumimos cada caso con seriedad, responsabilidad y dedicación profesional.",
  },
  {
    icon: Scale,
    title: "Excelencia técnica",
    desc: "Estudiamos cada asunto con rigor jurídico, estrategia procesal y criterio práctico.",
  },
  {
    icon: Landmark,
    title: "Transparencia",
    desc: "Entregamos información clara, honorarios definidos y comunicación permanente.",
  },
  {
    icon: LockKeyhole,
    title: "Confidencialidad",
    desc: "Resguardamos con absoluta reserva la información de nuestros clientes.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.12,
      duration: 0.55,
      ease: "easeOut",
    },
  }),
};

const AboutSection = () => {
  return (
    <section
      id="nosotros"
      className="relative section-padding overflow-hidden bg-card"
    >
      {/* Fondo decorativo sutil */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#A12341]/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Encabezado */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          custom={0}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <p className="text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-4">
            Quiénes somos
          </p>

          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Asesoría jurídica estratégica, cercana y orientada a resultados
          </h2>

          <div className="w-20 h-[2px] bg-gradient-to-r from-[#A12341] to-[#0F3B47] mx-auto mb-8" />

          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            Arteaga & Aldunate Abogados y Asociados es un estudio jurídico de servicios
            legales integrales, con sede en Santiago y cobertura en todo Chile.
            Asesoramos a personas, familias, emprendedores y empresas en la
            prevención, gestión y solución de sus conflictos jurídicos.
          </p>
        </motion.div>

        {/* Bloque institucional */}
        <div className="grid lg:grid-cols-2 gap-10 items-stretch mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
            className="bg-background border border-border rounded-3xl p-8 md:p-10 shadow-soft"
          >
            <p className="text-primary/70 font-semibold text-sm tracking-widest uppercase mb-4">
              Nuestra propuesta
            </p>

            <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-5">
              Una defensa seria, clara y técnicamente preparada
            </h3>

            <div className="space-y-5 text-muted-foreground text-base md:text-lg leading-relaxed">
              <p>
                Nuestro trabajo combina análisis jurídico riguroso, estrategia
                procesal y una comunicación directa con el cliente. Entendemos
                que enfrentar un problema legal puede generar incertidumbre; por
                eso buscamos entregar orientación clara, oportuna y enfocada en
                soluciones concretas.
              </p>

              <p>
                Intervenimos en materias penales, civiles, laborales,
                familiares, corporativas, inmobiliarias y tributarias, siempre
                con una mirada preventiva y litigiosa según las necesidades de
                cada caso.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={2}
            className="relative rounded-3xl p-[2px] bg-gradient-to-br from-[#A12341] to-[#0F3B47] shadow-soft"
          >
            <div className="h-full bg-background rounded-[22px] p-8 md:p-10">
              <p className="text-primary/70 font-semibold text-sm tracking-widest uppercase mb-4">
                Nuestra misión
              </p>

              <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-5">
                Proteger lo que más importa
              </h3>

              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
                Entregar a cada cliente —sea persona natural o empresa—
                soluciones jurídicas estratégicas, claras y ejecutables, que
                protejan su libertad, su familia, su trabajo y su patrimonio,
                bajo los más altos estándares éticos y profesionales.
              </p>

              <div className="border-t border-border pt-6">
                <p className="font-serif text-xl text-foreground italic leading-relaxed">
                  “La mejor asesoría legal no solo resuelve conflictos: también
                  los previene.”
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Valores */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={3}
          className="text-center mb-10"
        >
          <p className="text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-3">
            Nuestros valores
          </p>

          <h3 className="font-serif text-2xl md:text-4xl font-bold text-foreground">
            Principios que guían nuestra práctica
          </h3>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((item, i) => (
            <motion.div
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i + 4}
              className="group bg-background border border-border rounded-2xl p-7 shadow-soft hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-13 h-13 mb-5 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition">
                <item.icon className="w-7 h-7 text-primary" />
              </div>

              <h4 className="font-serif text-xl font-semibold text-foreground mb-3">
                {item.title}
              </h4>

              <p className="font-sans text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Cierre */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={8}
          className="mt-16 bg-background border border-border rounded-3xl px-8 py-10 md:px-12 md:py-12 text-center shadow-soft"
        >
          <p className="text-primary/70 font-semibold text-sm tracking-widest uppercase mb-4">
            Nuestro enfoque
          </p>

          <p className="max-w-4xl mx-auto text-muted-foreground text-lg md:text-xl leading-relaxed">
            Creemos que cada caso exige una estrategia propia. Por eso
            analizamos los antecedentes, evaluamos los riesgos y diseñamos un
            camino jurídico claro, ya sea para prevenir conflictos, negociar una
            solución o litigar con firmeza ante los tribunales competentes.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;