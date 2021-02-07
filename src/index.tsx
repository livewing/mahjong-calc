import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './components/app';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

ReactDOM.render(<App />, document.getElementById('app'));
