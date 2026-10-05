// Configuracao WEB do Firebase. Ela e publica por design: vai no JavaScript que o
// navegador baixa. Quem protege os dados sao as regras em firestore.rules.
// Copie os valores do console: Configuracoes do projeto > Seus apps > App da Web.
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCMzm4KvxpoKEDUbJ3vw0Pa4yNZJ7SLFgA",
  authDomain: "semana6-jpnunes.firebaseapp.com",
  projectId: "semana6-jpnunes",
  storageBucket: "semana6-jpnunes.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID || "442292496211",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:442292496211:web:2db2df46d2b89a2b6be3a6",
};
