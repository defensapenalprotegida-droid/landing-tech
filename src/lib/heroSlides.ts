import heroLegal from "@/assets/hero-legal.jpg";

export interface HeroSlideData {
  id: "legal" | "corretaje";
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaTarget: string;
  whatsappMessage: string;
}

export const HERO_SLIDES: HeroSlideData[] = [
  {
    id: "legal",
    eyebrow: "Estudio Jurídico en Chile",
    title: "Defensa estratégica, asesoría cercana y resultados que se ven.",
    description:
      "Somos un estudio jurídico, con sede en Santiago y cobertura nacional, que combina la rigurosidad técnica con la cercanía y disponibilidad que usted necesita. Defendemos sus derechos, su patrimonio y su tranquilidad.",
    image: heroLegal,
    ctaLabel: "Cuéntanos tu caso",
    ctaTarget: "contacto",
    whatsappMessage: "Hola, necesito ayuda legal.",
  },
  {
    id: "corretaje",
    eyebrow: "Corretaje con respaldo legal",
    title: "Vende o arrienda tu propiedad con un estudio jurídico detrás.",
    description:
      "Corretaje de propiedades acompañado de asesoría legal y representación judicial. Si tu propiedad arrastra una herencia sin resolver, un arriendo impago o un conflicto entre copropietarios, lo vemos nosotros mismos: no tendrás que contratar a un abogado aparte.",
    image: heroLegal,
    ctaLabel: "Habla con un corredor",
    ctaTarget: "contacto",
    whatsappMessage: "Hola, quiero asesoría para vender o arrendar mi propiedad.",
  },
];
