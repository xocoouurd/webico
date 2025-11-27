/**
 * Webico Website - Main JavaScript
 */

(function() {
  'use strict';

  // ========================================
  // Translation System
  // ========================================
  let translations = null;
  let currentLang = localStorage.getItem('webico-lang') || 'mn';

  async function loadTranslations() {
    try {
      const response = await fetch('translations.json');
      translations = await response.json();
      applyTranslations();
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  }

  function applyTranslations() {
    if (!translations || !translations[currentLang]) return;

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = getNestedValue(translations[currentLang], key);
      if (translation) {
        if (el.tagName === 'INPUT' && el.type === 'submit') {
          el.value = translation;
        } else if (el.tagName === 'OPTION') {
          el.textContent = translation;
        } else {
          el.textContent = translation;
        }
      }
    });

    // Update lang toggle button text
    const langCurrent = document.querySelector('.lang-current');
    if (langCurrent) {
      langCurrent.textContent = currentLang.toUpperCase();
    }

    // Update HTML lang attribute
    document.documentElement.lang = currentLang;
  }

  function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'mn' : 'en';
    localStorage.setItem('webico-lang', currentLang);
    applyTranslations();
  }

  // ========================================
  // Mobile Navigation
  // ========================================
  function initMobileNav() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('active');
    });

    // Close menu when clicking a nav link
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
      }
    });
  }

  // ========================================
  // Language Toggle
  // ========================================
  function initLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    const langToggleFooter = document.getElementById('langToggleFooter');

    if (langToggle) {
      langToggle.addEventListener('click', toggleLanguage);
    }

    if (langToggleFooter) {
      langToggleFooter.addEventListener('click', toggleLanguage);
    }
  }

  // ========================================
  // FAQ Accordion
  // ========================================
  function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', () => {
          // Close other items
          faqItems.forEach(other => {
            if (other !== item) {
              other.classList.remove('active');
            }
          });
          // Toggle current item
          item.classList.toggle('active');
        });
      }
    });
  }

  // ========================================
  // Smooth Scroll for Navigation
  // ========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = target.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ========================================
  // Header Scroll Effect
  // ========================================
  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
      }

      lastScroll = currentScroll;
    });
  }

  // ========================================
  // Contact Form
  // ========================================
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Dynamic form sections
    initDynamicFormSections();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const projectType = formData.get('projectType');

      // Build data object based on project type
      const data = {
        // Contact info
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        business: formData.get('business'),
        // Project type
        projectType: projectType,
        // Budget & timeline
        budget: formData.get('budget'),
        timeline: formData.get('timeline'),
        maintenance: formData.get('maintenance'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
      };

      // Add project-specific data
      if (projectType === 'website') {
        data.websitePages = formData.get('websitePages');
        data.websiteDesign = formData.get('websiteDesign');
        data.websiteFeatures = formData.getAll('websiteFeatures');
        data.websiteContent = formData.get('websiteContent');
      } else if (projectType === 'mobile') {
        data.mobilePlatform = formData.get('mobilePlatform');
        data.mobileDesign = formData.get('mobileDesign');
        data.mobileFeatures = formData.getAll('mobileFeatures');
        data.mobileBackend = formData.get('mobileBackend');
      } else if (projectType === 'webapp') {
        data.webappType = formData.get('webappType');
        data.webappUsers = formData.get('webappUsers');
        data.webappFeatures = formData.getAll('webappFeatures');
      } else if (projectType === 'ecommerce') {
        data.ecommerceProducts = formData.get('ecommerceProducts');
        data.ecommercePlatform = formData.get('ecommercePlatform');
        data.ecommerceFeatures = formData.getAll('ecommerceFeatures');
        data.ecommerceContent = formData.get('ecommerceContent');
      } else if (projectType === 'ai') {
        data.aiUsecase = formData.get('aiUsecase');
        data.aiIntegration = formData.get('aiIntegration');
        data.aiFeatures = formData.getAll('aiFeatures');
      }

      // For now, just log the data and show success message
      console.log('Form submission:', data);

      // Show success message
      const successMessage = translations?.[currentLang]?.contact?.success ||
        'Thank you! Your quote request has been sent. We\'ll get back to you soon.';

      // Create or show success element
      let successEl = form.querySelector('.form-success');
      if (!successEl) {
        successEl = document.createElement('div');
        successEl.className = 'form-success';
        form.appendChild(successEl);
      }
      successEl.textContent = successMessage;
      successEl.classList.add('show');

      // Reset form and dynamic sections
      form.reset();
      resetDynamicSections();

      // Hide success message after 5 seconds
      setTimeout(() => {
        successEl.classList.remove('show');
      }, 5000);
    });
  }

  // ========================================
  // Dynamic Form Sections
  // ========================================
  function initDynamicFormSections() {
    const projectTypeRadios = document.querySelectorAll('input[name="projectType"]');
    const hint = document.querySelector('.select-project-hint');

    projectTypeRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const selectedType = e.target.value;
        showDynamicSection(selectedType);
        if (hint) hint.classList.add('hidden');
      });
    });
  }

  function showDynamicSection(type) {
    // Hide all dynamic sections
    const sections = document.querySelectorAll('.dynamic-section');
    sections.forEach(section => section.classList.remove('active'));

    // Show the selected section
    const sectionMap = {
      'website': 'websiteOptions',
      'mobile': 'mobileOptions',
      'webapp': 'webappOptions',
      'ecommerce': 'ecommerceOptions',
      'ai': 'aiOptions'
    };

    const sectionId = sectionMap[type];
    if (sectionId) {
      const section = document.getElementById(sectionId);
      if (section) section.classList.add('active');
    }
  }

  function resetDynamicSections() {
    const sections = document.querySelectorAll('.dynamic-section');
    sections.forEach(section => section.classList.remove('active'));

    const hint = document.querySelector('.select-project-hint');
    if (hint) hint.classList.remove('hidden');

    // Hide estimate display
    const estimateDisplay = document.getElementById('estimateDisplay');
    if (estimateDisplay) estimateDisplay.classList.remove('visible');
  }

  // ========================================
  // Cost Estimator
  // ========================================
  const pricing = {
    // Base prices by project type (in MNT thousands)
    // null = no estimate shown for this type
    base: {
      website: 500,
      mobile: null,
      webapp: null,
      ecommerce: 3000,
      ai: null
    },
    // Website options
    websitePages: { '1-5': 0, '6-10': 200, '11-20': 400, '20+': 800 },
    websiteDesign: { 'template': 0, 'custom': 500, 'ready': -100 },
    websiteFeatures: {
      multilang: 200, blog: 150, forms: 100, booking: 300, accounts: 400, seo: 150
    },
    websiteContent: { 'yes': 0, 'need-help': 300, 'not-sure': 0 },
    // Mobile options
    mobilePlatform: { 'ios': 0, 'android': 0, 'both': 800 },
    mobileDesign: { 'standard': 0, 'custom': 600, 'ready': -150 },
    mobileFeatures: {
      accounts: 300, push: 200, offline: 400, payments: 500, location: 200, camera: 250, chat: 600
    },
    mobileBackend: { 'yes': 500, 'no': 0, 'not-sure': 0 },
    // Web App options
    webappType: { 'dashboard': 0, 'portal': 200, 'internal': 0, 'saas': 500, 'other': 0 },
    webappUsers: { 'small': 0, 'medium': 200, 'large': 500, 'xlarge': 1000 },
    webappFeatures: {
      roles: 300, import: 200, reports: 400, integrations: 350, realtime: 500, files: 200
    },
    // E-commerce options
    ecommerceProducts: { '1-20': 0, '21-100': 200, '101-500': 500, '500+': 1000 },
    ecommercePlatform: { 'custom': 500, 'shopify': 0, 'woocommerce': 0, 'no-preference': 0 },
    ecommerceFeatures: {
      inventory: 300, payments: 200, shipping: 250, discounts: 150, accounts: 200, reviews: 150, multicurrency: 300
    },
    ecommerceContent: { 'yes': 0, 'need-help': 400 },
    // AI options
    aiUsecase: { 'chatbot': 0, 'analysis': 300, 'content': 200, 'automation': 400, 'other': 0 },
    aiIntegration: { 'yes': 300, 'no': 0, 'not-sure': 0 },
    aiFeatures: {
      'custom-data': 500, multilang: 300, analytics: 250
    }
  };

  function initCostEstimator() {
    const step3 = document.getElementById('step3');
    if (!step3) return;

    // Listen to all input changes in step 3
    step3.addEventListener('change', calculateEstimate);

    // Also listen to project type changes
    const projectTypeRadios = document.querySelectorAll('input[name="projectType"]');
    projectTypeRadios.forEach(radio => {
      radio.addEventListener('change', calculateEstimate);
    });
  }

  function calculateEstimate() {
    const projectType = document.querySelector('input[name="projectType"]:checked');
    if (!projectType) return;

    const type = projectType.value;
    const estimateDisplay = document.getElementById('estimateDisplay');

    // Hide estimate for project types without pricing
    if (pricing.base[type] === null) {
      if (estimateDisplay) estimateDisplay.classList.remove('visible');
      return;
    }

    let total = pricing.base[type] || 0;

    // Get active section
    const sectionMap = {
      'website': { prefix: 'website', selects: ['Pages', 'Design', 'Content'], checkboxes: 'websiteFeatures' },
      'mobile': { prefix: 'mobile', selects: ['Platform', 'Design', 'Backend'], checkboxes: 'mobileFeatures' },
      'webapp': { prefix: 'webapp', selects: ['Type', 'Users'], checkboxes: 'webappFeatures' },
      'ecommerce': { prefix: 'ecommerce', selects: ['Products', 'Platform', 'Content'], checkboxes: 'ecommerceFeatures' },
      'ai': { prefix: 'ai', selects: ['Usecase', 'Integration'], checkboxes: 'aiFeatures' }
    };

    const config = sectionMap[type];
    if (config) {
      // Calculate select values
      config.selects.forEach(selectName => {
        const select = document.querySelector(`select[name="${config.prefix}${selectName}"]`);
        if (select && select.value) {
          const pricingKey = config.prefix + selectName;
          if (pricing[pricingKey] && pricing[pricingKey][select.value]) {
            total += pricing[pricingKey][select.value];
          }
        }
      });

      // Calculate checkbox values
      const checkboxes = document.querySelectorAll(`input[name="${config.checkboxes}"]:checked`);
      const featurePricing = pricing[config.checkboxes];
      if (featurePricing) {
        checkboxes.forEach(cb => {
          if (featurePricing[cb.value]) {
            total += featurePricing[cb.value];
          }
        });
      }
    }

    // Update display
    const estimateAmount = document.getElementById('estimateAmount');

    if (estimateDisplay && estimateAmount) {
      estimateDisplay.classList.add('visible');
      // Format number with commas
      estimateAmount.textContent = (total * 1000).toLocaleString();
    }
  }

  // ========================================
  // Scroll Animations
  // ========================================
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
      '.service-card, .why-us-card, .portfolio-card, .process-step, .faq-item'
    );

    if (!animatedElements.length) return;

    // Add animation class
    animatedElements.forEach(el => {
      el.classList.add('animate-on-scroll');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  }

  // ========================================
  // Active Navigation Link
  // ========================================
  function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-100px 0px -50% 0px'
    });

    sections.forEach(section => observer.observe(section));
  }

  // ========================================
  // Set Current Year
  // ========================================
  function initCurrentYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  // ========================================
  // Initialize Everything
  // ========================================
  function init() {
    loadTranslations();
    initMobileNav();
    initLanguageToggle();
    initFAQ();
    initSmoothScroll();
    initHeaderScroll();
    initContactForm();
    initCostEstimator();
    initScrollAnimations();
    initActiveNavLink();
    initCurrentYear();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
