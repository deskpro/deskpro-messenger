import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import {
  withKnobs,
  boolean,
  button,
  select,
  color
} from '@storybook/addon-knobs';
import _isPlainObject from 'lodash/isPlainObject';

import App from '../App';
import '../index.css';

import currentUser from '../services/CurrentUser';
import createStore from '../store';

/**
 * Workaround for async app starting.
 */
class InitCurrentUser extends PureComponent {
  state = {};
  componentDidMount() {
    currentUser
      .init(this.props.store)
      .then((cache) => this.setState({ cache }));
  }
  render() {
    if (_isPlainObject(this.state.cache)) {
      return this.props.children(this.state.cache);
    }
    return null;
  }
}

storiesOf('Messenger', module)
  .addDecorator(withKnobs)
  .add('Messenger', () => {
    const screens = {
      index: {
        screenType: 'Blocks',
        blocks: []
      },
      greetingChat: {
        screenType: 'Blocks',
        blocks: [
          {
            blockType: 'StartChatBlock',
            to: 'startSupportChat'
          }
        ]
      }
    };

    if (boolean('Enable Sales Chat', true, 'Config')) {
      screens.index.blocks.push({
        blockType: 'StartChatBlock',
        linkText: 'Start sales chat',
        to: 'startSalesChat'
      });
      screens.startSalesChat = {
        screenType: 'StartChatScreen',
        category: 'sales',
        noAnswerBehavior: 'new_ticket',
        preChatForm: [
          {
            rules: [
              {
                field: 'category',
                value: 'sales',
                op: 'eq'
              }
            ],
            fields: [
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
              },
              {
                name: 'budget',
                label: 'Budget',
                type: 'text'
              }
            ]
          },
          {
            rules: [
              {
                field: 'category',
                value: 'support',
                op: 'eq'
              }
            ],
            fields: [
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
              },
              {
                name: 'cloud_premise',
                label: 'Cloud or On-Premise',
                type: 'choice',
                dataSource: {
                  getOptions: [
                    {
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
      };
    }
    if (boolean('Enable Support Chat', true, 'Config')) {
      screens.index.blocks.push({
        blockType: 'StartChatBlock',
        linkText: 'Start support chat',
        to: 'startSupportChat'
      });
      screens.startSupportChat = {
        screenType: 'StartChatScreen',
        category: 'support',
        prompt: 'chat.prompt.support',
        noAnswerBehavior: 'save_ticket',
        ticketFormConfig: [
          {
            fields: [
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
              }
            ]
          }
        ]
      };
    }
    if (boolean('Enable Ticket Form', true, 'Config')) {
      screens.index.blocks.push({
        blockType: 'ScreenLink',
        blockTitle: 'tickets.create_form_block.header',
        label: 'tickets.create_form_block.link_label',
        to: 'newTicket'
      });
      screens.newTicket = {
        screenType: 'TicketFormScreen',
        formConfig: [
          {
            fields: [
              {
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
              },
              {
                name: 'message',
                label: 'Message',
                type: 'textarea',
                validation: ['required'],
                placeholder: 'Enter you message here...'
              }
            ]
          }
        ]
      };
    }
    if (boolean('Enable Html Block #1', false, 'Config')) {
      screens.index.blocks.push({
        blockType: 'ScreenLink',
        label: 'Show html #1',
        to: 'customHtml1'
      });
      screens.customHtml1 = {
        screenType: 'HtmlScreen',
        html: '<h2>Lorem Ipsum</h2><p>Some body text in P tag.</p>'
      };
    }
    if (boolean('Enable Html Block #2', false, 'Config')) {
      screens.index.blocks.push({
        blockType: 'ScreenLink',
        label: 'Show html #2',
        to: 'customHtml2'
      });
      screens.customHtml2 = {
        screenType: 'HtmlScreen',
        html: '<h2>Another HTML block</h2><p>Another body text in P tag.</p>'
      };
    }

    const greetings = {
      greeting1: {
        greetingType: 'SimpleGreeting'
      },
      greeting2: {
        greetingType: 'PricingGreeting'
      }
    };
    const enabledGreetings = [
      null,
      '/screens/greetingChat',
      '/greetings/greeting1',
      '/greetings/greeting2'
    ];

    const buttonHandler = () => {
      window.parent.DeskProMessenger.send('open', { screen: 'salesChat' });
    };

    button('Open Sales Chat', buttonHandler, 'API');

    const themeVars = {
      '--color-primary': color('Primary Color', '#3d88f3', 'Theme'),
      '--color-background': color('Background Color', '#3d88f3', 'Theme')
    };

    const config = {
      locale: select('Locale', ['en-US', 'ru-RU'], 'en-US', 'i18n'),
      screens,
      greetings,
      enabledGreetings,
      themeVars
    };

    const store = createStore(undefined, config);

    return (
      <Provider store={store}>
        <InitCurrentUser store={store}>
          {(cache) => <App config={config} cache={cache} />}
        </InitCurrentUser>
      </Provider>
    );
  });
