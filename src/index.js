import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import './index.css';

ReactDOM.render(
  <App config={window.parent.DESKPRO_WIDGET_OPTIONS} />,
  window.parent.document.getElementById('deskpro-container')
);
