document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. Auto-update current year in footer
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Initialize all portfolio JS modules
  if (window.PortfolioProjects && typeof window.PortfolioProjects.init === 'function') {
    window.PortfolioProjects.init();
  }

  if (window.PortfolioNavigation && typeof window.PortfolioNavigation.init === 'function') {
    window.PortfolioNavigation.init();
  }

  if (window.PortfolioReveal && typeof window.PortfolioReveal.init === 'function') {
    window.PortfolioReveal.init();
  }

  if (window.PortfolioContact && typeof window.PortfolioContact.init === 'function') {
    window.PortfolioContact.init();
  }
});
