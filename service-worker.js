// 添加 Service Worker 支持离线访问
const CACHE_NAME = 'v1';
const CACHE_FILES = [
    '/',
    '/index.html',
    '/love.html',
    '/parenting.html',
    '/common.css',
    '/images/*'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CACHE_FILES))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
}); 