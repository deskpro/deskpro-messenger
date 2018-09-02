import _uniqueId from 'lodash/uniqueId';
import _sample from 'lodash/sample';

import asset from '../utils/asset';
import BaseChatService from './BaseChatService';

const NETWORK_LATENCY = 2000;

const agentAnswers = [
  'Yes, sure',
  'Nope',
  'You are right!',
  'What can I help you with?',
  'Hello! My name is Alisa.',
  'Have a nice day!',
  'You are so smart!'
];

const sleep = (time) =>
  new Promise((res) => {
    setTimeout(res, time);
  });

export default class FakeChatService extends BaseChatService {
  polling = false;
  chatId = null;

  async createChat(data) {
    if (this.chatId) {
      throw new Error('Chat is already started');
    }
    this.chatId = _uniqueId('chat-');
    await super.createChat(data);

    console.log('chat id', this.chatId);
    return await this.chatId;
  }

  async startListening() {
    await super.startListening();

    await sleep(NETWORK_LATENCY);

    await this.onMessageReceived({
      type: 'chat.agentAssigned',
      origin: 'system',
      name: 'Nick Green'
    });
  }

  async sendMessage(message) {
    await super.sendMessage({
      ...message,
      avatar: asset('img/docs/avatar.png'),
      name: this.userData.name || 'John Doe'
    });

    await sleep(NETWORK_LATENCY / 2);
    if (
      'type' in message &&
      message.type === 'chat.message' &&
      message.origin === 'user'
    ) {
      const lowerMessage = message.message.toLowerCase();
      if (lowerMessage.includes('transcript')) {
        await sleep(NETWORK_LATENCY);
        this.onMessageReceived({
          type: 'chat.block.transcript',
          origin: 'system'
        });
      } else if (lowerMessage.includes('rating')) {
        await sleep(NETWORK_LATENCY);
        this.onMessageReceived({
          type: 'chat.block.rate',
          origin: 'system',
          name: 'Nick'
        });
      } else {
        this.onMessageReceived({
          type: 'typing.start',
          origin: 'agent',
          avatar: asset('img/dp-logo.svg'),
          name: 'Nick Green'
        });
        await sleep(NETWORK_LATENCY * 2);
        this.onMessageReceived({
          type: 'chat.message',
          origin: 'agent',
          message: _sample(agentAnswers),
          avatar: asset('img/dp-logo.svg'),
          name: 'Nick Green'
        });
      }
    }
  }
}
