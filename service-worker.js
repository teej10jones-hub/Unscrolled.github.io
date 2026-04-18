self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { self.clients.claim(); });
self.addEventListener('fetch', (e) => { e.respondWith(fetch(e.request)); });

// ── Scheduled notifications ───────────────────────────────────────────────────
// Messages posted from the main thread: { type:'SCHEDULE_NOTIFICATIONS', quotes:[], delays:[300000,600000] }
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SCHEDULE_NOTIFICATIONS') {
    const { quotes, delays } = e.data;
    delays.forEach((delay, i) => {
      setTimeout(() => {
        const pool = [
          "How about another verse?",
          "Time for some inspiration?",
          "Remember to look up.",
          "Do you want to still be here?",
          "A moment of reflection awaits.",
          "You are loved.",
          "What are you grateful for?"
        ];
        // Every other notification use a quote if available
        let body, title;
        if (i % 2 === 1 && quotes && quotes.length) {
          const q = quotes[Math.floor(Math.random() * quotes.length)];
          title = "Unscrolled";
          body = q.length > 100 ? q.slice(0, 97) + "…" : q;
        } else {
          title = "Unscrolled";
          body = pool[Math.floor(Math.random() * pool.length)];
        }
        self.registration.showNotification(title, {
          body,
          icon: 'icon.png',
          badge: 'icon.png',
          tag: 'unscrolled-reminder-' + i,
          renotify: true,
        });
      }, delay);
    });
  }
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});
