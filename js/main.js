// =============================================
// CiviConnect — main.js
// Script principal: navbar, utilidades globales
// =============================================

/* === NAVBAR: scroll effect === */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  });
}

/* === HAMBURGER MENU === */
const hamburger = document.getElementById('hamburger');
const navLinks   = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  // Cerrar al hacer click fuera
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) navLinks.classList.remove('open');
  });
}

/* === SMOOTH SCROLL para anclas internas === */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* === INTERSECTION OBSERVER para animaciones de entrada === */
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.cat-card, .step, .ods-card, .event-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Agregar clase visible con estilos
const style = document.createElement('style');
style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);

/* === UTILIDADES GLOBALES === */

/**
 * Formatea una fecha ISO a texto legible en español
 * @param {string} isoDate
 * @returns {string}
 */
window.formatDate = function(isoDate) {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  return date.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Muestra un toast de notificación temporal
 * @param {string} message
 * @param {'success'|'error'|'info'|'warning'} type
 */
window.showToast = function(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed; bottom: 1.5rem; right: 1.5rem;
      z-index: 9999; display: flex; flex-direction: column; gap: 0.5rem;
    `;
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const colors = {
    success: 'background:#E1F5EE; color:#0F6E56; border:1px solid #9FE1CB;',
    error:   'background:#FCEBEB; color:#791F1F; border:1px solid #F7C1C1;',
    info:    'background:#E6F1FB; color:#0C447C; border:1px solid #B5D4F4;',
    warning: 'background:#FAEEDA; color:#854F0B; border:1px solid #FAC775;',
  };

  const toast = document.createElement('div');
  toast.style.cssText = `
    display:flex; align-items:center; gap:0.5rem;
    padding:0.75rem 1rem; border-radius:12px;
    font-family:'DM Sans', sans-serif; font-size:0.9rem;
    box-shadow:0 4px 12px rgba(0,0,0,0.1);
    max-width:340px; animation:slideIn 0.3s ease;
    ${colors[type]}
  `;
  toast.innerHTML = `${icons[type]} <span>${message}</span>`;
  container.appendChild(toast);

  // CSS para animación del toast
  if (!document.getElementById('toast-styles')) {
    const ts = document.createElement('style');
    ts.id = 'toast-styles';
    ts.textContent = `
      @keyframes slideIn {
        from { opacity:0; transform:translateX(40px); }
        to   { opacity:1; transform:translateX(0); }
      }
      @keyframes slideOut {
        from { opacity:1; transform:translateX(0); }
        to   { opacity:0; transform:translateX(40px); }
      }
    `;
    document.head.appendChild(ts);
  }

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

/**
 * Trunca texto a n caracteres con "…"
 */
window.truncateText = function(text, n = 80) {
  return text && text.length > n ? text.slice(0, n) + '…' : text;
};

/**
 * Genera un ID único simple
 */
window.generateId = function() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
