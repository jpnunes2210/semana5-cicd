// Acesso ao Cloud Firestore. Carregado sob demanda (import dinamico) para que o
// modo "api" da Semana 5 nao baixe o SDK do Firebase.
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  connectFirestoreEmulator,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";

import { firebaseConfig } from "./firebase-config";

const USE_EMULATOR = process.env.NEXT_PUBLIC_USE_EMULATOR === "true";
const EMULATOR_HOST = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST || "127.0.0.1";
const EMULATOR_PORT = Number(process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT || 8080);

let db;

function getDb() {
  if (db) return db;
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  if (USE_EMULATOR) {
    connectFirestoreEmulator(db, EMULATOR_HOST, EMULATOR_PORT);
  }
  return db;
}

// Mesmo formato da API Django: { status: "ok", items: [...] }
export async function fetchItemsFromFirestore() {
  const snap = await getDocs(query(collection(getDb(), "items"), orderBy("ordem")));
  return { status: "ok", items: snap.docs.map((d) => d.data().texto) };
}

// Usado na demonstracao de seguranca: as regras devem negar esta escrita.
export async function tryWriteItem(texto) {
  await addDoc(collection(getDb(), "items"), { texto, ordem: 999 });
}
