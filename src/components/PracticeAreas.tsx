import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  AlertTriangle,
  Briefcase,
  Heart,
  Building2,
  Landmark,
  ReceiptText,
  ChevronRight,
} from "lucide-react";

const areas = [
  {
    icon: AlertTriangle,
    title: "Derecho Penal",
    subtitle: "Defensa penal estratégica, inmediata y confidencial.",
    desc: "Cuando hay una imputación, una detención o una citación de la Fiscalía, cada hora cuenta. En Arteaga y Aldunate Abogados y Asociados asumimos su defensa desde el primer minuto: comparecencia ante el Ministerio Público, control de detención, formalización, juicio oral y recursos. Nuestro enfoque combina técnica procesal, conocimiento de la jurisprudencia de la Corte Suprema y una estrategia de defensa diseñada para proteger su libertad, su honra y su patrimonio.",
    services: [
      "Defensa penal en delitos comunes y delitos económicos.",
      "Defensa en delitos contra las personas: lesiones, homicidio, violencia intrafamiliar y porte de armas.",
      "Querellas criminales por delitos sufridos por usted o su empresa.",
      "Asesoría a víctimas y querellantes particulares, con foco en obtener reparación efectiva.",
      "Defensa en delitos contra la propiedad: hurto, robo y receptación.",
      "Asesoría en cumplimiento de la Ley N° 20.393 sobre responsabilidad penal de las personas jurídicas.",
      "Recursos de nulidad, apelación, queja y acciones constitucionales.",
    ],
    cta: "¿Está siendo investigado, citado o detenido? Contáctenos hoy. La defensa temprana es la diferencia entre un mal y un buen resultado.",
  },
  {
    icon: Scale,
    title: "Derecho Civil",
    subtitle:
      "Soluciones jurídicas sólidas para sus conflictos patrimoniales y contractuales.",
    desc: "El Derecho Civil es el corazón de las relaciones jurídicas entre personas: contratos, propiedad, responsabilidad, sucesiones e indemnizaciones. Nuestro equipo lo asesora tanto en la prevención, mediante la revisión y redacción de contratos, como en la litigación, incluyendo cobros, indemnizaciones, nulidades y juicios de precario. Diseñamos cada estrategia midiendo costos, tiempos y probabilidades reales de éxito.",
    services: [
      "Redacción, revisión y negociación de contratos civiles y comerciales.",
      "Juicios de cobro ejecutivo, ordinario y procedimiento monitorio.",
      "Indemnización de perjuicios por responsabilidad contractual y extracontractual.",
      "Acciones reivindicatorias, posesorias, juicios de precario y juicios de arrendamiento.",
      "Nulidades, resoluciones y rescisiones contractuales.",
      "Sucesiones, posesiones efectivas, particiones de herencia y testamentos.",
      "Tramitación de medidas prejudiciales y precautorias.",
    ],
    cta: "Le ayudamos a defender su patrimonio con estrategias procesales claras y resultados medibles.",
  },
  {
    icon: Briefcase,
    title: "Derecho Laboral",
    subtitle:
      "Asesoría laboral para empresas y trabajadores, con foco en resultados.",
    desc: "El Derecho Laboral chileno exige decisiones rápidas y bien fundamentadas. Asesoramos a trabajadores en despidos injustificados, autodespidos, tutela de derechos fundamentales y cobranza de prestaciones; y a empresas en gestión laboral preventiva, reglamentos internos, finiquitos, sumarios y defensa en juicios. Nuestro objetivo es alcanzar la mejor solución, sea en negociación o en tribunales.",
    services: [
      "Demandas por despido injustificado, indebido o improcedente.",
      "Tutela laboral por vulneración de derechos fundamentales.",
      "Autodespido y cobro de prestaciones adeudadas.",
      "Reclamos administrativos ante la Dirección del Trabajo e Inspección del Trabajo.",
      "Procedimientos por accidentes del trabajo y enfermedades profesionales.",
      "Asesoría a empleadores: contratos, reglamentos internos, finiquitos, sumarios y defensa judicial.",
      "Negociación colectiva y resolución de conflictos laborales.",
    ],
    cta: "Ya sea como trabajador o como empresa, evalúe su caso con un equipo que litiga y negocia en igual medida.",
  },
  {
    icon: Heart,
    title: "Derecho de Familia",
    subtitle:
      "Acompañamiento jurídico cercano en los momentos más sensibles de la vida.",
    desc: "Los conflictos de familia exigen sensibilidad, prudencia y la mejor técnica jurídica. Asesoramos en divorcios, alimentos, cuidado personal, relación directa y regular, violencia intrafamiliar y filiación, combinando experiencia procesal en los Juzgados de Familia con un trato humano, reservado y estratégico.",
    services: [
      "Divorcios de común acuerdo, unilaterales y por culpa.",
      "Pensión de alimentos: demandas, aumentos, rebajas y cese.",
      "Cuidado personal de niños, niñas y adolescentes.",
      "Relación directa y regular.",
      "Violencia intrafamiliar: medidas cautelares y denuncias.",
      "Filiación, reconocimiento de paternidad e impugnación.",
      "Acuerdo de Unión Civil y régimen patrimonial del matrimonio.",
      "Adopción y autorización de salida del país.",
    ],
    cta: "Conversemos su caso con la reserva y la cercanía que merece. Su tranquilidad es nuestra prioridad.",
  },
  {
    icon: Building2,
    title: "Derecho Corporativo",
    subtitle: "Su socio jurídico para constituir, operar y hacer crecer su empresa.",
    desc: "Toda empresa necesita una estructura jurídica sólida. Acompañamos a emprendedores, pymes y empresas consolidadas en la constitución, modificación y transformación de sociedades, pactos de accionistas, contratos comerciales, acuerdos de confidencialidad, fusiones y adquisiciones, gobierno corporativo y compliance.",
    services: [
      "Constitución de sociedades: SpA, E.I.R.L, LTDA y S.A.",
      "Pactos de socios y de accionistas.",
      "Redacción y negociación de contratos comerciales.",
      "Fusiones, adquisiciones, reorganizaciones empresariales y due diligence.",
      "Asesoría en gobierno corporativo y directorios.",
      "Implementación de programas de compliance.",
      "Disolución, liquidación y reorganización de sociedades.",
      "Asesoría continua a empresas como abogados externos de confianza.",
    ],
    cta: "Estructure su empresa hoy con la asesoría que protegerá su patrimonio mañana.",
  },
  {
    icon: Landmark,
    title: "Derecho Inmobiliario",
    subtitle:
      "Seguridad jurídica en cada compraventa, arrendamiento y proyecto inmobiliario.",
    desc: "Una propiedad mal estudiada es un riesgo patrimonial enorme. Realizamos estudios de títulos, redactamos y revisamos compraventas, promesas, arriendos y leasings, y asesoramos a inmobiliarias, propietarios y compradores en transacciones de cualquier escala. También representamos en conflictos por arriendos, deslindes, servidumbres y comunidades de copropiedad.",
    services: [
      "Estudio de títulos y saneamiento de la propiedad.",
      "Redacción y revisión de promesas y contratos de compraventa.",
      "Contratos de arrendamiento de viviendas, locales comerciales y oficinas.",
      "Juicios de terminación de arriendo, restitución y cobro de rentas.",
      "Asesoría a inmobiliarias en proyectos.",
      "Subdivisiones, fusiones de predios, servidumbres y deslindes.",
      "Ley N° 19.537 sobre copropiedad inmobiliaria.",
      "Regularización de bienes raíces conforme al DL N° 2.695.",
    ],
    cta: "Antes de firmar, asesórese. Cada error en un contrato inmobiliario cuesta años de litigio.",
  },
  {
    icon: ReceiptText,
    title: "Derecho Tributario",
    subtitle: "Planificación tributaria estratégica y defensa frente al SII.",
    desc: "El cumplimiento tributario es hoy un eje crítico para personas, empresas y profesionales. Asesoramos en planificación tributaria lícita, reorganización de patrimonios, defensa frente a fiscalizaciones del Servicio de Impuestos Internos y litigación en los Tribunales Tributarios y Aduaneros.",
    services: [
      "Planificación tributaria de personas naturales y empresas.",
      "Asesoría en regímenes tributarios.",
      "Defensa ante fiscalizaciones, citaciones y liquidaciones del SII.",
      "Reclamos tributarios y aduaneros ante los TTA y Cortes superiores.",
      "Reorganizaciones empresariales con enfoque tributario.",
      "Cumplimiento tributario y prevención de contingencias.",
      "Devoluciones de impuestos, condonaciones y convenios de pago.",
      "Asesoría en herencias, donaciones y sucesiones con foco tributario.",
    ],
    cta: "Una buena planificación tributaria, hecha a tiempo, puede ahorrarle millones. Conversemos.",
  },
];

const PracticeAreas = () => {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section id="areas" className="section-padding bg-card">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <p className="text-primary/70 font-semibold text-sm tracking-[0.25em] uppercase mb-4">
            Áreas de práctica
          </p>

          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Soluciones legales integrales para personas y empresas
          </h2>

          <div className="w-20 h-[2px] bg-gradient-to-r from-[#A12341] to-[#0F3B47] mx-auto mb-8" />

          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            Presentamos nuestras principales áreas de práctica, redactadas con
            un enfoque claro, estratégico y orientado a resultados. Nuestro
            estudio asesora y representa a clientes en materias penales, civiles,
            laborales, familiares, corporativas, inmobiliarias y tributarias.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Menú lateral */}
          <div className="lg:col-span-4 space-y-3">
            {areas.map((area, i) => (
              <motion.button
                key={area.title}
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActive(i)}
                className={`w-full text-left rounded-2xl border p-5 transition-all duration-300 group ${
                  active === i
                    ? "bg-background border-primary/40 shadow-hover"
                    : "bg-background/70 border-border shadow-soft hover:shadow-hover hover:border-primary/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
                      active === i ? "bg-primary/10" : "bg-primary/5"
                    }`}
                  >
                    <area.icon className="w-6 h-6 text-primary" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {area.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-1">
                      {area.subtitle}
                    </p>
                  </div>

                  <ChevronRight
                    className={`w-5 h-5 text-primary transition-transform ${
                      active === i ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {active !== null && (
                <motion.div
                  key={areas[active].title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.35 }}
                  className="relative rounded-3xl p-[2px] bg-gradient-to-br from-[#A12341] to-[#0F3B47] shadow-soft"
                >
                  <div className="bg-background rounded-[22px] p-7 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-start gap-5 mb-8">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {(() => {
                          const Icon = areas[active].icon;
                          return <Icon className="w-8 h-8 text-primary" />;
                        })()}
                      </div>

                      <div>
                        <p className="text-primary/70 font-semibold text-sm tracking-widest uppercase mb-2">
                          {active + 1}. Área de práctica
                        </p>

                        <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
                          {areas[active].title}
                        </h3>

                        <p className="text-primary font-semibold italic">
                          {areas[active].subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
                      {areas[active].desc}
                    </p>

                    <div className="border-t border-border pt-8">
                      <h4 className="font-serif text-xl font-semibold text-foreground mb-5">
                        Servicios principales
                      </h4>

                      <div className="grid md:grid-cols-2 gap-3">
                        {areas[active].services.map((service) => (
                          <div
                            key={service}
                            className="flex items-start gap-3 rounded-xl bg-card border border-border/70 p-4"
                          >
                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {service}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 rounded-2xl bg-card border border-primary/20 p-6">
                      <p className="text-primary/70 font-semibold text-sm tracking-widest uppercase mb-2">
                        Llamado a la acción
                      </p>

                      <p className="text-foreground font-medium leading-relaxed mb-5">
                        {areas[active].cta}
                      </p>

                      <a
                        href="#contacto"
                        className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-primary-foreground font-semibold shadow-soft hover:opacity-90 transition"
                      >
                        Consultar ahora
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PracticeAreas;