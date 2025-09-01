// Initialize navigation functionality
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
    }

    // Add scroll and load event listeners
    window.addEventListener('scroll', handleScrollAndLoad, { passive: true });
    window.addEventListener('load', handleScrollAndLoad);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeNavigation);

// Page visibility change handler
document.addEventListener('visibilitychange', function() {
    const favicon = document.getElementById('favicon');
    
    if (document.visibilityState === "visible") {
        document.title = "Projects | Portfolio Tony Siu";
        if (favicon) {
            favicon.setAttribute('href', '/assets/images/favicon.png');
        }
    } else {
        document.title = "Come Back To Portfolio";
        if (favicon) {
            favicon.setAttribute('href', '/assets/images/favhand.png');
        }
    }
});


// fetch projects start
function getProjects() {
    return fetch("projects.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            return data
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            return [];
        });
}

// Utility function to escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, m => map[m]);
}

function showProjects(projects) {
    let projectsContainer = document.querySelector(".work .box-container");
    projectsContainer.innerHTML = ''; // Clear existing content
    
    projects.forEach(project => {
        // Create elements using DOM methods for security
        const gridItem = document.createElement('div');
        gridItem.className = `grid-item ${escapeHtml(project.category || '')}`;
        
        const boxDiv = document.createElement('div');
        boxDiv.className = 'box tilt';
        boxDiv.style.width = '380px';
        boxDiv.style.margin = '1rem';
        
        // Image with WebP support
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
            this.style.display = 'none'; 
        };
        
        picture.appendChild(sourceWebP);
        picture.appendChild(img);
        
        // Content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        
        // Tag section
        const tagDiv = document.createElement('div');
        tagDiv.className = 'tag';
        const h3 = document.createElement('h3');
        h3.textContent = project.name || '';
        tagDiv.appendChild(h3);
        
        // Description section
        const descDiv = document.createElement('div');
        descDiv.className = 'desc';
        const p = document.createElement('p');
        p.textContent = project.desc || '';
        
        // Buttons section
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
        
        // Assemble the structure
        descDiv.appendChild(p);
        descDiv.appendChild(btnsDiv);
        contentDiv.appendChild(tagDiv);
        contentDiv.appendChild(descDiv);
        boxDiv.appendChild(picture);
        boxDiv.appendChild(contentDiv);
        gridItem.appendChild(boxDiv);
        projectsContainer.appendChild(gridItem);
    });

    // Initialize VanillaTilt for dynamic projects
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".tilt"), {
            max: 15
        });
    }

    // Initialize Isotope filter functionality
    const boxContainer = document.querySelector('.box-container');
    const buttonGroup = document.querySelector('.button-group');
    
    if (boxContainer && typeof Isotope !== 'undefined') {
        // Initialize Isotope
        const grid = new Isotope(boxContainer, {
            itemSelector: '.grid-item',
            layoutMode: 'fitRows',
            masonry: {
                columnWidth: 200
            }
        });

        // Filter items on button click
        if (buttonGroup) {
            buttonGroup.addEventListener('click', function(e) {
                if (e.target.tagName === 'BUTTON') {
                    // Remove active class from all buttons
                    const buttons = buttonGroup.querySelectorAll('button');
                    buttons.forEach(btn => btn.classList.remove('is-checked'));
                    
                    // Add active class to clicked button
                    e.target.classList.add('is-checked');
                    
                    // Get filter value and apply filter
                    const filterValue = e.target.getAttribute('data-filter');
                    grid.arrange({ filter: filterValue });
                }
            });
        }
    } else {
        console.warn('Isotope library not loaded or box-container not found');
    }
}

getProjects().then(data => {
    showProjects(data);
})
// fetch projects end

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