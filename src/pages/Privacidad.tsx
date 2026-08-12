import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { PRIVACY_POLICY_VERSION } from "@/lib/consent";

/**
 * BORRADOR SUJETO A REVISIÓN DEL ESTUDIO.
 *
 * Decisiones tomadas y a respetar:
 * - NO se publica RUT, datos bancarios, teléfonos ni domicilios particulares
 *   de los socios. La ley exige individualizar al responsable y ofrecer un
 *   medio de contacto, no exponer esos antecedentes.
 * - El canal de derechos es abogados@arteagayaldunate.cl, que ya es público.
 *   No se crea un buzón nuevo que después nadie revisa.
 *
 * Queda un [POR DEFINIR] que BLOQUEA la publicación: los plazos de
 * conservación. La razón social ya está confirmada: el nombre comercial es
 * también la entidad responsable.
 *
 * Al modificar este texto hay que subir PRIVACY_POLICY_VERSION en
 * src/lib/consent.ts: esa versión queda registrada en cada lead y es lo que
 * permite acreditar qué aceptó cada persona.
 */
const Privacidad = () => (
  <div className="min-h-screen">
    <Seo
      title="Política de Privacidad"
      description="Cómo Arteaga & Aldunate Abogados trata los datos personales que recibe a través de este sitio: qué recopilamos, para qué, con quién se comparten y cómo ejercer tus derechos."
      path="/privacidad"
    />
    <Header />
    <main className="max-w-3xl mx-auto container-padding pt-32 pb-20 prose prose-lg prose-headings:font-heading prose-a:text-primary">
      <h1>Política de Privacidad</h1>

      <p className="lead">
        Esta política explica cómo Arteaga &amp; Aldunate Abogados y Asociados
        trata los datos personales que recibe a través de este sitio.
      </p>

      <p>
        <strong>Versión {PRIVACY_POLICY_VERSION}.</strong> Cuando envías un
        formulario, registramos la versión vigente en ese momento, de modo que
        siempre sea posible saber qué texto aceptaste.
      </p>

      <h2>1. Quién es responsable de tus datos</h2>
      <p>
        El responsable del tratamiento de los datos personales recopilados a
        través de este sitio es{" "}
        <strong>Arteaga &amp; Aldunate Abogados y Asociados</strong>.
      </p>
      <p>
        <strong>Domicilio para estos efectos:</strong> Bombero Salas N° 1369,
        oficina 701, Santiago, Chile.
      </p>
      <p>
        <strong>Contacto para consultas y ejercicio de derechos:</strong>{" "}
        <a href="mailto:abogados@arteagayaldunate.cl">
          abogados@arteagayaldunate.cl
        </a>
      </p>

      <h2>2. Qué datos recopilamos</h2>
      <p>A través de los formularios del sitio podemos recibir:</p>
      <ul>
        <li>
          <strong>Datos de contacto:</strong> nombre, teléfono y correo
          electrónico.
        </li>
        <li>
          <strong>Antecedentes de tu consulta:</strong> el área jurídica, la
          urgencia, tu horario preferido y la descripción que decidas escribir.
        </li>
        <li>
          <strong>Antecedentes sensibles del caso,</strong> cuando eliges
          alguna de las opciones que ofrecen los formularios: tu situación en
          un procedimiento penal (por ejemplo, citado a declarar, detenido,
          formalizado o víctima), la materia de familia involucrada (alimentos,
          cuidado personal, divorcio), tu situación laboral o el monto
          económico en disputa.
        </li>
        <li>
          <strong>Datos de la propiedad,</strong> en las consultas de
          corretaje: tipo de propiedad, comuna, dirección y, si usas el
          buscador de direcciones, las coordenadas geográficas asociadas.
        </li>
      </ul>
      <p>
        No estás obligado a completar los campos opcionales. Puedes describir tu
        situación en términos generales y reservar los detalles para una
        reunión privada.
      </p>

      <h2>3. Para qué los usamos</h2>
      <p>
        Únicamente para <strong>evaluar tu consulta y contactarte</strong>. Si
        además autorizas expresamente las comunicaciones comerciales —una
        casilla distinta y opcional— los usaremos para enviarte contenidos y
        novedades del estudio. Esa autorización es separable: no marcarla no
        afecta la respuesta a tu consulta.
      </p>
      <p>
        No vendemos tus datos ni los cedemos a terceros para que los usen con
        fines propios. Esto es distinto de los proveedores que trabajan{" "}
        <strong>por encargo nuestro y siguiendo nuestras instrucciones</strong>,
        que sí acceden a ellos para que el sitio y el correo funcionen. Están
        detallados más abajo.
      </p>

      <h2>4. Con qué fundamento los tratamos</h2>
      <p>
        Con tu consentimiento, que otorgas al marcar la casilla del formulario.
        Registramos la fecha y hora, el formulario de origen y la versión de
        esta política. Puedes revocarlo en cualquier momento escribiéndonos, sin
        que ello afecte la licitud del tratamiento anterior a la revocación.
      </p>

      <h2>5. Cuánto tiempo los conservamos</h2>
      <p>
        <em>
          [POR DEFINIR: plazo de conservación de las consultas que no derivan en
          un encargo profesional, y plazo aplicable a los expedientes de
          clientes, considerando las obligaciones de conservación que pesan
          sobre el estudio.]
        </em>
      </p>

      <h2>6. Encargados del tratamiento</h2>
      <p>
        Para operar el sitio y el correo recurrimos a proveedores tecnológicos
        que tratan tus datos <strong>por encargo nuestro</strong>. No deciden
        sobre ellos ni pueden usarlos para fines propios: nosotros seguimos
        siendo responsables frente a ti.
      </p>
      <ul>
        <li>
          <strong>Amazon Web Services:</strong> procesa y envía los correos con
          tu consulta. Sus servidores están en Estados Unidos.
        </li>
        <li>
          <strong>Google:</strong> el correo del estudio, además de reCAPTCHA
          —que protege los formularios de envíos automatizados— y el buscador de
          direcciones.
        </li>
        <li>
          <strong>Vercel:</strong> alojamiento del sitio.
        </li>
      </ul>
      <p>
        Esto implica que tus datos se procesan{" "}
        <strong>fuera de Chile</strong>. Exigimos a estos proveedores
        resguardos contractuales de confidencialidad y seguridad.
      </p>

      <h2>7. Tecnologías de terceros</h2>
      <p>
        Este sitio carga reCAPTCHA Enterprise y el servicio de direcciones de
        Google. Ambos recogen información técnica de tu navegación —como tu
        dirección IP y tu interacción con la página— para distinguir personas de
        programas automatizados y sugerir direcciones. Se rigen por las
        políticas de privacidad de Google.
      </p>

      <h2>8. Confidencialidad</h2>
      <p>
        La información sobre tu caso es tratada con reserva por los abogados del
        estudio. Ten presente que el secreto profesional ampara la relación con
        clientes: mientras tu consulta sea un contacto inicial, la protegemos
        contractual y técnicamente, pero la relación profesional se formaliza
        solo mediante un contrato de prestación de servicios.
      </p>

      <h2>9. Tus derechos</h2>
      <p>Puedes solicitarnos en cualquier momento:</p>
      <ul>
        <li>
          <strong>Acceso:</strong> saber qué datos tuyos tenemos.
        </li>
        <li>
          <strong>Rectificación:</strong> corregir datos inexactos o
          incompletos.
        </li>
        <li>
          <strong>Supresión:</strong> eliminar tus datos cuando ya no sean
          necesarios o revoques tu consentimiento.
        </li>
        <li>
          <strong>Oposición:</strong> oponerte a determinados tratamientos.
        </li>
        <li>
          <strong>Portabilidad:</strong> recibir tus datos en un formato
          reutilizable.
        </li>
      </ul>
      <p>
        Escríbenos a{" "}
        <a href="mailto:abogados@arteagayaldunate.cl">
          abogados@arteagayaldunate.cl
        </a>{" "}
        indicando qué derecho deseas ejercer. Responderemos dentro del plazo
        que fija la ley.
      </p>

      <h2>10. Seguridad</h2>
      <p>
        El sitio opera bajo conexión cifrada, los formularios están protegidos
        contra envíos automatizados y el acceso a las consultas está restringido
        a quienes deben atenderlas.
      </p>

      <h2>11. Cambios a esta política</h2>
      <p>
        Si modificamos esta política publicaremos una versión nueva en esta
        página. La versión que se te aplica es la que estaba vigente cuando
        entregaste tus datos, y quedó registrada junto con tu consulta.
      </p>
    </main>
    <Footer />
  </div>
);

export default Privacidad;
