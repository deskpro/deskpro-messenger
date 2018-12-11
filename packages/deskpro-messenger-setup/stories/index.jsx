import React from 'react';
import App from '../src/App';

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
    ticketDefaults: {
      department: 3,
    },
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

const departments = [
  { id: 3, title: 'Sales' }, { id: 4, title: 'Support' }
];

class SetupStory extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: settings
    };
  }

  onChange = (value, name) => {
    const settings = Immutable.fromJS(this.state.settings);

    let config;
    if (typeof value === 'function') {
      config = settings.withMutations(value);
    } else if (name) {
      const keyPath = name.split('.');
      config = settings.setIn(keyPath, value);
    }
    if (config) {
      this.setState({ settings: config.toJS() });
    }
  };

  export = () => {
    this.props.onExport(transformConfig(Immutable.fromJS(this.state.settings)));
  };

  render() {
    const { settings } = this.state;
    return (
      <div>
        <App
          settings={Immutable.fromJS(settings)}
          handleChange={this.onChange}
          ticketDepartments={Immutable.fromJS(departments)}
          chatDepartments={Immutable.fromJS(departments)}
        />
        <button type="button" onClick={this.export}>
          Dump messenger config
        </button>
      </div>
    );
  }
}

storiesOf('Setup', module)
  .add('Setup screen', () => {
    return <SetupStory onExport={action('messenger-config')} />;
  }
);
