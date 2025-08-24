const { chromium } = require('playwright');

async function analyzeUX() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });
    const page = await context.newPage();
    
    try {
        console.log('=== COMPREHENSIVE UX ANALYSIS ===\n');
        
        // Navigate to homepage
        console.log('1. LOADING HOMEPAGE...');
        const startTime = Date.now();
        await page.goto('http://localhost:8003', { waitUntil: 'networkidle' });
        const loadTime = Date.now() - startTime;
        console.log(`   ✓ Load time: ${loadTime}ms`);
        
        // Take initial screenshot
        await page.screenshot({ path: 'homepage_full.png', fullPage: true });
        console.log('   ✓ Full page screenshot captured');
        
        // Analyze page structure and content
        console.log('\n2. PAGE STRUCTURE ANALYSIS...');
        const pageInfo = await page.evaluate(() => {
            return {
                title: document.title,
                headings: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
                    tag: h.tagName,
                    text: h.textContent.trim(),
                    visible: h.offsetParent !== null
                })),
                sections: Array.from(document.querySelectorAll('section')).map(s => ({
                    id: s.id,
                    class: s.className,
                    visible: s.offsetParent !== null
                })),
                navigation: Array.from(document.querySelectorAll('nav a, .navbar a')).map(a => ({
                    text: a.textContent.trim(),
                    href: a.href,
                    visible: a.offsetParent !== null
                })),
                images: Array.from(document.querySelectorAll('img')).length,
                videos: Array.from(document.querySelectorAll('video')).length,
                forms: Array.from(document.querySelectorAll('form')).length
            };
        });
        console.log('   ✓ Title:', pageInfo.title);
        console.log('   ✓ Sections found:', pageInfo.sections.length);
        console.log('   ✓ Navigation items:', pageInfo.navigation.length);
        console.log('   ✓ Images:', pageInfo.images);
        
        // Check for animations and interactive elements
        console.log('\n3. INTERACTIVE ELEMENTS...');
        const interactiveElements = await page.evaluate(() => {
            return {
                buttons: Array.from(document.querySelectorAll('button, .btn')).map(b => ({
                    text: b.textContent.trim(),
                    visible: b.offsetParent !== null,
                    disabled: b.disabled
                })),
                links: Array.from(document.querySelectorAll('a[href]')).filter(a => 
                    a.offsetParent !== null && a.href !== '#'
                ).length,
                animations: document.querySelectorAll('[data-aos], .animate, .animated').length,
                particles: document.querySelector('#particles-js') ? 'Present' : 'Not found',
                typed: document.querySelector('.typed') ? 'Present' : 'Not found'
            };
        });
        console.log('   ✓ Interactive buttons:', interactiveElements.buttons.length);
        console.log('   ✓ Active links:', interactiveElements.links);
        console.log('   ✓ Animated elements:', interactiveElements.animations);
        console.log('   ✓ Particles.js:', interactiveElements.particles);
        console.log('   ✓ Typed.js:', interactiveElements.typed);
        
        // Test mobile responsiveness
        console.log('\n4. MOBILE RESPONSIVENESS TEST...');
        await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'mobile_view.png', fullPage: true });
        
        const mobileLayout = await page.evaluate(() => {
            const nav = document.querySelector('nav, .navbar');
            const hero = document.querySelector('.hero, #hero');
            const content = document.querySelector('main, .content');
            
            return {
                navVisible: nav ? nav.offsetParent !== null : false,
                heroHeight: hero ? hero.offsetHeight : 0,
                contentWidth: content ? content.offsetWidth : 0,
                scrollWidth: document.body.scrollWidth,
                viewportWidth: window.innerWidth,
                hasHorizontalScroll: document.body.scrollWidth > window.innerWidth
            };
        });
        console.log('   ✓ Mobile navigation visible:', mobileLayout.navVisible);
        console.log('   ✓ Hero height on mobile:', mobileLayout.heroHeight + 'px');
        console.log('   ✓ Horizontal scroll issues:', mobileLayout.hasHorizontalScroll);
        
        // Test navigation flow
        console.log('\n5. NAVIGATION FLOW TEST...');
        await page.setViewportSize({ width: 1920, height: 1080 }); // Back to desktop
        
        const navLinks = await page.$$eval('nav a, .navbar a', links => 
            links.map(link => ({ text: link.textContent.trim(), href: link.href }))
        );
        
        for (const link of navLinks.slice(0, 3)) { // Test first 3 links
            try {
                if (link.href.includes('localhost') || link.href.includes('#')) {
                    console.log(`   → Testing: ${link.text}`);
                    if (link.href.includes('#')) {
                        // Scroll to anchor
                        await page.click(`a[href="${new URL(link.href).hash}"]`);
                        await page.waitForTimeout(500);
                    } else {
                        // Navigate to page
                        await page.goto(link.href, { waitUntil: 'networkidle' });
                        await page.waitForTimeout(500);
                        console.log(`     ✓ Page loaded: ${await page.title()}`);
                    }
                }
            } catch (error) {
                console.log(`     ✗ Navigation error for ${link.text}: ${error.message}`);
            }
        }
        
        // Return to homepage for final checks
        await page.goto('http://localhost:8003');
        await page.waitForTimeout(1000);
        
        // Performance and accessibility checks
        console.log('\n6. PERFORMANCE & ACCESSIBILITY...');
        const performanceMetrics = await page.evaluate(() => {
            const perf = performance.getEntriesByType('navigation')[0];
            return {
                domContentLoaded: Math.round(perf.domContentLoadedEventEnd - perf.navigationStart),
                loadComplete: Math.round(perf.loadEventEnd - perf.navigationStart),
                resourceCount: performance.getEntriesByType('resource').length
            };
        });
        
        const accessibilityIssues = await page.evaluate(() => {
            const issues = [];
            
            // Check for alt text on images
            const imagesWithoutAlt = Array.from(document.querySelectorAll('img:not([alt])')).length;
            if (imagesWithoutAlt > 0) issues.push(`${imagesWithoutAlt} images without alt text`);
            
            // Check for form labels
            const inputsWithoutLabels = Array.from(document.querySelectorAll('input:not([aria-label]):not([id])')).length;
            if (inputsWithoutLabels > 0) issues.push(`${inputsWithoutLabels} inputs without labels`);
            
            // Check for heading hierarchy
            const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
            const h1Count = headings.filter(h => h.tagName === 'H1').length;
            if (h1Count !== 1) issues.push(`${h1Count} H1 tags found (should be exactly 1)`);
            
            return issues;
        });
        
        console.log('   ✓ DOM Content Loaded:', performanceMetrics.domContentLoaded + 'ms');
        console.log('   ✓ Full Load Time:', performanceMetrics.loadComplete + 'ms');
        console.log('   ✓ Resource Count:', performanceMetrics.resourceCount);
        console.log('   ✓ Accessibility Issues:', accessibilityIssues.length);
        if (accessibilityIssues.length > 0) {
            accessibilityIssues.forEach(issue => console.log(`     - ${issue}`));
        }
        
        // Visual design analysis
        console.log('\n7. VISUAL DESIGN ANALYSIS...');
        const designMetrics = await page.evaluate(() => {
            const computedStyle = getComputedStyle(document.body);
            const colors = new Set();
            const fonts = new Set();
            
            // Sample elements for color/font analysis
            const elements = Array.from(document.querySelectorAll('h1, h2, h3, p, a, button'));
            elements.forEach(el => {
                const style = getComputedStyle(el);
                colors.add(style.color);
                fonts.add(style.fontFamily.split(',')[0].trim().replace(/['"]/g, ''));
            });
            
            return {
                backgroundColor: computedStyle.backgroundColor,
                colorPalette: Array.from(colors),
                fonts: Array.from(fonts),
                hasCustomCursor: computedStyle.cursor !== 'auto',
                hasTransitions: document.querySelectorAll('*[style*="transition"], .transition, [class*="transition"]').length > 0
            };
        });
        
        console.log('   ✓ Color palette diversity:', designMetrics.colorPalette.length + ' colors');
        console.log('   ✓ Font families used:', designMetrics.fonts.length);
        console.log('   ✓ Transition effects:', designMetrics.hasTransitions);
        
        console.log('\n=== ANALYSIS COMPLETE ===');
        console.log('Screenshots saved: homepage_full.png, mobile_view.png');
        
    } catch (error) {
        console.error('Analysis error:', error.message);
    } finally {
        await browser.close();
    }
}

analyzeUX();
