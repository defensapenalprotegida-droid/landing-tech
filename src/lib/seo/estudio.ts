/**
 * Identidad del estudio: la fuente única del NAP.
 *
 * Estos valores tienen que coincidir carácter por carácter con la ficha de
 * Google Business Profile. Si el sitio y la ficha difieren, la señal se
 * debilita en vez de reforzarse: el buscador ve dos negocios parecidos en vez
 * de uno confirmado por dos fuentes.
 */
export const SITE = "https://arteagayaldunate.cl";

/**
 * Identificador estable de la entidad.
 *
 * Todas las páginas lo referencian. Es lo que hace que once páginas se lean
 * como un estudio y no como once negocios que comparten teléfono.
 */
export const ESTUDIO_ID = `${SITE}/#estudio`;

export const ESTUDIO = {
  nombre: "Arteaga & Aldunate Abogados y Asociados",
  nombreCorto: "Arteaga & Aldunate",
  descripcion:
    "Estudio jurídico en Santiago de Chile. Asesoría y representación en derecho penal, civil, laboral, de familia, corporativo, inmobiliario y tributario.",
  telefono: "+56995336140",
  email: "abogados@arteagayaldunate.cl",
  direccion: {
    calle: "Bombero Salas 1369, oficina 701",
    ciudad: "Santiago",
    region: "Región Metropolitana",
    pais: "CL",
  },
  /**
   * PENDIENTE DE CONFIRMACIÓN: el footer dice "Lun-Vie 9:00-18:00" y
   * "Emergencias 24/7". Las urgencias penales no se modelan como horario de
   * atención porque no son atención presencial en oficina.
   */
  horario: {
    dias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    abre: "09:00",
    cierra: "18:00",
  },
  /**
   * PENDIENTE DE CONFIRMACIÓN: mientras no se confirme el alcance real de
   * litigación, se declara la Región Metropolitana. Declarar Chile entero sin
   * respaldo diluye la señal local, que es justo lo que se quiere reforzar.
   */
  areaServida: "Región Metropolitana, Chile",
  areas: [
    "Derecho Penal",
    "Derecho Civil",
    "Derecho Laboral",
    "Derecho de Familia",
    "Derecho Corporativo",
    "Derecho Inmobiliario",
    "Derecho Tributario",
  ],
  /**
   * PENDIENTE: URLs reales de Instagram, LinkedIn y Facebook. El footer las
   * tiene como "#", y un sameAs con relleno es peor que no tener sameAs.
   * Al completarlas, actualizar también SOCIALS en Footer.tsx.
   */
  redes: [] as string[],
} as const;
