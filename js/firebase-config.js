// =============================================
// CiviConnect — Firebase Configuration
// =============================================
// INSTRUCCIONES: Reemplaza los valores de firebaseConfig
// con los de tu proyecto en Firebase Console.
// https://console.firebase.google.com/

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ⚙️ CONFIGURACIÓN DE FIREBASE — Reemplaza con los datos de tu proyecto
const firebaseConfig = {
  apiKey:            "TU_API_KEY_AQUI",
  authDomain:        "tu-proyecto.firebaseapp.com",
  projectId:         "tu-proyecto-id",
  storageBucket:     "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:123456789:web:abcdef123456"
};

// Inicializar Firebase
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// Exportar para uso global en módulos
export { app, auth, db, onAuthStateChanged };

// Hacer disponible globalmente para scripts no-módulo
window.firebaseApp  = app;
window.firebaseAuth = auth;
window.firebaseDb   = db;
