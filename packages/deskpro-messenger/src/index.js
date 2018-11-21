import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createMemoryHistory as createHistory } from 'history';
import { Router } from 'react-router-dom';

import App from './App';
import './index.css';
import createStore from './store';
import createApiService from './services/api';

const history = createHistory();
const config = {
  helpdeskURL: process.env.REACT_APP_API_BASE,
  froalaKey: process.env.REACT_APP_FROALA_KEY,
  ...window.parent.DESKPRO_MESSENGER_OPTIONS
};
const api = createApiService(config);
const store = createStore(undefined, { config, history, api });

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App config={config} />
    </Router>
  </Provider>,
  window.parent.document.getElementById('deskpro-container')
);