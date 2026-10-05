"use client";

import { useEffect, useState } from "react";

import { DATA_SOURCE, fetchItems, tryWriteItem } from "@/lib/data-source";

// Versao B (canal de pre-visualizacao): titulo e cor de destaque diferentes
const VERSAO_B = process.env.NEXT_PUBLIC_APP_VARIANT === "b";

export default function Home() {
  const [estado, setEstado] = useState({ carregando: true, dados: null, erro: null });
  const [escrita, setEscrita] = useState(null);

  useEffect(() => {
    let ativo = true;
    fetchItems()
      .then((dados) => ativo && setEstado({ carregando: false, dados, erro: null }))
      .catch((erro) => ativo && setEstado({ carregando: false, dados: null, erro }));
    return () => {
      ativo = false;
    };
  }, []);

  async function testarEscrita() {
    setEscrita("Tentando gravar...");
    try {
      await tryWriteItem("Recado de um visitante");
      setEscrita("Escrita ACEITA: as regras estão abertas demais!");
    } catch (erro) {
      setEscrita(`Bloqueado: ${erro.code ?? erro.message}`);
    }
  }

  return (
    <main className={VERSAO_B ? "versao-b" : undefined}>
      <p className="eyebrow">AILAB Makers · Do container à nuvem · Semana 6</p>
      <h1>{VERSAO_B ? "Painel DevOps · Versão B" : "Painel DevOps"}</h1>
      <section className="card">
        {estado.carregando && <p className="muted">Carregando dados...</p>}

        {estado.erro && (
          <>
            <p className="status erro">Dados indisponíveis</p>
            <p className="muted">
              Não foi possível buscar os dados agora. Tente novamente em instantes.
            </p>
          </>
        )}

        {estado.dados && (
          <>
            <p className="status ok">
              {DATA_SOURCE === "firestore" ? "Firestore" : "API"}: {estado.dados.status}
            </p>
            <ul>
              {estado.dados.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        )}
      </section>

      {DATA_SOURCE === "firestore" && (
        <section className="seguranca">
          <button type="button" onClick={testarEscrita}>
            Testar escrita no Firestore
          </button>
          {escrita && <p className="muted">{escrita}</p>}
        </section>
      )}
    </main>
  );
}
