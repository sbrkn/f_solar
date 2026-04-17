'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('Service Worker registered:', registration.scope);
            }
          })
          .catch((err) => {
            console.error('Service Worker registration failed:', err);
          });
      });
    }
  }, []);

  return null;
}
