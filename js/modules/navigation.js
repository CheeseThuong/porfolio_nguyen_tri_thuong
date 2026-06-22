(function definePortfolioNavigation(global) {
  'use strict';

  function getHashTarget(hash) {
    if (!hash || hash === '#') return null;
    try {
      const id = decodeURIComponent(hash.slice(1));
      return document.getElementById(id) || document.querySelector(hash);
    } catch {
      return null;
    }
  }

  function init() {
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const supportsIntersectionObserver = 'IntersectionObserver' in window;

    // 1. Back to Top Button
    const backToTop = document.createElement('button');
    backToTop.className = 'floating-control back-to-top';
    backToTop.type = 'button';
    backToTop.setAttribute('aria-label', 'Về đầu trang');
    backToTop.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
    document.body.appendChild(backToTop);

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });

    // 2. Navbar Scrolled and Back to Top Observer
    const nav = document.querySelector('.navbar');
    const hero = document.querySelector('.hero');

    if (supportsIntersectionObserver) {
      if (hero) {
        const heroObserver = new IntersectionObserver(([entry]) => {
          backToTop.classList.toggle('is-visible', !entry.isIntersecting);
          if (nav) {
            nav.classList.toggle('navbar-scrolled', !entry.isIntersecting);
          }
        }, { threshold: 0.15 });
        heroObserver.observe(hero);
      } else {
        // Fallback if no hero element
        window.addEventListener('scroll', () => {
          const scrolled = window.scrollY > 100;
          backToTop.classList.toggle('is-visible', scrolled);
          if (nav) {
            nav.classList.toggle('navbar-scrolled', scrolled);
          }
        }, { passive: true });
      }
    } else {
      // Fallback for browsers without IntersectionObserver
      window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 100;
        backToTop.classList.toggle('is-visible', scrolled);
        if (nav) {
          nav.classList.toggle('navbar-scrolled', scrolled);
        }
      }, { passive: true });
    }

    // 3. Scroll Spy (Active Links)
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
            if (isActive) {
              link.setAttribute('aria-current', 'page');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        });
      }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });

      trackedSections.forEach((section) => sectionObserver.observe(section));
    }

    // 4. Navigation Links Click and Mobile Menu Collapse
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const hash = link.getAttribute('href');
        const target = getHashTarget(hash);

        if (target) {
          // If reveal module is active, force reveal target section elements
          target.querySelectorAll('.js-reveal').forEach((element) => {
            element.classList.add('is-revealed');
          });
        }

        // Collapse bootstrap menu if open
        const menu = document.getElementById('navbarNav');
        if (menu?.classList.contains('show') && window.bootstrap?.Collapse) {
          const bsCollapse = window.bootstrap.Collapse.getInstance(menu) || new window.bootstrap.Collapse(menu, { toggle: false });
          bsCollapse.hide();
        }
      });
    });

    // 5. Handle Initial Hash or Page Reload Offset
    if (window.location.hash) {
      const initialTarget = getHashTarget(window.location.hash);
      if (initialTarget) {
        setTimeout(() => {
          initialTarget.scrollIntoView({ behavior: 'smooth' });
          initialTarget.querySelectorAll('.js-reveal').forEach((element) => {
            element.classList.add('is-revealed');
          });
        }, 100);
      }
    }
  }

  global.PortfolioNavigation = Object.freeze({ init });
})(window);
