import { Head } from "vite-react-ssg";

/**
 * Emite datos estructurados dentro de <Head>.
 *
 * Va en Head y no en el cuerpo para que quede en el HTML prerenderizado: un
 * crawler que no ejecuta JavaScript —y varios rastreadores de IA no lo
 * ejecutan— no vería nada si esto se inyectara después.
 *
 * Acepta `null` para que quien llama pueda pasar un schema condicional sin
 * envolverlo en un ternario en cada página.
 */
const JsonLd = ({ schema }: { schema: object | null }) => {
  if (!schema) return null;

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Head>
  );
};

export default JsonLd;
