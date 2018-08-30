import React from 'react';
import { storiesOf } from '@storybook/react';

import '../../public/assets/styles.css';
import Button from '../components/form/Button';
import Group from './Group';

storiesOf('Elements', module).add('Buttons', () => (
  <div style={{ maxWidth: '800px' }}>
    <Group title="Custom Buttons">
      <Button width="full" color="primary" size="medium">
        Send a message
      </Button>
      <Button width="limited" color="success">
        Helpful
      </Button>
      <Button width="limited" color="danger">
        Unhelpful
      </Button>
      <Button width="full" color="transparent">
        11.30am
      </Button>
      <Button width="half" color="secondary">
        12.30am
      </Button>
      <Button width="half" color="primary">
        Confirm
      </Button>
      <Button width="half" color="transparent" disabled>
        Cloud
      </Button>
      <Button width="half" color="transparent" disabled>
        On-Permise
      </Button>
    </Group>
    <Group>
      <Button>Default</Button>
      <Button color="primary">Primary</Button>
      <Button color="transparent">Transparent</Button>
      <Button color="secondary">Secondary</Button>
      <Button color="success">Success</Button>
      <Button color="info">Info</Button>
      <Button color="warning">Warning</Button>
      <Button color="danger">Danger</Button>
    </Group>
    <Group>
      <Button color="white">Danger</Button>
      <Button color="black">Danger</Button>
      <Button textOnly>Danger</Button>
    </Group>
    <Group>
      <Button to="" color="primary">
        You can also use links
      </Button>
    </Group>

    <Group title="Rounded buttons">
      <Button rounded>Default</Button>
      <Button color="primary" rounded>
        Primary
      </Button>
      <Button color="transparent" rounded>
        Transparent
      </Button>
      <Button color="secondary" rounded>
        Secondary
      </Button>
      <Button color="success" rounded>
        Success
      </Button>
      <Button color="info" rounded>
        Info
      </Button>
      <Button color="warning" rounded>
        Warning
      </Button>
      <Button color="danger" rounded>
        Danger
      </Button>
    </Group>
    <Group title="Sizes">
      <Button size="small">Small</Button>
      <Button>Normal</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </Group>
  </div>
));
