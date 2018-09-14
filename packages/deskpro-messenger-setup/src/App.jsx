import React, { PureComponent } from 'react';
import '@deskpro/react-components/dist/main.css';

import Settings from './components/settings/Settings';
import Preview from './components/preview/Preview';

class App extends PureComponent {
  render() {
    return (
      <div id="dp-messenger-setup">
        <Settings />
        <Preview />
      </div>
    );
  }
}

export default App;