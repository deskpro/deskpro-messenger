import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import enLocale from 'react-intl/locale-data/en';

import App from './App';
import './index.css';
import createStore from './store';

const store = createStore();

addLocaleData(enLocale);

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale={navigator.language}>
      <App config={window.parent.DESKPRO_MESSENGER_OPTIONS} />
    </IntlProvider>
  </Provider>,
  window.parent.document.getElementById('deskpro-container')
);
