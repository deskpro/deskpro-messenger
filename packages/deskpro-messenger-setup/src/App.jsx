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
    chatCustomFields: PropTypes.object,
    usergroups: PropTypes.object,
    code: PropTypes.string,
  };

  render() {
    const {
      settings,
      handleChange,
      chatDepartments,
      chatCustomFields,
      ticketDepartments,
      usergroups,
      code,
    } = this.props;
    return (
      <div id="dp-messenger-setup">
        <Settings
          settings={settings}
          handleChange={handleChange}
          chatDepartments={chatDepartments}
          ticketDepartments={ticketDepartments}
          chatCustomFields={chatCustomFields}
          usergroups={usergroups}
          code={code}
        >
          <div className={"dp-ms-children"}>
            { this.props.children }
          </div>
        </Settings>
        <Preview config={transformConfig(settings)}/>
      </div>
    );
  }
}

export default App;
