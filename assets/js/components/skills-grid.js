/**
 * Skills Grid Component
 * Displays skills in a responsive grid layout
 */

import { createElement, addClass } from '../utils/dom.js';
import { escapeHtml } from '../utils/api.js';

export class SkillsGrid {
  constructor(container, skills = []) {
    this.container = container;
    this.skills = skills;
    this.categories = this.categorizeSkills(skills);
    
    this.init();
  }

  init() {
    if (!this.container) return;
    
    this.render();
    this.initAnimations();
  }

  categorizeSkills(skills) {
    const categories = {
      'Languages': [],
      'AI/ML': [],
      'Web Development': [],
      'Databases': [],
      'Cloud & DevOps': [],
      'Tools': []
    };
    
    skills.forEach(skill => {
      const name = skill.name.toLowerCase();
      
      if (['python', 'javascript', 'typescript', 'java', 'c++', 'c', 'php'].some(lang => name.includes(lang))) {
        categories['Languages'].push(skill);
      } else if (['tensorflow', 'pytorch', 'keras', 'opencv', 'numpy', 'pandas', 'scikit', 'ml', 'ai'].some(tech => name.includes(tech))) {
        categories['AI/ML'].push(skill);
      } else if (['react', 'node', 'express', 'django', 'flask', 'fastapi', 'html', 'css', 'bootstrap', 'tailwind'].some(tech => name.includes(tech))) {
        categories['Web Development'].push(skill);
      } else if (['mysql', 'postgresql', 'mongodb', 'redis', 'sql'].some(db => name.includes(db))) {
        categories['Databases'].push(skill);
      } else if (['aws', 'gcp', 'docker', 'kubernetes', 'jenkins', 'heroku', 'git'].some(tool => name.includes(tool))) {
        categories['Cloud & DevOps'].push(skill);
      } else {
        categories['Tools'].push(skill);
      }
    });
    
    // Remove empty categories
    Object.keys(categories).forEach(key => {
      if (categories[key].length === 0) {
        delete categories[key];
      }
    });
    
    return categories;
  }

  render() {
    this.container.innerHTML = '';
    
    // Render by category
    Object.entries(this.categories).forEach(([category, skills]) => {
      if (skills.length === 0) return;
      
      const categorySection = createElement('div', {
        className: 'skills-category'
      });
      
      const categoryTitle = createElement('h3', {
        className: 'category-title',
        textContent: category
      });
      
      const skillsGrid = createElement('div', {
        className: 'skills-items'
      });
      
      skills.forEach(skill => {
        const skillElement = this.createSkillElement(skill);
        skillsGrid.appendChild(skillElement);
      });
      
      categorySection.appendChild(categoryTitle);
      categorySection.appendChild(skillsGrid);
      this.container.appendChild(categorySection);
    });
  }

  createSkillElement(skill) {
    const skillDiv = createElement('div', {
      className: 'skill-item'
    });
    
    // Create picture element for icon with WebP support
    const picture = createElement('picture');
    
    // Check if icon is a local image
    const isLocalImage = skill.icon && !skill.icon.startsWith('http');
    
    if (isLocalImage) {
      // Local image - add WebP source
      const iconName = skill.icon.replace(/\.(png|jpg|jpeg)$/i, '');
      
      const sourceWebP = createElement('source', {
        type: 'image/webp',
        srcset: `/assets/images/skills/${iconName}.webp`
      });
      
      picture.appendChild(sourceWebP);
    }
    
    // Fallback image
    const img = createElement('img', {
      src: skill.icon || '/assets/images/default-skill.png',
      alt: escapeHtml(skill.name),
      loading: 'lazy',
      onerror: function() {
        this.src = '/assets/images/default-skill.webp';
        if (this.src.includes('default-skill.webp')) {
          this.src = '/assets/images/default-skill.png';
        }
      }
    });
    
    picture.appendChild(img);
    
    const nameSpan = createElement('span', {
      className: 'skill-name',
      textContent: skill.name
    });
    
    // Add proficiency indicator if available
    if (skill.proficiency) {
      const proficiencyDiv = createElement('div', {
        className: 'skill-proficiency'
      });
      
      const progressBar = createElement('div', {
        className: 'progress-bar'
      });
      
      const progressFill = createElement('div', {
        className: 'progress-fill',
        style: `width: ${skill.proficiency}%`
      });
      
      progressBar.appendChild(progressFill);
      proficiencyDiv.appendChild(progressBar);
      
      skillDiv.appendChild(picture);
      skillDiv.appendChild(nameSpan);
      skillDiv.appendChild(proficiencyDiv);
    } else {
      skillDiv.appendChild(picture);
      skillDiv.appendChild(nameSpan);
    }
    
    // Add hover effect data
    skillDiv.setAttribute('data-skill', escapeHtml(skill.name));
    
    return skillDiv;
  }

  initAnimations() {
    // Add stagger animation on scroll
    if (window.ScrollReveal) {
      ScrollReveal().reveal('.skill-item', {
        delay: 100,
        distance: '20px',
        duration: 500,
        easing: 'ease-in-out',
        interval: 50,
        opacity: 0,
        origin: 'bottom',
        scale: 0.9
      });
    }
    
    // Add hover tilt effect
    const skillItems = this.container.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
      item.addEventListener('mouseenter', (e) => {
        addClass(e.currentTarget, 'hover');
      });
      
      item.addEventListener('mouseleave', (e) => {
        removeClass(e.currentTarget, 'hover');
      });
    });
  }

  /**
   * Filter skills by search term
   */
  filterSkills(searchTerm) {
    const term = searchTerm.toLowerCase();
    const skillItems = this.container.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
      const skillName = item.getAttribute('data-skill').toLowerCase();
      
      if (skillName.includes(term)) {
        item.style.display = '';
        addClass(item, 'visible');
      } else {
        item.style.display = 'none';
        removeClass(item, 'visible');
      }
    });
  }

  /**
   * Sort skills alphabetically
   */
  sortSkills(order = 'asc') {
    this.skills.sort((a, b) => {
      if (order === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    
    this.categories = this.categorizeSkills(this.skills);
    this.render();
    this.initAnimations();
  }

  /**
   * Add a new skill
   */
  addSkill(skill) {
    this.skills.push(skill);
    this.categories = this.categorizeSkills(this.skills);
    this.render();
    this.initAnimations();
  }

  /**
   * Remove a skill
   */
  removeSkill(skillName) {
    this.skills = this.skills.filter(s => s.name !== skillName);
    this.categories = this.categorizeSkills(this.skills);
    this.render();
    this.initAnimations();
  }
}

// Export for use in other modules
export default SkillsGrid;