// Performance and Accessibility Enhancement Script

// Lazy loading for images
function implementImageLazyLoading() {
    const images = document.querySelectorAll('img[src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            if (!img.complete) {
                imageObserver.observe(img);
            }
        });
    }
}

// Preload critical resources
function preloadCriticalResources() {
    const criticalResources = [
        '/assets/css/style.css',
        '/assets/js/particles.min.js',
        '/skills.json',
        '/assets/data/experience.json'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = resource.endsWith('.css') ? 'style' : 
                  resource.endsWith('.js') ? 'script' : 'fetch';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Optimize external script loading
function optimizeScriptLoading() {
    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach(script => {
        if (!script.async && !script.defer) {
            script.defer = true;
        }
    });
}

// Add service worker for caching
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered:', registration);
            })
            .catch(error => {
                console.log('SW registration failed:', error);
            });
    }
}

// Optimize animations for reduced motion preference
function respectReducedMotionPreference() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Disable or reduce animations
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize all optimizations
function initializeOptimizations() {
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            implementImageLazyLoading();
            preloadCriticalResources();
            optimizeScriptLoading();
            respectReducedMotionPreference();
        });
    } else {
        implementImageLazyLoading();
        preloadCriticalResources();
        optimizeScriptLoading();
        respectReducedMotionPreference();
    }
    
    // Register service worker after page load
    window.addEventListener('load', registerServiceWorker);
}

// Auto-initialize
initializeOptimizations();