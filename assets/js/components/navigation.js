/**
 * Navigation Module
 * Shared navigation functionality for all pages
 */

import { select, selectAll, on, toggleClass, removeClass, addClass, hasClass, scrollTo, scrollTop, throttle } from '../utils/dom.js';

export class Navigation {
  constructor() {
    this.menu = select('#menu');
    this.navbar = select('.navbar');
    this.navLinks = selectAll('.navbar ul li a');
    this.scrollTopBtn = select('#scroll-top');
    this.sections = selectAll('section');
    
    this.init();
  }

  init() {
    if (!this.menu || !this.navbar) return;
    
    // Mobile menu toggle
    this.initMobileMenu();
    
    // Scroll events
    this.initScrollEvents();
    
    // Smooth scrolling
    this.initSmoothScroll();
    
    // Scroll spy
    this.initScrollSpy();
    
    // Page visibility
    this.initPageVisibility();
  }

  initMobileMenu() {
    on(this.menu, 'click', () => {
      toggleClass(this.menu, 'fa-times');
      toggleClass(this.navbar, 'nav-toggle');
    });
  }

  initScrollEvents() {
    const handleScroll = throttle(() => {
      // Close mobile menu on scroll
      removeClass(this.menu, 'fa-times');
      removeClass(this.navbar, 'nav-toggle');
      
      // Show/hide scroll-to-top button
      if (this.scrollTopBtn) {
        if (scrollTop() > 60) {
          addClass(this.scrollTopBtn, 'active');
        } else {
          removeClass(this.scrollTopBtn, 'active');
        }
      }
      
      // Update active nav link
      this.updateActiveNavLink();
    }, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('load', handleScroll);
  }

  initSmoothScroll() {
    // Handle all internal links
    selectAll('a[href*="#"]').forEach(link => {
      on(link, 'click', (e) => {
        const href = link.getAttribute('href');
        
        // Skip if external link or just #
        if (href === '#' || href.startsWith('#!')) return;
        
        const target = select(href);
        if (target) {
          e.preventDefault();
          scrollTo(target, 0);
        }
      });
    });
  }

  initScrollSpy() {
    if (this.sections.length === 0) return;
    
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    };
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          this.setActiveNavLink(id);
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    this.sections.forEach(section => observer.observe(section));
  }

  updateActiveNavLink() {
    const scrollPosition = scrollTop();
    
    this.sections.forEach(section => {
      const sectionTop = section.offsetTop - 200;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        this.setActiveNavLink(sectionId);
      }
    });
  }

  setActiveNavLink(sectionId) {
    if (!sectionId) return;
    
    this.navLinks.forEach(link => {
      removeClass(link, 'active');
      
      if (link.getAttribute('href') === `#${sectionId}`) {
        addClass(link, 'active');
      }
    });
  }

  initPageVisibility() {
    const favicon = select('#favicon');
    if (!favicon) return;
    
    const originalTitle = document.title;
    const originalFavicon = favicon.getAttribute('href');
    
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        document.title = originalTitle;
        favicon.setAttribute('href', originalFavicon);
      } else {
        document.title = 'Come Back To Portfolio';
        favicon.setAttribute('href', '/assets/images/favhand.png');
      }
    });
  }

  /**
   * Static method to initialize navigation on any page
   */
  static initialize() {
    return new Navigation();
  }
}

// Auto-initialize if module is imported
if (typeof window !== 'undefined') {
  window.Navigation = Navigation;
}