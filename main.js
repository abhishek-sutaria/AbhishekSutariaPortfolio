/* ============================================================
   ABHISHEK SUTARIA — PREMIUM ENGINEERING LAB INTERACTIONS
   Apple Scrollytelling × Toukoum Micro-Interactions
   ============================================================ */

'use strict';

/* ── GLOBAL MOUSE POSITION ───────────────────────────────────── */
let gMouseX = 0, gMouseY = 0;

document.addEventListener('mousemove', (e) => {
  gMouseX = e.clientX;
  gMouseY = e.clientY;
});

/* ── CUSTOM CURSOR ───────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', () => {
    dot.style.left = gMouseX + 'px';
    dot.style.top  = gMouseY + 'px';
  });

  function animateRing() {
    ringX += (gMouseX - ringX) * 0.1;
    ringY += (gMouseY - ringY) * 0.1;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Show cursor after first move
  document.addEventListener('mousemove', function show() {
    document.body.classList.add('cursor-ready');
    document.removeEventListener('mousemove', show);
  });

  const hoverEls = document.querySelectorAll('a, button, .exp-item, .project-card, .skill-badge, .btn-magnetic');
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

/* ── BLUEPRINT GRID GLOW (cursor-following) ──────────────────── */
(function initBlueprintGlow() {
  const glow = document.querySelector('.blueprint-glow');
  if (!glow) return;

  document.addEventListener('mousemove', () => {
    glow.style.left = gMouseX + 'px';
    glow.style.top  = gMouseY + 'px';
  });
})();

/* ── SCROLL PROGRESS BAR ─────────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  function update() {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ── NAV SCROLL STATE ────────────────────────────────────────── */
(function initNav() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
})();

/* ── MOBILE MENU ─────────────────────────────────────────────── */
function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const btn  = document.getElementById('hamburger-btn');
  if (menu) menu.classList.remove('open');
  if (btn) btn.setAttribute('aria-expanded', 'false');
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

/* ── KINETIC TYPEWRITER ──────────────────────────────────────── */
(function initTyping() {
  const target = document.getElementById('typed-text');
  if (!target) return;

  const phrases = [
    'Data Scientist',
    'ML Engineer',
    'AI Researcher',
    'Data Engineer',
    'LLM Engineer',
  ];

  let phraseIdx = 0, charIdx = 0, isDeleting = false;

  function type() {
    const current = phrases[phraseIdx];

    if (!isDeleting) {
      charIdx++;
      target.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(type, 2200);
        return;
      }
      setTimeout(type, 70);
    } else {
      charIdx--;
      target.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 30);
    }
  }

  setTimeout(type, 800);
})();

/* ── SPRING-BOUNCE NUMBER COUNTERS ───────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix !== undefined ? el.dataset.prefix : '';
    const dur = 2000;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      let progress = Math.min(elapsed / dur, 1);

      // Spring-bounce easing: overshoot then settle
      const t = progress;
      const spring = t < 0.6
        ? (t / 0.6) * 1.12  // overshoot to 112%
        : 1.12 - 0.12 * Math.sin((t - 0.6) / 0.4 * Math.PI / 2 * 3) * (1 - t); // bounce settle

      const eased = Math.min(spring, 1.12);
      const val = Math.round(eased * target);
      const display = Math.min(val, target + (eased > 1 ? Math.round((eased - 1) * target) : 0));

      if (progress < 1) {
        el.textContent = prefix + Math.min(Math.round(eased * target), target + 2) + suffix;
        requestAnimationFrame(tick);
      } else {
        el.textContent = prefix + target + suffix;
      }
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
    threshold: 0.06,
    rootMargin: '0px 0px -30px 0px',
  });

  els.forEach(el => observer.observe(el));
})();

/* ── APPLE TYPOGRAPHIC FADE ──────────────────────────────────── */
(function initTypoFade() {
  const els = document.querySelectorAll('.typo-fade, .typo-fade-sub');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      } else {
        // Remove so it re-fades when scrolling away
        entry.target.classList.remove('in-view');
      }
    });
  }, {
    threshold: 0.5, // fires when 50% visible (roughly center of viewport)
    rootMargin: '-10% 0px -10% 0px',
  });

  els.forEach(el => observer.observe(el));
})();

/* ── HERO PARALLAX DEPTH ─────────────────────────────────────── */
(function initParallaxDepth() {
  const heroBg   = document.querySelector('.hero-bg');
  const heroGrid = document.querySelector('.hero-grid');
  const heroContent = document.querySelector('.hero-content');
  if (!heroBg) return;

  let ticking = false;

  function update() {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight * 1.2) {
      // Different scroll speeds = parallax depth
      if (heroGrid)    heroGrid.style.transform    = `translateY(${scrollY * 0.08}px)`;
      if (heroBg)      heroBg.style.transform      = `translateY(${scrollY * 0.15}px)`;
      if (heroContent) heroContent.style.transform  = `translateY(${scrollY * 0.25}px)`;
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

/* ── SCROLL-DRIVEN SCALE (Project Cards) ─────────────────────── */
(function initScrollScale() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px',
  });

  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 80}ms`;
    observer.observe(card);
  });
})();

/* ── SVG TRACING BEAM (Experience) ───────────────────────────── */
(function initTracingBeam() {
  const timeline = document.querySelector('.exp-timeline');
  const beamSvg  = document.querySelector('.exp-beam-svg');
  if (!timeline || !beamSvg) return;

  const line      = beamSvg.querySelector('.exp-beam-glow');
  const bgLine    = beamSvg.querySelector('.exp-beam-bg');
  const items     = timeline.querySelectorAll('.exp-item');
  if (!line || !bgLine) return;

  function updateBeam() {
    const timelineRect = timeline.getBoundingClientRect();
    const totalHeight  = timeline.scrollHeight;

    bgLine.setAttribute('y1', '0');
    bgLine.setAttribute('y2', totalHeight.toString());
    bgLine.setAttribute('x1', '1');
    bgLine.setAttribute('x2', '1');

    line.setAttribute('x1', '1');
    line.setAttribute('x2', '1');
    line.setAttribute('y1', '0');

    // Calculate how far into the timeline we've scrolled
    const viewportCenter = window.innerHeight * 0.6;
    const scrolled = viewportCenter - timelineRect.top;
    const progress = Math.max(0, Math.min(scrolled / totalHeight, 1));

    line.setAttribute('y2', (progress * totalHeight).toString());

    // Light up dots that the beam has passed
    items.forEach(item => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.top + itemRect.height * 0.3;
      if (itemCenter < viewportCenter) {
        item.classList.add('beam-active');
      } else {
        item.classList.remove('beam-active');
      }
    });
  }

  beamSvg.style.height = timeline.scrollHeight + 'px';
  window.addEventListener('scroll', updateBeam, { passive: true });
  window.addEventListener('resize', () => {
    beamSvg.style.height = timeline.scrollHeight + 'px';
    updateBeam();
  });
  updateBeam();
})();

/* ── MAGNETIC CTA BUTTONS ────────────────────────────────────── */
(function initMagneticButtons() {
  const btns = document.querySelectorAll('.btn-magnetic');
  if (!btns.length) return;

  const RANGE = 60; // px — magnetic pull range
  const STRENGTH = 0.25; // how far it moves (0-1)

  btns.forEach(btn => {
    let animId = null;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    function animate() {
      // Spring physics
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      if (Math.abs(targetX - currentX) < 0.1 && Math.abs(targetY - currentY) < 0.1) {
        currentX = targetX;
        currentY = targetY;
        btn.style.transform = `translate(${currentX}px, ${currentY}px)`;
        animId = null;
        return;
      }

      btn.style.transform = `translate(${currentX}px, ${currentY}px)`;
      animId = requestAnimationFrame(animate);
    }

    function onMouseMove(e) {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RANGE) {
        targetX = dx * STRENGTH;
        targetY = dy * STRENGTH;
      } else {
        targetX = 0;
        targetY = 0;
      }

      if (!animId) animId = requestAnimationFrame(animate);
    }

    function onMouseLeave() {
      targetX = 0;
      targetY = 0;
      if (!animId) animId = requestAnimationFrame(animate);
    }

    document.addEventListener('mousemove', onMouseMove);
    btn.addEventListener('mouseleave', onMouseLeave);
  });
})();

/* ── INTERACTIVE SPOTLIGHT (Skill Badges) ────────────────────── */
(function initSkillSpotlight() {
  const badges = document.querySelectorAll('.skill-badge');
  if (!badges.length) return;

  const SPOTLIGHT_RANGE = 80; // px

  function update() {
    badges.forEach(badge => {
      const rect = badge.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.sqrt((gMouseX - cx) ** 2 + (gMouseY - cy) ** 2);

      if (dist < SPOTLIGHT_RANGE) {
        badge.classList.add('spotlight');
      } else {
        badge.classList.remove('spotlight');
      }
    });
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
})();

/* ── SKILLS CARD MOUSE TRACKING (for background radial) ──────── */
(function initSkillsCardMouse() {
  const cards = document.querySelectorAll('.skills-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
    });
  });
})();

/* ── SKILL BADGE STAGGER ─────────────────────────────────────── */
(function initSkillStagger() {
  const grids = document.querySelectorAll('.skills-grid');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const badges = entry.target.querySelectorAll('.skill-badge');
        badges.forEach((badge, i) => {
          badge.style.opacity = '0';
          badge.style.transform = 'translateY(10px) scale(0.95)';
          badge.style.transition = `opacity 0.5s ease ${i * 30}ms, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 30}ms`;
          requestAnimationFrame(() => requestAnimationFrame(() => {
            badge.style.opacity = '1';
            badge.style.transform = 'translateY(0) scale(1)';
          }));
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  grids.forEach(g => observer.observe(g));
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
          if (href === '#' + entry.target.id && !link.classList.contains('nav-cta')) {
            link.style.color = 'var(--text-primary)';
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
})();
