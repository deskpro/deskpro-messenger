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
    ticketSubject: 'Missed chat from {name}',
    usergroups: [
      1,
      2,
      5,
      6,
      7
    ],
    options: {
      title: 'Start a conversation',
      description: 'Start a chat with one of our agents',
      buttonText: 'Start a new conversation',
      showAgentPhotos: false
    }
  },
  tickets: {
    enabled: false
  },
  messenger: {
    autoStart: false,
    title: 'Get In Touch',
    subtext: '',
    chat: {
      title: 'Chat with us',
      description: 'Start a chat with one of our agents',
      buttonText: 'Start a new conversation',
      inputPlaceholder: 'Type your message here',
      showAgentPhotos: false,
    },
    tickets: {
      title: 'Email Us',
      description: 'Send us a message and we will reply by email',
      buttonText: 'Send a message'
    }
  }
};

const departments = [
  { id: 3, title: 'Sales', children: [] }, { id: 4, title: 'Support', children: [] }
];

const code = "<script type=\"text\/javascript\">\n    window.parent.DESKPRO_MESSENGER_ASSET_URL = \"https:\/\/localhost:3001\";\n    window.parent.DESKPRO_MESSENGER_OPTIONS = {\n      language: {\n        id: \"7\",\n        locale: \"sv\"\n      },\n      helpdeskURL: \"https:\/\/deskpro5.local\",\n      baseUrl: \"https:\/\/localhost:3001\",\n    }\n<\/script>\n<script id=\"dp-messenger-loader\" src=\"\/dyn-assets\/pub\/build\/messenger\/loader.js?v=1522067551\" data-helpdesk-url=\"https:\/\/deskpro5.local\"><\/script>";

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
          code={code}
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
