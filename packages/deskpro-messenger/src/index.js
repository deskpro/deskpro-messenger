import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import './index.css';
import createStore from './store';
import currentUser from './services/CurrentUser';

const config = window.parent.DESKPRO_MESSENGER_OPTIONS;
const store = createStore(undefined, config);

currentUser.init(store, config).then((cache) =>
  ReactDOM.render(
    <Provider store={store}>
      <App config={config} cache={cache} />
    </Provider>,
    window.parent.document.getElementById('deskpro-container')
  )
);
