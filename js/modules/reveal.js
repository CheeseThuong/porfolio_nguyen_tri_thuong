(function definePortfolioReveal(global) {
  'use strict';

  function init() {
    const prefersReducedMotion = global.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const revealElements = document.querySelectorAll('.section-heading, .project-card, #contactForm');

    if (prefersReducedMotion || !('IntersectionObserver' in global)) return;

    let revealObserver;
    try {
      revealObserver = new global.IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

      document.documentElement.classList.add('js-active');
      revealElements.forEach((element, index) => {
        element.classList.add('js-reveal');
        element.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 65}ms`);
        revealObserver.observe(element);
      });
    } catch {
      revealObserver?.disconnect();
      revealElements.forEach((element) => {
        element.classList.remove('js-reveal', 'is-revealed');
        element.style.removeProperty('--reveal-delay');
      });
      document.documentElement.classList.remove('js-active');
    }
  }

  global.PortfolioReveal = Object.freeze({ init });
})(window);
