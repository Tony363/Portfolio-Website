// Service Worker for Portfolio Website
const CACHE_NAME = 'portfolio-v1.2';
const urlsToCache = [
  '/',
  '/index.html',
  '/projects/',
  '/projects/index.html',
  '/experience/',
  '/experience/index.html',
  '/assets/css/style.css',
  '/assets/css/responsive-improvements.css',
  '/assets/js/script.js',
  '/assets/js/app.js',
  '/assets/js/particles.min.js',
  '/projects/script.js',
  '/projects/style.css',
  '/experience/script.js',
  '/experience/style.css',
  '/skills.json',
  '/projects/projects.json',
  '/assets/data/experience.json',
  '/partials/header.html',
  '/partials/footer.html',
  // Add critical images
  '/assets/images/favicon.png',
  '/assets/images/resume_photo.jpeg',
  '/assets/images/coder.jpg',
  '/assets/images/contact1.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});