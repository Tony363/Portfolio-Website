/**
 * DOM Utility Module
 * Shared DOM manipulation functions
 */

export const DOMUtils = {
  /**
   * Wait for DOM to be ready
   */
  ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  },

  /**
   * Query selector with null check
   */
  select(selector, parent = document) {
    return parent.querySelector(selector);
  },

  /**
   * Query selector all with array conversion
   */
  selectAll(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  },

  /**
   * Add event listener with optional delegation
   */
  on(element, event, selectorOrHandler, handler) {
    if (typeof selectorOrHandler === 'function') {
      // Direct event binding
      element.addEventListener(event, selectorOrHandler);
    } else {
      // Event delegation
      element.addEventListener(event, (e) => {
        const target = e.target.closest(selectorOrHandler);
        if (target) {
          handler.call(target, e);
        }
      });
    }
  },

  /**
   * Toggle class on element
   */
  toggleClass(element, className) {
    if (element) {
      element.classList.toggle(className);
    }
  },

  /**
   * Add class to element
   */
  addClass(element, className) {
    if (element) {
      element.classList.add(className);
    }
  },

  /**
   * Remove class from element
   */
  removeClass(element, className) {
    if (element) {
      element.classList.remove(className);
    }
  },

  /**
   * Check if element has class
   */
  hasClass(element, className) {
    return element ? element.classList.contains(className) : false;
  },

  /**
   * Get or set attribute
   */
  attr(element, name, value) {
    if (!element) return null;
    if (value === undefined) {
      return element.getAttribute(name);
    }
    element.setAttribute(name, value);
    return element;
  },

  /**
   * Create element with properties
   */
  createElement(tag, props = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(props).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'textContent') {
        element.textContent = value;
      } else if (key === 'innerHTML') {
        element.innerHTML = value;
      } else if (key.startsWith('on')) {
        const event = key.slice(2).toLowerCase();
        element.addEventListener(event, value);
      } else {
        element.setAttribute(key, value);
      }
    });
    
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof Element) {
        element.appendChild(child);
      }
    });
    
    return element;
  },

  /**
   * Show element
   */
  show(element) {
    if (element) {
      element.style.display = '';
    }
  },

  /**
   * Hide element
   */
  hide(element) {
    if (element) {
      element.style.display = 'none';
    }
  },

  /**
   * Get element offset
   */
  offset(element) {
    if (!element) return { top: 0, left: 0 };
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset
    };
  },

  /**
   * Get element height
   */
  height(element) {
    return element ? element.offsetHeight : 0;
  },

  /**
   * Get element width
   */
  width(element) {
    return element ? element.offsetWidth : 0;
  },

  /**
   * Smooth scroll to element
   */
  scrollTo(target, offset = 0) {
    if (typeof target === 'string') {
      target = document.querySelector(target);
    }
    
    if (target) {
      const top = this.offset(target).top - offset;
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    }
  },

  /**
   * Get scroll position
   */
  scrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop;
  },

  /**
   * Debounce function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Throttle function
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Export individual functions for convenient imports
export const {
  ready,
  select,
  selectAll,
  on,
  toggleClass,
  addClass,
  removeClass,
  hasClass,
  attr,
  createElement,
  show,
  hide,
  offset,
  height,
  width,
  scrollTo,
  scrollTop,
  debounce,
  throttle
} = DOMUtils;