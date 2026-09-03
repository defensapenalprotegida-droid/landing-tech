/**
 * Widget de redes sociales de terceros (Elfsight, SnapWidget, LightWidget).
 *
 * El proveedor entrega dos cosas: un <script> y un contenedor. Aquí se
 * guardan por separado para que el componente pueda cargar el script SOLO
 * cuando la persona aceptó cookies de marketing: estos widgets traen tracking
 * propio y no pueden ejecutarse antes del consentimiento.
 *
 * Mientras `scriptSrc` esté vacío la sección muestra únicamente los botones a
 * las redes. Es el estado seguro por defecto.
 */
export interface SocialFeedWidget {
  /** URL del script del proveedor. Vacío = widget no configurado. */
  scriptSrc: string;
  /** HTML del contenedor tal como lo entrega el proveedor. */
  containerHtml: string;
}

export const SOCIAL_FEED_WIDGET: SocialFeedWidget = {
  // Ejemplo Elfsight:
  //   scriptSrc: "https://static.elfsight.com/platform/platform.js",
  //   containerHtml: '<div class="elfsight-app-XXXXXXXX" data-elfsight-app-lazy></div>',
  scriptSrc: "",
  containerHtml: "",
};

export function socialFeedConfigured(widget: SocialFeedWidget = SOCIAL_FEED_WIDGET) {
  return widget.scriptSrc.trim() !== "" && widget.containerHtml.trim() !== "";
}
