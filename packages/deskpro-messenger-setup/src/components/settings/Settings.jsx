import React from 'react';
import PropTypes from 'prop-types';
import { Map, fromJS } from 'immutable';
import { Icon, ToggleableList } from '@deskpro/react-components';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import ChatSettings from './ChatSettings';
import EmbedWidget from './EmbedWidget';
import MessengerSettings from './MessengerSettings';
import StyleSettings from './StyleSettings';
import TicketSettings from './TicketSettings';

const dumpStyles = {
  height: '300px',
  overflowY: 'auto',
  border: '1px solid #eee',
  padding: '10px'
};

class Settings extends React.Component {
  static propTypes = {
    settings: PropTypes.instanceOf(Map),
    handleChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    settings: fromJS({})
  };

  render() {
    const { settings, handleChange } = this.props;
    return (
      <div className="messenger-settings">
        <div>
          <Icon name={faCog} /> Site Widget & Chat
        </div>
        <ToggleableList on="click" toggle="opened">
          <StyleSettings config={settings} handleChange={handleChange} />
          <EmbedWidget config={settings} handleChange={handleChange} />
          <ChatSettings config={settings} handleChange={handleChange} />
          <TicketSettings config={settings} handleChange={handleChange} />
          <MessengerSettings config={settings} handleChange={handleChange} />
        </ToggleableList>
        <div>
          <h2>Settings:</h2>
          <pre style={dumpStyles}>
            {JSON.stringify(settings.toJS(), null, 2)}
          </pre>
        </div>
      </div>
    );
  }
}

export default Settings;
