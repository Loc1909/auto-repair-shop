// service-worker.js

// Khi nhận push từ FCM
self.addEventListener('push', function(event) {
  const payload = event.data.json(); // FCM gửi JSON
  const options = {
    body: payload.notification?.body || 'Bạn có thông báo mới',
    icon: payload.notification?.icon || '/icon.png',
    data: payload.data || {}, // chứa click_action hoặc thông tin khác
    badge: '/badge.png' // optional
  };

  event.waitUntil(
    self.registration.showNotification(payload.notification?.title || 'Thông báo', options)
  );
});

// Khi người dùng click vào notification
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const clickAction = event.notification.data.click_action || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        for (let client of windowClients) {
          if (client.url === clickAction && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(clickAction);
        }
      })
  );
});