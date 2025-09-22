// Service Worker لموقع 4GAMER
const CACHE_NAME = '4gamer-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/advanced-features.js',
    '/admin.html',
    '/admin.js',
    '/games.json',
    '/assets/ghost_of_tsushima_thumb.jpg',
    '/assets/far_cry_3_thumb.jpg',
    '/assets/last_of_us_2_thumb.jpg',
    '/assets/god_of_war_thumb.jpg',
    '/assets/spiderman_thumb.jpg',
    '/assets/horizon_zero_dawn_thumb.jpg',
    '/assets/uncharted_4_thumb.jpg',
    '/assets/bloodborne_thumb.jpg',
    '/assets/red_dead_2_thumb.jpg',
    '/assets/persona_5_thumb.jpg',
    '/assets/last_of_us_ps3_thumb.jpg',
    '/assets/gta_v_ps3_thumb.jpg',
    '/assets/cyberpunk_2077_thumb.jpg',
    '/assets/witcher_3_thumb.jpg',
    '/assets/elden_ring_thumb.jpg',
    '/assets/default_thumb.jpg'
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('فتح الكاش');
                return cache.addAll(urlsToCache);
            })
    );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('حذف الكاش القديم:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// اعتراض الطلبات
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // إرجاع الملف من الكاش إذا وجد
                if (response) {
                    return response;
                }

                // إذا لم يوجد في الكاش، جلب من الشبكة
                return fetch(event.request).then((response) => {
                    // التحقق من صحة الاستجابة
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // نسخ الاستجابة
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                }).catch(() => {
                    // في حالة عدم وجود اتصال، إرجاع صفحة افتراضية
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});

// معالجة الرسائل من الصفحة الرئيسية
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// إشعارات الدفع (Push Notifications)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'إشعار جديد من 4GAMER',
        icon: '/assets/icon-192x192.png',
        badge: '/assets/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'استكشف الألعاب',
                icon: '/assets/checkmark.png'
            },
            {
                action: 'close',
                title: 'إغلاق',
                icon: '/assets/xmark.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('4GAMER', options)
    );
});

// معالجة النقر على الإشعارات
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        // فتح الموقع
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'close') {
        // إغلاق الإشعار فقط
        return;
    } else {
        // النقر على الإشعار نفسه
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// تحديث الكاش في الخلفية
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(
            updateCache()
        );
    }
});

// وظيفة تحديث الكاش
async function updateCache() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const requests = await cache.keys();
        
        for (const request of requests) {
            try {
                const response = await fetch(request);
                if (response.status === 200) {
                    await cache.put(request, response);
                }
            } catch (error) {
                console.log('فشل في تحديث:', request.url);
            }
        }
    } catch (error) {
        console.log('فشل في تحديث الكاش:', error);
    }
}

// معالجة أخطاء الشبكة
self.addEventListener('error', (event) => {
    console.log('خطأ في Service Worker:', event.error);
});

// معالجة الأخطاء غير المعالجة
self.addEventListener('unhandledrejection', (event) => {
    console.log('خطأ Promise غير معالج في Service Worker:', event.reason);
});

// تنظيف الكاش القديم
setInterval(() => {
    caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
            if (cacheName !== CACHE_NAME) {
                caches.delete(cacheName);
            }
        });
    });
}, 24 * 60 * 60 * 1000); // كل 24 ساعة
