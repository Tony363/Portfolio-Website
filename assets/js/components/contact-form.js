/**
 * Contact Form Component
 * Handles form validation and submission via EmailJS
 */

import { select, on, addClass, removeClass, hasClass } from '../utils/dom.js';
import { sendEmail } from '../utils/api.js';

export class ContactForm {
  constructor(formElement) {
    this.form = formElement;
    this.submitBtn = select('.btn', this.form);
    this.isSubmitting = false;
    
    // EmailJS configuration
    this.config = {
      serviceId: 'service_jw74m1h',
      templateId: 'template_55ieasq',
      publicKey: 'oHOQD3UqCH-Iqej_S'
    };
    
    this.init();
  }

  init() {
    if (!this.form) return;
    
    // Initialize EmailJS
    this.initEmailJS();
    
    // Add form validation
    this.addValidation();
    
    // Handle form submission
    on(this.form, 'submit', (e) => this.handleSubmit(e));
    
    // Real-time validation
    this.initRealTimeValidation();
  }

  initEmailJS() {
    if (window.emailjs) {
      emailjs.init(this.config.publicKey);
    } else {
      console.warn('EmailJS not loaded');
    }
  }

  addValidation() {
    // Add required attributes if not present
    const requiredFields = ['name', 'email', 'message'];
    
    requiredFields.forEach(fieldName => {
      const field = select(`[name="${fieldName}"]`, this.form);
      if (field && !field.hasAttribute('required')) {
        field.setAttribute('required', 'required');
      }
    });
  }

  initRealTimeValidation() {
    const fields = this.form.querySelectorAll('input, textarea');
    
    fields.forEach(field => {
      // Validate on blur
      on(field, 'blur', () => this.validateField(field));
      
      // Clear error on input
      on(field, 'input', () => {
        if (hasClass(field, 'error')) {
          this.clearFieldError(field);
        }
      });
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name;
    
    // Clear previous error
    this.clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
      this.showFieldError(field, `${this.capitalizeFirst(name)} is required`);
      return false;
    }
    
    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showFieldError(field, 'Please enter a valid email address');
        return false;
      }
    }
    
    // Phone validation (if exists)
    if (type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value)) {
        this.showFieldError(field, 'Please enter a valid phone number');
        return false;
      }
    }
    
    // Message minimum length
    if (name === 'message' && value && value.length < 10) {
      this.showFieldError(field, 'Message must be at least 10 characters');
      return false;
    }
    
    return true;
  }

  showFieldError(field, message) {
    addClass(field, 'error');
    
    // Create or update error message
    let errorEl = field.nextElementSibling;
    if (!errorEl || !hasClass(errorEl, 'error-message')) {
      errorEl = document.createElement('span');
      errorEl.className = 'error-message';
      field.parentNode.insertBefore(errorEl, field.nextSibling);
    }
    
    errorEl.textContent = message;
    addClass(errorEl, 'show');
  }

  clearFieldError(field) {
    removeClass(field, 'error');
    
    const errorEl = field.nextElementSibling;
    if (errorEl && hasClass(errorEl, 'error-message')) {
      removeClass(errorEl, 'show');
      setTimeout(() => errorEl.remove(), 300);
    }
  }

  validateForm() {
    const fields = this.form.querySelectorAll('input, textarea');
    let isValid = true;
    
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    // Prevent double submission
    if (this.isSubmitting) return;
    
    // Validate form
    if (!this.validateForm()) {
      this.showNotification('Please fix the errors before submitting', 'error');
      return;
    }
    
    // Check EmailJS availability
    if (!window.emailjs) {
      this.showNotification('Email service is not available. Please try again later.', 'error');
      return;
    }
    
    this.isSubmitting = true;
    this.setSubmitButtonState('sending');
    
    // Collect form data
    const formData = this.collectFormData();
    
    try {
      // Send email
      const result = await sendEmail(formData, this.config);
      
      if (result.success) {
        this.showNotification('Message sent successfully!', 'success');
        this.form.reset();
        this.setSubmitButtonState('success');
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showNotification('Failed to send message. Please try again.', 'error');
      this.setSubmitButtonState('error');
    } finally {
      this.isSubmitting = false;
      
      // Reset button state after delay
      setTimeout(() => {
        this.setSubmitButtonState('default');
      }, 3000);
    }
  }

  collectFormData() {
    const formData = {};
    const fields = this.form.querySelectorAll('input, textarea');
    
    fields.forEach(field => {
      const name = field.name;
      const value = field.value.trim();
      
      if (name && value) {
        formData[name] = value;
      }
    });
    
    // Add metadata
    formData.timestamp = new Date().toISOString();
    formData.source = window.location.href;
    
    return formData;
  }

  setSubmitButtonState(state) {
    if (!this.submitBtn) return;
    
    const states = {
      default: {
        text: 'Send Message',
        disabled: false,
        class: ''
      },
      sending: {
        text: 'Sending...',
        disabled: true,
        class: 'sending'
      },
      success: {
        text: 'Message Sent!',
        disabled: true,
        class: 'success'
      },
      error: {
        text: 'Send Failed',
        disabled: false,
        class: 'error'
      }
    };
    
    const currentState = states[state] || states.default;
    
    this.submitBtn.textContent = currentState.text;
    this.submitBtn.disabled = currentState.disabled;
    
    // Remove all state classes
    Object.values(states).forEach(s => removeClass(this.submitBtn, s.class));
    
    // Add current state class
    if (currentState.class) {
      addClass(this.submitBtn, currentState.class);
    }
  }

  showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = select('.form-notification');
    if (existing) existing.remove();
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.textContent = message;
    
    // Insert after form
    this.form.parentNode.insertBefore(notification, this.form.nextSibling);
    
    // Add show class after a tick for animation
    setTimeout(() => addClass(notification, 'show'), 10);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeClass(notification, 'show');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Export for use in other modules
export default ContactForm;