/**
 * API Utility Module
 * Shared data fetching and API communication functions
 */

export class APIUtils {
  /**
   * Fetch JSON data with error handling
   */
  static async fetchJSON(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Load projects data
   */
  static async loadProjects() {
    const result = await this.fetchJSON('/projects/projects.json');
    
    if (result.success) {
      return result.data;
    }
    
    // Return default data on error
    return [];
  }

  /**
   * Load experience data
   */
  static async loadExperience() {
    const result = await this.fetchJSON('/assets/data/experience.json');
    
    if (result.success) {
      return result.data;
    }
    
    return [];
  }

  /**
   * Load skills data
   */
  static async loadSkills() {
    const result = await this.fetchJSON('/skills.json');
    
    if (result.success) {
      return result.data;
    }
    
    return [];
  }

  /**
   * Load partial HTML content
   */
  static async loadPartial(url) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.text();
    } catch (error) {
      console.error(`Error loading partial ${url}:`, error);
      return '';
    }
  }

  /**
   * Send form data via EmailJS
   */
  static async sendEmail(formData, config) {
    try {
      if (!window.emailjs) {
        throw new Error('EmailJS not loaded');
      }
      
      const response = await emailjs.send(
        config.serviceId,
        config.templateId,
        formData,
        config.publicKey
      );
      
      return { success: true, response };
    } catch (error) {
      console.error('Email send failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  static escapeHtml(text) {
    if (!text) return '';
    
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    
    return text.toString().replace(/[&<>"']/g, m => map[m]);
  }

  /**
   * Debounced search function
   */
  static createSearch(searchFn, delay = 300) {
    let timeoutId;
    
    return function(...args) {
      clearTimeout(timeoutId);
      
      return new Promise((resolve) => {
        timeoutId = setTimeout(async () => {
          const result = await searchFn.apply(this, args);
          resolve(result);
        }, delay);
      });
    };
  }

  /**
   * Retry failed requests
   */
  static async retry(fn, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;
        
        console.log(`Retry ${i + 1}/${retries} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }

  /**
   * Cache API responses
   */
  static cache = new Map();
  
  static async cachedFetch(url, ttl = 300000) { // 5 minutes default TTL
    const cached = this.cache.get(url);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data;
    }
    
    const data = await this.fetchJSON(url);
    
    if (data.success) {
      this.cache.set(url, {
        data: data.data,
        timestamp: Date.now()
      });
      return data.data;
    }
    
    return null;
  }

  /**
   * Clear cache
   */
  static clearCache(url = null) {
    if (url) {
      this.cache.delete(url);
    } else {
      this.cache.clear();
    }
  }
}

// Export convenience functions
export const {
  fetchJSON,
  loadProjects,
  loadExperience,
  loadSkills,
  loadPartial,
  sendEmail,
  escapeHtml,
  createSearch,
  retry,
  cachedFetch,
  clearCache
} = APIUtils;