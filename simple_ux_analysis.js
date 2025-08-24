const fs = require('fs');
const path = require('path');

async function analyzePortfolioUX() {
    console.log('=== COMPREHENSIVE PORTFOLIO UX ANALYSIS ===\n');
    
    // Read main files
    const indexHTML = fs.readFileSync('index.html', 'utf8');
    const mainCSS = fs.readFileSync('./assets/css/style.css', 'utf8');
    
    console.log('1. CONTENT STRUCTURE ANALYSIS');
    console.log('=====================================');
    
    // Analyze HTML structure
    const sections = indexHTML.match(/<section[^>]*class="([^"]*)"[^>]*id="([^"]*)"[^>]*>/g) || [];
    const headings = indexHTML.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/g) || [];
    const images = indexHTML.match(/<img[^>]*>/g) || [];
    const links = indexHTML.match(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g) || [];
    
    console.log(`   ✓ Sections found: ${sections.length}`);
    sections.forEach(section => {
        const classMatch = section.match(/class="([^"]*)"/);
        const idMatch = section.match(/id="([^"]*)"/);
        console.log(`     - ${idMatch ? idMatch[1] : 'unnamed'}: ${classMatch ? classMatch[1] : 'no-class'}`);
    });
    
    console.log(`   ✓ Headings: ${headings.length}`);
    console.log(`   ✓ Images: ${images.length}`);
    console.log(`   ✓ Links: ${links.length}`);
    
    console.log('\n2. VISUAL DESIGN ANALYSIS');
    console.log('=====================================');
    
    // Analyze CSS for design patterns
    const colorMatches = mainCSS.match(/color:\s*([^;]+);/g) || [];
    const backgroundMatches = mainCSS.match(/background(-color)?:\s*([^;]+);/g) || [];
    const fontMatches = mainCSS.match(/font-family:\s*([^;]+);/g) || [];
    const transitionMatches = mainCSS.match(/transition:\s*([^;]+);/g) || [];
    
    console.log(`   ✓ Color declarations: ${colorMatches.length}`);
    console.log(`   ✓ Background declarations: ${backgroundMatches.length}`);
    console.log(`   ✓ Font families used: ${new Set(fontMatches).size}`);
    console.log(`   ✓ Transitions/animations: ${transitionMatches.length}`);
    
    // Check for modern CSS features
    const modernFeatures = {
        flexbox: (mainCSS.match(/display:\s*flex/g) || []).length,
        grid: (mainCSS.match(/display:\s*grid/g) || []).length,
        transforms: (mainCSS.match(/transform:/g) || []).length,
        gradients: (mainCSS.match(/gradient\(/g) || []).length
    };
    
    console.log('   ✓ Modern CSS Features:');
    Object.entries(modernFeatures).forEach(([feature, count]) => {
        console.log(`     - ${feature}: ${count} uses`);
    });
    
    console.log('\n3. INTERACTIVITY ANALYSIS');
    console.log('=====================================');
    
    // Check for JavaScript libraries and interactive elements
    const jsLibraries = {
        jQuery: indexHTML.includes('jquery'),
        particles: indexHTML.includes('particles'),
        typed: indexHTML.includes('typed'),
        tilt: indexHTML.includes('vanilla-tilt'),
        scrollReveal: indexHTML.includes('scrollreveal'),
        emailJS: indexHTML.includes('emailjs')
    };
    
    console.log('   ✓ JavaScript Libraries:');
    Object.entries(jsLibraries).forEach(([lib, present]) => {
        console.log(`     - ${lib}: ${present ? '✓ Present' : '✗ Missing'}`);
    });
    
    // Interactive elements
    const buttons = (indexHTML.match(/<button[^>]*>/g) || []).length;
    const forms = (indexHTML.match(/<form[^>]*>/g) || []).length;
    const inputs = (indexHTML.match(/<input[^>]*>/g) || []).length;
    
    console.log(`   ✓ Interactive elements:`);
    console.log(`     - Buttons: ${buttons}`);
    console.log(`     - Forms: ${forms}`);
    console.log(`     - Input fields: ${inputs}`);
    
    console.log('\n4. PERFORMANCE ANALYSIS');
    console.log('=====================================');
    
    // Analyze performance aspects
    const externalResources = {
        fonts: (indexHTML.match(/fonts\.googleapis\.com/g) || []).length,
        cdns: (indexHTML.match(/cdnjs\.cloudflare\.com/g) || []).length,
        icons: (indexHTML.match(/icons8\.com/g) || []).length,
        preloads: (indexHTML.match(/rel="preload"/g) || []).length,
        prefetch: (indexHTML.match(/rel="dns-prefetch"/g) || []).length
    };
    
    console.log('   ✓ Performance Features:');
    Object.entries(externalResources).forEach(([feature, count]) => {
        console.log(`     - ${feature}: ${count}`);
    });
    
    console.log('\n5. ACCESSIBILITY ANALYSIS');
    console.log('=====================================');
    
    // Check accessibility features
    const altTexts = (indexHTML.match(/alt="[^"]*"/g) || []).length;
    const ariaLabels = (indexHTML.match(/aria-label="[^"]*"/g) || []).length;
    const skipLinks = (indexHTML.match(/skip-link|skip-content/gi) || []).length;
    const focusElements = (mainCSS.match(/:focus/g) || []).length;
    
    console.log(`   ✓ Accessibility Features:`);
    console.log(`     - Alt texts: ${altTexts}`);
    console.log(`     - ARIA labels: ${ariaLabels}`);
    console.log(`     - Skip links: ${skipLinks}`);
    console.log(`     - Focus styles: ${focusElements}`);
    
    console.log('\n6. SEO & META ANALYSIS');
    console.log('=====================================');
    
    // SEO features
    const metaTags = (indexHTML.match(/<meta[^>]*>/g) || []).length;
    const openGraph = (indexHTML.match(/property="og:/g) || []).length;
    const twitter = (indexHTML.match(/property="twitter:/g) || []).length;
    const structuredData = indexHTML.includes('application/ld+json');
    
    console.log(`   ✓ SEO Features:`);
    console.log(`     - Meta tags: ${metaTags}`);
    console.log(`     - Open Graph: ${openGraph}`);
    console.log(`     - Twitter Cards: ${twitter}`);
    console.log(`     - Structured Data: ${structuredData ? '✓' : '✗'}`);
    
    console.log('\n7. MOBILE RESPONSIVENESS');
    console.log('=====================================');
    
    // Check responsive design features
    const mediaQueries = (mainCSS.match(/@media[^{]+\{/g) || []).length;
    const viewportMeta = indexHTML.includes('name="viewport"');
    const fluidUnits = (mainCSS.match(/\d+(\.\d+)?%|\d+(\.\d+)?vw|\d+(\.\d+)?vh|\d+(\.\d+)?rem/g) || []).length;
    
    console.log(`   ✓ Responsive Features:`);
    console.log(`     - Media queries: ${mediaQueries}`);
    console.log(`     - Viewport meta: ${viewportMeta ? '✓' : '✗'}`);
    console.log(`     - Fluid units usage: ${fluidUnits}`);
    
    console.log('\n8. PROJECT STRUCTURE');
    console.log('=====================================');
    
    // Analyze file organization
    const directories = ['assets', 'projects', 'experience', 'partials'];
    directories.forEach(dir => {
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir, { recursive: true });
            console.log(`   ✓ ${dir}/: ${files.length} files`);
        } else {
            console.log(`   ✗ ${dir}/: Not found`);
        }
    });
    
    console.log('\n=== ANALYSIS COMPLETE ===');
    
    return {
        sections: sections.length,
        images: images.length,
        modernCSS: Object.values(modernFeatures).reduce((a, b) => a + b, 0),
        accessibility: altTexts + ariaLabels,
        performance: Object.values(externalResources).reduce((a, b) => a + b, 0),
        responsive: mediaQueries
    };
}

analyzePortfolioUX().then(results => {
    console.log('\nSUMMARY METRICS:', results);
}).catch(console.error);
