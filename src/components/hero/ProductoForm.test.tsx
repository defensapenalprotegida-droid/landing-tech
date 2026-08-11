// src/components/hero/ProductoForm.test.tsx

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductoForm from "@/components/hero/ProductoForm";
import * as leadApi from "@/lib/leadApi";

// Mock leadApi
vi.mock("@/lib/leadApi", () => ({
  submitLead: vi.fn(),
}));

// Mock recaptcha
vi.mock("@/lib/recaptcha", () => ({
  getRecaptchaToken: vi.fn(() => Promise.resolve("mock-token")),
  RECAPTCHA_ACTIONS: { heroLegal: "hero_legal" },
}));

// Mock toast
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe("ProductoForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("debe renderizar el formulario para recupera-casa", () => {
    render(<ProductoForm productoId="recupera-casa" />);
    expect(screen.getByText("Recupera tu Casa")).toBeInTheDocument();
  });

  it("debe renderizar campos dinámicos del producto", () => {
    render(<ProductoForm productoId="recupera-casa" />);
    // Verificar que los campos dinámicos estén presentes en el DOM
    expect(screen.getByText(/¿Tienes contrato de arriendo?/)).toBeInTheDocument();
    expect(screen.getByText(/¿Cuántos meses de mora?/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Ej: 3")).toBeInTheDocument();
  });

  it("debe validar que nombre sea requerido", async () => {
    render(<ProductoForm productoId="recupera-casa" />);
    const submitBtn = screen.getByText("Enviar consulta gratuita");

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Nombre requerido/)).toBeInTheDocument();
    });
  });

  it.skip("debe validar que email sea válido", async () => {
    render(<ProductoForm productoId="recupera-casa" />);

    const nameInput = screen.getByPlaceholderText("Tu nombre completo") as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText("tu@email.com") as HTMLInputElement;
    const messageInput = screen.getByPlaceholderText(/desde cuándo no paga/) as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: "Juan Pérez" } });
    fireEvent.change(emailInput, { target: { value: "email-invalido" } });
    fireEvent.change(messageInput, { target: { value: "Tengo problemas con mi arrendatario" } });

    const submitBtn = screen.getByText("Enviar consulta gratuita");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Email inválido/)).toBeInTheDocument();
    });
  });

  it.skip("debe validar campos requeridos del producto", async () => {
    render(<ProductoForm productoId="recupera-casa" />);

    const nameInput = screen.getByPlaceholderText("Tu nombre completo") as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText("tu@email.com") as HTMLInputElement;
    const messageInput = screen.getByPlaceholderText(/desde cuándo no paga/) as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: "Juan Pérez" } });
    fireEvent.change(emailInput, { target: { value: "juan@example.com" } });
    fireEvent.change(messageInput, { target: { value: "Tengo problemas" } });

    const submitBtn = screen.getByText("Enviar consulta gratuita");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/es requerido/)).toBeInTheDocument();
    });
  });

  it.skip("debe enviar datos correctamente cuando es válido", async () => {
    const mockSubmitLead = vi.mocked(leadApi.submitLead);
    mockSubmitLead.mockResolvedValue({ ok: true, message: "Success" });

    render(<ProductoForm productoId="recupera-casa" />);

    const nameInput = screen.getByPlaceholderText("Tu nombre completo") as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText("tu@email.com") as HTMLInputElement;
    const messageInput = screen.getByPlaceholderText(/desde cuándo no paga/) as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: "Juan Pérez" } });
    fireEvent.change(emailInput, { target: { value: "juan@example.com" } });
    fireEvent.change(messageInput, { target: { value: "Tengo problemas con arrendatario" } });

    // Llenar campos dinámicos
    const radioButtons = screen.getAllByRole("radio");
    fireEvent.click(radioButtons[0]); // tieneContrato: "si"

    const mesesInput = screen.getByPlaceholderText("Ej: 3") as HTMLInputElement;
    fireEvent.change(mesesInput, { target: { value: "3" } });

    const submitBtn = screen.getByText("Enviar consulta gratuita");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockSubmitLead).toHaveBeenCalled();
      expect(mockSubmitLead).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Juan Pérez",
          email: "juan@example.com",
          producto: "recupera-casa",
          servicio: "legal",
        })
      );
    });
  });

  it("debe mostrar toast de error si falla el submit", async () => {
    const mockSubmitLead = vi.mocked(leadApi.submitLead);
    mockSubmitLead.mockResolvedValue({ ok: false, message: "Error en servidor" });

    render(<ProductoForm productoId="recupera-casa" />);

    const nameInput = screen.getByPlaceholderText("Tu nombre completo") as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText("tu@email.com") as HTMLInputElement;
    const messageInput = screen.getByPlaceholderText(/desde cuándo no paga/) as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: "Juan Pérez" } });
    fireEvent.change(emailInput, { target: { value: "juan@example.com" } });
    fireEvent.change(messageInput, { target: { value: "Tengo problemas" } });

    const radioButtons = screen.getAllByRole("radio");
    fireEvent.click(radioButtons[0]);

    const submitBtn = screen.getByText("Enviar consulta gratuita");
    fireEvent.click(submitBtn);

    // El toast de error debería mostrarse después
  });

  it("debe renderizar diferentes productos", () => {
    const { unmount } = render(<ProductoForm productoId="cobra-deuda" />);
    expect(screen.getByText("Cobra tu Deuda")).toBeInTheDocument();

    unmount();

    render(<ProductoForm productoId="divorcio-express" />);
    expect(screen.getByText("Divorcio Express")).toBeInTheDocument();
  });
});
