// =============================================
// CiviConnect - events.js
// CRUD de eventos con Firestore + datos Cancun
// =============================================

let firebaseServicesPromise = null;

const EVENT_CATEGORY_META = {
  voluntariado: {
    label: 'Voluntariado',
    shortLabel: 'Voluntariado',
    icon: '🌱',
    className: 'volunteer',
    color: '#1D9E75'
  },
  medioambiente: {
    label: 'Medio ambiente',
    shortLabel: 'Ambiente',
    icon: '♻️',
    className: 'env',
    color: '#0F8A84'
  },
  educacion: {
    label: 'Educación',
    shortLabel: 'Educación',
    icon: '📚',
    className: 'education',
    color: '#378ADD'
  },
  salud: {
    label: 'Salud',
    shortLabel: 'Salud',
    icon: '❤️',
    className: 'health',
    color: '#E24B4A'
  },
  cultura: {
    label: 'Cultura',
    shortLabel: 'Cultura',
    icon: '🎨',
    className: 'culture',
    color: '#7F77DD'
  },
  derechos: {
    label: 'Derechos cívicos',
    shortLabel: 'Derechos',
    icon: '⚖️',
    className: 'rights',
    color: '#EF9F27'
  }
};

/* =========================================
   DATOS DE EJEMPLO - Cancun, Q. Roo 2026
   ========================================= */
const SAMPLE_EVENTS = [
  {
    id: 'ev001',
    title: 'Guardianes de Playa Delfines',
    description: 'Jornada práctica para retirar residuos, separar materiales reciclables y aprender cómo proteger la zona de anidación. Incluye mini reto por equipos y punto de hidratación.',
    category: 'medioambiente',
    date: '2026-06-06',
    time: '07:00',
    endTime: '11:00',
    location: 'Playa Delfines, Zona Hotelera, Cancún',
    city: 'Cancún',
    lat: 21.0353,
    lng: -86.7913,
    organizer: 'Mar Limpio Cancún',
    organizerId: 'org001',
    image: '🌊',
    maxCapacity: 90,
    enrolled: 61,
    points: 70,
    status: 'active',
    impact: '120 kg menos de residuos en playa',
    difficulty: 'Familiar',
    tags: ['playa', 'limpieza', 'reciclaje', 'zona-hotelera'],
    createdAt: new Date('2026-05-01')
  },
  {
    id: 'ev002',
    title: 'Manglares Vivos en Nichupté',
    description: 'Plantación guiada de mangle, monitoreo básico del agua y charla corta sobre la importancia de la laguna para Cancún. No necesitas experiencia previa.',
    category: 'medioambiente',
    date: '2026-06-13',
    time: '07:30',
    endTime: '11:30',
    location: 'Laguna Nichupté, entrada por Jardín del Arte, Cancún',
    city: 'Cancún',
    lat: 21.0921,
    lng: -86.7821,
    organizer: 'Ecosistemas del Caribe',
    organizerId: 'org002',
    image: '🌿',
    maxCapacity: 55,
    enrolled: 37,
    points: 80,
    status: 'active',
    impact: '300 plantas nativas sembradas',
    difficulty: 'Activo',
    tags: ['manglar', 'laguna', 'reforestación', 'ecología'],
    createdAt: new Date('2026-05-05')
  },
  {
    id: 'ev003',
    title: 'Despensa Solidaria en Plaza Las Américas',
    description: 'Colecta de alimentos no perecederos para familias de Cancún. Puedes apoyar recibiendo donativos, clasificando productos o armando paquetes de entrega.',
    category: 'voluntariado',
    date: '2026-06-07',
    time: '09:00',
    endTime: '14:00',
    location: 'Plaza Las Américas, Av. Tulum Sur, Cancún',
    city: 'Cancún',
    lat: 21.1563,
    lng: -86.8475,
    organizer: 'Banco de Alimentos Quintana Roo',
    organizerId: 'org003',
    image: '🥫',
    maxCapacity: 150,
    enrolled: 92,
    points: 55,
    status: 'active',
    impact: '500 despensas para colonias de Cancún',
    difficulty: 'Ligero',
    tags: ['alimentos', 'solidaridad', 'familias', 'colecta'],
    createdAt: new Date('2026-05-03')
  },
  {
    id: 'ev004',
    title: 'Brigada de Salud en Parque de las Palapas',
    description: 'Apoya en registro, orientación y logística durante consultas médicas, vacunación y módulos de prevención. Ideal para estudiantes y vecinos voluntarios.',
    category: 'salud',
    date: '2026-06-14',
    time: '08:00',
    endTime: '15:00',
    location: 'Parque de las Palapas, Centro, Cancún',
    city: 'Cancún',
    lat: 21.1619,
    lng: -86.8515,
    organizer: 'Salud Para Todos Q. Roo',
    organizerId: 'org004',
    image: '❤️',
    maxCapacity: 120,
    enrolled: 83,
    points: 65,
    status: 'active',
    impact: '700 atenciones comunitarias',
    difficulty: 'Ligero',
    tags: ['salud', 'brigada', 'gratuito', 'prevención'],
    createdAt: new Date('2026-05-08')
  },
  {
    id: 'ev005',
    title: 'Aula Abierta: Matemáticas y Español',
    description: 'Sesiones de apoyo académico para niñas, niños y adolescentes. Participa como tutor, facilitador de lectura o apoyo en dinámicas didácticas.',
    category: 'educacion',
    date: '2026-06-10',
    time: '16:00',
    endTime: '18:30',
    location: 'Biblioteca Pública de Cancún, Supermanzana 23',
    city: 'Cancún',
    lat: 21.1697,
    lng: -86.8501,
    organizer: 'Tutores Voluntarios Cancún',
    organizerId: 'org001',
    image: '📚',
    maxCapacity: 36,
    enrolled: 21,
    points: 45,
    status: 'active',
    impact: '60 estudiantes con acompañamiento',
    difficulty: 'Familiar',
    tags: ['educación', 'tutorías', 'matemáticas', 'lectura'],
    createdAt: new Date('2026-05-10')
  },
  {
    id: 'ev006',
    title: 'Noche Caribeña de Arte y Comunidad',
    description: 'Festival participativo con murales colectivos, música local, talleres creativos y muestra gastronómica. El objetivo es activar espacios públicos con talento cancunense.',
    category: 'cultura',
    date: '2026-06-21',
    time: '17:00',
    endTime: '21:30',
    location: 'Malecón Tajamar, Cancún',
    city: 'Cancún',
    lat: 21.1459,
    lng: -86.8217,
    organizer: 'Cultura Viva Cancún',
    organizerId: 'org005',
    image: '🎭',
    maxCapacity: 260,
    enrolled: 184,
    points: 35,
    status: 'active',
    impact: '8 talleres abiertos a la comunidad',
    difficulty: 'Familiar',
    tags: ['arte', 'cultura', 'festival', 'música', 'tajamar'],
    createdAt: new Date('2026-05-12')
  },
  {
    id: 'ev007',
    title: 'Cabildo Abierto: Movilidad Segura',
    description: 'Mesa ciudadana para proponer rutas, cruces seguros y ciclovías en Cancún. Habrá dinámica de mapas, votación de prioridades y registro de propuestas.',
    category: 'derechos',
    date: '2026-06-17',
    time: '18:00',
    endTime: '20:00',
    location: 'Palacio Municipal de Benito Juárez, Centro, Cancún',
    city: 'Cancún',
    lat: 21.1613,
    lng: -86.8512,
    organizer: 'Ciudadanía Activa Cancún',
    organizerId: 'org006',
    image: '⚖️',
    maxCapacity: 200,
    enrolled: 74,
    points: 50,
    status: 'active',
    impact: 'Propuestas ciudadanas para movilidad',
    difficulty: 'Ligero',
    tags: ['movilidad', 'transporte', 'cabildo', 'ciclovía'],
    createdAt: new Date('2026-05-14')
  },
  {
    id: 'ev008',
    title: 'Guardianes Nocturnos de Tortugas',
    description: 'Monitoreo nocturno de nidos y orientación a visitantes para proteger tortugas marinas. Actividad guiada con cupo reducido por seguridad.',
    category: 'medioambiente',
    date: '2026-06-28',
    time: '21:00',
    endTime: '02:00',
    location: 'Playa Marlín, Zona Hotelera, Cancún',
    city: 'Cancún',
    lat: 21.1029,
    lng: -86.7642,
    organizer: 'Tortugas del Caribe A.C.',
    organizerId: 'org002',
    image: '🐢',
    maxCapacity: 40,
    enrolled: 34,
    points: 90,
    status: 'active',
    impact: 'Nidos protegidos durante temporada',
    difficulty: 'Activo',
    tags: ['tortugas', 'conservación', 'playa', 'nocturno'],
    createdAt: new Date('2026-05-16')
  },
  {
    id: 'ev009',
    title: 'Primeros Auxilios para Vecinos',
    description: 'Taller didáctico con práctica de RCP, control de hemorragias y armado de botiquín familiar. Pensado para líderes vecinales y ciudadanía en general.',
    category: 'salud',
    date: '2026-06-24',
    time: '10:00',
    endTime: '13:00',
    location: 'Centro Comunitario de la Supermanzana 96, Cancún',
    city: 'Cancún',
    lat: 21.1545,
    lng: -86.8788,
    organizer: 'Cruz Roja Mexicana Cancún',
    organizerId: 'org007',
    image: '🚑',
    maxCapacity: 48,
    enrolled: 29,
    points: 60,
    status: 'active',
    impact: 'Vecinos listos para responder emergencias',
    difficulty: 'Ligero',
    tags: ['primeros-auxilios', 'rcp', 'prevención', 'comunidad'],
    createdAt: new Date('2026-05-18')
  },
  {
    id: 'ev010',
    title: 'Ruta Histórica por el Centro de Cancún',
    description: 'Recorrido guiado por puntos históricos del centro con cápsulas de memoria local y actividad de fotografía comunitaria.',
    category: 'cultura',
    date: '2026-06-27',
    time: '08:30',
    endTime: '11:00',
    location: 'Parque del Crucero, Cancún',
    city: 'Cancún',
    lat: 21.1714,
    lng: -86.8499,
    organizer: 'Cronistas Jóvenes de Cancún',
    organizerId: 'org005',
    image: '📸',
    maxCapacity: 70,
    enrolled: 45,
    points: 40,
    status: 'active',
    impact: 'Memoria barrial documentada',
    difficulty: 'Familiar',
    tags: ['historia', 'fotografía', 'centro', 'cultura'],
    createdAt: new Date('2026-05-19')
  },
  {
    id: 'ev011',
    title: 'Alfabetización Digital para Adultos',
    description: 'Acompaña a personas adultas en el uso básico del celular, trámites digitales y seguridad en línea. Materiales y guía de sesión incluidos.',
    category: 'educacion',
    date: '2026-07-04',
    time: '11:00',
    endTime: '13:30',
    location: 'Universidad del Caribe, Cancún',
    city: 'Cancún',
    lat: 21.2106,
    lng: -86.8022,
    organizer: 'Red Aprende Cancún',
    organizerId: 'org008',
    image: '💻',
    maxCapacity: 44,
    enrolled: 18,
    points: 55,
    status: 'active',
    impact: 'Adultos con habilidades digitales básicas',
    difficulty: 'Ligero',
    tags: ['tecnología', 'adultos', 'educación', 'trámites'],
    createdAt: new Date('2026-05-20')
  },
  {
    id: 'ev012',
    title: 'Feria de Derechos y Servicios',
    description: 'Módulos de orientación ciudadana, defensoría, transparencia y participación comunitaria. Apoya guiando asistentes y levantando necesidades del barrio.',
    category: 'derechos',
    date: '2026-07-11',
    time: '09:30',
    endTime: '14:00',
    location: 'Parque Kabah, Cancún',
    city: 'Cancún',
    lat: 21.1421,
    lng: -86.8373,
    organizer: 'Red Cívica Benito Juárez',
    organizerId: 'org006',
    image: '⚖️',
    maxCapacity: 110,
    enrolled: 53,
    points: 60,
    status: 'active',
    impact: 'Orientación directa para vecinos',
    difficulty: 'Ligero',
    tags: ['derechos', 'servicios', 'participación', 'orientación'],
    createdAt: new Date('2026-05-21')
  }
];

/* =========================================
   OBTENER TODOS LOS EVENTOS (con filtros)
   ========================================= */
export async function getEvents({ category = null, search = '', limitNum = 20 } = {}) {
  try {
    const { db, collection, getDocs, query, where, orderBy, limit } = await getFirebaseServices();
    let q = collection(db, 'events');
    const constraints = [where('status', '==', 'active'), orderBy('date'), limit(limitNum)];
    if (category && category !== 'all') constraints.push(where('category', '==', category));
    q = query(q, ...constraints);
    const snap = await getDocs(q);
    if (!snap.empty) return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (_) {}

  let events = SAMPLE_EVENTS.filter(e => e.city === 'Cancún');
  if (category && category !== 'all') events = events.filter(e => e.category === category);
  if (search) {
    const s = search.toLowerCase();
    events = events.filter(e =>
      e.title.toLowerCase().includes(s) ||
      e.description.toLowerCase().includes(s) ||
      e.location.toLowerCase().includes(s) ||
      e.organizer.toLowerCase().includes(s) ||
      (e.tags || []).some(t => t.toLowerCase().includes(s))
    );
  }
  return events;
}

/* =========================================
   OBTENER EVENTO POR ID
   ========================================= */
export async function getEventById(id) {
  try {
    const { db, doc, getDoc } = await getFirebaseServices();
    const snap = await getDoc(doc(db, 'events', id));
    if (snap.exists()) return { id: snap.id, ...snap.data() };
  } catch (_) {}
  return SAMPLE_EVENTS.find(e => e.id === id) || null;
}

/* =========================================
   CREAR EVENTO
   ========================================= */
export async function createEvent(eventData) {
  let services = null;
  let user = null;
  try {
    services = await getFirebaseServices();
    user = services.auth.currentUser;
  } catch (_) {}

  const data = {
    ...eventData,
    city: eventData.city || 'Cancún',
    organizerId: user?.uid || 'demo',
    organizer: user?.displayName || user?.email || 'Organizador Demo',
    enrolled: 0,
    status: 'active',
    createdAt: services?.serverTimestamp ? services.serverTimestamp() : new Date(),
    updatedAt: services?.serverTimestamp ? services.serverTimestamp() : new Date()
  };
  try {
    if (!services) throw new Error('Firebase no disponible');
    const docRef = await services.addDoc(services.collection(services.db, 'events'), data);
    return docRef.id;
  } catch (_) {
    const newEvent = { id: generateId(), ...data, createdAt: new Date(), updatedAt: new Date() };
    SAMPLE_EVENTS.unshift(newEvent);
    return newEvent.id;
  }
}

/* =========================================
   ACTUALIZAR EVENTO
   ========================================= */
export async function updateEvent(id, updates) {
  try {
    const { db, doc, updateDoc, serverTimestamp } = await getFirebaseServices();
    await updateDoc(doc(db, 'events', id), { ...updates, updatedAt: serverTimestamp() });
  } catch (_) {
    const idx = SAMPLE_EVENTS.findIndex(e => e.id === id);
    if (idx !== -1) Object.assign(SAMPLE_EVENTS[idx], updates);
  }
}

/* =========================================
   ELIMINAR EVENTO
   ========================================= */
export async function deleteEvent(id) {
  try {
    const { db, doc, deleteDoc } = await getFirebaseServices();
    await deleteDoc(doc(db, 'events', id));
  } catch (_) {
    const idx = SAMPLE_EVENTS.findIndex(e => e.id === id);
    if (idx !== -1) SAMPLE_EVENTS.splice(idx, 1);
  }
}

/* =========================================
   INSCRIBIRSE A UN EVENTO
   ========================================= */
export async function enrollInEvent(eventId) {
  try {
    const {
      db, auth, collection, doc, addDoc, updateDoc,
      serverTimestamp, arrayUnion, increment
    } = await getFirebaseServices();
    const user = auth.currentUser;
    if (user) {
      await addDoc(collection(db, 'events', eventId, 'enrollments'), {
        userId: user.uid,
        name: user.displayName,
        email: user.email,
        enrolledAt: serverTimestamp()
      });
      await updateDoc(doc(db, 'events', eventId), { enrolled: increment(1) });
      await updateDoc(doc(db, 'users', user.uid), {
        eventsJoined: arrayUnion(eventId),
        updatedAt: serverTimestamp()
      });
      const ev = await getEventById(eventId);
      if (ev?.points) await updateDoc(doc(db, 'users', user.uid), { points: increment(ev.points) });
    }
  } catch (_) {
    const ev = SAMPLE_EVENTS.find(e => e.id === eventId);
    if (ev && ev.enrolled < ev.maxCapacity) ev.enrolled += 1;
  }
}

/* =========================================
   CANCELAR INSCRIPCION
   ========================================= */
export async function unenrollFromEvent(eventId) {
  try {
    const { db, auth, doc, updateDoc, arrayRemove, increment } = await getFirebaseServices();
    const user = auth.currentUser;
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid), { eventsJoined: arrayRemove(eventId) });
    await updateDoc(doc(db, 'events', eventId), { enrolled: increment(-1) });
  } catch (_) {}
}

/* =========================================
   OBTENER EVENTOS DEL ORGANIZADOR
   ========================================= */
export async function getUserEvents(uid) {
  try {
    const { db, collection, getDocs, query, where } = await getFirebaseServices();
    const q = query(collection(db, 'events'), where('organizerId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (_) {
    return SAMPLE_EVENTS.filter(e => e.organizerId === uid);
  }
}

export { SAMPLE_EVENTS, EVENT_CATEGORY_META };

async function getFirebaseServices() {
  if (!firebaseServicesPromise) {
    firebaseServicesPromise = Promise.all([
      import('./firebase-config.js'),
      import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js")
    ]).then(([config, firestore]) => ({
      db: config.db,
      auth: config.auth,
      ...firestore
    }));
  }
  return firebaseServicesPromise;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
