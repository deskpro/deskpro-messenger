import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryHistory as createHistory } from 'history';
import { Router } from 'react-router-dom';

import Main from './containers/Main';
import './index.css';
import createStore from './store';
import createApiService from './services/api';
import cache from './services/Cache';

const history = createHistory();
const config = {
  helpdeskURL: process.env.REACT_APP_API_BASE,
  froalaKey: process.env.REACT_APP_FROALA_KEY,
  ...window.parent.DESKPRO_MESSENGER_OPTIONS
};
const api = createApiService(config);
const store = createStore(undefined, { config, history, api, cache });

export default () => <Provider store={store}>
  <Router history={history}>
    <Main config={config} />
  </Router>
</Provider>;
