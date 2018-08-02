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

    return <App config={{ screens }} />;
  });
