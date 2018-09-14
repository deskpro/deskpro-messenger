import React from 'react';
import Immutable from 'immutable';
import {
  Icon,
  ToggleableList,
} from '@deskpro/react-components';
import ChatSettings from './ChatSettings';
import EmbedWidget from './EmbedWidget';
import MessengerSettings from './MessengerSettings';
import StyleSettings from './StyleSettings';
import TicketSettings from './TicketSettings';

class Settings extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      config: Immutable.fromJS(
        {
          authorize_domains: `example.com\n*.example.com`,
          user_prompt: 'What can we help you with today?',
          busy_message: 'It looks like all of our agents are busy at the moment. You can still send us a ticket below and we\'ll get back to you as soon as possible',
          messenger: {
            greeting: 'Get in touch',
            chat: {
              title: 'Start a conversation',
              description: 'Start a chat with one of our agents',
              button_text: 'Start a new conversation',
            },
            tickets: {
              title: 'Contact us',
              description: 'Send us a message and we\'ll reply by email',
              button_text: 'Send us a message'
            }
          }
        }
      )
    }
  }

  handleChange(value, name) {
    const { config } = this.state;
    config[name] = value;
    this.setState({
      config
    });
  }

  render() {
    const { config } = this.state;
    return (
      <div className="messenger-settings">
        <div>
          <Icon name="cog" /> Site Widget & Chat
        </div>
        <ToggleableList on="click" toggle="opened">
          <StyleSettings config={config} />
          <EmbedWidget config={config} />
          <ChatSettings config={config} />
          <TicketSettings config={config} />
          <MessengerSettings config={config} />
        </ToggleableList>
        Settings
      </div>
    );
  }
}

export default Settings;