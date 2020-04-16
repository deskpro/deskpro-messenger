import React from 'react';
import PropTypes from 'prop-types';
import { fromJS } from 'immutable';
import { Icon, ToggleableList } from '@deskpro/react-components';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import ChatSettings from './ChatSettings';
import EmbedWidget from './EmbedWidget';
import ProactiveSettings from './ProactiveSettings';
import WidgetSettings from './WidgetSettings';
import TicketSettings from './TicketSettings';

class Settings extends React.Component {
  static propTypes = {
    settings: PropTypes.object,
    handleChange: PropTypes.func.isRequired,
    chatDepartments: PropTypes.object,
    ticketDepartments: PropTypes.object,
    chatCustomFields: PropTypes.object,
    usergroups: PropTypes.object,
    code: PropTypes.string,
  };

  static defaultProps = {
    settings: fromJS({}),
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
      <div className="dp-ms-container">
        <div>
          <Icon name={faCog} /> Site Widget & Chat
        </div>

        <ToggleableList on="click" toggle="opened">
          <WidgetSettings
            id="style"
            config={settings}
            handleChange={handleChange}
          />
          <ChatSettings
            id="chat"
            config={settings}
            handleChange={handleChange}
            chatDepartments={chatDepartments}
            ticketDepartments={ticketDepartments}
            chatCustomFields={chatCustomFields}
            usergroups={usergroups}
          />
          <ProactiveSettings
            id="messenger"
            config={settings}
            handleChange={handleChange}
          />
          <TicketSettings
            id="ticket"
            config={settings}
            handleChange={handleChange}
            ticketDepartments={ticketDepartments}
          />
          <EmbedWidget
            id="embed"
            config={settings}
            handleChange={handleChange}
            code={code}
          />
        </ToggleableList>
        { this.props.children }
      </div>
    );
  }
}

export default Settings;
