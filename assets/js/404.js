// Initialize navigation functionality
function initializeNavigation() {
    const menu = document.getElementById('menu');
    const navbar = document.querySelector('.navbar');
    
    // Menu toggle functionality
    if (menu && navbar) {
        menu.addEventListener('click', function() {
            this.classList.toggle('fa-times');
            navbar.classList.toggle('nav-toggle');
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeNavigation);

