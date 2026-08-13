import "@testing-library/jest-dom";

// jsdom no implementa IntersectionObserver, y framer-motion lo necesita para
// las animaciones `whileInView` que usan varias secciones. Sin este doble, esos
// componentes revientan al renderizarse en las pruebas.
class IntersectionObserverDoble implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

globalThis.IntersectionObserver =
  IntersectionObserverDoble as unknown as typeof IntersectionObserver;

// ResizeObserver es necesario para radix-ui components en tests
class ResizeObserverDoble implements ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver =
  ResizeObserverDoble as unknown as typeof ResizeObserver;

// jsdom no implementa matchMedia, y Sonner (el Toaster que monta Layout) lo
// consulta al montarse para decidir el tema. Sin este doble, cualquier
// prueba que renderice Layout revienta antes de llegar a lo que se quiere
// verificar.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
