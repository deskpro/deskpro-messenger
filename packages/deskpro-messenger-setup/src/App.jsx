import React from 'react';
import PropTypes from 'prop-types';
import '@deskpro/react-components/dist/main.css';

import Settings from './components/settings/Settings';
import Preview from './components/preview/Preview';
import transformConfig from "./utils/transformConfig";
import '../styles/elements/settings.css';

class App extends React.Component {
  static propTypes = {
    settings: PropTypes.object,
    handleChange: PropTypes.func,
    chatDepartments: PropTypes.object,
    ticketDepartments: PropTypes.object,
  };

  render() {
    const {
      settings,
      handleChange,
      chatDepartments,
      ticketDepartments
    } = this.props;
    return (
      <div id="dp-messenger-setup">
        <Settings
          settings={settings}
          handleChange={handleChange}
          chatDepartments={chatDepartments}
          ticketDepartments={ticketDepartments}
        />
        <Preview config={transformConfig(settings)}/>
      </div>
    );
  }
}

export default App;
