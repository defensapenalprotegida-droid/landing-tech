import { motion } from "framer-motion";
import { Shield, Users, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Ética profesional",
    desc: "Actuamos con integridad, transparencia y responsabilidad en cada caso que asumimos.",
  },
  {
    icon: Users,
    title: "Equipo multidisciplinario",
    desc: "Abogados especializados en diversas ramas del derecho para una asesoría integral.",
  },
  {
    icon: Award,
    title: "Prestigio comprobado",
    desc: "Reconocidos por nuestra trayectoria y resultados favorables en tribunales de todo Chile.",
  },
];

const team = [
  {
    name: "Patricio Aldunate",
    role: "Abogado litigante",
    description: "Concentra su práctica en las áreas de derecho penal, derecho laboral y procedimientos concursales. Su experiencia profesional se ha desarrollado en la representación y asesoría de personas y empresas, abordando conflictos jurídicos complejos con un enfoque estratégico, técnico y orientado a resultados. A lo largo de su ejercicio, ha intervenido en diversas instancias judiciales y administrativas, destacándose por una labor rigurosa, analítica y comprometida con la defensa de los intereses de sus representados, brindando una asesoría clara, cercana y confiable.",
    image: "/equipo/maria.jpg",
  },
  {
    name: "Ignacio Arteaga",
    role: "Abogado senior",
    description: " Concentra su práctica en Derecho Penal y Derecho Administrativo, con experiencia en litigios complejos y en la representación de personas y empresas ante instancias judiciales y administrativas; ha intervenido en materias vinculadas a delitos económicos, cibercrimen, lavado de activos e infracciones a normativas anticorrupción y tributarias, y en el ámbito administrativo asesora y representa a clientes en reclamaciones y demandas contra el Estado, municipalidades y diversos órganos de la Administración, caracterizándose su trabajo por una defensa técnica, estratégica y orientada a la protección efectiva de los derechos de sus representados.",
    image: "/equipo/jose.jpg",
  },
 {
  name: "Jose Pereira",
  role: "Abogada litigante",
  description: "Forma parte del equipo en las áreas de Derecho Laboral, Civil y Asesoría Corporativa, contando con sólida experiencia en la asesoría a personas y empresas en materias de derecho del trabajo —tanto individual como colectivo—, seguridad social y gestión de relaciones laborales, asumiendo además la defensa judicial en conflictos laborales y contingencias propias de la actividad empresarial. Asimismo, interviene en asuntos de derecho civil vinculados a contratos, obligaciones y responsabilidad civil, distinguiéndose su práctica profesional por un análisis jurídico crítico, un enfoque preventivo y estratégico y una asesoría rigurosa, clara y eficaz, orientada a la correcta aplicación de la normativa vigente y a la resolución oportuna de controversias.",
  image: "/equipo/camila.jpg",
},
{

  name: "Marta Garasa",
  role: "Abogada litigante",
  description: "Integra el equipo en las áreas de Derecho Penal y Derecho de Familia, con experiencia en litigación ante tribunales penales y superiores de justicia, representando a personas y empresas en causas de diversa complejidad. Asimismo, asesora en materias de compliance y responsabilidad penal de personas jurídicas, interviniendo también en asuntos de familia como alimentos, cuidado personal, relación directa y regular y divorcios.",
  image: "/equipo/marta.jpg",
},
// {
//   name: "Kony Pedreros",
//   role: "Analista informática",
//   description: "Integra el equipo aportando conocimientos especializados en el ámbito tecnológico y digital, colaborando en el análisis de antecedentes vinculados a causas jurídicas y participando en materias que requieren evaluación técnica o pericial en contextos asociados a ciberdelitos. Su participación contribuye al fortalecimiento de la estrategia jurídica del estudio en asuntos donde convergen el derecho y la tecnología.",
//   image: "/equipo/kony.jpg",
// }







];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

const AboutSection = () => {
  return (
    <section id="nosotros" className="section-padding bg-card">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          custom={0}
          className="text-center mb-16"
        >
          <p className="text-primary/70 font-semibold text-sm tracking-widest uppercase mb-3">
            Quiénes somos
          </p>

          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-8">
            Su confianza, nuestra prioridad
          </h2>

          {/* TEXTO ORDENADO */}
  <div className="text-muted-foreground text-lg leading-relaxed space-y-5 max-w-4xl mx-auto">
  <p>
    El prestigio y la reputación que hemos construido en el ámbito jurídico
    nacional se sustentan en nuestra vasta experiencia, en los altos estándares
    de calidad de los servicios que prestamos, en el estricto apego a la ética
    profesional y en la eficiencia con la que asumimos cada encargo.
  </p>

  <p>
    Somos un equipo multidisciplinario, cercano y altamente especializado,
    conformado por profesionales de excelencia en sus respectivas áreas de
    desempeño, comprometidos con brindar asesoría jurídica sólida y confiable.
  </p>

  <p>
    Nuestro objetivo es analizar cada conflicto de manera integral y entregar
    soluciones oportunas, personalizadas y eficaces a las necesidades de
    nuestros clientes, siempre con pleno respeto por los principios éticos que
    rigen el ejercicio de la profesión.
  </p>


          </div>
        </motion.div>

        {/* FEATURES */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i + 1}
              className="bg-background rounded-2xl p-8 border border-border shadow-soft hover:shadow-hover transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition">
                <f.icon className="w-7 h-7 text-primary" />
              </div>

              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                {f.title}
              </h3>

              <p className="font-sans text-muted-foreground leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* TEAM */}
        <div className="mt-20">
          <h3 className="font-serif text-3xl font-bold text-foreground text-center mb-12">
            Nuestro Equipo
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member) => (
              <Card
                key={member.name}
                className="relative group p-[2px] rounded-xl bg-transparent
                transition-all duration-300 hover:bg-gradient-to-tr
                hover:from-[#A12341] hover:to-[#0F3B47]
                hover:shadow-xl hover:-translate-y-2
                h-full min-h-[340px]"
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100
                  transition-opacity duration-500 z-10 flex items-center justify-center
                  rounded-xl px-6 text-center">
                  <p className="text-black text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>

                <div className="bg-white rounded-[10px] h-full w-full relative z-0 flex flex-col">
                  <CardContent className="p-6 text-center flex flex-col items-center justify-center flex-grow">

                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#A12341] to-[#0F3B47] mb-4 overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h4 className="font-serif text-xl font-semibold text-foreground mb-1">
                      {member.name}
                    </h4>

                    <p className="font-sans text-primary font-medium">
                      {member.role}
                    </p>

                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
