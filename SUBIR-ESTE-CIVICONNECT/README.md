# CiviConnect 🌍
## Plataforma de Participación Ciudadana Digital

> Proyecto académico universitario — Alineado con ODS 11 y ODS 17

---

## 📋 Descripción

CiviConnect es una aplicación web completa que conecta a ciudadanos con eventos comunitarios, campañas sociales y actividades de voluntariado, fomentando la participación activa y el impacto social en las ciudades.

---

## 🗂️ Estructura del proyecto

```
civiconnect/
├── index.html                  ← Landing page principal
├── css/
│   ├── main.css                ← Design system y estilos globales
│   ├── landing.css             ← Estilos específicos del landing
│   ├── auth.css                ← Estilos de páginas de autenticación
│   └── app.css                 ← Estilos de páginas internas
├── js/
│   ├── firebase-config.js      ← Configuración e inicialización de Firebase
│   ├── auth.js                 ← Módulo de autenticación (register/login/logout)
│   ├── events.js               ← CRUD de eventos con Firestore
│   └── main.js                 ← Utilidades globales (navbar, toast, etc.)
└── pages/
    ├── login.html              ← Inicio de sesión
    ├── register.html           ← Registro de usuario
    ├── forgot-password.html    ← Recuperación de contraseña
    ├── dashboard.html          ← Panel del usuario ciudadano
    ├── events.html             ← Explorador de eventos con filtros
    ├── calendar.html           ← Calendario mensual de eventos
    ├── map.html                ← Mapa interactivo (Leaflet.js)
    ├── organizer.html          ← Panel del organizador
    └── create-event.html       ← Formulario de creación de eventos
```

---

## ⚙️ Configuración de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Authentication** → Correo/contraseña + Google
4. Crea una base de datos **Firestore** en modo de prueba
5. Copia tu configuración en `js/firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey:            "TU_API_KEY",
  authDomain:        "tu-proyecto.firebaseapp.com",
  projectId:         "tu-proyecto-id",
  storageBucket:     "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId:             "1:xxx:web:xxx"
};
```

### Reglas de Firestore recomendadas

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /events/{eventId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.organizerId;
    }
    match /events/{eventId}/enrollments/{enrollId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

---

## 🚀 Cómo ejecutar el proyecto

### Opción 1: VS Code + Live Server (recomendado)
1. Instala la extensión **Live Server** en VS Code
2. Abre la carpeta `civiconnect/` en VS Code
3. Clic derecho en `index.html` → "Open with Live Server"

### Opción 2: Python (servidor local)
```bash
cd civiconnect/
python -m http.server 8000
# Abrir: http://localhost:8000
```

### Opción 3: Node.js
```bash
npx serve civiconnect/
```

> ⚠️ **Importante**: Los módulos ES (`type="module"`) requieren un servidor HTTP local. No funcionan abriendo el archivo directamente (`file://`).

---

## 🎯 Funcionalidades implementadas

| Función | Estado | Descripción |
|---------|--------|-------------|
| 🔐 Registro/Login | ✅ Completo | Firebase Auth + Google OAuth |
| 🔑 Recuperar contraseña | ✅ Completo | Envío de email de recuperación |
| 📊 Panel de usuario | ✅ Completo | Estadísticas, historial, puntos |
| 🗺️ Explorar eventos | ✅ Completo | Grid/lista, búsqueda, filtros |
| 📍 Mapa interactivo | ✅ Completo | Leaflet.js + OpenStreetMap |
| 📅 Calendario | ✅ Completo | Vista mensual con marcadores |
| 📝 Inscripción | ✅ Completo | Firestore + modo demo |
| 🧑‍💼 Panel organizador | ✅ Completo | Crear/editar/eliminar eventos |
| ⭐ Sistema de puntos | ✅ Completo | Niveles: Bronce/Plata/Oro/Diamante |
| 📱 Diseño responsivo | ✅ Completo | Mobile-first, adaptable |

---

## 🌐 ODS Relacionados

- **ODS 11** — Ciudades y comunidades sostenibles: la plataforma facilita el acceso inclusivo a iniciativas comunitarias.
- **ODS 17** — Alianzas para lograr los objetivos: conecta ciudadanos, organizaciones y gobierno local.

---

## 🛠️ Tecnologías utilizadas

- **Frontend**: HTML5, CSS3 (Variables, Grid, Flexbox), JavaScript ES6+
- **Base de datos**: Firebase Firestore (NoSQL en tiempo real)
- **Autenticación**: Firebase Authentication
- **Mapas**: Leaflet.js + OpenStreetMap (gratuito, sin API key)
- **Tipografía**: Google Fonts (Syne + DM Sans)
- **Módulos**: ES Modules nativos del navegador

---

## 📚 Notas académicas

- El proyecto funciona en **modo demo** sin Firebase configurado, usando datos de ejemplo predefinidos en `events.js`.
- La arquitectura sigue el patrón **MVC simplificado**: HTML (View), JS modules (Controller/Model), Firestore (Model).
- El diseño implementa principios de **UX/UI modernos**: jerarquía visual, feedback inmediato, estados de carga y manejo de errores.

---

*Desarrollado con 💚 para comunidades más activas y sostenibles*
