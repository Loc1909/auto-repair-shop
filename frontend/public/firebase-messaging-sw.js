// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
});

const messaging = firebase.messaging();

// ================= BACKGROUND MESSAGE =================
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);

  const title = payload.notification?.title || "Thông báo";
  const options = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/icon.png",
    data: payload.data || {}
  };

  self.registration.showNotification(title, options);
});

// ================= CLICK NOTIFICATION =================
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.click_action || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        // Nếu tab đã mở URL này thì focus
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      // Nếu chưa mở thì tạo tab mới
      return clients.openWindow(url);
    })
  );
});