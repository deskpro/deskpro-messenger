import React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';
import { withKnobs, boolean, select } from '@storybook/addon-knobs';

import App from '../components/App';
import '../index.css';

storiesOf('Widget', module)
  .addDecorator(withKnobs)
  .add('Widget', () => {
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

    if (boolean('Enable Sales Chat', true)) {
      screens.index.blocks.push({
        blockType: 'StartChatBlock',
        to: 'salesChat'
      });
      screens.salesChat = {
        screenType: 'ChatScreen',
        category: 'sales'
      };
    }
    if (boolean('Enable Support Chat', true)) {
      screens.index.blocks.push({
        blockType: 'StartChatBlock',
        to: 'supportChat'
      });
      screens.supportChat = {
        screenType: 'ChatScreen',
        category: 'support'
      };
    }
    if (boolean('Enable Tickets', false)) {
      screens.index.blocks.push({
        blockType: 'TicketsBlock',
        to: 'tickets'
      });
      screens.tickets = {
        screenType: 'TicketsScreen'
      };
    }
    if (boolean('Enable Html Block #1', false)) {
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
    if (boolean('Enable Html Block #2', false)) {
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

    return <App config={{ screens, greetings, enabledGreetings }} />;
  });
