import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import './index.css';

ReactDOM.render(
  <App />,
  window.parent.document.getElementById('deskpro-container')
);
