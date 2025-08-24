// Service Worker for Portfolio Website
const CACHE_NAME = 'portfolio-v1.3';
const urlsToCache = [
  '/',
  '/index.html',
  '/projects/',
  '/projects/index.html',
  '/experience/',
  '/experience/index.html',
  '/assets/css/style.css',
  '/assets/css/responsive-improvements.css',
  '/assets/css/contrast-improvements.css',
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
  '/assets/images/contact1.png',
  '/assets/images/default-skill.png',
  // Cache skill images for offline use
  '/assets/images/skills/c.png',
  '/assets/images/skills/c-plus-plus.png',
  '/assets/images/skills/python.png',
  '/assets/images/skills/java.png',
  '/assets/images/skills/php.png',
  '/assets/images/skills/javascript.png',
  '/assets/images/skills/expressjs.png',
  '/assets/images/skills/nodejs.png',
  '/assets/images/skills/typescript.png',
  '/assets/images/skills/bootstrap.png',
  '/assets/images/skills/css.png',
  '/assets/images/skills/html5.png',
  '/assets/images/skills/mongodb.png',
  '/assets/images/skills/mysql.png',
  '/assets/images/skills/postgresql.png',
  '/assets/images/skills/aws.png',
  '/assets/images/skills/gcp.png',
  '/assets/images/skills/docker.png',
  '/assets/images/skills/django.png',
  '/assets/images/skills/flask.jpg',
  '/assets/images/skills/fastapi.jpg',
  '/assets/images/skills/heroku.png',
  '/assets/images/skills/vercel.webp',
  '/assets/images/skills/postman.png',
  '/assets/images/skills/git-vcs.png',
  '/assets/images/skills/github.png',
  '/assets/images/skills/pytorch.png',
  '/assets/images/skills/tensorflow.png',
  '/assets/images/skills/keras.png',
  '/assets/images/skills/opencv.png',
  '/assets/images/skills/pandas.png',
  '/assets/images/skills/numpy.png',
  '/assets/images/skills/sympy.png',
  '/assets/images/skills/optuna.png'
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