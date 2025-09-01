// Performance Enhancements Module
// Optimizes website performance through various techniques

(function() {
    'use strict';

    // Lazy Loading for Images
    function setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                            img.removeAttribute('data-srcset');
                        }
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
            document.querySelectorAll('img[data-srcset]').forEach(img => {
                img.srcset = img.dataset.srcset;
                img.removeAttribute('data-srcset');
            });
        }
    }

    // Debounce utility for scroll and resize events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Optimize scroll performance
    function optimizeScrollPerformance() {
        let ticking = false;
        
        function updateScrollPosition() {
            // Add your scroll-based updates here
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                window.requestAnimationFrame(updateScrollPosition);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Preload critical resources
    function preloadCriticalResources() {
        const criticalResources = [
            { href: '/assets/css/main.css', as: 'style' },
            { href: '/assets/js/script.js', as: 'script' },
            { href: '/assets/images/resume_photo.jpeg', as: 'image' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.as === 'font') {
                link.crossOrigin = 'anonymous';
            }
            document.head.appendChild(link);
        });
    }

    // Enable resource hints for external domains
    function setupResourceHints() {
        const externalDomains = [
            'https://fonts.googleapis.com',
            'https://cdnjs.cloudflare.com',
            'https://kit.fontawesome.com'
        ];

        externalDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
            
            const preconnect = document.createElement('link');
            preconnect.rel = 'preconnect';
            preconnect.href = domain;
            preconnect.crossOrigin = 'anonymous';
            document.head.appendChild(preconnect);
        });
    }

    // Initialize performance enhancements
    function init() {
        // Run immediately
        setupResourceHints();
        
        // Run when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setupLazyLoading();
                preloadCriticalResources();
                optimizeScrollPerformance();
            });
        } else {
            setupLazyLoading();
            preloadCriticalResources();
            optimizeScrollPerformance();
        }
    }

    // Start initialization
    init();

    // Export for use in other modules if needed
    window.PerformanceEnhancements = {
        setupLazyLoading,
        debounce,
        optimizeScrollPerformance
    };

})();