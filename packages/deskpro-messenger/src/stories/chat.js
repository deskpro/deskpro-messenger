import React, { Fragment } from 'react';
import { storiesOf, action } from '@storybook/react';

import MessageShell from '../components/core/MessengerShell';
import Block from '../components/core/Block';
import Chat from '../components/chat/Chat';
import { MuteButton } from '../containers/MuteButton';

window.parent.DESKPRO_MESSENGER_OPTIONS = {
  baseUrl:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:9009/'
      : 'https://deskpro.github.io/deskpro-messenger/'
};

import asset from '../utils/asset';

const messages = [
  {
    type: 'chat.message',
    origin: 'system',
    message:
      'Our mission is to help businesses and organizations like yours provide their customers with better support across every communication channel.'
  },
  {
    type: 'chat.message',
    origin: 'system',
    message: 'How can we help you today?'
  },
  {
    type: 'chat.message',
    origin: 'user',
    message: 'Hi, need help with a ticket please.',
    avatar: asset('img/docs/avatar.png'),
    name: 'John Doe'
  },
  {
    type: 'chat.agentAssigned',
    origin: 'system',
    name: 'Nick Green'
  },
  {
    type: 'chat.message',
    origin: 'agent',
    message:
      'Our mission is to help businesses and organizations like yours provide their customers with better support across every communication channel.',
    avatar: asset('img/docs/avatar.png'),
    name: 'John Doe'
  },
  {
    type: 'chat.block.transcript',
    origin: 'system'
  },
  {
    type: 'chat.block.rate',
    origin: 'system'
  },
  {
    type: 'chat.block.rate',
    origin: 'user',
    rate: 'helpful'
  }
];

storiesOf('Chat Elements', module).add('Chat', () => (
  <MessageShell
    controls={
      <Fragment>
        <a
          href={false}
          className="dpmsg-BackBtn dpmsg-LevelLeft"
          onClick={action('back')}
        >
          <i className="dpmsg-IconArrow iconArrow--left" /> back
        </a>
        <MuteButton isMuted toggleSound={action('toggle muted')} />
      </Fragment>
    }
    introText="Helping organizations provide their customers with better support."
  >
    <Block title="Sales Conversation">
      <Chat
        messages={messages}
        category="sales"
        typing={false}
        onSendMessage={action('send message')}
      />
    </Block>
  </MessageShell>
));
