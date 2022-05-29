import React from 'react';
import { Provider } from 'react-redux';
import { createMemoryHistory as createHistory } from 'history';
import { MemoryRouter, Router } from 'react-router-dom';

import Main from './containers/Main';
import './index.css';
import createStore from './store';
import createApiService from './services/api';
import cache from './services/Cache';
import cssVars from "css-vars-ponyfill";

const history = createHistory();
const config = {
  helpdeskURL: process.env.REACT_APP_API_BASE,
  ...window.parent.DESKPRO_MESSENGER_OPTIONS
};
const api = createApiService(config);
const store = createStore(undefined, { config, history, api, cache });

if(!(window.CSS && CSS.supports('color', 'var(--fake-var)'))) {
  cssVars({
    onlyLegacy   : true,
    shadowDOM: true,
    watch: true,
    updateURLs: false
  });
}
const RouterComponent = (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) ? MemoryRouter : Router;

export default () => <Provider store={store}>
  <RouterComponent history={history}>
    <Main config={config} cache={cache} api={api} />
  </RouterComponent>
</Provider>;
