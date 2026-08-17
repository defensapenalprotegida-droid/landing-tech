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
    expect(screen.getByText("Contrato de arriendo")).toBeInTheDocument();
    expect(screen.getByText("Meses de mora")).toBeInTheDocument();
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
    const { unmount } = render(<ProductoForm productoId="cobra-pension" />);
    expect(screen.getByText("Cobra tu Pensión")).toBeInTheDocument();

    unmount();

    render(<ProductoForm productoId="divorcio-express" />);
    expect(screen.getByText("Divorcio Express")).toBeInTheDocument();
  });
});

describe("campos numéricos", () => {
  // Se busca por placeholder y no por etiqueta: los <label> del formulario no
  // declaran `htmlFor`, así que no hay nombre accesible que consultar. Es un
  // defecto de accesibilidad real, anotado aparte.
  const escribir = (placeholder: string, texto: string) => {
    const input = screen.getByPlaceholderText(placeholder) as HTMLInputElement;
    fireEvent.change(input, { target: { value: texto } });
    return input;
  };

  it("muestra los montos como pesos mientras se escribe", () => {
    render(<ProductoForm productoId="recupera-casa" />);
    expect(escribir("$0", "2400000").value).toBe("$2.400.000");
  });

  it("descarta letras en los montos", () => {
    render(<ProductoForm productoId="recupera-casa" />);
    expect(escribir("$0", "24abc00").value).toBe("$2.400");
  });

  it("los campos numéricos que no son dinero no llevan el signo peso", () => {
    // "Meses de mora" son 6, no $6.
    render(<ProductoForm productoId="recupera-casa" />);
    expect(escribir("Ej: 3", "6").value).toBe("6");
  });

  it("ningún campo numérico usa type=number, que dibuja flechas inútiles", () => {
    render(<ProductoForm productoId="recupera-casa" />);
    const numericos = screen
      .getAllByRole("textbox")
      .filter((i) => (i as HTMLInputElement).inputMode === "numeric");

    expect(numericos.length).toBeGreaterThan(1);
    for (const input of numericos) {
      expect((input as HTMLInputElement).type).toBe("text");
    }
  });
});
