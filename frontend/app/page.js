"use client";

import { useEffect, useState } from "react";

import { fetchHealth } from "@/lib/api";

export default function Home() {
  const [estado, setEstado] = useState({ carregando: true, dados: null, erro: null });

  useEffect(() => {
    let ativo = true;
    fetchHealth()
      .then((dados) => ativo && setEstado({ carregando: false, dados, erro: null }))
      .catch((erro) => ativo && setEstado({ carregando: false, dados: null, erro }));
    return () => {
      ativo = false;
    };
  }, []);

  return (
    <main>
      <p className="eyebrow">Semana 5 · Containerização e CI/CD</p>
      <h1>Painel DevOps</h1>
      <section className="card">
        {estado.carregando && <p className="muted">Carregando dados da API...</p>}

        {estado.erro && (
          <>
            <p className="status erro">Dados indisponíveis</p>
            <p className="muted">
              Não foi possível falar com a API agora. Tente novamente em instantes.
            </p>
          </>
        )}

        {estado.dados && (
          <>
            <p className="status ok">API: {estado.dados.status}</p>
            <ul>
              {estado.dados.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}
