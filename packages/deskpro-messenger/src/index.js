import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import './index.css';
import createStore from './store';
import currentUser from './services/CurrentUser';

const store = createStore();

currentUser.init(store).then(() =>
  ReactDOM.render(
    <Provider store={store}>
      <App config={window.parent.DESKPRO_MESSENGER_OPTIONS} />
    </Provider>,
    window.parent.document.getElementById('deskpro-container')
  )
);
