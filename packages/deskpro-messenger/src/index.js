import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const run = () => {
  ReactDOM.render(
    <App />,
    window.parent.document.getElementById('deskpro-container')
  );
};

if (document.readyState !== 'loading') {
  run();
} else if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', run);
} else document.attachEvent('onreadystatechange', () => {
    if (document.readyState === 'complete') {
      run();
    }
});
