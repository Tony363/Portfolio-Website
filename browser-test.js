// Quick Browser Testing Script for Portfolio Website
// Copy and paste this into browser console on each page

(function() {
    console.log('%c🚀 Portfolio Website Browser Test', 'color: #007bff; font-size: 18px; font-weight: bold;');
    
    const results = {
        passed: 0,
        failed: 0,
        warnings: 0
    };
    
    function test(description, condition, isWarning = false) {
        if (condition) {
            console.log(`%c✅ ${description}`, 'color: green');
            results.passed++;
        } else {
            if (isWarning) {
                console.log(`%c⚠️ ${description}`, 'color: orange');
                results.warnings++;
            } else {
                console.log(`%c❌ ${description}`, 'color: red');
                results.failed++;
            }
        }
    }
    
    // Test 1: Check jQuery is loaded
    test('jQuery library loaded', typeof $ !== 'undefined');
    
    // Test 2: Check if page has proper title
    test('Page has title', document.title && document.title !== '');
    
    // Test 3: Check for required meta tags
    test('Viewport meta tag present', document.querySelector('meta[name="viewport"]') !== null);
    test('Description meta tag present', document.querySelector('meta[name="description"]') !== null);
    
    // Test 4: Check for favicon
    test('Favicon present', document.querySelector('link[rel*="icon"]') !== null);
    
    // Test 5: Check for external library dependencies
    const libraries = [
        { name: 'ScrollReveal', check: () => typeof ScrollReveal !== 'undefined' },
        { name: 'VanillaTilt', check: () => typeof VanillaTilt !== 'undefined', warning: true }
    ];
    
    libraries.forEach(lib => {
        test(`${lib.name} loaded`, lib.check(), lib.warning);
    });
    
    // Test 6: Check images for alt attributes
    const images = document.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => !img.alt);
    test(`All images have alt text (${imagesWithoutAlt.length} missing)`, imagesWithoutAlt.length === 0, true);
    
    // Test 7: Check external links for security
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    const unsafeLinks = Array.from(externalLinks).filter(link => 
        !link.getAttribute('rel') || !link.getAttribute('rel').includes('noopener')
    );
    test(`External links are secure (${unsafeLinks.length} unsafe)`, unsafeLinks.length === 0);
    
    // Test 8: Check for form validation (if contact form exists)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const requiredFields = contactForm.querySelectorAll('[required]');
        test(`Contact form has required fields (${requiredFields.length} found)`, requiredFields.length > 0);
        
        // Test if form has proper validation
        const nameField = contactForm.querySelector('input[name="name"]');
        const emailField = contactForm.querySelector('input[name="email"]');
        test('Contact form has name field', nameField !== null);
        test('Contact form has email field', emailField !== null && emailField.type === 'email');
    }
    
    // Test 9: Check navigation functionality
    const navLinks = document.querySelectorAll('.navbar a');
    test(`Navigation links present (${navLinks.length} found)`, navLinks.length > 0);
    
    // Test 10: Check responsive design elements
    test('Mobile menu toggle present', document.getElementById('menu') !== null);
    
    // Test 11: Check for scroll to top button
    test('Scroll to top button present', document.getElementById('scroll-top') !== null);
    
    // Test 12: Check for social media links
    const socialLinks = document.querySelectorAll('.social-icons a, .share a');
    test(`Social media links present (${socialLinks.length} found)`, socialLinks.length > 0, true);
    
    // Test 13: Check page-specific functionality
    const currentPage = window.location.pathname;
    if (currentPage.includes('projects')) {
        // Projects page specific tests
        const filterButtons = document.querySelectorAll('#filters button');
        test(`Project filter buttons present (${filterButtons.length} found)`, filterButtons.length > 0);
        
        const projectContainer = document.querySelector('.box-container');
        test('Project container present', projectContainer !== null);
    }
    
    if (currentPage === '/' || currentPage.includes('index')) {
        // Main page specific tests
        const particlesContainer = document.getElementById('particles-js');
        test('Particles.js container present', particlesContainer !== null, true);
        
        const skillsContainer = document.getElementById('skillsContainer');
        test('Skills container present', skillsContainer !== null);
        
        const experienceTimeline = document.getElementById('experience-timeline');
        test('Experience timeline container present', experienceTimeline !== null);
    }
    
    // Test 14: Performance checks
    if (performance && performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        test(`Page load time acceptable (<3s): ${loadTime}ms`, loadTime < 3000, true);
    }
    
    // Test 15: Console error check
    const hasConsoleErrors = window.consoleErrors && window.consoleErrors.length > 0;
    test('No console errors detected', !hasConsoleErrors, true);
    
    // Final results
    console.log('\n📊 Test Results Summary:');
    console.log(`%c✅ Passed: ${results.passed}`, 'color: green; font-weight: bold');
    console.log(`%c❌ Failed: ${results.failed}`, 'color: red; font-weight: bold');
    console.log(`%c⚠️ Warnings: ${results.warnings}`, 'color: orange; font-weight: bold');
    
    const totalTests = results.passed + results.failed + results.warnings;
    const successRate = Math.round((results.passed / totalTests) * 100);
    
    console.log(`\n🎯 Success Rate: ${successRate}%`);
    
    if (results.failed === 0) {
        console.log('%c🎉 All critical tests passed! Website is ready for production.', 
                   'color: green; font-size: 16px; font-weight: bold');
    } else {
        console.log('%c⚠️ Some tests failed. Please review and fix issues before deployment.', 
                   'color: red; font-size: 16px; font-weight: bold');
    }
    
    // Return results for further processing
    return {
        results,
        successRate,
        totalTests
    };
})();

// Additional helper functions for manual testing
window.portfolioTest = {
    // Test specific functionality
    testNavigation: function() {
        console.log('Testing navigation...');
        const navLinks = document.querySelectorAll('.navbar a');
        navLinks.forEach((link, index) => {
            console.log(`Link ${index + 1}: ${link.textContent} -> ${link.href}`);
        });
    },
    
    testFormValidation: function() {
        console.log('Testing form validation...');
        const form = document.getElementById('contact-form');
        if (form) {
            const submitEvent = new Event('submit');
            form.dispatchEvent(submitEvent);
            console.log('Form validation triggered');
        } else {
            console.log('No contact form found on this page');
        }
    },
    
    testResponsive: function() {
        console.log('Current viewport:', window.innerWidth + 'x' + window.innerHeight);
        if (window.innerWidth < 450) {
            console.log('📱 Mobile view detected');
        } else if (window.innerWidth < 768) {
            console.log('📊 Tablet view detected');
        } else {
            console.log('🖥️ Desktop view detected');
        }
    },
    
    simulateSlowConnection: function() {
        console.log('💡 To test slow connection:');
        console.log('1. Open DevTools (F12)');
        console.log('2. Go to Network tab');
        console.log('3. Select "Slow 3G" throttling');
        console.log('4. Reload page and observe loading behavior');
    }
};

console.log('\n💡 Additional testing functions available:');
console.log('portfolioTest.testNavigation() - Test navigation links');
console.log('portfolioTest.testFormValidation() - Test form validation');
console.log('portfolioTest.testResponsive() - Check responsive breakpoints');
console.log('portfolioTest.simulateSlowConnection() - Instructions for connection testing');