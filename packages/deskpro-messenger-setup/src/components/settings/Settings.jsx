import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { Icon, ToggleableList, Section } from '@deskpro/react-components';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import ChatSettings from './ChatSettings';
import EmbedWidget from './EmbedWidget';
import MessengerSettings from './MessengerSettings';
import StyleSettings from './StyleSettings';
import TicketSettings from './TicketSettings';

class Settings extends React.Component {
  static propTypes = {
    settings: PropTypes.object,
    handleChange: PropTypes.func.isRequired,
    chatDepartments: PropTypes.object,
    ticketDepartments: PropTypes.object,
  };

  static defaultProps = {
    settings: fromJS({})
  };

  render() {
    const {
      settings,
      handleChange,
      chatDepartments,
      ticketDepartments,
    } = this.props;

    return (
      <div className="messenger-settings">
        <div>
          <Icon name={faCog} /> Site Widget & Chat
        </div>

        <ToggleableList on="click" toggle="opened">
          <StyleSettings
            id="style"
            config={settings}
            handleChange={handleChange}
          />
          <EmbedWidget
            id="embed"
            config={settings}
            handleChange={handleChange}
          />
          <ChatSettings
            id="chat"
            config={settings}
            handleChange={handleChange}
            chatDepartments={chatDepartments}
            ticketDepartments={ticketDepartments}
          />
          <TicketSettings
            id="ticket"
            config={settings}
            handleChange={handleChange}
            ticketDepartments={ticketDepartments}
          />
          <MessengerSettings
            id="messenger"
            config={settings}
            handleChange={handleChange}
          />
        </ToggleableList>
      </div>
    );
  }
}

export default Settings;
