import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ContactSection from "./ContactSection";

// El Toaster real usa hooks globales; envolvemos sin providers extra.
describe("ContactSection (formulario adaptativo)", () => {
  it("muestra el campo 'situación' solo cuando el área es Penal", () => {
    render(<ContactSection />);
    // Por defecto no hay situación penal visible
    expect(screen.queryByText(/Situación actual/i)).toBeNull();
    // Seleccionar área Penal
    const areaSelect = screen.getByLabelText(/Área/i) as HTMLSelectElement;
    fireEvent.change(areaSelect, { target: { value: "penal" } });
    expect(screen.getByText(/Situación actual/i)).toBeInTheDocument();
  });

  it("muestra 'monto involucrado' para Civil", () => {
    render(<ContactSection />);
    const areaSelect = screen.getByLabelText(/Área/i) as HTMLSelectElement;
    fireEvent.change(areaSelect, { target: { value: "civil" } });
    expect(screen.getByText(/Monto involucrado/i)).toBeInTheDocument();
  });
});
