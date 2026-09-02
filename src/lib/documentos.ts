/**
 * Plantillas descargables del estudio.
 *
 * Cada documento tiene su propia página en /documentos/<slug>. La razón es
 * de buscadores: un .docx enlazado desde la home con dos palabras de anchor
 * no aparece para búsquedas como "poder simple modelo"; una página con texto
 * que explica qué es, cuándo sirve y cómo completarlo, sí.
 *
 * Los textos son informativos y generales. Deben ser revisados por un abogado
 * del estudio antes de cambiar su sentido jurídico.
 */
export interface DocumentoDescargable {
  slug: string;
  /** Nombre del archivo dentro de public/planillasparapaginaweb. */
  archivo: string;
  nombre: string;
  area: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  /** Párrafo citable: qué es el documento, en dos o tres frases. */
  resumen: string;
  cuandoUsar: string[];
  comoCompletar: string[];
  advertencias: string[];
  faq: { q: string; a: string }[];
  /** Slug de un artículo del blog que profundiza el tema. */
  articuloRelacionado?: string;
}

export const DOCUMENTOS_DIR = "/planillasparapaginaweb";

const documentos: DocumentoDescargable[] = [
  {
    slug: "poder-simple",
    archivo: "PAGINA_Poder_Simple.docx",
    nombre: "Poder Simple",
    area: "Derecho Civil",
    metaTitle: "Poder simple en Chile: modelo Word para descargar",
    metaDescription:
      "Descarga un modelo de poder simple en Word, editable y gratuito. Qué es, cuándo sirve, cómo completarlo y cuándo necesitas un poder notarial.",
    h1: "Modelo de poder simple para descargar",
    resumen:
      "Un poder simple es un documento privado en el que una persona (poderdante) autoriza a otra (apoderado) para realizar un trámite específico en su nombre. No requiere notaría, aunque muchas instituciones piden la firma autorizada ante notario para aceptarlo.",
    cuandoUsar: [
      "Retirar documentos, certificados o correspondencia a nombre de otra persona.",
      "Realizar trámites en instituciones públicas o privadas que aceptan poder simple.",
      "Representar a alguien en gestiones administrativas puntuales, sin facultad de disponer de bienes.",
    ],
    comoCompletar: [
      "Completa ciudad y fecha de otorgamiento.",
      "Identifica al poderdante y al apoderado con nombre completo, nacionalidad, estado civil, profesión, RUT y domicilio.",
      "Describe el objeto del poder con precisión: qué trámite, ante qué institución y por cuánto tiempo.",
      "Firma el poderdante. Si la institución lo exige, autoriza la firma ante notario.",
    ],
    advertencias: [
      "Un poder simple no sirve para vender, hipotecar o comprar inmuebles, ni para actos que la ley exige por escritura pública. Para eso necesitas un mandato especial ante notario.",
      "Cada institución define si acepta poder simple o exige firma autorizada. Confírmalo antes de presentarlo.",
      "Limita el objeto del poder. Un poder amplio y sin plazo es difícil de controlar.",
    ],
    faq: [
      {
        q: "¿El poder simple necesita notario?",
        a: "No por ley. Es un instrumento privado. En la práctica, bancos, AFP, Registro Civil y muchas empresas exigen que la firma esté autorizada ante notario, lo que cuesta poco y evita rechazos.",
      },
      {
        q: "¿Cuánto dura un poder simple?",
        a: "Lo que diga el documento. Si no fija plazo, dura hasta que el poderdante lo revoque. Conviene indicar una fecha de vencimiento.",
      },
      {
        q: "¿Puedo revocar un poder simple?",
        a: "Sí, en cualquier momento. Basta comunicarlo por escrito al apoderado y a la institución donde se iba a usar.",
      },
    ],
  },
  {
    slug: "carta-renuncia-voluntaria",
    archivo: "paginaweb_Carta_Renuncia_Voluntaria.docx",
    nombre: "Carta de Renuncia Voluntaria",
    area: "Derecho Laboral",
    metaTitle: "Carta de renuncia voluntaria: modelo Word para descargar",
    metaDescription:
      "Modelo de carta de renuncia voluntaria conforme al artículo 159 N.º 2 del Código del Trabajo. Descárgala en Word, edítala y conoce los plazos y requisitos.",
    h1: "Modelo de carta de renuncia voluntaria",
    resumen:
      "La carta de renuncia voluntaria es el aviso escrito con que el trabajador pone término a su contrato por decisión propia, según el artículo 159 N.º 2 del Código del Trabajo. Debe darse con al menos 30 días de anticipación y ratificarse ante ministro de fe para tener pleno valor.",
    cuandoUsar: [
      "Decidiste dejar tu trabajo por iniciativa propia, sin que haya despido ni incumplimiento del empleador.",
      "Quieres dejar constancia formal de la fecha de término y de tu solicitud de finiquito.",
    ],
    comoCompletar: [
      "Indica ciudad, fecha, y los datos de la empresa y de quien recibe la carta.",
      "Identifícate con nombre completo, RUT, cargo y fecha de ingreso.",
      "Fija la fecha efectiva de término respetando los 30 días de aviso, salvo acuerdo distinto con el empleador.",
      "Firma la carta y ratifícala ante notario, inspector del trabajo o presidente del sindicato. Guarda una copia timbrada.",
    ],
    advertencias: [
      "Si tu empleador incumple gravemente sus obligaciones (no paga cotizaciones, no paga sueldo, acoso), no renuncies: la vía correcta es el autodespido, que da derecho a indemnizaciones.",
      "La renuncia voluntaria no genera indemnización por años de servicio ni sustitutiva del aviso previo.",
      "Sin ratificación ante ministro de fe, el empleador puede objetar la renuncia.",
    ],
    faq: [
      {
        q: "¿Debo dar 30 días de aviso?",
        a: "Sí, el Código del Trabajo exige un aviso mínimo de 30 días. Puedes acordar con tu empleador un plazo menor; conviene dejar ese acuerdo por escrito.",
      },
      {
        q: "¿Tengo derecho a finiquito si renuncio?",
        a: "Sí. El finiquito debe incluir remuneraciones pendientes, feriado proporcional y cualquier otro haber adeudado. Lo que no corresponde es indemnización por años de servicio.",
      },
      {
        q: "¿Puedo arrepentirme después de entregar la carta?",
        a: "Solo si el empleador acepta dejarla sin efecto. Una vez ratificada, la renuncia produce efectos.",
      },
    ],
    articuloRelacionado: "autodespido-chile",
  },
  {
    slug: "declaracion-jurada-testigo",
    archivo: "pagina_Declaracion_Jurada_Testigo.docx",
    nombre: "Declaración Jurada de Testigo",
    area: "Derecho Penal",
    metaTitle: "Declaración jurada de testigo: modelo Word para descargar",
    metaDescription:
      "Modelo de declaración jurada de testigo en Word, editable. Para acreditar hechos, convivencia o relaciones ante notario, tribunales u organismos públicos.",
    h1: "Modelo de declaración jurada de testigo",
    resumen:
      "La declaración jurada de testigo es un documento en el que una persona afirma, bajo juramento y con su firma autorizada ante notario, hechos que le constan personalmente. Se usa para acreditar convivencia, dependencia económica, residencia u otros hechos ante organismos públicos y tribunales.",
    cuandoUsar: [
      "Acreditar convivencia o vínculo entre dos personas para trámites de familia, herencia o previsión social.",
      "Respaldar hechos ante un organismo público que acepta declaraciones juradas como antecedente.",
      "Dejar constancia formal de lo que un testigo sabe antes de un proceso judicial.",
    ],
    comoCompletar: [
      "Individualiza al declarante con nombre, nacionalidad, estado civil, profesión, RUT y domicilio.",
      "Identifica a las personas sobre las que se declara y explica el vínculo con ellas y desde cuándo.",
      "Redacta los hechos en primera persona, de forma concreta y sin opiniones.",
      "Firma ante notario, quien autoriza la firma y da fecha cierta al documento.",
    ],
    advertencias: [
      "Declarar hechos falsos bajo juramento es delito (artículo 210 del Código Penal).",
      "En un juicio la declaración jurada no reemplaza la declaración del testigo ante el tribunal; sirve como antecedente.",
      "Cada organismo tiene su propio formato. Confirma si acepta un modelo libre o exige el suyo.",
    ],
    faq: [
      {
        q: "¿La declaración jurada tiene que ser ante notario?",
        a: "En general sí. Sin firma autorizada por notario la mayoría de las instituciones no la acepta.",
      },
      {
        q: "¿Sirve para acreditar convivencia?",
        a: "Es uno de los antecedentes habituales, junto con contratos, cuentas a nombre de ambos o certificados de residencia. Cada organismo indica qué combinación exige.",
      },
    ],
    articuloRelacionado: "citado-a-declarar",
  },
  {
    slug: "checklist-compra-bien-raiz",
    archivo: "pagina_Checklist_Compra_Bien_Raiz.docx",
    nombre: "Checklist Compra de Bien Raíz",
    area: "Derecho Inmobiliario",
    metaTitle: "Checklist para comprar una propiedad en Chile (Word)",
    metaDescription:
      "Lista de verificación para comprar casa, departamento o terreno en Chile: estudio de títulos, certificados del Conservador, deudas, promesa y escritura. Descárgala en Word.",
    h1: "Checklist para comprar un bien raíz en Chile",
    resumen:
      "Este checklist ordena, paso a paso, lo que un comprador debe revisar antes de firmar la compra de una casa, departamento o terreno: estudio de títulos, certificados del Conservador de Bienes Raíces, deudas del inmueble, promesa de compraventa, escritura e inscripción.",
    cuandoUsar: [
      "Vas a comprar una propiedad, con o sin crédito hipotecario, y quieres revisar la situación legal antes de pagar el pie.",
      "Quieres saber qué certificados pedir al vendedor y al Conservador de Bienes Raíces.",
      "Necesitas una guía para ordenar la operación con el banco, el notario y el corredor.",
    ],
    comoCompletar: [
      "Llena la ficha inicial con datos del inmueble, rol de avalúo, partes, precio y forma de pago.",
      "Marca cada ítem a medida que reúnas el documento o confirmes el punto.",
      "Anota fechas de vigencia: varios certificados caducan a los 30 o 60 días.",
      "Si algún punto queda sin verificar, consúltalo con un abogado antes de firmar la promesa.",
    ],
    advertencias: [
      "El checklist no reemplaza el estudio de títulos de un abogado, que revisa la cadena de dominio de al menos diez años.",
      "No pagues pie ni firmes promesa sin certificado de dominio vigente y de hipotecas, gravámenes y prohibiciones.",
      "Revisa deudas de contribuciones, gastos comunes y servicios: pueden perseguir al inmueble.",
    ],
    faq: [
      {
        q: "¿Qué es el estudio de títulos?",
        a: "Es la revisión legal de la historia del inmueble para confirmar que quien vende es dueño y que no hay hipotecas, embargos, prohibiciones ni vicios que afecten la compra.",
      },
      {
        q: "¿Cuánto duran los certificados del Conservador?",
        a: "Los bancos y notarías suelen exigir certificados con no más de 30 días de antigüedad. Pídelos cerca de la fecha de firma.",
      },
    ],
    articuloRelacionado: "recuperar-pie-inmobiliaria",
  },
  {
    slug: "checklist-arrendar-propiedad",
    archivo: "Pagina_Checklist_Arrendar_Propiedad.docx",
    nombre: "Checklist Arrendar Propiedad",
    area: "Derecho Inmobiliario",
    metaTitle: "Checklist para arrendar una propiedad en Chile (Word)",
    metaDescription:
      "Lista de verificación para arrendador y arrendatario: antecedentes, contrato, garantía, inventario, reajustes y término del arriendo. Descárgala en Word.",
    h1: "Checklist para arrendar una propiedad",
    resumen:
      "Esta guía reúne lo que arrendador y arrendatario deben verificar antes, durante y al término de un arriendo: selección del arrendatario, cláusulas del contrato, garantía, inventario de entrega, reajustes y restitución del inmueble.",
    cuandoUsar: [
      "Vas a arrendar tu propiedad y quieres reducir el riesgo de no pago o de daños.",
      "Vas a arrendar como arrendatario y quieres saber qué revisar en el contrato antes de firmar.",
      "Necesitas ordenar la entrega y la devolución del inmueble con inventario y acta.",
    ],
    comoCompletar: [
      "Completa la ficha con tipo de inmueble, partes, renta, reajuste, plazo y garantía.",
      "Recorre la parte del arrendador o del arrendatario según tu rol, marcando cada punto.",
      "Adjunta el inventario con fotos fechadas al momento de la entrega.",
      "Conserva el checklist junto al contrato firmado.",
    ],
    advertencias: [
      "Un contrato de arriendo sin firmas autorizadas ante notario dificulta el cobro y el desalojo.",
      "La garantía debe devolverse al término, descontando solo daños acreditados y deudas del arrendatario.",
      "Para recuperar la propiedad frente a un arrendatario moroso, la Ley Devuélveme mi Casa fija un procedimiento rápido, pero exige contrato escrito.",
    ],
    faq: [
      {
        q: "¿El contrato de arriendo debe ser notarial?",
        a: "No es obligatorio, pero firmarlo ante notario da fecha cierta y facilita el juicio de cobro o desalojo. Es la recomendación habitual.",
      },
      {
        q: "¿Cuánto puede pedirse de garantía?",
        a: "La práctica es un mes de renta. La ley no fija un máximo, pero debe estar pactada por escrito y devolverse al término del contrato.",
      },
    ],
    articuloRelacionado: "ley-devuelveme-mi-casa",
  },
  {
    slug: "mandato-especial-compraventa-inmueble",
    archivo: "pagina_Mandato_Especial_Compraventa_Inmueble.docx",
    nombre: "Mandato Especial Compraventa Inmueble",
    area: "Derecho Inmobiliario",
    metaTitle: "Mandato especial para compraventa de inmueble: modelo Word",
    metaDescription:
      "Modelo de mandato especial por escritura pública para comprar o vender un inmueble a través de un mandatario. Descárgalo en Word y conoce los requisitos.",
    h1: "Modelo de mandato especial para compraventa de inmueble",
    resumen:
      "El mandato especial para compraventa de inmueble es el poder, otorgado por escritura pública ante notario, con el que una persona faculta a otra para vender o comprar una propiedad en su nombre y firmar la escritura correspondiente. Un poder simple no sirve para este acto.",
    cuandoUsar: [
      "Vas a vender o comprar una propiedad y no puedes asistir a la firma de la escritura.",
      "Vives fuera de Chile o de la ciudad donde se firmará la compraventa.",
      "Quieres que un familiar o abogado gestione la operación completa, incluida la inscripción en el Conservador.",
    ],
    comoCompletar: [
      "Identifica al mandante y al mandatario con todos sus datos.",
      "Individualiza el inmueble con dirección, rol de avalúo y datos de inscripción en el Conservador de Bienes Raíces.",
      "Detalla las facultades: vender o comprar, fijar precio, recibir o pagar, firmar escritura, alzar o constituir hipotecas, requerir inscripciones.",
      "Lleva el texto a la notaría: el mandato debe otorgarse por escritura pública.",
    ],
    advertencias: [
      "Este documento es un borrador para revisar con el notario y con un abogado. Si se otorga en el extranjero debe legalizarse o apostillarse.",
      "Un mandato con facultades vagas puede ser rechazado por el Conservador o por el banco del comprador.",
      "Fija plazo de vigencia y, si corresponde, un precio mínimo de venta.",
    ],
    faq: [
      {
        q: "¿Sirve un poder simple para vender una casa?",
        a: "No. La compraventa de inmuebles exige escritura pública, y el poder para celebrarla también. Debe ser un mandato especial otorgado ante notario.",
      },
      {
        q: "¿Puedo otorgar el mandato desde el extranjero?",
        a: "Sí, ante el cónsul chileno o ante notario extranjero con apostilla. Luego debe protocolizarse en Chile.",
      },
    ],
  },
];

export function getDocumentos(): DocumentoDescargable[] {
  return documentos;
}

export function getDocumentoBySlug(slug: string) {
  return documentos.find((d) => d.slug === slug);
}

export function getDocumentoByArchivo(archivo: string) {
  return documentos.find((d) => d.archivo === archivo);
}

export function urlDescarga(doc: DocumentoDescargable): string {
  return `${DOCUMENTOS_DIR}/${encodeURIComponent(doc.archivo)}`;
}
