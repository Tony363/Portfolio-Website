// Comprehensive Website Testing Script
// Run this in browser console to test functionality

console.log('=== Portfolio Website Testing Script ===');

// Test 1: Check if all external libraries are loaded
function testLibrariesLoaded() {
    console.log('\n🧪 Testing Library Loading...');
    
    const libraries = {
        'jQuery': typeof $ !== 'undefined',
        'Particles.js': typeof particlesJS !== 'undefined',
        'Typed.js': typeof Typed !== 'undefined', 
        'VanillaTilt': typeof VanillaTilt !== 'undefined',
        'ScrollReveal': typeof ScrollReveal !== 'undefined',
        'EmailJS': typeof emailjs !== 'undefined'
    };
    
    Object.entries(libraries).forEach(([name, loaded]) => {
        console.log(`${loaded ? '✅' : '❌'} ${name}: ${loaded ? 'Loaded' : 'Missing'}`);
    });
}

// Test 2: Check navigation functionality
function testNavigation() {
    console.log('\n🧪 Testing Navigation...');
    
    const navLinks = document.querySelectorAll('.navbar a');
    console.log(`✅ Navigation links found: ${navLinks.length}`);
    
    navLinks.forEach((link, index) => {
        const href = link.getAttribute('href');
        const text = link.textContent.trim();
        console.log(`📍 Link ${index + 1}: "${text}" → ${href}`);
    });
}

// Test 3: Check JSON data loading
async function testDataLoading() {
    console.log('\n🧪 Testing Data Loading...');
    
    try {
        // Test skills data
        const skillsResponse = await fetch('/skills.json');
        if (skillsResponse.ok) {
            const skills = await skillsResponse.json();
            console.log(`✅ Skills data loaded: ${skills.length} items`);
        } else {
            console.log('❌ Skills data failed to load');
        }
    } catch (error) {
        console.log('❌ Skills data error:', error.message);
    }
    
    try {
        // Test projects data
        const projectsResponse = await fetch('/projects/projects.json');
        if (projectsResponse.ok) {
            const projects = await projectsResponse.json();
            console.log(`✅ Projects data loaded: ${projects.length} items`);
        } else {
            console.log('❌ Projects data failed to load');
        }
    } catch (error) {
        console.log('❌ Projects data error:', error.message);
    }
    
    try {
        // Test experience data
        const expResponse = await fetch('/assets/data/experience.json');
        if (expResponse.ok) {
            const experience = await expResponse.json();
            console.log(`✅ Experience data loaded: ${experience.length} items`);
        } else {
            console.log('❌ Experience data failed to load');
        }
    } catch (error) {
        console.log('❌ Experience data error:', error.message);
    }
}

// Test 4: Check responsive design
function testResponsiveDesign() {
    console.log('\n🧪 Testing Responsive Design...');
    
    const viewportWidth = window.innerWidth;
    let deviceType;
    
    if (viewportWidth < 450) {
        deviceType = 'Mobile';
    } else if (viewportWidth < 768) {
        deviceType = 'Tablet';
    } else {
        deviceType = 'Desktop';
    }
    
    console.log(`📱 Current viewport: ${viewportWidth}px (${deviceType})`);
    
    // Test mobile menu
    const mobileMenu = document.getElementById('menu');
    if (mobileMenu) {
        console.log('✅ Mobile menu toggle found');
    } else {
        console.log('❌ Mobile menu toggle missing');
    }
}

// Test 5: Check image loading
function testImageLoading() {
    console.log('\n🧪 Testing Image Loading...');
    
    const images = document.querySelectorAll('img');
    let loadedCount = 0;
    let errorCount = 0;
    
    images.forEach((img, index) => {
        if (img.complete) {
            if (img.naturalWidth > 0) {
                loadedCount++;
            } else {
                errorCount++;
                console.log(`❌ Image ${index + 1} failed: ${img.src}`);
            }
        } else {
            img.onload = () => {
                console.log(`✅ Image ${index + 1} loaded: ${img.src}`);
            };
            img.onerror = () => {
                console.log(`❌ Image ${index + 1} error: ${img.src}`);
            };
        }
    });
    
    console.log(`📊 Images: ${loadedCount} loaded, ${errorCount} errors, ${images.length - loadedCount - errorCount} loading`);
}

// Test 6: Check form functionality
function testContactForm() {
    console.log('\n🧪 Testing Contact Form...');
    
    const form = document.getElementById('contact-form');
    if (form) {
        console.log('✅ Contact form found');
        
        const requiredFields = form.querySelectorAll('[required]');
        console.log(`📝 Required fields: ${requiredFields.length}`);
        
        requiredFields.forEach((field, index) => {
            console.log(`📍 Required field ${index + 1}: ${field.name || field.id} (${field.type})`);
        });
    } else {
        console.log('❌ Contact form not found');
    }
}

// Test 7: Check accessibility
function testAccessibility() {
    console.log('\n🧪 Testing Accessibility...');
    
    // Check for alt texts
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
    if (imagesWithoutAlt.length > 0) {
        console.log(`❌ ${imagesWithoutAlt.length} images missing alt text`);
        imagesWithoutAlt.forEach((img, index) => {
            console.log(`  📍 Image ${index + 1}: ${img.src}`);
        });
    } else {
        console.log('✅ All images have alt text');
    }
    
    // Check for ARIA labels
    const linksWithoutLabels = document.querySelectorAll('a[target="_blank"]:not([aria-label])');
    if (linksWithoutLabels.length > 0) {
        console.log(`⚠️ ${linksWithoutLabels.length} external links missing aria-label`);
    } else {
        console.log('✅ External links have aria-labels');
    }
    
    // Check headings hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    console.log(`📊 Heading structure: ${headings.length} headings found`);
}

// Test 8: Performance check
function testPerformance() {
    console.log('\n🧪 Testing Performance...');
    
    if (performance && performance.timing) {
        const timing = performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
        
        console.log(`⏱️ Page load time: ${loadTime}ms`);
        console.log(`⏱️ DOM ready time: ${domReady}ms`);
        
        if (loadTime > 3000) {
            console.log('⚠️ Page load time is slow (>3s)');
        } else {
            console.log('✅ Page load time is acceptable');
        }
    }
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Starting comprehensive website testing...\n');
    
    testLibrariesLoaded();
    testNavigation();
    await testDataLoading();
    testResponsiveDesign();
    testImageLoading();
    testContactForm();
    testAccessibility();
    testPerformance();
    
    console.log('\n✅ Testing complete! Check results above.');
}

// Auto-run if not already running
if (typeof window !== 'undefined' && !window.testingRunning) {
    window.testingRunning = true;
    runAllTests();
}

// Export for manual testing
window.portfolioTests = {
    runAllTests,
    testLibrariesLoaded,
    testNavigation,
    testDataLoading,
    testResponsiveDesign,
    testImageLoading,
    testContactForm,
    testAccessibility,
    testPerformance
};