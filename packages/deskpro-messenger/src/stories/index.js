import React from 'react';
import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import { withKnobs, boolean, button } from '@storybook/addon-knobs';

import App from '../App';
import '../index.css';

import createStore from '../store';
const store = createStore();

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
            to: 'supportChat'
          }
        ]
      }
    };

    if (boolean('Enable Sales Chat', true, 'Config')) {
      screens.index.blocks.push({
        blockType: 'StartChatBlock',
        linkText: 'Start sales chat',
        to: 'salesChat'
      });
      screens.salesChat = {
        screenType: 'ChatScreen',
        category: 'sales'
      };
    }
    if (boolean('Enable Support Chat', true, 'Config')) {
      screens.index.blocks.push({
        blockType: 'StartChatBlock',
        linkText: 'Start support chat',
        to: 'supportChat'
      });
      screens.supportChat = {
        screenType: 'ChatScreen',
        category: 'support'
      };
    }
    if (boolean('Enable Tickets', false, 'Config')) {
      screens.index.blocks.push({
        blockType: 'TicketsBlock',
        to: 'tickets'
      });
      screens.tickets = {
        screenType: 'TicketsScreen'
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

    return (
      <Provider store={store}>
        <App config={{ screens, greetings, enabledGreetings }} />
      </Provider>
    );
  });
