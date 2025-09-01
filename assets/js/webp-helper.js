/**
 * WebP Helper Module
 * Provides WebP support detection and image loading with fallbacks
 */

class WebPHelper {
  constructor() {
    this.webpSupport = null;
    this.checkWebPSupport();
  }

  /**
   * Check if browser supports WebP format
   */
  async checkWebPSupport() {
    if (this.webpSupport !== null) {
      return this.webpSupport;
    }

    const webP = new Image();
    webP.onload = webP.onerror = () => {
      this.webpSupport = webP.height === 2;
      if (this.webpSupport) {
        document.documentElement.classList.add('webp');
      } else {
        document.documentElement.classList.add('no-webp');
      }
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    
    return this.webpSupport;
  }

  /**
   * Load image with WebP support and fallback
   */
  loadImage(element, webpSrc, fallbackSrc) {
    if (!element) return;

    // Create picture element for proper fallback
    const picture = document.createElement('picture');
    
    // WebP source
    const sourceWebP = document.createElement('source');
    sourceWebP.srcset = webpSrc;
    sourceWebP.type = 'image/webp';
    
    // Fallback image
    const img = document.createElement('img');
    img.src = fallbackSrc;
    img.alt = element.alt || '';
    img.loading = 'lazy';
    
    // Copy classes and attributes
    if (element.className) img.className = element.className;
    if (element.id) img.id = element.id;
    
    // Build picture element
    picture.appendChild(sourceWebP);
    picture.appendChild(img);
    
    // Replace original element
    element.parentNode.replaceChild(picture, element);
  }

  /**
   * Convert all images on page to use WebP with fallback
   */
  convertAllImages() {
    const images = document.querySelectorAll('img[data-webp]');
    
    images.forEach(img => {
      const webpSrc = img.dataset.webp;
      const fallbackSrc = img.src;
      
      if (webpSrc) {
        this.loadImage(img, webpSrc, fallbackSrc);
      }
    });
  }

  /**
   * Lazy load images with Intersection Observer
   */
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Load the image
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            
            // Load srcset if available
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
            
            // Stop observing this image
            observer.unobserve(img);
            
            // Add loaded class for animations
            img.classList.add('loaded');
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Observe all lazy images
      const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
      lazyImages.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without Intersection Observer
      const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
      lazyImages.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
      });
    }
  }

  /**
   * Create responsive image with WebP support
   */
  createResponsiveImage(imagePath, alt = '', sizes = '100vw') {
    const picture = document.createElement('picture');
    const name = imagePath.substring(0, imagePath.lastIndexOf('.'));
    const ext = imagePath.substring(imagePath.lastIndexOf('.'));
    
    // WebP sources for different sizes
    const webpSource = document.createElement('source');
    webpSource.type = 'image/webp';
    webpSource.sizes = sizes;
    webpSource.srcset = `
      ${name}-400w.webp 400w,
      ${name}-800w.webp 800w,
      ${name}-1200w.webp 1200w,
      ${name}.webp 1920w
    `;
    
    // Original format sources
    const originalSource = document.createElement('source');
    originalSource.type = `image/${ext.substring(1)}`;
    originalSource.sizes = sizes;
    originalSource.srcset = `
      ${name}-400w${ext} 400w,
      ${name}-800w${ext} 800w,
      ${name}-1200w${ext} 1200w,
      ${name}${ext} 1920w
    `;
    
    // Fallback image
    const img = document.createElement('img');
    img.src = imagePath;
    img.alt = alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    
    picture.appendChild(webpSource);
    picture.appendChild(originalSource);
    picture.appendChild(img);
    
    return picture;
  }

  /**
   * Preload critical images
   */
  preloadCriticalImages(imagePaths) {
    imagePaths.forEach(path => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = path;
      
      // Add type for WebP images
      if (path.endsWith('.webp')) {
        link.type = 'image/webp';
      }
      
      document.head.appendChild(link);
    });
  }
}

// Initialize and export
const webpHelper = new WebPHelper();

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    webpHelper.convertAllImages();
    webpHelper.setupLazyLoading();
  });
} else {
  webpHelper.convertAllImages();
  webpHelper.setupLazyLoading();
}

// Export for use in other modules
export default webpHelper;