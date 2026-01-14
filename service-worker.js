const CACHE_NAME = 'qr-generator-cache-v12';

const urlsToCache = [
  // --- Основные страницы ---
  '/qr/',
  '/qr/index.html',
  '/qr/manifest.json',


  '/qr/style.min.css',
  '/qr/coloris.css',
  '/qr/cropper.min.css',

  // --- Скрипты  ---
  '/qr/main.min.js',
  '/qr/clipper.js',
  '/qr/coloris.js',
  '/qr/opentype.js',
  '/qr/qrcode.js',
  '/qr/cropper.min.js',

  // --- Шрифты ---
  '/qr/fonts/Rubik-Medium.woff',

  // --- Иконки PWA ---
  '/qr/icons/icon-192x192.png',
  '/qr/icons/icon-512x512.png',
  '/qr/icons/maskable-icon-512x512.png',

  // --- Изображения интерфейса и логотипы  ---
  '/qr/images/2gis.svg',
  '/qr/images/avito.svg',
  '/qr/images/dd.svg',
  '/qr/images/delete.svg',
  '/qr/images/download.svg',
  '/qr/images/inst.svg',
  '/qr/images/mail.svg',
  '/qr/images/nstr.svg',
  '/qr/images/nstr-01.svg',
  '/qr/images/nstr-02.svg',
  '/qr/images/nstr-03.svg',
  '/qr/images/palitra.svg',
  '/qr/images/pen.svg',
  '/qr/images/ramki.svg',
  '/qr/images/ramki-gr.svg',
  '/qr/images/ramki-01.svg',
  '/qr/images/ramki-02.svg',
  '/qr/images/ramki-03.svg',
  '/qr/images/ramki-04.svg',
  '/qr/images/ramki-05.svg',
  '/qr/images/ramki-06.svg',
  '/qr/images/sb.svg',
  '/qr/images/sbp.svg',
  '/qr/images/site.svg',
  '/qr/images/star.svg',
  '/qr/images/tbank.svg',
  '/qr/images/tg.svg',
  '/qr/images/vk.svg',
  '/qr/images/wa.svg',
  '/qr/images/ya.svg',
  '/qr/images/yc.svg',
  '/qr/images/fon.svg',

  // --- Фоны ---
  '/qr/images/bgforqr-01.jpg',
  '/qr/images/bgforqr-02.jpg',
  '/qr/images/bgforqr-03.jpg',
  '/qr/images/bgforqr-04.jpg'
];

// 1. Установка Service Worker и кэширование статики
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кэш открыт, загрузка файлов...');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
      .catch(error => console.error('Ошибка кэширования:', error))
  );
});

// 2. Активация и удаление старого кэша
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Перехват запросов
self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
        });
      })
  );
});