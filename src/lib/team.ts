export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  image: string;
  areas: string[];
  bio: string;
  formacion: string[];
  contacto: {
    telefono?: string;
    correo?: string;
    linkedin?: string;
  };
}

// Orden: socios, luego asociados y por último asesoría externa.
export const TEAM: TeamMember[] = [
  {
    slug: "ignacio-arteaga",
    name: "Ignacio Arteaga C.",
    role: "Socio fundador",
    image: "/equipo/ignacio-arteaga.webp",
    areas: [
      "Derecho Penal",
      "Derecho Civil",
      "Derecho Administrativo",
      "Derechos Humanos",
      "Derecho Financiero",
    ],
    bio: "Ignacio Arteaga Casanova es socio fundador del estudio y abogado litigante, experto en juicios contra el Estado, con una trayectoria profesional desarrollada desde 1994. Su práctica se concentra en Derecho Penal, Civil, Administrativo, Financiero y Derechos Humanos, asesorando y representando a personas y organizaciones en asuntos de alta complejidad, con una visión estratégica, rigurosa y comprometida con la defensa de sus derechos.",
    formacion: [
      "Abogado, Universidad Central de Chile, 1994.",
      "Diplomado Reforma Procesal Penal, 2004.",
      "Magíster en Derecho Penal y Procesal, 2010.",
    ],
    contacto: {
      telefono: "+56 9 9977 4936",
      correo: "abogados@arteagayaldunate.cl",
    },
  },
  {
    slug: "patricio-aldunate",
    name: "Patricio Aldunate C.",
    role: "Socio administrador",
    image: "/equipo/patricio-aldunate.webp",
    areas: [
      "Derecho Penal",
      "Derecho Laboral",
      "Derecho Civil",
      "Negociación y solución de controversias",
    ],
    bio: "Patricio Aldunate es socio administrador del estudio y concentra su práctica en litigios penales y laborales. Asesora a personas y empresas en la prevención y resolución de conflictos, combinando una estrategia jurídica rigurosa con una atención cercana y orientada a resultados.",
    formacion: [
      "Abogado, Universidad Mayor, 2022.",
      "Diplomado en Derecho Penal Económico, Pontificia Universidad Católica de Chile, 2025.",
      "Diplomado en Litigación ante Tribunales Ordinarios y Superiores de Justicia, Pontificia Universidad Católica de Chile, 2026.",
    ],
    contacto: {
      telefono: "+56 9 9533 6140",
      correo: "paldunate.abogado@gmail.com",
      linkedin: "https://linkedin.com/in/patricioaldunatecontreras/",
    },
  },
  {
    slug: "jose-pereira",
    name: "José Pereira V.",
    role: "Asociado",
    image: "/equipo/jose-pereira.webp",
    areas: ["Derecho Corporativo", "Derecho Inmobiliario", "Derecho Civil"],
    bio: "José Pereira se incorporó al estudio en 2025. Su práctica se enfoca en la asesoría de personas y empresas en materias civiles, comerciales, societarias, contractuales e inmobiliarias, con especial atención a la prevención de contingencias y al diseño de soluciones jurídicas claras y eficientes.",
    formacion: ["Abogado, Universidad Diego Portales, 2022."],
    contacto: {
      telefono: "+56 9 6641 6504",
      correo: "jpereirav.abogado@gmail.com",
      linkedin: "https://linkedin.com/in/josepereirav/",
    },
  },
  {
    slug: "fabian-gomez",
    name: "Fabián Gómez R.",
    role: "Asociado",
    image: "/equipo/fabian-gomez.webp",
    areas: [
      "Derecho Tributario",
      "Procedimientos Concursales",
      "Derecho Civil",
    ],
    bio: "Fabián Gómez se incorporó al estudio en 2026. Su práctica se concentra en materias tributarias, civiles y concursales, brindando asesoría a personas y empresas en la evaluación de contingencias, reorganización de obligaciones y búsqueda de soluciones jurídicas sostenibles.",
    // El "Diplomado en Gestión Tributaria, 2024" queda fuera a propósito: la
    // ficha original pide confirmar la institución antes de publicarlo.
    formacion: ["Abogado, Universidad Andrés Bello, 2020."],
    contacto: {
      telefono: "+56 2 2391 2030",
      correo: "fabiangomezretamal@gmail.com",
      linkedin: "https://linkedin.com/in/fabian-gomez-retamal/",
    },
  },
  {
    slug: "marta-garasa",
    name: "Marta Garasa G.",
    role: "Asociada",
    image: "/equipo/marta-garasa.webp",
    areas: ["Derecho de Familia", "Derecho Penal", "Solución de controversias"],
    bio: "Marta Garasa se incorporó al estudio en 2024. Su práctica se enfoca en litigios de familia y penales, incluyendo asuntos de especial complejidad y alta sensibilidad. Entrega una asesoría estratégica, cercana y comprometida con la protección de los intereses de cada cliente.",
    formacion: ["Abogada, Universidad Bolivariana, 2022."],
    contacto: {
      telefono: "+56 9 8668 5396",
      correo: "garasa.abogada@gmail.com",
      linkedin: "https://linkedin.com/in/marta-garasa-ab8981124/",
    },
  },
  {
    slug: "camilo-henriquez",
    name: "Camilo Henríquez P.",
    role: "Asociado",
    image: "/equipo/camilo-henriquez.webp",
    areas: [
      "Policía Local",
      "Derecho Inmobiliario",
      "Derecho Civil",
      "Derecho Penal",
    ],
    // La ficha original mezclaba primera y tercera persona; se unifica en
    // tercera para que calce con el resto del equipo.
    bio: "Camilo Henríquez se incorporó al estudio en 2025 y se especializa en Policía Local, Derecho Inmobiliario, contratos, Derecho Civil y Derecho Penal. Tiene experiencia como litigante, reforzada por su diplomado en la Universidad de los Andes. Su paso por la Fiscalía Local de La Florida fue fundamental para consolidar su competencia y manejar casos con eficiencia, orientando su ejercicio a un servicio de excelencia en el cumplimiento de su obligación de medio.",
    formacion: [
      "Abogado, Universidad Pedro de Valdivia, 2020.",
      "Diplomado en Derecho Penal, Universidad de Los Andes, 2022.",
    ],
    contacto: {
      telefono: "+56 9 3072 8146",
      correo: "camilo.henriquezp@gmail.com",
      linkedin: "https://www.linkedin.com/in/camilo-henr%C3%ADquez-puentes-0b7225278/",
    },
  },
  {
    slug: "ivan-marivil",
    name: "Iván Rodrigo Marivil",
    role: "Asesor externo",
    image: "/equipo/IvanRodrigo.webp",
    areas: [
      "Policía Local",
      "Protección de derechos de los consumidores",
      "Fraude bancario",
      "Ley de tránsito",
    ],
    bio: "Iván Rodrigo Marivil es abogado con experiencia en litigación ante los Juzgados de Policía Local (JPL) y tribunales ordinarios. Su práctica destaca principalmente en la defensa de los derechos sobre protección a los derechos de los consumidores, ley especial sobre fraude bancario y Ley de tránsito. Se incorporó al estudio como asesor externo para reforzar la competencia en materias de policía local y protección del consumidor.",
    formacion: [
      "Abogado, Universidad Ucinf, 2020.",
      "Diplomado en Derecho Procesal Penal, Universidad Central de Chile, 2023.",
      "Diplomado en Derecho Procesal Constitucional, Universidad Central de Chile, 2023.",
      "Diplomado en Derecho Procedimiento Civil, Universidad Central de Chile, 2023.",
      "Curso sobre protección de los derechos de los consumidores.",
    ],
    contacto: {
      telefono: "+56 9 3032 1703",
      correo: "abogadoivanmarivil@gmail.com",
      linkedin: "https://www.linkedin.com/in/ivan-marivil-43b2351bb/",
    },
  },
  {
    slug: "kony-pedreros",
    name: "Kony Pedreros G.",
    role: "Asesora externa",
    image: "/equipo/kony-pedreros.webp",
    areas: ["Fraude bancario", "Delitos económicos", "Ciberdelitos"],
    bio: "Kony Pedreros se incorporó al estudio jurídico en 2024 como asesora externa. Ingeniera en Informática, aporta una mirada técnica especializada en fraude bancario, delitos económicos y ciberdelitos. Su labor se orienta al análisis de antecedentes digitales y transacciones, la identificación de patrones de fraude y el apoyo técnico en asuntos que requieren integrar criterios informáticos y jurídicos.",
    formacion: [
      "Ingeniera en Informática, Universidad Tecnológica de Chile INACAP, 2020.",
      "Diplomado en Gestión Ágil de Proyectos, Pontificia Universidad Católica de Chile, 2024.",
      "Diplomado en Transformación de Empresas, Pontificia Universidad Católica de Chile, 2023.",
    ],
    contacto: {
      telefono: "+56 9 6499 4292",
      correo: "konypedreros@gmail.com",
      linkedin: "https://www.linkedin.com/in/kony-pedreros-gonz%C3%A1lez/",
    },
  },
];
