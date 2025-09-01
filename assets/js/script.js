document.addEventListener('DOMContentLoaded', function() {
    // Load header with error handling
    fetch('/partials/header.html')
        .then(res => {
            if (!res.ok) throw new Error('Failed to load header');
            return res.text();
        })
        .then(html => {
            const placeholder = document.getElementById('header-placeholder');
            if (placeholder) placeholder.innerHTML = html;
        })
        .catch(err => console.error('Header load error:', err));
    
    // Load footer with error handling
    fetch('/partials/footer.html')
        .then(res => {
            if (!res.ok) throw new Error('Failed to load footer');
            return res.text();
        })
        .then(html => {
            const placeholder = document.getElementById('footer-placeholder');
            if (placeholder) placeholder.innerHTML = html;
        })
        .catch(err => console.error('Footer load error:', err));

    // Dynamic experience timeline with XSS protection
    fetch('/assets/data/experience.json')
        .then(res => {
            if (!res.ok) throw new Error('Failed to load experience data');
            return res.json();
        })
        .then(data => {
            const container = document.getElementById('experience-timeline');
            if (!container) return;
            
            container.innerHTML = ''; // Clear existing content
            
            data.forEach(item => {
                const containerDiv = document.createElement('div');
                containerDiv.className = `container ${escapeHtml(item.side || 'left')}`;
                
                const contentDiv = document.createElement('div');
                contentDiv.className = 'content';
                
                const tagDiv = document.createElement('div');
                tagDiv.className = 'tag';
                
                const h2 = document.createElement('h2');
                
                if (item.companyIcon) {
                    const img = document.createElement('img');
                    img.src = escapeHtml(item.companyIcon);
                    img.alt = escapeHtml(item.alt || item.company || 'Company logo');
                    img.className = 'company-icon';
                    img.onerror = function() { this.style.display = 'none'; };
                    h2.appendChild(img);
                }
                
                const companyText = document.createTextNode(' ' + (item.company || ''));
                h2.appendChild(companyText);
                tagDiv.appendChild(h2);
                
                const descDiv = document.createElement('div');
                descDiv.className = 'desc';
                
                const h3 = document.createElement('h3');
                h3.textContent = item.title || '';
                
                const p = document.createElement('p');
                p.textContent = item.period || '';
                
                descDiv.appendChild(h3);
                descDiv.appendChild(p);
                contentDiv.appendChild(tagDiv);
                contentDiv.appendChild(descDiv);
                containerDiv.appendChild(contentDiv);
                container.appendChild(containerDiv);
            });
        })
        .catch(err => {
            console.error('Experience timeline load error:', err);
            const container = document.getElementById('experience-timeline');
            if (container) {
                container.innerHTML = '<p>Unable to load experience data.</p>';
            }
        });

    // Initialize VanillaTilt for static elements
    VanillaTilt.init(document.querySelectorAll(".tilt"), { max: 15 });
});

// Vanilla JavaScript implementation of jQuery functionality
function initializeNavigation() {
    const menu = document.getElementById('menu');
    const navbar = document.querySelector('.navbar');
    const scrollTop = document.getElementById('scroll-top');
    
    // Menu toggle functionality
    if (menu && navbar) {
        menu.addEventListener('click', function() {
            this.classList.toggle('fa-times');
            navbar.classList.toggle('nav-toggle');
        });
    }

    // Scroll and load event handling
    function handleScrollAndLoad() {
        // Close mobile menu on scroll
        if (menu) menu.classList.remove('fa-times');
        if (navbar) navbar.classList.remove('nav-toggle');

        // Show/hide scroll-to-top button
        if (scrollTop) {
            if (window.pageYOffset > 60) {
                scrollTop.classList.add('active');
            } else {
                scrollTop.classList.remove('active');
            }
        }

        // Scroll spy functionality
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.navbar ul li a');
        
        sections.forEach(section => {
            if (!section.id) return;
            
            const rect = section.getBoundingClientRect();
            const height = rect.height;
            const offset = rect.top + window.pageYOffset - 200;
            const top = window.pageYOffset;
            const id = section.id;

            if (top > offset && top < offset + height) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section link
                const activeLink = document.querySelector(`.navbar [href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // Add scroll and load event listeners
    window.addEventListener('scroll', handleScrollAndLoad, { passive: true });
    window.addEventListener('load', handleScrollAndLoad);

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href*="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

    // EmailJS configuration - More secure approach
    // Note: For production, use environment variables or server-side processing
    const EMAILJS_CONFIG = {
        publicKey: 'user_TTDmetQLYgWCLzHTDgqxm', // Consider moving to environment variable
        serviceId: 'contact_service',
        templateId: 'template_contact'
    };
    
    // Initialize EmailJS once on page load
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_CONFIG.publicKey);
    }
    
    // Contact form submission with improved security and UX
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Basic client-side validation
        const form = this;
        const formData = new FormData(form);
        
        // Validate required fields
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        if (!name || !email || !message) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Disable submit button to prevent duplicate submissions
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }
        
        // Send form
        if (typeof emailjs !== 'undefined') {
            emailjs.sendForm(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, form)
                .then(function (response) {
                    console.log('Form submitted successfully');
                    form.reset();
                    alert('Thank you for your message! I will get back to you soon.');
                }, function (error) {
                    console.error('Form submission error:', error);
                    alert('Sorry, there was an error sending your message. Please try again later or contact me directly via email.');
                })
                .finally(function() {
                    // Re-enable submit button
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Submit';
                    }
                });
        } else {
            console.error('EmailJS not loaded');
            alert('Contact form is currently unavailable. Please try again later.');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
            }
        }
    });
    // <!-- emailjs to mail contact form data -->
    }

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeNavigation);

// Page visibility change handler
document.addEventListener('visibilitychange', function() {
    const favicon = document.getElementById('favicon');
    
    if (document.visibilityState === "visible") {
        document.title = "Portfolio | Tony Siu";
        if (favicon) {
            favicon.setAttribute('href', 'assets/images/favicon.png');
        }
    } else {
        document.title = "Come Back To Portfolio";
        if (favicon) {
            favicon.setAttribute('href', 'assets/images/favhand.png');
        }
    }
});


// <!-- typed js effect starts -->
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector(".typing-text")) {
        var typed = new Typed(".typing-text", {
            strings: ["Multi-Modal Generative AI", "Computer Vision", "Natural Language Processing", "Data Engineering", "Statistical Optimization"],
            loop: true,
            typeSpeed: 50,
            backSpeed: 25,
            backDelay: 500,
        });
    }
});
// <!-- typed js effect ends -->

async function fetchData(type = "skills") {
    try {
        let response
        type === "skills" ?
            response = await fetch("skills.json")
            :
            response = await fetch("./projects/projects.json")
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

// Utility function to escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, m => map[m]);
}

function showSkills(skills) {
    let skillsContainer = document.getElementById("skillsContainer");
    skillsContainer.innerHTML = ''; // Clear existing content
    
    skills.forEach((skill, index) => {
        const skillDiv = document.createElement('div');
        skillDiv.className = 'bar';
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'info';
        
        const img = document.createElement('img');
        
        // Add lazy loading for images not in viewport initially
        if (index < 12) {
            // Load first 12 images immediately (typically visible)
            img.src = escapeHtml(skill.icon);
        } else {
            // Lazy load the rest
            img.dataset.src = escapeHtml(skill.icon);
            img.classList.add('lazy-load');
            img.src = '/assets/images/default-skill.png'; // Show placeholder initially
        }
        
        img.alt = `${skill.name} icon`;
        img.loading = 'lazy'; // Native lazy loading
        img.width = 48;
        img.height = 48;
        
        // Improved error handling with retry logic
        img.onerror = function() {
            if (!this.dataset.retried) {
                this.dataset.retried = 'true';
                // Try original URL once more after a delay
                setTimeout(() => {
                    this.src = this.dataset.src || '/assets/images/default-skill.png';
                }, 1000);
            } else {
                this.src = '/assets/images/default-skill.png';
            }
        };
        
        const span = document.createElement('span');
        span.textContent = skill.name; // Using textContent prevents XSS
        
        infoDiv.appendChild(img);
        infoDiv.appendChild(span);
        skillDiv.appendChild(infoDiv);
        skillsContainer.appendChild(skillDiv);
    });
    
    // Initialize lazy loading observer
    initLazyLoading();
}

// Lazy loading implementation with Intersection Observer
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy-load');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-load');
                    img.classList.add('lazy-loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px', // Start loading 50px before entering viewport
            threshold: 0.01
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without Intersection Observer
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy-load');
            img.classList.add('lazy-loaded');
        });
    }
}

function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    projectsContainer.innerHTML = ''; // Clear existing content
    
    projects.slice(0, 10).filter(project => project.category != "android").forEach(project => {
        const boxDiv = document.createElement('div');
        boxDiv.className = 'box tilt';
        
        // Create picture element for WebP support
        const picture = document.createElement('picture');
        
        // WebP source
        const sourceWebP = document.createElement('source');
        sourceWebP.type = 'image/webp';
        sourceWebP.srcset = `/assets/images/projects/${escapeHtml(project.image)}.webp`;
        
        // PNG fallback
        const img = document.createElement('img');
        img.draggable = false;
        img.src = `/assets/images/projects/${escapeHtml(project.image)}.png`;
        img.alt = 'project';
        img.loading = 'lazy';
        img.onerror = function() { 
            this.src = '/assets/images/default-project.webp';
            if (this.src.includes('default-project.webp')) {
                this.src = '/assets/images/default-project.png';
            }
        };
        
        picture.appendChild(sourceWebP);
        picture.appendChild(img);
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        
        const tagDiv = document.createElement('div');
        tagDiv.className = 'tag';
        const h3 = document.createElement('h3');
        h3.textContent = project.name;
        tagDiv.appendChild(h3);
        
        const descDiv = document.createElement('div');
        descDiv.className = 'desc';
        const p = document.createElement('p');
        p.textContent = project.desc;
        
        const btnsDiv = document.createElement('div');
        btnsDiv.className = 'btns';
        
        if (project.links && project.links.view) {
            const viewLink = document.createElement('a');
            viewLink.href = escapeHtml(project.links.view);
            viewLink.className = 'btn';
            viewLink.target = '_blank';
            viewLink.rel = 'noopener noreferrer';
            viewLink.innerHTML = '<i class="fas fa-eye"></i> View';
            btnsDiv.appendChild(viewLink);
        }
        
        if (project.links && project.links.code) {
            const codeLink = document.createElement('a');
            codeLink.href = escapeHtml(project.links.code);
            codeLink.className = 'btn';
            codeLink.target = '_blank';
            codeLink.rel = 'noopener noreferrer';
            codeLink.innerHTML = 'Code <i class="fas fa-code"></i>';
            btnsDiv.appendChild(codeLink);
        }
        
        descDiv.appendChild(p);
        descDiv.appendChild(btnsDiv);
        contentDiv.appendChild(tagDiv);
        contentDiv.appendChild(descDiv);
        boxDiv.appendChild(picture);
        boxDiv.appendChild(contentDiv);
        projectsContainer.appendChild(boxDiv);
    });

    // Initialize VanillaTilt for dynamic projects
    VanillaTilt.init(document.querySelectorAll(".tilt"), { max: 15 });

    // Reveal dynamic project boxes using ScrollReveal
    const srtop = ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 1000,
        reset: true
    });
    srtop.reveal('.work .box', { interval: 200 });
}

// Load skills and projects when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    fetchData().then(data => {
        console.log('Skills data loaded:', data);
        showSkills(data);
    }).catch(err => {
        console.error('Error loading skills:', err);
    });

    fetchData("projects").then(data => {
        console.log('Projects data loaded:', data);
        showProjects(data);
    }).catch(err => {
        console.error('Error loading projects:', err);
    });
});

// Start of Tawk.to Live Chat
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/60df10bf7f4b000ac03ab6a8/1f9jlirg6';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
})();
// End of Tawk.to Live Chat


/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

/* SCROLL HOME */
srtop.reveal('.home .content h3', { delay: 200 });
srtop.reveal('.home .content p', { delay: 200 });
srtop.reveal('.home .content .btn', { delay: 200 });

srtop.reveal('.home .image', { delay: 400 });
srtop.reveal('.home .linkedin', { interval: 600 });
srtop.reveal('.home .github', { interval: 800 });
srtop.reveal('.home .twitter', { interval: 1000 });
srtop.reveal('.home .telegram', { interval: 600 });
srtop.reveal('.home .instagram', { interval: 600 });
srtop.reveal('.home .dev', { interval: 600 });

/* SCROLL ABOUT */
srtop.reveal('.about .content h3', { delay: 200 });
srtop.reveal('.about .content .tag', { delay: 200 });
srtop.reveal('.about .content p', { delay: 200 });
srtop.reveal('.about .content .box-container', { delay: 200 });
srtop.reveal('.about .content .resumebtn', { delay: 200 });

/* SCROLL SKILLS */
srtop.reveal('.skills .container', { interval: 200 });
srtop.reveal('.skills .container .bar', { delay: 400 });

/* SCROLL EDUCATION */
srtop.reveal('.education .box', { interval: 200 });

/* SCROLL EXPERIENCE */
srtop.reveal('.experience .timeline', { delay: 400 });
srtop.reveal('.experience .timeline .container', { interval: 400 });

/* SCROLL CONTACT */
srtop.reveal('.contact .container', { delay: 400 });
srtop.reveal('.contact .container .form-group', { delay: 400 });