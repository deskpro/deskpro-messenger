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
    const features = [];
    if (boolean('Enable Chat', true, 'Conversations')) {
      features.push({
        type: 'conversations',
        options: {
          category: select(
            'Chat Category',
            ['sales', 'support'],
            'sales',
            'Conversations'
          )
        }
      });
    }
    if (boolean('Enable Tickets', false, 'Tickets')) {
      features.push({ type: 'tickets' });
    }
    if (boolean('Enable Search', true, 'Search')) {
      features.push({ type: 'search' });
    }
    if (boolean('Enable Contact Us', false, 'Contact Us')) {
      features.push({ type: 'contact_us' });
    }

    return <App config={{ features }} />;
  });
