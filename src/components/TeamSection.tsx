import { Card, CardContent } from "@/components/ui/card";

const team = [
  {
    name: "Patricio Aldunate",
    role: "Abogado litigante",
    description:
      "Concentra su práctica en las áreas de derecho penal, derecho laboral y procedimientos concursales. Su experiencia profesional se ha desarrollado en la representación y asesoría de personas y empresas, abordando conflictos jurídicos complejos con un enfoque estratégico, técnico y orientado a resultados. A lo largo de su ejercicio, ha intervenido en diversas instancias judiciales y administrativas, destacándose por una labor rigurosa, analítica y comprometida con la defensa de los intereses de sus representados, brindando una asesoría clara, cercana y confiable.",
    image: "/equipo/maria.jpg",
  },
  {
    name: "Ignacio Arteaga",
    role: "Abogado senior",
    description:
      "Concentra su práctica en Derecho Penal y Derecho Administrativo, con experiencia en litigios complejos y en la representación de personas y empresas ante instancias judiciales y administrativas; ha intervenido en materias vinculadas a delitos económicos, cibercrimen, lavado de activos e infracciones a normativas anticorrupción y tributarias, y en el ámbito administrativo asesora y representa a clientes en reclamaciones y demandas contra el Estado, municipalidades y diversos órganos de la Administración, caracterizándose su trabajo por una defensa técnica, estratégica y orientada a la protección efectiva de los derechos de sus representados.",
    image: "/equipo/jose.jpg",
  },
  {
    name: "Jose Pereira",
    role: "Abogado litigante",
    description:
      "Forma parte del equipo en las áreas de Derecho Laboral, Civil y Asesoría Corporativa, contando con sólida experiencia en la asesoría a personas y empresas en materias de derecho del trabajo —tanto individual como colectivo—, seguridad social y gestión de relaciones laborales, asumiendo además la defensa judicial en conflictos laborales y contingencias propias de la actividad empresarial. Asimismo, interviene en asuntos de derecho civil vinculados a contratos, obligaciones y responsabilidad civil, distinguiéndose su práctica profesional por un análisis jurídico crítico, un enfoque preventivo y estratégico y una asesoría rigurosa, clara y eficaz, orientada a la correcta aplicación de la normativa vigente y a la resolución oportuna de controversias.",
    image: "/equipo/camila.jpg",
  },
  {
    name: "Marta Garasa",
    role: "Abogada litigante",
    description:
      "Integra el equipo en las áreas de Derecho Penal y Derecho de Familia, con experiencia en litigación ante tribunales penales y superiores de justicia, representando a personas y empresas en causas de diversa complejidad. Asimismo, asesora en materias de compliance y responsabilidad penal de personas jurídicas, interviniendo también en asuntos de familia como alimentos, cuidado personal, relación directa y regular y divorcios.",
    image: "/equipo/marta.jpg",
  },
];

const TeamSection = () => {
  return (
    <section id="equipo" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-primary/70 font-semibold text-sm tracking-widest uppercase mb-3">
            Profesionales
          </p>

          <h3 className="font-serif text-3xl md:text-5xl font-bold text-foreground">
            Nuestro Equipo
          </h3>
        </div>

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
              <div
                className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100
                transition-opacity duration-500 z-10 flex items-center justify-center
                rounded-xl px-6 text-center"
              >
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
    </section>
  );
};

export default TeamSection;