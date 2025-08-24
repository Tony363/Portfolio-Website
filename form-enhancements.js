// Enhanced Form Validation and UX Improvements

// Better form validation with visual feedback
function enhanceFormValidation() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    // Add CSS for validation styles
    const validationStyles = `
        <style>
        .field.error input, .field.error textarea {
            border: 2px solid #ff4757;
            background-color: #fff5f5;
        }
        .field.success input, .field.success textarea {
            border: 2px solid #2ed573;
            background-color: #f0fff4;
        }
        .error-message {
            color: #ff4757;
            font-size: 0.8rem;
            margin-top: 0.25rem;
            display: block;
        }
        .form-status {
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 0.5rem;
            display: none;
        }
        .form-status.success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            display: block;
        }
        .form-status.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            display: block;
        }
        .loading-spinner {
            display: inline-block;
            width: 1rem;
            height: 1rem;
            border: 2px solid #f3f3f3;
            border-top: 2px solid #007bff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 0.5rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        </style>
    `;
    document.head.insertAdjacentHTML('beforeend', validationStyles);

    // Add status message container
    const statusDiv = document.createElement('div');
    statusDiv.className = 'form-status';
    statusDiv.id = 'form-status';
    contactForm.insertBefore(statusDiv, contactForm.firstChild);

    // Enhanced validation functions
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return re.test(email.toLowerCase());
    }

    function validateName(name) {
        return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
    }

    function validateMessage(message) {
        return message.trim().length >= 10;
    }

    function showFieldError(field, message) {
        const fieldContainer = field.closest('.field') || field.closest('.message');
        fieldContainer.classList.add('error');
        fieldContainer.classList.remove('success');
        
        // Remove existing error message
        const existingError = fieldContainer.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Add new error message
        const errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        errorSpan.textContent = message;
        fieldContainer.appendChild(errorSpan);
    }

    function showFieldSuccess(field) {
        const fieldContainer = field.closest('.field') || field.closest('.message');
        fieldContainer.classList.add('success');
        fieldContainer.classList.remove('error');
        
        // Remove error message
        const existingError = fieldContainer.querySelector('.error-message');
        if (existingError) existingError.remove();
    }

    function showFormStatus(message, type = 'success') {
        const statusDiv = document.getElementById('form-status');
        statusDiv.className = `form-status ${type}`;
        statusDiv.textContent = message;
        statusDiv.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        }
    }

    // Real-time validation
    const nameField = contactForm.querySelector('input[name="name"]');
    const emailField = contactForm.querySelector('input[name="email"]');
    const messageField = contactForm.querySelector('textarea[name="message"]');

    if (nameField) {
        nameField.addEventListener('blur', function() {
            if (!validateName(this.value)) {
                showFieldError(this, 'Name must be at least 2 characters and contain only letters');
            } else {
                showFieldSuccess(this);
            }
        });
    }

    if (emailField) {
        emailField.addEventListener('blur', function() {
            if (!validateEmail(this.value)) {
                showFieldError(this, 'Please enter a valid email address');
            } else {
                showFieldSuccess(this);
            }
        });
    }

    if (messageField) {
        messageField.addEventListener('blur', function() {
            if (!validateMessage(this.value)) {
                showFieldError(this, 'Message must be at least 10 characters long');
            } else {
                showFieldSuccess(this);
            }
        });
    }

    // Enhanced form submission
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Hide previous status
        document.getElementById('form-status').style.display = 'none';
        
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        let isValid = true;

        // Validate all fields
        if (!name || !validateName(name)) {
            showFieldError(nameField, 'Name must be at least 2 characters and contain only letters');
            isValid = false;
        } else {
            showFieldSuccess(nameField);
        }

        if (!email || !validateEmail(email)) {
            showFieldError(emailField, 'Please enter a valid email address');
            isValid = false;
        } else {
            showFieldSuccess(emailField);
        }

        if (!message || !validateMessage(message)) {
            showFieldError(messageField, 'Message must be at least 10 characters long');
            isValid = false;
        } else {
            showFieldSuccess(messageField);
        }

        if (!isValid) {
            showFormStatus('Please correct the errors above', 'error');
            return;
        }

        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span>Sending...';

        // Simulate form submission (replace with actual EmailJS call)
        setTimeout(() => {
            // Reset form
            this.reset();
            document.querySelectorAll('.field').forEach(field => {
                field.classList.remove('success', 'error');
            });
            document.querySelectorAll('.message').forEach(field => {
                field.classList.remove('success', 'error');
            });
            
            showFormStatus('Thank you for your message! I will get back to you soon.', 'success');
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 2000);
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceFormValidation);
} else {
    enhanceFormValidation();
}