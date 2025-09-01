/**
 * Main JavaScript Module
 * Entry point that coordinates all functionality
 */

// Import utilities
import { ready, select, selectAll, on } from './utils/dom.js';
import { loadProjects, loadExperience, loadSkills, loadPartial, escapeHtml } from './utils/api.js';

// Import components
import { Navigation } from './components/navigation.js';
import { ContactForm } from './components/contact-form.js';
import { SkillsGrid } from './components/skills-grid.js';
import { ExperienceTimeline } from './components/experience-timeline.js';
import { ProjectGallery } from './components/project-gallery.js';
import { initAnimations } from './components/animations.js';

// Import third-party integrations
import { ChatWidget } from './services/chat.js';
import { Analytics } from './services/analytics.js';

/**
 * Main application class
 */
class PortfolioApp {
  constructor() {
    this.currentPage = this.detectCurrentPage();
    this.components = new Map();
  }

  /**
   * Initialize application
   */
  async init() {
    try {
      // Load critical components first
      await this.loadPartials();
      
      // Initialize navigation (common to all pages)
      this.components.set('navigation', Navigation.initialize());
      
      // Initialize page-specific components
      await this.initPageComponents();
      
      // Initialize third-party services
      this.initServices();
      
      // Initialize animations
      this.initAnimations();
      
      // Hide preloader
      this.hidePreloader();
      
    } catch (error) {
      console.error('Application initialization failed:', error);
    }
  }

  /**
   * Detect current page based on URL
   */
  detectCurrentPage() {
    const path = window.location.pathname;
    
    if (path.includes('/projects')) return 'projects';
    if (path.includes('/experience')) return 'experience';
    if (path.includes('/404')) return '404';
    
    return 'home';
  }

  /**
   * Load header and footer partials
   */
  async loadPartials() {
    const [header, footer] = await Promise.all([
      loadPartial('/partials/header.html'),
      loadPartial('/partials/footer.html')
    ]);
    
    const headerContainer = select('#header-placeholder');
    const footerContainer = select('#footer-placeholder');
    
    if (headerContainer) headerContainer.innerHTML = header;
    if (footerContainer) footerContainer.innerHTML = footer;
  }

  /**
   * Initialize page-specific components
   */
  async initPageComponents() {
    switch (this.currentPage) {
      case 'home':
        await this.initHomePage();
        break;
      
      case 'projects':
        await this.initProjectsPage();
        break;
      
      case 'experience':
        await this.initExperiencePage();
        break;
      
      case '404':
        this.init404Page();
        break;
    }
  }

  /**
   * Initialize home page components
   */
  async initHomePage() {
    // Initialize contact form
    const contactForm = select('#contact-form');
    if (contactForm) {
      this.components.set('contactForm', new ContactForm(contactForm));
    }
    
    // Load and display skills
    const skillsContainer = select('.skills-container');
    if (skillsContainer) {
      const skills = await loadSkills();
      this.components.set('skills', new SkillsGrid(skillsContainer, skills));
    }
    
    // Load and display experience timeline
    const experienceContainer = select('.experience .timeline');
    if (experienceContainer) {
      const experience = await loadExperience();
      this.components.set('experience', new ExperienceTimeline(experienceContainer, experience));
    }
    
    // Load and display featured projects
    const projectsContainer = select('.work .box-container');
    if (projectsContainer) {
      const projects = await loadProjects();
      this.components.set('projects', new ProjectGallery(projectsContainer, projects.slice(0, 10)));
    }
    
    // Initialize typing animation
    this.initTypingAnimation();
    
    // Initialize particles
    this.initParticles();
  }

  /**
   * Initialize projects page
   */
  async initProjectsPage() {
    const container = select('.work .box-container');
    if (container) {
      const projects = await loadProjects();
      this.components.set('projectGallery', new ProjectGallery(container, projects, {
        enableFiltering: true,
        enableSearch: true
      }));
    }
  }

  /**
   * Initialize experience page
   */
  async initExperiencePage() {
    const container = select('.experience .timeline');
    if (container) {
      const experience = await loadExperience();
      this.components.set('experienceTimeline', new ExperienceTimeline(container, experience, {
        detailed: true
      }));
    }
  }

  /**
   * Initialize 404 page
   */
  init404Page() {
    // Animated text effect
    const errorText = select('.error-text');
    if (errorText) {
      let index = 0;
      const messages = [
        'Oops! Page not found',
        'The page you seek does not exist',
        'Error 404: Lost in space',
        'This page has moved or been deleted'
      ];
      
      setInterval(() => {
        errorText.textContent = messages[index];
        index = (index + 1) % messages.length;
      }, 3000);
    }
  }

  /**
   * Initialize typing animation
   */
  initTypingAnimation() {
    const typedElement = select('.typing-text');
    if (typedElement && window.Typed) {
      new Typed(typedElement, {
        strings: [
          'AI Engineer',
          'Generative AI Specialist',
          'Computer Vision Expert',
          'NLP Engineer',
          'Data Engineer',
          'Full Stack Developer'
        ],
        loop: true,
        typeSpeed: 50,
        backSpeed: 25,
        backDelay: 1000
      });
    }
  }

  /**
   * Initialize particles background
   */
  initParticles() {
    const particlesContainer = select('#particles-js');
    if (particlesContainer && window.particlesJS) {
      particlesJS('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: '#6366f1' },
          shape: { type: 'circle' },
          opacity: { value: 0.5, random: false },
          size: { value: 3, random: true },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#6366f1',
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
          }
        },
        retina_detect: true
      });
    }
  }

  /**
   * Initialize third-party services
   */
  initServices() {
    // Initialize chat widget
    this.components.set('chat', new ChatWidget());
    
    // Initialize analytics
    this.components.set('analytics', new Analytics());
  }

  /**
   * Initialize animations
   */
  initAnimations() {
    initAnimations();
  }

  /**
   * Hide preloader
   */
  hidePreloader() {
    const loader = select('.loader-container');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => {
          loader.style.display = 'none';
        }, 500);
      }, 1000);
    }
  }

  /**
   * Get component by name
   */
  getComponent(name) {
    return this.components.get(name);
  }
}

// Initialize application when DOM is ready
ready(() => {
  window.portfolioApp = new PortfolioApp();
  window.portfolioApp.init();
});

// Export for use in other modules
export default PortfolioApp;