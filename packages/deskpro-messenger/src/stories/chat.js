import React, { Fragment } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import MessageShell from '../components/core/MessengerShell';
import Block from '../components/core/Block';
import Chat from '../components/chat/Chat';
import { MuteButton } from '../containers/MuteButton';

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
    origin: 'system',
    name: 'Nick Green'
  },
  {
    type: 'chat.block.rate',
    origin: 'user',
    name: 'Nick Green',
    rate: 'helpful'
  }
];

storiesOf('Chat Elements', module).add('Chat', () => (
  <MessageShell
    controls={
      <Fragment>
        <a
          className="dpmsg-BackBtn dpmsg-LevelLeft"
          onClick={action('go-back')}
        >
          <i className="dpmsg-IconArrow iconArrow--left" /> back
        </a>
        <MuteButton isMuted toggleSound={action('toggle-mute')} />
      </Fragment>
    }
    introText="Helping organizations provide their customers with better support."
  >
    <Block title="Sales Conversation">
      <Chat
        messages={messages}
        category="sales"
        onSendMessage={action('send-message')}
        onEndChat={action('end-chat')}
      />
    </Block>
  </MessageShell>
));
