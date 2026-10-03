// Configuracao WEB do Firebase. Ela e publica por design: vai no JavaScript que o
// navegador baixa. Quem protege os dados sao as regras em firestore.rules.
// Copie os valores do console: Configuracoes do projeto > Seus apps > App da Web.
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "COLE-AQUI-A-API-KEY",
  authDomain: "semana6-jpnunes.firebaseapp.com",
  projectId: "semana6-jpnunes",
  storageBucket: "semana6-jpnunes.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID || "COLE-AQUI-O-SENDER-ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "COLE-AQUI-O-APP-ID",
};
