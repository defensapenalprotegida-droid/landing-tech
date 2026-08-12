import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  renderHook,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PrivacyConsent from "./PrivacyConsent";
import { useConsent } from "@/hooks/use-consent";
import { CONSENT_REQUIRED_MESSAGE, PRIVACY_POLICY_VERSION } from "@/lib/consent";

/** Formulario mínimo que integra el consentimiento como lo haría uno real. */
const Formulario = ({ onEnviar }: { onEnviar: (r: unknown) => void }) => {
  const consent = useConsent("hero_legal");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!consent.validar()) return;
        onEnviar(consent.registro());
      }}
    >
      <PrivacyConsent {...consent} />
      <button type="submit">Enviar</button>
    </form>
  );
};

const montar = (onEnviar: (r: unknown) => void) =>
  render(
    <MemoryRouter>
      <Formulario onEnviar={onEnviar} />
    </MemoryRouter>
  );

describe("PrivacyConsent", () => {
  it("la casilla parte desmarcada: premarcarla no sería consentimiento", () => {
    montar(() => {});
    const casillas = screen.getAllByRole("checkbox");
    expect(casillas.every((c) => !(c as HTMLInputElement).checked)).toBe(true);
  });

  it("bloquea el envío mientras no se autorice, y explica por qué", () => {
    const enviar = vi.fn();
    montar(enviar);

    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    expect(enviar).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      CONSENT_REQUIRED_MESSAGE
    );
  });

  it("al autorizar, envía el registro probatorio completo", () => {
    const enviar = vi.fn();
    montar(enviar);

    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));

    expect(enviar).toHaveBeenCalledTimes(1);
    const registro = enviar.mock.calls[0][0] as Record<string, unknown>;
    expect(registro.policyVersion).toBe(PRIVACY_POLICY_VERSION);
    expect(registro.source).toBe("hero_legal");
    expect(registro.marketing).toBe(false);
    expect(typeof registro.acceptedAt).toBe("string");
    expect(registro.text).toBeTruthy();
  });

  it("la autorización comercial es independiente: no habilita ni bloquea el envío", () => {
    const enviar = vi.fn();
    montar(enviar);

    // Marcar solo la comercial no debe permitir enviar.
    fireEvent.click(screen.getAllByRole("checkbox")[1]);
    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));
    expect(enviar).not.toHaveBeenCalled();

    // Con ambas, el registro refleja que sí la autorizó.
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));
    const registro = enviar.mock.calls[0][0] as Record<string, unknown>;
    expect(registro.marketing).toBe(true);
  });

  it("el error desaparece al marcar la casilla", () => {
    montar(() => {});
    fireEvent.click(screen.getByRole("button", { name: /enviar/i }));
    expect(screen.queryByRole("alert")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("enlaza a la política de privacidad", () => {
    montar(() => {});
    expect(
      screen.getByRole("link", { name: /política de privacidad/i })
    ).toHaveAttribute("href", "/privacidad");
  });
});

describe("useConsent", () => {
  it("reset deja las casillas en blanco tras un envío exitoso", () => {
    const { result } = renderHook(() => useConsent("contacto"));

    act(() => {
      result.current.setAceptado(true);
      result.current.setMarketing(true);
    });
    expect(result.current.aceptado).toBe(true);

    act(() => result.current.reset());
    expect(result.current.aceptado).toBe(false);
    expect(result.current.marketing).toBe(false);
  });
});
