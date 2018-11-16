import React from 'react';
import App from '../src/App';
import '../styles/style.css';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Immutable from 'immutable';
import transformConfig from '../src/utils/transformConfig';

const settings = {
  styles: {
    backgroundColor: '#aaa',
    primaryColor: '#3d88f3'
  },
  embed: {
    showOnPortal: false,
    authorizeDomains: ''
  },
  chat: {
    enabled: true,
    prompt: 'What can we help you with today?',
    timeout: 90,
    noAnswerBehavior: 'save_ticket',
    busyMessage:
      'It looks like all of our agents are busy at the moment. You can still send us a ticket below and we will get back to you as soon as possible',
    department: 3,
    ticketSubject: 'Missed chat from {name}'
  },
  tickets: {
    enabled: false
  },
  messenger: {
    autoStart: false,
    title: 'Get In Touch',
    subtext: '',
    chat: {
      title: 'Start a conversation',
      description: 'Start a chat with one of our agents',
      buttonText: 'Start a new conversation',
      showAgentPhotos: false
    },
    tickets: {
      title: 'Contact Us',
      description: 'Send us a message and we will reply by email',
      buttonText: 'Send a message'
    }
  }
};

class SetupStory extends React.Component {
  state = {
    settings: Immutable.fromJS(settings)
  };

  onChange = (value, name) => {
    const { settings } = this.state;

    let config;
    if (typeof value === 'function') {
      config = settings.withMutations(value);
    } else if (name) {
      const keyPath = name.split('.');
      config = settings.setIn(keyPath, value);
    }
    if (config) {
      this.setState({ settings: config });
    }
  };

  export = () => {
    this.props.onExport(transformConfig(this.state.settings));
  };

  render() {
    const { settings } = this.state;
    return (
      <div>
        <App settings={settings} handleChange={this.onChange} />
        <button type="button" onClick={this.export}>
          Dump messenger config
        </button>
      </div>
    );
  }
}

storiesOf('Setup', module).add('Setup screen', () => {
  return <SetupStory onExport={action('messenger-config')} />;
});
