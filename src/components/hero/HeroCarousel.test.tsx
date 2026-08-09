import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HeroCarousel from "./HeroCarousel";
import { HERO_SLIDES } from "@/lib/heroSlides";

const slides = HERO_SLIDES.map((data) => ({
  data,
  form: <div>form-{data.id}</div>,
}));

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
});
