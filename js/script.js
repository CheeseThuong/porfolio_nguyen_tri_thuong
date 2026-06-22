/*
=============================
UI utilities and interactions
=============================
*/

function getHashTarget(hash) {
  if (!hash || hash === '#') return null;

  try {
    const id = decodeURIComponent(hash.slice(1));
    return document.getElementById(id) || document.querySelector(hash);
  } catch {
    return null;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const supportsIntersectionObserver = 'IntersectionObserver' in window;
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  const year = document.getElementById('currentYear');
  if (year) year.textContent = new Date().getFullYear();

  const backToTop = document.createElement('button');
  backToTop.className = 'floating-control back-to-top';
  backToTop.type = 'button';
  backToTop.setAttribute('aria-label', 'Về đầu trang');
  backToTop.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
  document.body.appendChild(backToTop);

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });

  const hero = document.querySelector('.hero');
  if (hero && supportsIntersectionObserver) {
    const heroObserver = new IntersectionObserver(([entry]) => {
      backToTop.classList.toggle('is-visible', !entry.isIntersecting);
    }, { threshold: 0.15 });
    heroObserver.observe(hero);
  }

  const nav = document.querySelector('.navbar');
  const navLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
  const trackedSections = navLinks
    .map((link) => getHashTarget(link.getAttribute('href')))
    .filter(Boolean);

  if (trackedSections.length && supportsIntersectionObserver) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', isActive);
          if (isActive) link.setAttribute('aria-current', 'page');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });

    trackedSections.forEach((section) => sectionObserver.observe(section));
  }

  if (nav && hero && supportsIntersectionObserver) {
    const navObserver = new IntersectionObserver(([entry]) => {
      nav.classList.toggle('navbar-scrolled', !entry.isIntersecting);
    }, { threshold: 0.75 });
    navObserver.observe(hero);
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const target = getHashTarget(link.getAttribute('href'));
      target?.querySelectorAll('.js-reveal').forEach((element) => element.classList.add('is-revealed'));

      const menu = document.getElementById('navbarNav');
      if (menu?.classList.contains('show') && window.bootstrap?.Collapse) {
        window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  const revealElements = document.querySelectorAll(
    '.section > .container > h2, .card, .project-card, .skill-meter, .toolkit-item, .timeline__item, #contactForm'
  );

  if (prefersReducedMotion || !supportsIntersectionObserver) {
    revealElements.forEach((element) => element.classList.add('is-revealed'));
  } else {
    revealElements.forEach((element, index) => {
      element.classList.add('js-reveal');
      element.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 65}ms`);
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    revealElements.forEach((element) => revealObserver.observe(element));

    const initialTarget = getHashTarget(window.location.hash);
    initialTarget?.querySelectorAll('.js-reveal').forEach((element) => element.classList.add('is-revealed'));

    // Nội dung luôn hiển thị nếu trình duyệt tạm dừng IntersectionObserver.
    setTimeout(() => {
      revealElements.forEach((element) => element.classList.add('is-revealed'));
    }, 3000);
  }

  const skillMeters = [...document.querySelectorAll('.skill-meter')];
  if (prefersReducedMotion || !supportsIntersectionObserver) {
    skillMeters.forEach((meter) => meter.classList.add('is-visible'));
  } else if (skillMeters.length) {
    const meterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.35 });

    skillMeters.forEach((meter) => meterObserver.observe(meter));
  }
});
