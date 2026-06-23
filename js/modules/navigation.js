(function definePortfolioNavigation(global) {
  'use strict';

  function getHashTarget(hash) {
    if (!hash || hash === '#') return null;

    try {
      return document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch {
      return null;
    }
  }

  function init() {
    if (document.documentElement.dataset.navigationInitialized === 'true') return;
    document.documentElement.dataset.navigationInitialized = 'true';

    const prefersReducedMotion = global.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const nav = document.querySelector('.navbar');
    const menu = document.getElementById('navbarNav');
    const menuToggle = document.querySelector('.navbar-toggler');
    const navLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
    const sections = navLinks
      .map((link) => getHashTarget(link.getAttribute('href')))
      .filter(Boolean);

    const backToTop = document.createElement('button');
    backToTop.className = 'floating-control back-to-top';
    backToTop.type = 'button';
    backToTop.setAttribute('aria-label', 'Về đầu trang');
    backToTop.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
    document.body.append(backToTop);

    let activeSectionId = null;
    let scrollFrame = 0;

    function setActiveSection(sectionId, { replaceHash = false } = {}) {
      if (sectionId === activeSectionId && !replaceHash) return;

      activeSectionId = sectionId;
      navLinks.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${sectionId}`;
        link.classList.toggle('active', isActive);
        if (isActive) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });

      if (!replaceHash) return;

      const nextHash = sectionId ? `#${sectionId}` : '#top';
      if (global.location.hash !== nextHash) {
        global.history.replaceState(null, '', nextHash);
      }
    }

    function getSectionInView() {
      const headerOffset = (nav?.offsetHeight || 0) + 24;
      const scrollPosition = global.scrollY + headerOffset;
      let currentSection = null;

      sections.forEach((section) => {
        if (section.offsetTop <= scrollPosition) currentSection = section;
      });

      return currentSection;
    }

    function updateScrollState({ replaceHash = true } = {}) {
      const isPastScrollThreshold = global.scrollY > 420;
      backToTop.classList.toggle('is-visible', isPastScrollThreshold);
      nav?.classList.toggle('navbar-scrolled', global.scrollY > 32);

      const currentSection = getSectionInView();
      setActiveSection(currentSection?.id ?? null, { replaceHash });
    }

    function scheduleScrollUpdate() {
      if (scrollFrame) return;
      scrollFrame = global.requestAnimationFrame(() => {
        scrollFrame = 0;
        updateScrollState();
      });
    }

    function closeMobileMenu({ restoreFocus = false } = {}) {
      if (!menu?.classList.contains('show')) return;

      if (global.bootstrap?.Collapse) {
        const collapse = global.bootstrap.Collapse.getInstance(menu)
          || new global.bootstrap.Collapse(menu, { toggle: false });
        if (restoreFocus) {
          menu.addEventListener('hidden.bs.collapse', () => menuToggle?.focus({ preventScroll: true }), { once: true });
        }
        collapse.hide();
      } else {
        menu.classList.remove('show');
        menuToggle?.setAttribute('aria-expanded', 'false');
        if (restoreFocus) menuToggle?.focus({ preventScroll: true });
      }
    }

    backToTop.addEventListener('click', () => {
      global.history.pushState(null, '', '#top');
      setActiveSection(null);
      global.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });

    global.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
    global.addEventListener('resize', scheduleScrollUpdate, { passive: true });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        const target = getHashTarget(link.getAttribute('href'));
        if (!target) return;

        setActiveSection(target.id);
        target.querySelectorAll('.js-reveal').forEach((element) => element.classList.add('is-revealed'));
        closeMobileMenu({ restoreFocus: true });
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMobileMenu({ restoreFocus: true });
    });

    global.matchMedia?.('(min-width: 992px)').addEventListener?.('change', (event) => {
      if (event.matches) closeMobileMenu();
    });

    global.addEventListener('hashchange', () => {
      const target = getHashTarget(global.location.hash);
      setActiveSection(target?.id ?? null);
      global.requestAnimationFrame(() => updateScrollState({ replaceHash: false }));
    });

    global.addEventListener('popstate', () => {
      const target = getHashTarget(global.location.hash);
      setActiveSection(target?.id ?? null);
      global.requestAnimationFrame(() => updateScrollState({ replaceHash: false }));
    });

    global.requestAnimationFrame(() => updateScrollState({ replaceHash: !global.location.hash }));
  }

  global.PortfolioNavigation = Object.freeze({ init });
})(window);
