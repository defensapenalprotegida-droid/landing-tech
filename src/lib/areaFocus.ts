import type { Area } from "./leadSchema";

const EVENT = "practice-area:focus";

/**
 * Área elegida desde el menú mientras la sección no estaba montada (por
 * ejemplo, al elegirla desde /blog). `PracticeAreas` la consume al montarse.
 */
let pendiente: Area | null = null;

/** Pide que la sección de áreas abra un área concreta. */
export function focusArea(area: Area) {
  pendiente = area;
  window.dispatchEvent(new CustomEvent<Area>(EVENT, { detail: area }));
}

/** Devuelve el área pendiente y la limpia, para que no reaparezca después. */
export function consumePendingArea(): Area | null {
  const area = pendiente;
  pendiente = null;
  return area;
}

/** Suscribe la sección de áreas. Devuelve la función para desuscribirse. */
export function onFocusArea(cb: (area: Area) => void): () => void {
  const handler = (e: Event) => {
    pendiente = null;
    cb((e as CustomEvent<Area>).detail);
  };
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
