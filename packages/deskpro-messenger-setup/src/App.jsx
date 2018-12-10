import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import '@deskpro/react-components/dist/main.css';

import Settings from './components/settings/Settings';
import Preview from './components/preview/Preview';
import transformConfig from "./utils/transformConfig";
import style from '../styles/style.css';

class App extends PureComponent {
  static = {
    settings: PropTypes.object,
    handleChange: PropTypes.func
  };

  render() {
    const { settings, handleChange } = this.props;
    return (
      <div id="dp-messenger-setup">
        <Settings settings={settings} handleChange={handleChange} />
        <Preview config={transformConfig(settings)}/>
      </div>
    );
  }
}

export default App;
