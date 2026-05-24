// =============================================
// CiviConnect — LOGIN COMPLETO FUNCIONAL 🔥
// =============================================

// IMPORTS FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// CONFIGURACIÓN FIREBASE (LA TUYA)
const firebaseConfig = {
  apiKey: "AIzaSyByCTn-WVJdZdSo_SZwkJWfqf16mV3dICc",
  authDomain: "civiconnect-32615.firebaseapp.com",
  projectId: "civiconnect-32615",
  storageBucket: "civiconnect-32615.firebasestorage.app",
  messagingSenderId: "695157824478",
  appId: "1:695157824478:web:9d5c8ec6b1036900bf9b4f",
  measurementId: "G-1TX8EXGD9"
};

// INICIALIZAR FIREBASE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// =============================================
// 🔐 LOGIN CON GOOGLE (REDIRECT)
// =============================================
document.getElementById("loginGoogle").addEventListener("click", () => {
  signInWithRedirect(auth, provider);
});

// =============================================
// 🔄 RESULTADO DEL REDIRECT
// =============================================
getRedirectResult(auth)
  .then((result) => {
    if (result) {
      console.log("Login exitoso:", result.user);
    }
  })
  .catch((error) => {
    console.error("Error en login:", error);
  });

// =============================================
// 👤 DETECTAR USUARIO ACTIVO
// =============================================
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuario logueado:", user);

    // Mostrar nombre en pantalla
    document.getElementById("usuario").innerText =
      "Bienvenido, " + user.displayName;

    // 🔥 OPCIONAL: redirigir automáticamente
    // window.location.href = "/CiviConnect/pages/events.html";

  } else {
    console.log("No hay usuario");
    document.getElementById("usuario").innerText = "No has iniciado sesión";
  }
});

// =============================================
// 🚪 LOGOUT (OPCIONAL)
// =============================================
function cerrarSesion() {
  signOut(auth).then(() => {
    console.log("Sesión cerrada");
    location.reload();
  });
}

// Hacer global (por si lo usas en HTML)
window.cerrarSesion = cerrarSesion;
