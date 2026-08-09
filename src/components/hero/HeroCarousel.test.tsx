import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import HeroCarousel from "./HeroCarousel";
import { HERO_SLIDES } from "@/lib/heroSlides";

const slides = HERO_SLIDES.map((data) => ({
  data,
  form: <div>form-{data.id}</div>,
}));

// Los tests de rotación no deben depender del reloj real.
const conSlidesQueTienenInput = HERO_SLIDES.map((data) => ({
  data,
  form: <input aria-label={`campo-${data.id}`} />,
}));

const slideActivo = (container: HTMLElement) => {
  const items = [...container.querySelectorAll("[data-slide]")];
  return items.findIndex((el) => !el.hasAttribute("inert"));
};

describe("HeroCarousel", () => {
  it("renderiza ambos slides para que su texto sea indexable", () => {
    render(<HeroCarousel slides={slides} />);
    expect(screen.getByText(HERO_SLIDES[0].title)).toBeInTheDocument();
    expect(screen.getByText(HERO_SLIDES[1].title)).toBeInTheDocument();
  });

  it("usa un solo h1, el del primer slide", () => {
    render(<HeroCarousel slides={slides} />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(HERO_SLIDES[0].title);
  });

  it("arranca en el slide legal y marca el otro como inert", () => {
    const { container } = render(<HeroCarousel slides={slides} />);
    const items = container.querySelectorAll("[data-slide]");
    expect(items[0].hasAttribute("inert")).toBe(false);
    expect(items[1].hasAttribute("inert")).toBe(true);
  });

  it("expone controles accesibles para cambiar de slide", () => {
    render(<HeroCarousel slides={slides} />);
    expect(screen.getByRole("button", { name: /siguiente/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /anterior/i })).toBeInTheDocument();
  });

  it("cambia de slide con ArrowRight en el teclado", () => {
    const { container } = render(<HeroCarousel slides={slides} />);
    const section = container.querySelector("section")!;

    fireEvent.keyDown(section, { key: "ArrowRight" });

    const items = container.querySelectorAll("[data-slide]");
    expect(items[0].hasAttribute("inert")).toBe(true);
    expect(items[1].hasAttribute("inert")).toBe(false);
  });

  it("cambia de slide con un gesto de swipe horizontal", () => {
    const { container } = render(<HeroCarousel slides={slides} />);
    const track = container.querySelector(".flex.items-start")!;

    fireEvent.touchStart(track, { touches: [{ clientX: 300, clientY: 100 }] });
    fireEvent.touchEnd(track, { changedTouches: [{ clientX: 200, clientY: 100 }] });

    const items = container.querySelectorAll("[data-slide]");
    expect(items[0].hasAttribute("inert")).toBe(true);
    expect(items[1].hasAttribute("inert")).toBe(false);
  });

  it("ignora el swipe si el desplazamiento vertical domina", () => {
    const { container } = render(<HeroCarousel slides={slides} />);
    const track = container.querySelector(".flex.items-start")!;

    fireEvent.touchStart(track, { touches: [{ clientX: 300, clientY: 100 }] });
    fireEvent.touchEnd(track, { changedTouches: [{ clientX: 260, clientY: 250 }] });

    const items = container.querySelectorAll("[data-slide]");
    expect(items[0].hasAttribute("inert")).toBe(false);
    expect(items[1].hasAttribute("inert")).toBe(true);
  });

  it("no cambia de slide si ArrowRight se origina en un input", () => {
    const { container } = render(<HeroCarousel slides={slides} />);
    const section = container.querySelector("section")!;
    const input = document.createElement("input");
    section.appendChild(input);

    fireEvent.keyDown(input, { key: "ArrowRight" });

    const items = container.querySelectorAll("[data-slide]");
    expect(items[0].hasAttribute("inert")).toBe(false);
    expect(items[1].hasAttribute("inert")).toBe(true);
  });

  describe("rotación automática", () => {
    afterEach(() => {
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    it("cambia de slide al cumplirse el intervalo, y da la vuelta", () => {
      vi.useFakeTimers();
      const { container } = render(
        <HeroCarousel slides={slides} intervaloMs={5000} />
      );
      expect(slideActivo(container)).toBe(0);

      act(() => { vi.advanceTimersByTime(5000); });
      expect(slideActivo(container)).toBe(1);

      act(() => { vi.advanceTimersByTime(5000); });
      expect(slideActivo(container)).toBe(0);
    });

    it("por defecto deja cada slide 8 segundos", () => {
      vi.useFakeTimers();
      const { container } = render(<HeroCarousel slides={slides} />);

      // A los 7 s todavía no cambió.
      act(() => { vi.advanceTimersByTime(7000); });
      expect(slideActivo(container)).toBe(0);

      act(() => { vi.advanceTimersByTime(1000); });
      expect(slideActivo(container)).toBe(1);
    });

    it("no cambia de slide mientras el cursor está en un campo del formulario", () => {
      vi.useFakeTimers();
      const { container } = render(
        <HeroCarousel slides={conSlidesQueTienenInput} />
      );

      const campo = screen.getByLabelText("campo-legal");
      campo.focus();
      expect(document.activeElement).toBe(campo);

      act(() => { vi.advanceTimersByTime(30000); });
      expect(slideActivo(container)).toBe(0);

      // Al soltar el campo, la rotación se reanuda sola.
      campo.blur();
      act(() => { vi.advanceTimersByTime(8000); });
      expect(slideActivo(container)).toBe(1);
    });

    it("no rota si el sistema pide menos movimiento", () => {
      vi.useFakeTimers();
      vi.spyOn(window, "matchMedia").mockReturnValue({
        matches: true,
        media: "(prefers-reduced-motion: reduce)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      } as unknown as MediaQueryList);

      const { container } = render(<HeroCarousel slides={slides} />);
      act(() => { vi.advanceTimersByTime(30000); });
      expect(slideActivo(container)).toBe(0);
    });

    it("intervaloMs en 0 desactiva la rotación", () => {
      vi.useFakeTimers();
      const { container } = render(
        <HeroCarousel slides={slides} intervaloMs={0} />
      );
      act(() => { vi.advanceTimersByTime(30000); });
      expect(slideActivo(container)).toBe(0);
    });
  });
});
