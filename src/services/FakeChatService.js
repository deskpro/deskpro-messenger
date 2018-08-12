import _uniqueId from 'lodash/uniqueId';
import _sample from 'lodash/sample';

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

const sleep = time =>
  new Promise(res => {
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
    return this.chatId;
  }

  async startListening() {
    await super.startListening();

    this.onMessageReceived({
      type: 'chat.agentAssigned',
      origin: 'system',
      name: 'Nick Green'
    });

    await sleep(NETWORK_LATENCY);
  }

  async sendMessage(message) {
    await super.sendMessage(message);
    await sleep(NETWORK_LATENCY);
    if (
      'type' in message &&
      message.type === 'chat.message' &&
      message.origin === 'user'
    ) {
      this.onMessageReceived({
        type: 'chat.message',
        origin: 'agent',
        message: _sample(agentAnswers),
        avatar: 'https://deskpro.github.io/messenger-style/img/dp-logo.svg',
        author: 'Nick Green'
      });
    }
  }
}
