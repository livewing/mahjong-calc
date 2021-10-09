import React from 'react';
import ReactDOM from 'react-dom';
import { initI18n } from './lib/i18n';
import { App } from './components/app';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

initI18n().then(() => {
  ReactDOM.render(<App />, document.getElementById('app'));
});
