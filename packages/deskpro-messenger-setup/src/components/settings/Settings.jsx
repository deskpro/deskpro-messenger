import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  ToggleableList,
} from '@deskpro/react-components';
import { faCog } from "@fortawesome/free-solid-svg-icons";
import ChatSettings from './ChatSettings';
import EmbedWidget from './EmbedWidget';
import MessengerSettings from './MessengerSettings';
import StyleSettings from './StyleSettings';
import TicketSettings from './TicketSettings';

class Settings extends React.Component {
  static propTypes = {
    settings: PropTypes.object,
    onChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      // config: Immutable.fromJS(
      //   {
      //     authorize_domains: `example.com\n*.example.com`,
      //     user_prompt: 'What can we help you with today?',
      //     busy_message: 'It looks like all of our agents are busy at the moment. You can still send us a ticket below and we\'ll get back to you as soon as possible',
      //     messenger: {
      //       greeting: 'Get in touch',
      //       chat: {
      //         title: 'Start a conversation',
      //         description: 'Start a chat with one of our agents',
      //         button_text: 'Start a new conversation',
      //       },
      //       tickets: {
      //         title: 'Contact us',
      //         description: 'Send us a message and we\'ll reply by email',
      //         button_text: 'Send us a message'
      //       }
      //     }
      //   }
      // )
      config: props.settings
    }
  }

  handleChange = (value, name) => {
    const { config } = this.state;
    const { onChange } = this.props;

    if (name) {
      const keyPath = name.split('.');
      const newConfig = config.setIn(keyPath, value);
      this.setState({
        config: newConfig
      });
      onChange(newConfig);
    } else {
      console.log('missing name');
    }
  };

  render() {
    const { config } = this.state;
    return (
      <div className="messenger-settings">
        <div>
          <Icon name={faCog} /> Site Widget & Chat
        </div>
        <ToggleableList on="click" toggle="opened">
          <StyleSettings config={config} handleChange={this.handleChange} />
          <EmbedWidget config={config} handleChange={this.handleChange} />
          <ChatSettings config={config} handleChange={this.handleChange} />
          <TicketSettings config={config} handleChange={this.handleChange} />
          <MessengerSettings config={config} handleChange={this.handleChange} />
        </ToggleableList>
        Settings:
        {JSON.stringify(config.toJS())}
      </div>
    );
  }
}

export default Settings;
