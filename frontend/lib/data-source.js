import { fetchHealth } from "./api";

// "api" (Django da Semana 5) ou "firestore" (Semana 6). A tela nao muda: as duas
// fontes devolvem { status: "ok", items: [...] }.
export const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE === "firestore" ? "firestore" : "api";

export async function fetchItems() {
  if (DATA_SOURCE === "firestore") {
    const { fetchItemsFromFirestore } = await import("./firestore");
    return fetchItemsFromFirestore();
  }
  return fetchHealth();
}

export async function tryWriteItem(texto) {
  const firestore = await import("./firestore");
  return firestore.tryWriteItem(texto);
}
