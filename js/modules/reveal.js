(function definePortfolioReveal(global) {
  'use strict';

  function init() {
    // 1. Add js-active class to html root to activate CSS hidden states
    document.documentElement.classList.add('js-active');

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const supportsIntersectionObserver = 'IntersectionObserver' in window;

    // 2. Select elements that need reveal animations
    const revealElements = document.querySelectorAll(
      '.section > .container > h2, .card, .project-card, .skill-meter, .toolkit-item, .timeline__item, #contactForm'
    );

    if (prefersReducedMotion || !supportsIntersectionObserver) {
      // If animations are disabled or observer not supported, immediately show everything
      revealElements.forEach((element) => element.classList.add('is-revealed'));
      
      const skillMeters = document.querySelectorAll('.skill-meter');
      skillMeters.forEach((meter) => meter.classList.add('is-visible'));
      return;
    }

    // 3. Setup reveal animation classes and delays
    revealElements.forEach((element, index) => {
      element.classList.add('js-reveal');
      element.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 65}ms`);
    });

    // 4. Create IntersectionObserver for reveal elements
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

    revealElements.forEach((element) => revealObserver.observe(element));

    // 5. Separate Observer for Skill Meters progress bar animation
    const skillMeters = document.querySelectorAll('.skill-meter');
    if (skillMeters.length) {
      const meterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.25 });

      skillMeters.forEach((meter) => meterObserver.observe(meter));
    }
  }

  global.PortfolioReveal = Object.freeze({ init });
})(window);
