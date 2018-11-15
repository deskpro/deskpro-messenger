import React from 'react';
import App from '../src/App';
import '../styles/style.css';

import { storiesOf } from '@storybook/react';
import Immutable from "immutable";

const settings = {
  screens: {
    index: {
      screenType: 'Blocks',
      blocks: [{
        blockType: 'StartChatBlock',
        linkText: 'Start support chat',
        to: 'startSupportChat'
      },
        {
          blockType: 'StartChatBlock',
          linkText: 'Start sales chat',
          to: 'startSalesChat'
        },
        {
          blockType: 'ScreenLink',
          blockTitle: 'tickets.create_form_block.header',
          label: 'tickets.create_form_block.link_label',
          to: 'newTicket',
        },
      ]
    },
    startSupportChat: {
      screenType: 'StartChatScreen',
      department: 3,
      prompt: 'chat.prompt.support',
      noAnswerBehavior: 'save_ticket',
      ticketFormConfig: [{
        fields: [{
          name: 'name',
          label: 'Full Name',
          type: 'text',
          validation: ['required'],
          placeholder: 'John Doe'
        },
          {
            name: 'email',
            label: 'Email',
            type: 'text',
            validation: ['required'],
            placeholder: 'john.doe@company.com'
          }
        ]
      }]
    },
    startSalesChat: {
      screenType: 'StartChatScreen',
      department: 4,
      noAnswerBehavior: 'new_ticket',
      preChatForm: [{
        rules: [{
          field: 'department',
          value: 4,
          op: 'eq'
        }],
        fields: [{
          name: 'name',
          label: 'Full Name',
          type: 'text',
          validation: ['required'],
          placeholder: 'John Doe'
        },
          {
            name: 'email',
            label: 'Email',
            type: 'text',
            validation: ['required'],
            placeholder: 'john.doe@company.com'
          },
          {
            name: 'budget',
            label: 'Budget',
            type: 'text'
          }
        ]
      },
        {
          rules: [{
            field: 'department',
            value: 3,
            op: 'eq'
          }],
          fields: [{
            name: 'name',
            label: 'Full Name',
            type: 'text',
            validation: ['required'],
            placeholder: 'John Doe'
          },
            {
              name: 'email',
              label: 'Email',
              type: 'text',
              validation: ['required'],
              placeholder: 'john.doe@company.com'
            },
            {
              name: 'cloud_premise',
              label: 'Cloud or On-Premise',
              type: 'choice',
              dataSource: {
                getOptions: [{
                  value: 'cloud',
                  label: 'Cloud'
                },
                  {
                    value: 'on-premise',
                    label: 'On-Premise'
                  }
                ]
              }
            }
          ]
        }
      ]
    },
    newTicket: {
      screenType: 'TicketFormScreen',
      formConfig: [{
        fields: [{
          name: 'subject',
          label: 'Subject',
          type: 'text',
          validation: ['required']
        },
          {
            name: 'name',
            label: 'Full Name',
            type: 'text',
            validation: ['required'],
            placeholder: 'John Doe'
          },
          {
            name: 'email',
            label: 'Email',
            type: 'text',
            validation: ['required'],
            placeholder: 'john.doe@company.com'
          }, {
            name: 'message',
            label: 'Message',
            type: 'textarea',
            validation: ['required'],
            placeholder: 'Enter you message here...',
          }
        ],
      }],
    },
    greetingChat: {
      screenType: 'Blocks',
      blocks: [{
        blockType: 'StartChatBlock',
        to: 'startSupportChat'
      }]
    }
  },
  greetings: {
    greeting1: {
      greetingType: 'SimpleGreeting'
    },
    greeting2: {
      greetingType: 'PricingGreeting'
    },
  },
  enabledGreetings: [null, '/screens/greetingChat', '/greetings/greeting1', '/greetings/greeting2'],
  sounds: {
    user: '/assets/audio/to-the-point.mp3',
  },
  themeVars: {
    '--color-primary': '#3d88f3',
  },
};

class SetupStory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: Immutable.fromJS(settings)
    }
  }

  onChange = (settings) => {
    this.setState({
      settings
    });
  };

  render() {
    const { settings } = this.state;
    return (
      <App
        settings={settings}
        onChange={this.onChange}
      />
    );
  }
}

storiesOf('Setup', module)
  .add('Setup screen', () => {
    return <SetupStory />;
  }
);
