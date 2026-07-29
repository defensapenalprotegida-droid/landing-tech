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
    expect(fetchMock).toHaveBeenCalledWith("/api/contact", expect.objectContaining({
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
});
