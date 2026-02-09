import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Building2, Scale, AlertTriangle, Briefcase,
  ChevronRight, ChevronDown, ArrowRight,
  Users, HandCoins, TrendingUp, TrendingDown, XCircle,
  Handshake, Landmark, FileText, Gavel,
  Home, Key, FileCheck, ScrollText, Receipt, PenTool,
  Stamp, BookOpen, UserCheck, Search,
  ShieldAlert, Flame, Ban, Car, Skull, DollarSign,
  UserCog, Link, Swords, Scale as ScaleIcon, MessageSquare
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import imgFamilia from "@/assets/services-familia.jpg";
import imgBienes from "@/assets/services-bienes.jpg";
import imgCivil from "@/assets/services-civil.jpg";
import imgPenal from "@/assets/services-penal.jpg";
import imgLaboral from "@/assets/services-laboral.jpg";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Category {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  image: string;
  services: Service[];
}

const categories: Category[] = [
  {
    id: "familia",
    icon: Heart,
    title: "Derecho de Familia",
    subtitle: "Protegemos lo más importante: su familia y sus derechos.",
    image: imgFamilia,
    services: [
      { icon: HandCoins, title: "Demandar pensión de alimentos", description: "Inicio de demanda para obtener pensión alimenticia justa y proporcional." },
      { icon: Gavel, title: "Cumplimiento de pensión", description: "Acciones legales para garantizar el pago efectivo de la pensión." },
      { icon: TrendingUp, title: "Aumento de pensión", description: "Solicitud de incremento ante cambios en las necesidades del alimentario." },
      { icon: TrendingDown, title: "Rebaja de pensión", description: "Reducción proporcional ante cambios en la capacidad económica." },
      { icon: XCircle, title: "Cese de pensión", description: "Término legal de la obligación alimentaria cuando corresponda." },
      { icon: Handshake, title: "Mediación familiar", description: "Resolución colaborativa de conflictos familiares sin juicio." },
      { icon: Landmark, title: "Deuda de pensión", description: "Cobro judicial de pensiones adeudadas y apremios legales." },
      { icon: FileText, title: "Divorcio", description: "Mutuo acuerdo, unilateral por cese de convivencia o por culpa." },
      { icon: Scale, title: "Compensación económica", description: "Indemnización por dedicación al hogar o hijos comunes." },
      { icon: Users, title: "Liquidación sociedad conyugal", description: "División justa del patrimonio común tras el divorcio." },
    ],
  },
  {
    id: "bienes",
    icon: Building2,
    title: "Bienes Raíces",
    subtitle: "Seguridad jurídica en cada transacción inmobiliaria.",
    image: imgBienes,
    services: [
      { icon: FileCheck, title: "Promesa de compraventa", description: "Redacción y revisión de contratos de promesa inmobiliaria." },
      { icon: Home, title: "Usufructo vitalicio", description: "Constitución de derechos de uso y goce sobre inmuebles." },
      { icon: Key, title: "Contrato de arriendo", description: "Elaboración de contratos de arrendamiento seguros y completos." },
      { icon: Gavel, title: "Juicio de arrendamiento", description: "Defensa y demanda en conflictos de arriendo e incumplimiento." },
      { icon: Receipt, title: "Juicio monitorio", description: "Cobro rápido de deudas mediante procedimiento monitorio." },
      { icon: ScrollText, title: "Cesión de derechos", description: "Transferencia legal de derechos sobre bienes inmuebles." },
      { icon: PenTool, title: "Redacción de compraventa", description: "Escrituras de compraventa con plena seguridad jurídica." },
    ],
  },
  {
    id: "civil",
    icon: Scale,
    title: "Derecho Civil",
    subtitle: "Asesoría integral en materias civiles y contractuales.",
    image: imgCivil,
    services: [
      { icon: Stamp, title: "Mandatos y poderes", description: "Otorgamiento de poderes notariales y mandatos legales." },
      { icon: BookOpen, title: "Juicio ordinario", description: "Representación en juicios civiles de lato conocimiento." },
      { icon: UserCheck, title: "Cambio de nombre", description: "Gestión judicial para modificación de nombre o apellido." },
      { icon: Search, title: "Estudio jurídico previo", description: "Análisis legal preventivo antes de tomar decisiones importantes." },
    ],
  },
  {
    id: "penal",
    icon: AlertTriangle,
    title: "Derecho Penal",
    subtitle: "Defensa firme y estratégica en el proceso penal.",
    image: imgPenal,
    services: [
      { icon: ShieldAlert, title: "Delitos sexuales", description: "Defensa especializada en delitos contra la integridad sexual." },
      { icon: Flame, title: "Violencia intrafamiliar", description: "Protección y defensa ante situaciones de violencia doméstica." },
      { icon: Ban, title: "Estafas", description: "Representación en casos de fraude y delitos patrimoniales." },
      { icon: Car, title: "Manejo en estado de ebriedad", description: "Defensa penal en delitos de conducción bajo los efectos del alcohol." },
      { icon: Skull, title: "Homicidio", description: "Defensa técnica especializada en delitos contra la vida." },
      { icon: DollarSign, title: "Delitos económicos", description: "Asesoría en delitos tributarios, financieros y corporativos." },
    ],
  },
  {
    id: "laboral",
    icon: Briefcase,
    title: "Derecho Laboral",
    subtitle: "Defendemos sus derechos como trabajador o empleador.",
    image: imgLaboral,
    services: [
      { icon: UserCog, title: "Defensa trabajador", description: "Protección integral de los derechos del trabajador." },
      { icon: Link, title: "Relaciones laborales", description: "Asesoría en contratos, jornadas y condiciones laborales." },
      { icon: Swords, title: "Litigios laborales", description: "Representación en juicios ante Juzgados del Trabajo." },
      { icon: ScaleIcon, title: "Arbitraje laboral", description: "Resolución alternativa de conflictos laborales." },
      { icon: MessageSquare, title: "Negociación colectiva", description: "Asesoría sindical y procesos de negociación colectiva." },
    ],
  },
];

const ServiceCard = ({ service, index }: { service: Service; index: number }) => {
  const Icon = service.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group bg-background rounded-2xl border border-border p-6 transition-all duration-300 hover:shadow-hover hover:border-primary/20 hover:-translate-y-1"
    >
      <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h4 className="font-serif text-lg font-semibold text-foreground mb-2">{service.title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{service.description}</p>
      <a
        href="#contacto"
        className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all"
      >
        Más información
        <ArrowRight className="w-4 h-4" />
      </a>
    </motion.div>
  );
};

const CategorySection = ({ category, index }: { category: Category; index: number }) => {
  const [expanded, setExpanded] = useState(true);
  const Icon = category.icon;
  const isEven = index % 2 === 0;

  return (
    <div className={`py-16 md:py-24 ${isEven ? "bg-background" : "bg-card"}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Category header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start mb-12"
        >
          {/* Image */}
          <div className="w-full lg:w-2/5 overflow-hidden rounded-2xl shadow-soft">
            <motion.img
              src={category.image}
              alt={category.title}
              className="w-full h-56 md:h-72 object-cover"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Text */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <p className="text-primary/60 font-semibold text-sm tracking-widest uppercase">
                {category.id === "familia" ? "Categoría 1" : category.id === "bienes" ? "Categoría 2" : category.id === "civil" ? "Categoría 3" : category.id === "penal" ? "Categoría 4" : "Categoría 5"}
              </p>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">{category.title}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">{category.subtitle}</p>
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-5 inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
            >
              {expanded ? "Ocultar servicios" : `Ver ${category.services.length} servicios`}
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        </motion.div>

        {/* Service cards */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {category.services.map((service, i) => (
                  <ServiceCard key={service.title} service={service} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ServicesSection = () => {
  return (
    <section id="servicios">
      {/* Section header */}
      <div className="bg-background pt-20 md:pt-28 pb-8 px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-primary/70 font-semibold text-sm tracking-widest uppercase mb-3">
            Nuestros servicios
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
            Servicios legales especializados
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Ofrecemos asesoría integral en las principales áreas del derecho, con un equipo de abogados comprometidos con la defensa de sus derechos.
          </p>
        </motion.div>
      </div>

      {/* Categories */}
      {categories.map((category, i) => (
        <CategorySection key={category.id} category={category} index={i} />
      ))}
    </section>
  );
};

export default ServicesSection;
