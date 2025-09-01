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

/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    reset: true
});

/* SCROLL EXPERIENCE */
srtop.reveal('.experience .timeline',{delay: 400});
srtop.reveal('.experience .timeline .container',{interval: 400}); 


// Start of Tawk.to Live Chat
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/60df10bf7f4b000ac03ab6a8/1f9jlirg6';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
// End of Tawk.to Live Chat



// Page visibility change handler
document.addEventListener('visibilitychange', function() {
    const favicon = document.getElementById('favicon');
    
    if (document.visibilityState === "visible") {
        document.title = "Experience | Portfolio Tony Siu";
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