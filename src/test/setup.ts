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
