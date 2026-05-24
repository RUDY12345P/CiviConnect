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
  apiKey:            "AIzaSyByCTn-WVJdZdSo_SZwkJWfqf16mV3dICc",
  authDomain:        "civiconnect-32615.firebaseapp.com",
  projectId:         "civiconnect-32615",
  storageBucket:     "civiconnect-32615.firebasestorage.app",
  messagingSenderId: "695157824478",
  appId:             "1:695157824478:web:9d5c8ec6b1036900bf9b4f",
  measurementId:     "G-1TX8EXGD9"
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
