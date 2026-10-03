// Testes das regras do Firestore contra o emulador.
// Uso (na raiz): firebase emulators:exec --only firestore "npm --prefix frontend run test:rules"
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { afterAll, beforeAll, describe, it } from "vitest";

let env;

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "demo-regras",
    firestore: { rules: readFileSync(resolve(__dirname, "../../firestore.rules"), "utf8") },
  });
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), "items/item-1"), { texto: "Configurar Docker", ordem: 1 });
  });
});

afterAll(async () => {
  await env?.cleanup();
});

describe("regras de items", () => {
  it("visitante anonimo pode ler", async () => {
    await assertSucceeds(getDoc(doc(env.unauthenticatedContext().firestore(), "items/item-1")));
  });

  it("visitante anonimo nao pode gravar", async () => {
    await assertFails(setDoc(doc(env.unauthenticatedContext().firestore(), "items/x"), { texto: "spam" }));
  });

  it("nem usuario logado pode gravar", async () => {
    await assertFails(setDoc(doc(env.authenticatedContext("joao").firestore(), "items/x"), { texto: "spam" }));
  });

  it("outras colecoes ficam fechadas", async () => {
    await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), "segredos/x")));
  });
});
