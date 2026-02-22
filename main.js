/* ============================================================
   ABHISHEK SUTARIA PORTFOLIO — INTERACTIONS & ANIMATIONS
   ============================================================ */

'use strict';

/* ── CUSTOM CURSOR ───────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverEls = document.querySelectorAll('a, button, .exp-item, .project-card, .skill-badge');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();

/* ── SCROLL PROGRESS BAR ─────────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function updateProgress() {
    const scrollTop   = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
})();

/* ── NAV SCROLL STATE ────────────────────────────────────────── */
(function initNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── MOBILE MENU ─────────────────────────────────────────────── */
function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn  = document.getElementById('hamburger-btn');
  if (menu) menu.classList.remove('open');
  if (btn)  btn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

(function initMobileMenu() {
  const btn   = document.getElementById('hamburger-btn');
  const menu  = document.getElementById('mobile-menu');
  const close = document.getElementById('mobile-close');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  if (close) close.addEventListener('click', closeMobileMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMobileMenu();
  });
})();

/* ── TYPING ANIMATION ────────────────────────────────────────── */
(function initTyping() {
  const target = document.getElementById('typed-text');
  if (!target) return;

  const phrases = [
    'Data Engineer',
    'ML Researcher',
    'AI Systems Builder',
    'LLM Engineer',
    'Quant Data Engineer',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let isDeleting = false;
  let pauseTimer = null;

  const TYPE_SPEED   = 75;
  const DELETE_SPEED = 35;
  const PAUSE_AFTER  = 2000;
  const PAUSE_BEFORE = 400;

  function type() {
    const current = phrases[phraseIdx];

    if (!isDeleting) {
      charIdx++;
      target.textContent = current.slice(0, charIdx);

      if (charIdx === current.length) {
        isDeleting = true;
        pauseTimer = setTimeout(type, PAUSE_AFTER);
        return;
      }
      setTimeout(type, TYPE_SPEED);
    } else {
      charIdx--;
      target.textContent = current.slice(0, charIdx);

      if (charIdx === 0) {
        isDeleting   = false;
        phraseIdx    = (phraseIdx + 1) % phrases.length;
        pauseTimer   = setTimeout(type, PAUSE_BEFORE);
        return;
      }
      setTimeout(type, DELETE_SPEED);
    }
  }

  setTimeout(type, 1000);
})();

/* ── COUNTER ANIMATION ───────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target  = parseInt(el.dataset.count, 10);
    const suffix  = el.dataset.suffix  || '';
    const prefix  = el.dataset.prefix  !== undefined ? el.dataset.prefix  : '';
    const dur     = 1800;
    const start   = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / dur, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(eased * target);
      el.textContent = prefix + val + suffix;

      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(el => observer.observe(el));
})();

/* ── SCROLL REVEAL ───────────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px',
  });

  els.forEach(el => observer.observe(el));
})();

/* ── HERO PARALLAX ───────────────────────────────────────────── */
(function initHeroParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  let ticking = false;

  function update() {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${scrollY * 0.15}px)`;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
})();

/* ── SKILL BADGE STAGGER ─────────────────────────────────────── */
(function initSkillStagger() {
  const groups = document.querySelectorAll('.skills-grid');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const badges = entry.target.querySelectorAll('.skill-badge');
        badges.forEach((badge, i) => {
          badge.style.opacity   = '0';
          badge.style.transform = 'translateY(10px)';
          badge.style.transition = `opacity 0.4s ease ${i * 35}ms, transform 0.4s ease ${i * 35}ms`;
          requestAnimationFrame(() => requestAnimationFrame(() => {
            badge.style.opacity   = '1';
            badge.style.transform = 'translateY(0)';
          }));
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  groups.forEach(g => observer.observe(g));
})();

/* ── ACTIVE NAV HIGHLIGHT ────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          const href = link.getAttribute('href');
          if (href === '#' + entry.target.id) {
            if (!link.classList.contains('nav-cta')) {
              link.style.color = 'var(--text-primary)';
            }
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* ── KEYBOARD NAV SKIP ───────────────────────────────────────── */
(function initSkipLinks() {
  const main = document.querySelector('main');
  if (!main) return;
  main.setAttribute('tabindex', '-1');
})();
