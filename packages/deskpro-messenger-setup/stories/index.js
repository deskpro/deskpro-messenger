import React from 'react';
import App from '../src/App';
import '../styles/style.css';

import { storiesOf } from '@storybook/react';

storiesOf('Setup', module).add('Setup screen', () => <App />);
