import { Card } from "@/components/ui/card";

// Fuente: descrpcionabogados/abogados.md
const team = [
  {
    name: "Ignacio Arteaga C.",
    role: "Socio fundador",
    areas: "Penal · Civil · Administrativo · Derechos Humanos · Financiero",
    description:
      "Abogado litigante experto en juicios contra el Estado, con trayectoria desde 1994. Asesora y representa a personas y organizaciones en asuntos de alta complejidad, con una visión estratégica, rigurosa y comprometida con la defensa de sus derechos.",
    image: "/equipo/ignacio-arteaga.webp",
  },
  {
    name: "Patricio Aldunate C.",
    role: "Socio administrador",
    areas: "Penal · Laboral · Civil · Negociación y solución de controversias",
    description:
      "Concentra su práctica en litigios penales y laborales. Asesora a personas y empresas en la prevención y resolución de conflictos, combinando una estrategia jurídica rigurosa con una atención cercana y orientada a resultados.",
    image: "/equipo/patricio-aldunate.webp",
  },
  {
    // Kony no figura en abogados.md: falta confirmar sus áreas y su reseña.
    name: "Kony Pedreros",
    role: "Socia",
    areas: "",
    description: "",
    image: "/equipo/kony-pedreros.webp",
  },
  {
    name: "José Pereira V.",
    role: "Asociado",
    areas: "Corporativo · Inmobiliario · Civil",
    description:
      "Se incorporó al estudio en 2025. Asesora a personas y empresas en materias civiles, comerciales, societarias, contractuales e inmobiliarias, con especial atención a la prevención de contingencias y al diseño de soluciones jurídicas claras y eficientes.",
    image: "/equipo/jose-pereira.webp",
  },
  {
    name: "Fabián Gómez R.",
    role: "Asociado",
    areas: "Tributario · Procedimientos concursales · Civil",
    description:
      "Se incorporó al estudio en 2026. Su práctica se concentra en materias tributarias, civiles y concursales, brindando asesoría en la evaluación de contingencias, reorganización de obligaciones y búsqueda de soluciones jurídicas sostenibles.",
    image: "/equipo/fabian-gomez.webp",
  },
  {
    name: "Marta Garasa G.",
    role: "Asociada",
    areas: "Familia · Penal · Solución de controversias",
    description:
      "Se incorporó al estudio en 2024. Litiga en materias de familia y penales, incluyendo asuntos de especial complejidad y alta sensibilidad. Entrega una asesoría estratégica, cercana y comprometida con la protección de los intereses de cada cliente.",
    image: "/equipo/marta-garasa.webp",
  },
];

const TeamSection = () => {
  return (
    <section id="equipo" className="section-padding bg-background">
      <div className="max-w-5xl mx-auto container-padding">
        <div className="text-center mb-12">
          <p className="text-primary/70 font-semibold text-sm tracking-widest uppercase mb-3">
            Profesionales
          </p>

          <h3 className="font-serif text-3xl md:text-5xl font-bold text-foreground">
            Nuestro Equipo
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <Card
              key={member.name}
              className="group relative overflow-hidden rounded-xl border border-border bg-card
              shadow-soft transition-all duration-300 hover:shadow-hover hover:-translate-y-2"
            >
              {/* La foto ya viene recortada en 4:3, misma proporción que este
                  contenedor: el navegador no vuelve a recortar y ninguna
                  cabeza queda cortada. */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={member.image}
                  alt={`${member.name}, ${member.role}`}
                  loading="lazy"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {member.description && (
                  <div
                    className="absolute inset-0 bg-legal-dark/60 backdrop-blur-[3px] text-white opacity-0
                    group-hover:opacity-100 group-focus-within:opacity-100
                    transition-opacity duration-300
                    flex items-center justify-center p-4 text-center"
                  >
                    <p className="font-body text-[11px] leading-snug [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">
                      {member.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h4 className="font-serif text-base font-semibold text-foreground mb-0.5">
                  {member.name}
                </h4>

                <p className="font-sans text-xs text-primary font-medium">
                  {member.role}
                </p>

                {member.areas && (
                  <p className="font-body text-[10px] text-muted-foreground leading-relaxed mt-1.5">
                    {member.areas}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
