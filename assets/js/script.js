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

$(document).ready(function () {

    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }

        // scroll spy
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if (top > offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });

    // smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear')
    });

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
    $("#contact-form").submit(function (event) {
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

});

document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Portfolio | Tony Siu";
            $("#favicon").attr("href", "assets/images/favicon.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "assets/images/favhand.png");
        }
    });


// <!-- typed js effect starts -->
var typed = new Typed(".typing-text", {
    strings: ["Multi-Modal Generative AI", "Computer Vision", "Natural Language Processing", "Data Engineering", "Statistical Optimization"],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
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
    
    skills.forEach(skill => {
        const skillDiv = document.createElement('div');
        skillDiv.className = 'bar';
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'info';
        
        const img = document.createElement('img');
        img.src = escapeHtml(skill.icon);
        img.alt = 'skill';
        img.onerror = function() { this.src = '/assets/images/default-skill.png'; };
        
        const span = document.createElement('span');
        span.textContent = skill.name; // Using textContent prevents XSS
        
        infoDiv.appendChild(img);
        infoDiv.appendChild(span);
        skillDiv.appendChild(infoDiv);
        skillsContainer.appendChild(skillDiv);
    });
}

function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    projectsContainer.innerHTML = ''; // Clear existing content
    
    projects.slice(0, 10).filter(project => project.category != "android").forEach(project => {
        const boxDiv = document.createElement('div');
        boxDiv.className = 'box tilt';
        
        const img = document.createElement('img');
        img.draggable = false;
        img.src = `/assets/images/projects/${escapeHtml(project.image)}.png`;
        img.alt = 'project';
        img.onerror = function() { this.src = '/assets/images/default-project.png'; };
        
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
        boxDiv.appendChild(img);
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

fetchData().then(data => {
    showSkills(data);
});

fetchData("projects").then(data => {
    showProjects(data);
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