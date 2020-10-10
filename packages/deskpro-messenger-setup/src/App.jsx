import React from 'react';
import PropTypes from 'prop-types';
import '@deskpro/react-components/dist/main.css';

import Settings from './components/settings/Settings';
import '../styles/elements/settings.css';
import Immutable from 'immutable';

class App extends React.Component {
  static propTypes = {
    settings: PropTypes.object,
    handleChange: PropTypes.func,
    chatDepartments: PropTypes.object,
    ticketDepartments: PropTypes.object,
    chatCustomFields: PropTypes.object,
    usergroups: PropTypes.object,
    code: PropTypes.string,
    apiBaseUrl: PropTypes.string,
    languageId: PropTypes.number,
  };

  static defaultProps = {
    apiBaseUrl: '/api',
    languageId: 1
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
      apiBaseUrl,
      languageId,
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
          handleSubmit={this.props.handleSubmit}
          code={code}
          apiBaseUrl={apiBaseUrl.replace(/\/$/, "")}
          languageId={languageId}
        >
          <div className={"dp-ms-children"}>
            { this.props.children }
          </div>
        </Settings>
      </div>
    );
  }
}

export default App;
