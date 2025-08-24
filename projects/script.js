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
    });
});

document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Projects | Portfolio Tony Siu";
            $("#favicon").attr("href", "/assets/images/favicon.png");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "/assets/images/favhand.png");
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
        
        // Image
        const img = document.createElement('img');
        img.draggable = false;
        img.src = `/assets/images/projects/${escapeHtml(project.image)}.png`;
        img.alt = 'project';
        img.onerror = function() { 
            this.src = '/assets/images/default-project.png';
            this.style.display = 'none'; 
        };
        
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
        boxDiv.appendChild(img);
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

    // isotope filter products
    var $grid = $('.box-container').isotope({
        itemSelector: '.grid-item',
        layoutMode: 'fitRows',
        masonry: {
            columnWidth: 200
        }
    });

    // filter items on button click
    $('.button-group').on('click', 'button', function () {
        $('.button-group').find('.is-checked').removeClass('is-checked');
        $(this).addClass('is-checked');
        var filterValue = $(this).attr('data-filter');
        $grid.isotope({ filter: filterValue });
    });
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