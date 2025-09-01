// Form Enhancements Module
// Improves form functionality, validation, and user experience

(function() {
    'use strict';

    // Form validation patterns
    const validationPatterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[\d\s\-\+\(\)]+$/,
        name: /^[a-zA-Z\s]{2,50}$/
    };

    // Validation messages
    const validationMessages = {
        email: 'Please enter a valid email address',
        phone: 'Please enter a valid phone number',
        name: 'Name must be 2-50 characters, letters only',
        required: 'This field is required',
        message: 'Message must be at least 10 characters'
    };

    // Add validation to form fields
    function setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Add novalidate to handle validation with JavaScript
            form.setAttribute('novalidate', '');
            
            // Real-time validation on input
            form.addEventListener('input', (e) => {
                if (e.target.matches('input, textarea')) {
                    validateField(e.target);
                }
            });
            
            // Validation on blur
            form.addEventListener('blur', (e) => {
                if (e.target.matches('input, textarea')) {
                    validateField(e.target);
                }
            }, true);
            
            // Form submission handling
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (validateForm(form)) {
                    handleFormSubmission(form);
                } else {
                    showFormError(form, 'Please fix the errors before submitting');
                }
            });
        });
    }

    // Validate individual field
    function validateField(field) {
        const fieldName = field.name || field.id || field.type;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        clearFieldError(field);

        // Check if required
        if (field.hasAttribute('required') && !value) {
            errorMessage = validationMessages.required;
            isValid = false;
        }
        // Email validation
        else if (field.type === 'email' && value) {
            if (!validationPatterns.email.test(value)) {
                errorMessage = validationMessages.email;
                isValid = false;
            }
        }
        // Phone validation
        else if (field.type === 'tel' && value) {
            if (!validationPatterns.phone.test(value)) {
                errorMessage = validationMessages.phone;
                isValid = false;
            }
        }
        // Name validation
        else if (fieldName.toLowerCase().includes('name') && value) {
            if (!validationPatterns.name.test(value)) {
                errorMessage = validationMessages.name;
                isValid = false;
            }
        }
        // Message validation (minimum length)
        else if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
            errorMessage = validationMessages.message;
            isValid = false;
        }

        if (!isValid) {
            showFieldError(field, errorMessage);
        } else {
            field.classList.add('valid');
        }

        return isValid;
    }

    // Validate entire form
    function validateForm(form) {
        const fields = form.querySelectorAll('input, textarea, select');
        let isValid = true;

        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Show field error
    function showFieldError(field, message) {
        field.classList.add('error');
        field.classList.remove('valid');
        
        // Create or update error message
        let errorElement = field.parentElement.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            field.parentElement.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.color = '#ef4444';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.style.display = 'block';
    }

    // Clear field error
    function clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Show form-level error
    function showFormError(form, message) {
        let errorContainer = form.querySelector('.form-error');
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.className = 'form-error';
            errorContainer.style.color = '#ef4444';
            errorContainer.style.padding = '0.75rem';
            errorContainer.style.marginBottom = '1rem';
            errorContainer.style.backgroundColor = '#fef2f2';
            errorContainer.style.borderRadius = '0.375rem';
            errorContainer.style.border = '1px solid #fecaca';
            form.insertBefore(errorContainer, form.firstChild);
        }
        errorContainer.textContent = message;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorContainer.remove();
        }, 5000);
    }

    // Show form success message
    function showFormSuccess(form, message) {
        let successContainer = form.querySelector('.form-success');
        if (!successContainer) {
            successContainer = document.createElement('div');
            successContainer.className = 'form-success';
            successContainer.style.color = '#059669';
            successContainer.style.padding = '0.75rem';
            successContainer.style.marginBottom = '1rem';
            successContainer.style.backgroundColor = '#f0fdf4';
            successContainer.style.borderRadius = '0.375rem';
            successContainer.style.border = '1px solid #86efac';
            form.insertBefore(successContainer, form.firstChild);
        }
        successContainer.textContent = message;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            successContainer.remove();
        }, 5000);
    }

    // Handle form submission
    function handleFormSubmission(form) {
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        const originalText = submitButton ? submitButton.textContent : 'Submit';
        
        // Disable submit button and show loading state
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }

        // Collect form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Simulate form submission (replace with actual submission logic)
        setTimeout(() => {
            // Reset form
            form.reset();
            
            // Show success message
            showFormSuccess(form, 'Your message has been sent successfully!');
            
            // Re-enable submit button
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
            
            // Clear all validation states
            form.querySelectorAll('.valid, .error').forEach(field => {
                field.classList.remove('valid', 'error');
            });
        }, 1500);
    }

    // Add input formatting
    function setupInputFormatting() {
        // Phone number formatting
        document.querySelectorAll('input[type="tel"]').forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.length <= 3) {
                        value = value;
                    } else if (value.length <= 6) {
                        value = value.slice(0, 3) + '-' + value.slice(3);
                    } else {
                        value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
                    }
                }
                e.target.value = value;
            });
        });
    }

    // Add character counter for textareas
    function setupCharacterCounter() {
        document.querySelectorAll('textarea').forEach(textarea => {
            const maxLength = textarea.getAttribute('maxlength') || 500;
            
            // Create counter element
            const counter = document.createElement('div');
            counter.className = 'character-counter';
            counter.style.fontSize = '0.875rem';
            counter.style.color = '#6b7280';
            counter.style.textAlign = 'right';
            counter.style.marginTop = '0.25rem';
            counter.textContent = `0 / ${maxLength}`;
            
            textarea.parentElement.appendChild(counter);
            
            // Update counter on input
            textarea.addEventListener('input', () => {
                const length = textarea.value.length;
                counter.textContent = `${length} / ${maxLength}`;
                
                if (length > maxLength * 0.9) {
                    counter.style.color = '#ef4444';
                } else if (length > maxLength * 0.7) {
                    counter.style.color = '#f59e0b';
                } else {
                    counter.style.color = '#6b7280';
                }
            });
        });
    }

    // Initialize form enhancements
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setupFormValidation();
                setupInputFormatting();
                setupCharacterCounter();
            });
        } else {
            setupFormValidation();
            setupInputFormatting();
            setupCharacterCounter();
        }
    }

    // Start initialization
    init();

    // Export for use in other modules if needed
    window.FormEnhancements = {
        validateForm,
        validateField,
        showFormSuccess,
        showFormError
    };

})();