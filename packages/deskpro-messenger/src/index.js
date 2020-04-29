import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

const container = window.parent.document.getElementById('deskpro-container');
container.addEventListener('mouseenter', (e) => disableBodyScroll(container));
container.addEventListener('mouseleave', (e) => enableBodyScroll(container));

ReactDOM.render(
  <App />,
  container
);
