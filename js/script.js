/* =============================================
   PB SUMBER MAJU – script.js
   ============================================= */

'use strict';

/* ============ LOADING SCREEN ============ */
function initLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;
  window.addEventListener('load', () => {
    setTimeout(() => screen.classList.add('hidden'), 900);
  });
}

/* ============ BACK TO TOP ============ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============ NAVBAR ============ */
function initNavbar() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navbar   = document.getElementById('mainNavbar');

  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', () => {
    updateActiveLink();
    if (navbar) navbar.style.padding = window.scrollY > 50 ? '.4rem 0' : '.7rem 0';
  }, { passive: true });

  updateActiveLink();

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const navMenu = document.getElementById('navMenu');
      if (navMenu && navMenu.classList.contains('show')) {
        bootstrap.Collapse.getInstance(navMenu)?.hide();
      }
    });
  });
}

/* ============ LIGHTBOX ============ */
function initLightbox() {
  const lightbox     = document.getElementById('lightbox');
  const closeBtn     = document.getElementById('lightbox-close');
  const lbPhotoWrap  = document.getElementById('lb-photo-wrap');
  const lbPhoto      = document.getElementById('lb-photo');
  const lbPhotoTitle = document.getElementById('lb-photo-title');
  const lbPhotoDesc  = document.getElementById('lb-photo-desc');

  // Berhenti jika elemen tidak ditemukan (pastikan index.html versi terbaru)
  if (!lightbox || !lbPhoto) {
    console.warn('[Lightbox] Elemen tidak ditemukan. Pastikan index.html sudah versi terbaru.');
    return;
  }

  function openLightbox(src, title, desc) {
    lbPhoto.src = src;
    lbPhoto.alt = title;
    if (lbPhotoTitle) lbPhotoTitle.textContent = title;
    if (lbPhotoDesc)  lbPhotoDesc.textContent  = desc;
    if (lbPhotoWrap)  lbPhotoWrap.style.display = 'block';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lbPhoto.src = ''; }, 300);
  }

  // Pasang klik ke setiap gallery-item via data attribute
  document.querySelectorAll('.gallery-item[data-img]').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      openLightbox(
        item.dataset.img,
        item.dataset.title || '',
        item.dataset.desc  || ''
      );
    });
  });

  // Tutup via tombol X
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  // Tutup klik backdrop
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Tutup tekan Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });
}

/* ============ SMOOTH SCROLL ============ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth'
      });
    });
  });
}

/* ============ AOS ============ */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, once: true, offset: 60, easing: 'ease-out-quad' });
  }
}

/* ============ COUNTER ANIMASI ============ */
function animateCounter(el, target, duration) {
  duration = duration || 1200;
  var start = null;
  function step(ts) {
    if (!start) start = ts;
    var progress = Math.min((ts - start) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target + (el.dataset.suffix || '');
    }
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target, parseInt(entry.target.dataset.counter, 10));
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

/* ============ INIT SEMUA ============ */
document.addEventListener('DOMContentLoaded', function() {
  initLoadingScreen();
  initBackToTop();
  initNavbar();
  initLightbox();
  initSmoothScroll();
  initAOS();
  initCounters();
});