import type { Area } from "./leadSchema";

const EVENT = "lead:prefill-area";

/** Pre-selecciona un área en el formulario de contacto y hace scroll hacia él. */
export function prefillArea(area: Area) {
  window.dispatchEvent(new CustomEvent<Area>(EVENT, { detail: area }));
  const el = document.getElementById("contacto");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

/** Suscribe el formulario a los eventos de pre-selección. Devuelve un unsubscribe. */
export function onPrefillArea(cb: (area: Area) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<Area>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
