/**
 * Global Header and Footer Components
 */

(function() {
  'use strict';

  // Detect if we're in a subdirectory
  const isSubdir = window.location.pathname.includes('/blog/');
  const basePath = isSubdir ? '../' : '';

  function getHeader(activePage = '') {
    return `
    <div class="container header-content">
      <a href="${basePath}index.html" class="logo">
        <img src="${basePath}assets/logo.png" alt="Webico" class="logo-img">
      </a>

      <nav class="nav" id="nav">
        <a href="${basePath}index.html#home" class="nav-link${activePage === 'home' ? ' active' : ''}" data-i18n="nav.home">Home</a>
        <a href="${basePath}index.html#services" class="nav-link" data-i18n="nav.services">Services</a>
        <a href="${basePath}index.html#portfolio" class="nav-link" data-i18n="nav.portfolio">Portfolio</a>
        <a href="${basePath}blog.html" class="nav-link${activePage === 'blog' ? ' active' : ''}" data-i18n="nav.blog">Blog</a>
        <a href="${basePath}index.html#contact" class="nav-link" data-i18n="nav.contact">Contact</a>
      </nav>

      <div class="header-actions">
        <button class="lang-toggle" id="langToggle" aria-label="Toggle language">
          <span class="lang-current">EN</span>
        </button>
        <button class="menu-toggle" id="menuToggle" aria-label="Toggle menu">
          <span class="hamburger"></span>
        </button>
      </div>
    </div>
    `;
  }

  function getFooter() {
    return `
    <div class="container footer-content">
      <div class="footer-bottom">
        <p>&copy; <span id="currentYear"></span> Webico. <span data-i18n="footer.rights">All rights reserved.</span></p>
      </div>
    </div>
    `;
  }

  function initComponents() {
    // Get active page from data attribute
    const header = document.getElementById('header');
    const footer = document.querySelector('.footer');

    if (header) {
      const activePage = header.dataset.active || '';
      header.innerHTML = getHeader(activePage);
    }

    if (footer) {
      footer.innerHTML = getFooter();
    }

    // Set current year
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initComponents();
      // Mark components as ready
      window.componentsLoaded = true;
      window.dispatchEvent(new CustomEvent('componentsReady'));
    });
  } else {
    initComponents();
    window.componentsLoaded = true;
    window.dispatchEvent(new CustomEvent('componentsReady'));
  }
})();
