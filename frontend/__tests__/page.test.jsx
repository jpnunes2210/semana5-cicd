import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import Home from "@/app/page";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Home", () => {
  it("renderiza os itens vindos da API", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        status: "ok",
        items: ["Configurar Docker", "Automatizar CI", "Publicar no GHCR"],
      }),
    });

    render(<Home />);

    expect(await screen.findByText("Configurar Docker")).toBeInTheDocument();
    expect(screen.getByText("Publicar no GHCR")).toBeInTheDocument();
    expect(screen.getByText("API: ok")).toBeInTheDocument();
  });

  it("mostra mensagem amigavel quando a API falha", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("rede fora"));

    render(<Home />);

    expect(await screen.findByText("Dados indisponíveis")).toBeInTheDocument();
  });

  it("mostra mensagem amigavel quando a API responde 404 (ex.: Firebase Hosting sem backend)", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({ ok: false, status: 404 });

    render(<Home />);

    expect(await screen.findByText("Dados indisponíveis")).toBeInTheDocument();
  });
});
