import { env } from '@/config/env';

export async function GET() {
  const swCode = `
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "${env.FIREBASE_API_KEY}",
  authDomain: "${env.FIREBASE_AUTH_DOMAIN}",
  projectId: "${env.FIREBASE_PROJECT_ID}",
  storageBucket: "${env.FIREBASE_STORAGE_BUCKET}",
  messagingSenderId: "${env.FIREBASE_MESSAGING_SENDER_ID}",
  appId: "${env.FIREBASE_APP_ID}",
});

const messaging = firebase.messaging();

// Force SW update
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const data = payload.data || {};
  const notificationTitle = data.title || 'New Message';
  const notificationOptions = {
    body: data.body || 'You have a new message on Artspace.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: data,
    tag: 'chat-notification',
    renotify: true,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const conversationId = event.notification.data?.conversationId;
  
  const urlToOpen = conversationId 
    ? \`/chats?id=\${conversationId}\` 
    : '/chats';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
  `;

  return new Response(swCode, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Service-Worker-Allowed': '/',
    },
  });
}
