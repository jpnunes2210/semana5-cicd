import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
  vi.restoreAllMocks();
});

describe("fonte de dados", () => {
  it("usa a API Django por padrao", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ status: "ok", items: ["a"] }),
    });
    const { DATA_SOURCE, fetchItems } = await import("@/lib/data-source");

    expect(DATA_SOURCE).toBe("api");
    expect(await fetchItems()).toEqual({ status: "ok", items: ["a"] });
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/api/health/"), expect.anything());
  });

  it("usa o Firestore quando NEXT_PUBLIC_DATA_SOURCE=firestore, no mesmo formato JSON", async () => {
    vi.stubEnv("NEXT_PUBLIC_DATA_SOURCE", "firestore");
    vi.doMock("@/lib/firestore", () => ({
      fetchItemsFromFirestore: async () => ({
        status: "ok",
        items: ["Configurar Docker", "Automatizar CI", "Publicar no GHCR"],
      }),
    }));
    const { DATA_SOURCE, fetchItems } = await import("@/lib/data-source");

    expect(DATA_SOURCE).toBe("firestore");
    const dados = await fetchItems();
    expect(dados.status).toBe("ok");
    expect(dados.items).toHaveLength(3);
  });
});
