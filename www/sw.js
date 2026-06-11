// Notes+ Service Worker v4
// Handles background push notifications & offline caching

const CACHE_NAME = 'notesplus-v4';
const ASSETS = ['/', '/index.html'];

// ── INSTALL ──────────────────────────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

// ── ACTIVATE ─────────────────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── FETCH (offline support) ───────────────────────────────────
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => cached))
  );
});

// ── NOTIFICATION CLICK ────────────────────────────────────────
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (let c of list) {
        if (c.url && 'focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});

// ── ALARM CHECKER (runs every minute via message) ─────────────
// The app pings us via postMessage to keep alarms alive even when
// the browser tab is in the background.
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'CHECK_ALARMS') {
    checkAlarms(e.data.reminders);
  }
  if (e.data && e.data.type === 'SCHEDULE_EXACT') {
    // Store reminders list for background check
    scheduleReminders(e.data.reminders);
  }
});

// Track which alarms have fired this minute to avoid duplicates
const fired = new Set();

function checkAlarms(reminders) {
  if (!reminders || !reminders.length) return;

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const nowTime = hh + ':' + mm;

  reminders.forEach(r => {
    if (!r.time) return;
    let shouldFire = false;

    if (r.repeat === 'once') {
      shouldFire = (r.start === todayStr && r.time === nowTime);
    } else if (r.repeat === 'daily') {
      const inRange = (!r.start || todayStr >= r.start) && (!r.end || todayStr <= r.end);
      shouldFire = inRange && r.time === nowTime;
    } else if (r.repeat === 'weekly') {
      const startD = r.start ? new Date(r.start + 'T00:00:00') : null;
      const todayD = new Date(todayStr + 'T00:00:00');
      const sameWeekday = startD ? todayD.getDay() === startD.getDay() : true;
      const inRange = (!r.start || todayStr >= r.start) && (!r.end || todayStr <= r.end);
      shouldFire = inRange && sameWeekday && r.time === nowTime;
    } else if (r.repeat === 'monthly') {
      const startD = r.start ? new Date(r.start + 'T00:00:00') : null;
      const todayD = new Date(todayStr + 'T00:00:00');
      const sameDay = startD ? todayD.getDate() === startD.getDate() : true;
      const inRange = (!r.start || todayStr >= r.start) && (!r.end || todayStr <= r.end);
      shouldFire = inRange && sameDay && r.time === nowTime;
    }

    if (shouldFire) {
      const key = `${r.id}_${todayStr}_${nowTime}`;
      if (!fired.has(key)) {
        fired.add(key);
        // Clean up old fired keys every hour
        if (fired.size > 200) fired.clear();
        self.registration.showNotification(r.title || r.actual || 'Reminder', {
          body: r.msg || 'You have a reminder! ✨',
          icon: 'icon-192.png',
          badge: 'icon-96.png',
          tag: String(r.id),
          vibrate: [200, 100, 200, 100, 200],
          requireInteraction: false,
          silent: false,
          data: { url: '/' }
        });
      }
    }
  });
}

// ── PERIODIC BACKGROUND SYNC (Android Chrome supports this) ──
self.addEventListener('periodicsync', e => {
  if (e.tag === 'check-reminders') {
    e.waitUntil(
      self.clients.matchAll().then(clients => {
        // Ask app for reminders data
        clients.forEach(c => c.postMessage({ type: 'GET_REMINDERS' }));
      })
    );
  }
});

// Keep a local copy of reminders from last sync for background checks
let _reminders = [];
function scheduleReminders(reminders) {
  _reminders = reminders || [];
}

// Self-check every 60s if app sends us data
setInterval(() => {
  if (_reminders.length) checkAlarms(_reminders);
}, 60000);
