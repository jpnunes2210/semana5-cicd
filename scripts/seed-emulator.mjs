// Cadastra os 3 itens da Semana 5 no Firestore do EMULADOR.
// O cabecalho "Authorization: Bearer owner" so existe no emulador e ignora as regras,
// como o console faz em producao. Idempotente: pode rodar varias vezes.
// Uso (com os emuladores no ar): node scripts/seed-emulator.mjs

import { readFileSync } from "node:fs";

const projectId = JSON.parse(readFileSync(new URL("../.firebaserc", import.meta.url))).projects.default;
const host = process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1:8080";
const base = `http://${host}/v1/projects/${projectId}/databases/(default)/documents/items`;

const itens = ["Configurar Docker", "Automatizar CI", "Publicar no GHCR"];

for (const [i, texto] of itens.entries()) {
  const id = `item-${i + 1}`;
  const res = await fetch(`${base}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: "Bearer owner" },
    body: JSON.stringify({
      fields: { texto: { stringValue: texto }, ordem: { integerValue: String(i + 1) } },
    }),
  });
  if (!res.ok) {
    throw new Error(`Falha ao gravar ${id}: ${res.status} ${await res.text()}`);
  }
  console.log(`ok: items/${id} = ${texto}`);
}
