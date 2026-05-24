// =============================================
// CiviConnect — auth.js
// Manejo de autenticación con Firebase Auth
// =============================================

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { auth, db } from './firebase-config.js';

// Inicializar instancias (asume que firebase-config.js ya corrió)
const provider = new GoogleAuthProvider();

function goToPage(page) {
  window.location.href = new URL(page, window.location.href).href;
}

/* =========================================
   REGISTRO DE NUEVO USUARIO
   ========================================= */
export async function registerUser({ name, email, password, role = 'citizen' }) {
  // 1. Crear usuario en Firebase Auth
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  // 2. Actualizar displayName
  await updateProfile(user, { displayName: name });

  // 3. Guardar perfil en Firestore
  await setDoc(doc(db, 'users', user.uid), {
    uid:         user.uid,
    name,
    email,
    role,          // 'citizen' | 'organizer'
    points:        0,
    eventsJoined:  [],
    createdAt:     serverTimestamp(),
    updatedAt:     serverTimestamp()
  });

  return user;
}

/* =========================================
   INICIO DE SESIÓN
   ========================================= */
export async function loginUser(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

/* =========================================
   INICIO DE SESIÓN CON GOOGLE
   ========================================= */
export async function loginWithGoogle() {
  const { user } = await signInWithPopup(auth, provider);

  // Verificar si el usuario ya existe en Firestore
  const snap = await getDoc(doc(db, 'users', user.uid));
  if (!snap.exists()) {
    await setDoc(doc(db, 'users', user.uid), {
      uid:         user.uid,
      name:        user.displayName || 'Usuario',
      email:       user.email,
      role:        'citizen',
      points:      0,
      eventsJoined: [],
      createdAt:   serverTimestamp(),
      updatedAt:   serverTimestamp()
    });
  }

  return user;
}

/* =========================================
   CERRAR SESIÓN
   ========================================= */
export async function logout() {
  await signOut(auth);
  goToPage('../index.html');
}

/* =========================================
   RECUPERAR CONTRASEÑA
   ========================================= */
export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

/* =========================================
   OBTENER PERFIL DE USUARIO
   ========================================= */
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

/* =========================================
   OBSERVER DE ESTADO DE AUTENTICACIÓN
   ========================================= */
export function watchAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

/* =========================================
   GUARD: redirige si no está autenticado
   ========================================= */
export function requireAuth(redirectTo = 'login.html') {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      if (!user) {
        goToPage(redirectTo);
      } else {
        resolve(user);
      }
    });
  });
}

/* =========================================
   GUARD: redirige si ya está autenticado
   ========================================= */
export function redirectIfAuth(redirectTo = 'dashboard.html') {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      if (user) {
        goToPage(redirectTo);
      } else {
        resolve(null);
      }
    });
  });
}

// === MANEJO DE FORMULARIOS EN PÁGINAS ===

// Registro
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = registerForm.querySelector('[type="submit"]');
    const errEl = document.getElementById('authError');

    const name     = registerForm.name.value.trim();
    const email    = registerForm.email.value.trim();
    const password = registerForm.password.value;
    const confirm  = registerForm.confirmPassword.value;
    const role     = registerForm.role?.value || 'citizen';

    if (!name || name.length < 2) {
      if (errEl) { errEl.textContent = 'Ingresa tu nombre completo.'; errEl.classList.add('visible'); }
      return;
    }
    if (password !== confirm) {
      if (errEl) { errEl.textContent = 'Las contraseñas no coinciden.'; errEl.classList.add('visible'); }
      return;
    }
    if (password.length < 6) {
      if (errEl) { errEl.textContent = 'La contraseña debe tener al menos 6 caracteres.'; errEl.classList.add('visible'); }
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Creando cuenta…';
    if (errEl) errEl.classList.remove('visible');

    try {
      await registerUser({ name, email, password, role });
      showToast('¡Cuenta creada exitosamente! Bienvenid@ 🎉', 'success');
      setTimeout(() => { goToPage('dashboard.html'); }, 1200);
    } catch (err) {
      btn.disabled = false;
      btn.textContent = 'Crear cuenta';
      const msgs = {
        'auth/email-already-in-use': 'Este correo ya está registrado.',
        'auth/invalid-email':        'El formato del correo no es válido.',
        'auth/weak-password':        'La contraseña es muy débil.'
      };
      if (errEl) {
        errEl.textContent = msgs[err.code] || 'Error al crear la cuenta. Inténtalo de nuevo.';
        errEl.classList.add('visible');
      }
    }
  });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn   = loginForm.querySelector('[type="submit"]');
    const errEl = document.getElementById('authError');

    const email    = loginForm.email.value.trim();
    const password = loginForm.password.value;

    btn.disabled = true;
    btn.textContent = 'Entrando…';
    if (errEl) errEl.classList.remove('visible');

    try {
      await loginUser(email, password);
      goToPage('dashboard.html');
    } catch (err) {
      btn.disabled = false;
      btn.textContent = 'Iniciar sesión';
      const msgs = {
        'auth/user-not-found':   'No existe una cuenta con ese correo.',
        'auth/wrong-password':   'Contraseña incorrecta.',
        'auth/invalid-email':    'El formato del correo no es válido.',
        'auth/too-many-requests':'Demasiados intentos fallidos. Intenta más tarde.'
      };
      if (errEl) {
        errEl.textContent = msgs[err.code] || 'Error al iniciar sesión.';
        errEl.classList.add('visible');
      }
    }
  });
}

// Recuperar contraseña
const resetForm = document.getElementById('resetForm');
if (resetForm) {
  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn   = resetForm.querySelector('[type="submit"]');
    const errEl = document.getElementById('authError');
    const okEl  = document.getElementById('authSuccess');

    const email = resetForm.email.value.trim();
    btn.disabled = true;
    btn.textContent = 'Enviando…';

    try {
      await resetPassword(email);
      if (okEl)  { okEl.textContent = '✅ Correo enviado. Revisa tu bandeja de entrada.'; okEl.style.display = 'block'; }
      if (errEl) errEl.classList.remove('visible');
    } catch (err) {
      btn.disabled = false;
      btn.textContent = 'Enviar enlace';
      if (errEl) {
        errEl.textContent = 'No encontramos ese correo registrado.';
        errEl.classList.add('visible');
      }
    }
  });
}

// Login con Google (botón)
const googleBtn = document.getElementById('googleLoginBtn');
if (googleBtn) {
  googleBtn.addEventListener('click', async () => {
    try {
      await loginWithGoogle();
      goToPage('dashboard.html');
    } catch (err) {
      showToast('Error al iniciar sesión con Google.', 'error');
    }
  });
}

export { auth, db };
