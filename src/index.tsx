import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import { StoreProvider } from './contexts/store';
import { initI18n } from './lib/i18n';
import './style.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('/sw.js')
  );
}

initI18n().then(() => {
  const el = document.getElementById('app');
  if (el === null) throw new Error('#app is not found');
  createRoot(el).render(
    <React.StrictMode>
      <StoreProvider>
        <App />
      </StoreProvider>
    </React.StrictMode>
  );
});
