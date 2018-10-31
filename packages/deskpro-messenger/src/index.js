import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createMemoryHistory as createHistory } from 'history';
import { Router } from 'react-router-dom';

import App from './App';
import './index.css';
import createStore from './store';

const history = createHistory();
const config = window.parent.DESKPRO_MESSENGER_OPTIONS;
const store = createStore(undefined, { config, history });

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App config={config} />
    </Router>
  </Provider>,
  window.parent.document.getElementById('deskpro-container')
);
