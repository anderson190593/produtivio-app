// src/firebase/config.ts

// 1. Importar as bibliotecas que acabamos de instalar
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 2. Ler as chaves secretas do nosso arquivo .env.local
// Esta é a forma como o Vite acessa as variáveis de ambiente
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 3. "Ligar" o Firebase
const app = initializeApp(firebaseConfig);

// 4. Exportar os serviços que nosso app vai usar
// Vamos exportar a Autenticação (para login) e o Firestore (banco de dados)
export const auth = getAuth(app);
export const db = getFirestore(app);