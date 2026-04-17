// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Public VAPID Key
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;


const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

let isInitialized = false;

// ================= REQUEST PERMISSION & GET TOKEN =================
export const requestPermissionAndGetToken = async () => {
  try {
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    const subscriptionToken = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    console.log("FCM token:", subscriptionToken);
    return subscriptionToken;

  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

// ================= FOREGROUND MESSAGES =================
export const listenForegroundMessages = () => {
  onMessage(messaging, (payload) => {
    console.log("Foreground message received:", payload);

    const title = payload.notification?.title || "Thông báo";
    const options = {
      body: payload.notification?.body || "",
      icon: payload.notification?.icon || "/icon.png",
      data: payload.data || {}
    };

    // Hiển thị notification foreground
    if (Notification.permission === "granted") {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) reg.showNotification(title, options);
      });
    }
  });
};