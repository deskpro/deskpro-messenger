import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './components/App';
import './index.css';
import createStore from './store';

const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <App config={window.parent.DESKPRO_MESSENGER_OPTIONS} />
  </Provider>,
  window.parent.document.getElementById('deskpro-container')
);
