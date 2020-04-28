import "core-js"; // es6+ polyfills
import "regenerator-runtime/runtime"; // runtime for babel generator and async/await
import "whatwg-fetch"; // fetch API polyfill
import "dom4"; // various DOM polyfills - e.g. Element.closest and Element.remove
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
