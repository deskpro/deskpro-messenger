import React from 'react';
import { render } from '../../../utils/tests';

import Chat from '../Chat';

const messages = [
  {
    uuid: '1a2b',
    origin: 'user',
    type: 'chat.message',
    message: 'Hello World!',
    name: 'John Doe'
  },
  {
    uuid: '8cd76a',
    type: 'chat.noAgents',
    origin: 'system'
  },
  {
    uuid: '2c45',
    origin: 'system',
    type: 'chat.agentAssigned',
    message: { phrase_id: 'message_agent_join', name: 'Jon Snow' }
  },
  {
    uuid: '34f4',
    origin: 'agent',
    type: 'chat.message',
    message: 'How can I help you today?',
    name: 'Jon Snow'
  },
  {
    uuid: '545a',
    origin: 'user',
    type: 'chat.message',
    message: 'Another message from the user',
    name: 'John Doe'
  },
  {
    uuid: '1321',
    origin: 'system',
    type: 'chat.system_message',
    message: { phrase_id: 'system message from history without translation' }
  },
  {
    uuid: 'abcde',
    origin: 'system',
    type: 'chat.ended',
    message: { phrase_id: 'message_chat_end' }
  }
];

const translations = {
  message_agent_join: 'Agent {name} joined the chat',
  message_chat_end: 'Chat ended',
  chat_prompt: 'Thank you for start a chat!'
};

const onSendMessage = jest.fn();

const agent = { name: 'Jon Snow' };
const user = { name: 'John Doe' };
const chat = { id: 21, status: 'ended' };
const chatConfig = { prompt: 'chat_prompt', noAnswerBehavior: 'create_ticket' };
const typing = {
  name: 'Jon Snow',
  avatar: 'https://deskpro.com/images/jon-snow.png'
};

describe('<Chat />', () => {
  it('should render correctly', () => {
    const { asFragment } = render(
      <Chat {...{ messages, onSendMessage, agent, user, chat, chatConfig }} />,
      { translations }
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should display messages', () => {
    const { getByText, getByAltText } = render(
      <Chat
        {...{ messages, onSendMessage, agent, user, chat, chatConfig, typing }}
      />,
      { translations }
    );
    expect(getByText('Thank you for start a chat!')).toBeInTheDocument();
    expect(getByText('Hello World!')).toBeInTheDocument();
    expect(
      getByText('Sorry, no one is online to accept your chat.')
    ).toBeInTheDocument();
    expect(
      getByText(
        'You can submit a ticket instead and one of our agents will reply to you via email as soon as possible.'
      )
    ).toBeInTheDocument();
    const userAvatar = getByAltText('John Doe');
    expect(userAvatar).toBeInTheDocument();
    expect(userAvatar.nodeName).toBe('IMG');
    const agentAvatar = getByAltText('Jon Snow');
    expect(agentAvatar).toBeInTheDocument();
    expect(agentAvatar.nodeName).toBe('IMG');
    expect(getByText('How can I help you today?')).toBeInTheDocument();
    expect(getByText('Another message from the user')).toBeInTheDocument();
    expect(getByText('Agent Jon Snow joined the chat')).toBeInTheDocument();
    expect(
      getByText('system message from history without translation')
    ).toBeInTheDocument();
    expect(getByText('Chat ended')).toBeInTheDocument();
    expect(getByText('...')).toBeInTheDocument();
  });
});
