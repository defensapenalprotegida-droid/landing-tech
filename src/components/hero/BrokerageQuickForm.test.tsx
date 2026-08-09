import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BrokerageQuickForm from "./BrokerageQuickForm";
import * as leadApi from "@/lib/leadApi";

describe("BrokerageQuickForm", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("no envía si faltan campos obligatorios", async () => {
    const spy = vi.spyOn(leadApi, "submitLead");
    render(<BrokerageQuickForm />);
    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));
    await waitFor(() => expect(spy).not.toHaveBeenCalled());
  });

  it("envía servicio corretaje con los datos de la propiedad", async () => {
    const spy = vi
      .spyOn(leadApi, "submitLead")
      .mockResolvedValue({ ok: true });

    render(<BrokerageQuickForm />);
    fireEvent.change(screen.getByLabelText(/nombre completo/i), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(screen.getByLabelText(/teléfono/i), {
      target: { value: "+56 9 1234 5678" },
    });
    fireEvent.change(screen.getByLabelText(/correo/i), {
      target: { value: "juan@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/qué necesitas/i), {
      target: { value: "vender" },
    });
    fireEvent.change(screen.getByLabelText(/comuna/i), {
      target: { value: "Providencia" },
    });
    fireEvent.change(screen.getByLabelText(/cuéntanos/i), {
      target: { value: "Quiero vender mi departamento." },
    });
    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() => expect(spy).toHaveBeenCalled());
    const payload = spy.mock.calls[0][0];
    expect(payload.servicio).toBe("corretaje");
    expect(payload.operacion).toBe("vender");
    expect(payload.comuna).toBe("Providencia");
  });
});
