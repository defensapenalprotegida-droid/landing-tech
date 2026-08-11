import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitLead } from "./leadApi";

describe("submitLead", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("hace POST a /api/contact con JSON y devuelve ok", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true, json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = await submitLead({
      name: "Juan", email: "j@x.cl", message: "hola mundo largo", area: "penal",
    } as any);

    expect(res.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith("/api/leads", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }));
  });

  it("devuelve ok:false si el servidor responde error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false, json: async () => ({ ok: false, message: "boom" }),
    }));
    const res = await submitLead({ name: "a", email: "a@x.cl", message: "xxxxxxxxxxxxxxx" } as any);
    expect(res.ok).toBe(false);
    expect(res.message).toBe("boom");
  });

  it("envía los campos de corretaje junto al servicio", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await submitLead({
      servicio: "corretaje",
      name: "Juan",
      email: "j@e.com",
      message: "Hola!",
      phone: "+56911111111",
      operacion: "vender",
      comuna: "Providencia",
    });

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.servicio).toBe("corretaje");
    expect(body.operacion).toBe("vender");
    expect(body.comuna).toBe("Providencia");
  });
});
