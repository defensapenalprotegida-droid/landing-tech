import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TeamSection from "./TeamSection";
import { TEAM } from "@/lib/team";

describe("TeamSection (vista de detalle)", () => {
  it("muestra una tarjeta por integrante, con su foto", () => {
    render(<TeamSection />);
    for (const member of TEAM) {
      const img = screen.getByAltText(`${member.name}, ${member.role}`);
      expect(img).toHaveAttribute("src", member.image);
    }
  });

  it("no expone el detalle antes de hacer clic", () => {
    render(<TeamSection />);
    expect(screen.queryByText(/Formación académica/i)).toBeNull();
    expect(screen.queryByText(TEAM[0].bio)).toBeNull();
  });

  it("al hacer clic en la foto abre el detalle con experiencia, formación y contacto", () => {
    render(<TeamSection />);
    const member = TEAM[0];

    fireEvent.click(
      screen.getByRole("button", { name: `Ver detalle de ${member.name}` }),
    );

    expect(screen.getByText(member.bio)).toBeInTheDocument();
    for (const item of member.formacion) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
    for (const area of member.areas) {
      expect(screen.getByText(area)).toBeInTheDocument();
    }
    expect(
      screen.getByRole("link", { name: new RegExp(member.contacto.correo!) }),
    ).toHaveAttribute("href", `mailto:${member.contacto.correo}`);
  });

  it("abre el detalle de la persona sobre la que se hizo clic, no siempre el primero", () => {
    render(<TeamSection />);
    const kony = TEAM.find((m) => m.slug === "kony-pedreros")!;

    fireEvent.click(
      screen.getByRole("button", { name: `Ver detalle de ${kony.name}` }),
    );

    expect(screen.getByText(kony.bio)).toBeInTheDocument();
    expect(screen.queryByText(TEAM[0].bio)).toBeNull();
  });
});
