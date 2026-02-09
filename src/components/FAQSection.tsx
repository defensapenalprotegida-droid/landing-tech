import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "¿Qué es la pensión de alimentos?",
    a:
      "La pensión de alimentos es la obligación que tienen los padres de entregar alimentos, definida judicialmente, y que tiene por objeto cubrir los gastos de:\n" +
      "- Alimentación\n" +
      "- Vestimenta\n" +
      "- Educación\n" +
      "- Entretención\n" +
      "- Atención médica\n" +
      "- Entre otros\n\n" +
      "Esta obligación recae principalmente sobre los padres, pero también puede ser responsabilidad de otros parientes cercanos o tutores.",
  },
  {
    q: "¿Hasta qué edad los hijos pueden ser beneficiarios?",
    a:
      "- Hijos menores de 21 años.\n" +
      "- Hijos entre 21 y 28 años que se encuentren estudiando una profesión u oficio.\n" +
      "- Hijos con discapacidad física o mental que les impida subsistir por sí mismos.",
  },
  {
    q: "¿Quiénes deben proporcionar la pensión alimenticia a los hijos?",
    a: "Debe pagarla el padre o madre que no tiene el cuidado personal.",
  },
  {
    q: "¿Quién puede interponer una demanda por pensión alimenticia?",
    a:
      "El artículo 321(2) del Código Civil estipula la obligación legal de alimentar al o la cónyuge, los descendientes (hijos, nietos), los ascendientes (padres, abuelos) o a quien haya hecho una donación cuantiosa a la persona en cuestión.\n\n" +
      "Al ser un derecho individual, no es un beneficio transferible. Si los hijos del demandado son menores de edad, un tutor adulto puede demandar en su representación.",
  },
  {
    q: "¿Cómo se calcula la pensión de alimentos en Chile?",
    a:
      "Se calcula según:\n" +
      "- La capacidad económica del alimentante (quien debe pagar).\n" +
      "- Las necesidades del alimentario (quien recibe).\n\n" +
      "Se considera la situación financiera de ambas partes y se determina un monto justo y proporcional.",
  },
  {
    q: "¿Qué documentos vas a necesitar para demandar?",
    a:
      "Es vital reunir los siguientes documentos:\n" +
      "- Certificado de nacimiento del hijo o hijos.\n" +
      "- Certificado de matrimonio (si los padres están casados).\n" +
      "- Certificado de alumno regular (sala cuna, jardín, colegio o educación superior).\n" +
      "- Comprobante de pago de matrícula.\n" +
      "- Copia de la cédula de identidad.\n" +
      "- Certificados médicos (si existe enfermedad crónica o temporal).\n" +
      "- Todo documento que acredite gastos del hijo o hija.",
  },
  {
    q: "¿Cómo se realiza una demanda por pensión alimenticia?",
    a:
      "1) Primero se debe realizar una mediación familiar obligatoria para intentar un acuerdo extrajudicial.\n" +
      "2) Si no hay acuerdo, el mediador emite un acta de mediación frustrada, que permite interponer la demanda.\n" +
      "3) Luego se requiere el patrocinio de un abogado (idealmente especializado en Derecho de Familia).\n" +
      "4) Se presenta la demanda en el Tribunal de Familia correspondiente al domicilio del solicitante o del demandado.\n" +
      "5) Una vez acogida, se notifica al demandado.\n" +
      "6) Se fija audiencia y, si hay fundamentos, se decretan alimentos provisorios.\n\n" +
      "Los alimentos provisorios son el monto que deberá pagar el alimentante mientras dure el proceso y se fija el monto definitivo.",
  },
  {
    q: "¿Qué pasa si el demandado no cumple con la pensión?",
    a:
      "La legislación contempla mecanismos de apremio y cumplimiento forzado para garantizar el pago.\n\n" +
      "Además, existe el Registro Nacional de Deudores de Pensiones de Alimentos, que coordina diversas medidas legales para promover y garantizar el cumplimiento.",
  },
  {
    q: "¿Cómo se puede modificar la pensión de alimentos en Chile?",
    a:
      "Puede modificarse en cualquier momento si cambia:\n" +
      "- La situación financiera de alguna de las partes, o\n" +
      "- Las necesidades del alimentario.\n\n" +
      "Se debe presentar una solicitud ante el juez y acreditar un cambio significativo en las circunstancias.",
  },
  {
    q: "¿Se puede demandar a los abuelos?",
    a:
      "Sí. Cuando los alimentos decretados no fueran pagados o no fueran suficientes para solventar las necesidades del hijo o hija, se podrá demandar a los abuelos.\n\n" +
      "Excepción: no procede si la única fuente de ingreso de los abuelos corresponde a una pensión de vejez, invalidez o sobrevivencia.",
  },
];


const FAQSection = () => (
  <section id="faq" className="section-padding">
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <p className="text-primary/70 font-semibold text-sm tracking-widest uppercase mb-3">Preguntas frecuentes</p>
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">
          Resolvemos sus dudas
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-background rounded-xl border border-border px-6 overflow-hidden shadow-soft"
            >
              <AccordionTrigger className="text-foreground text-left font-medium py-5 hover:no-underline hover:text-primary transition-colors">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </div>
  </section>
);

export default FAQSection;
