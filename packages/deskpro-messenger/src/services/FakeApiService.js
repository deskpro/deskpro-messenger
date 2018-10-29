import _uniqueId from 'lodash/uniqueId';
import _sample from 'lodash/sample';

import asset from '../utils/asset';
import BaseApiService from './BaseApiService';

const NETWORK_LATENCY = 2000;

const rand = () => Math.round(Math.random() * 10);

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

export default class FakeChatService extends BaseApiService {
  agentAssigned = false;
  // simulate "no available agents" one of 3 times.
  hasAgentsOnline = rand() % 3 !== 0;

  async createChat(data) {
    await super.createChat(data);
    const chatId = _uniqueId('chat-');
    if (this.hasAgentsOnline) {
      this.assignAgent(chatId);
    }
    return { id: chatId };
  }

  async assignAgent(chatId) {
    // one of 5 times do not assign an agent.
    if (rand() % 5 !== 0) {
      console.log('assignAgent');
      await sleep(NETWORK_LATENCY);
      await this.onMessageReceived({
        type: 'chat.agentAssigned',
        origin: 'system',
        name: 'Nick Green',
        chat: chatId
      });
      this.agentAssigned = true;

      // simulate agent answer for the message sent before he has been assigned.
      if (this.hasUnasweredMessages) {
        this.hasUnasweredMessages = false;
        await sleep(NETWORK_LATENCY);
        await this.simulateAgentResponse(chatId);
      }
      return;
    } else {
      console.log('timeout');
      // timeout
    }
  }

  async onMessageReceived(message) {
    super.onMessageReceived(message);
    if (message.type === 'chat.ended') {
      this.isRunning = false;
      this.hasUnasweredMessages = false;
      this.agentAssigned = false;
    }
  }

  async endChat(chatId) {
    await sleep(NETWORK_LATENCY);
    this.onMessageReceived({
      type: 'chat.ended',
      origin: 'system',
      chat: chatId
    });
  }

  async sendMessage(message, chat) {
    await super.sendMessage(
      {
        ...message,
        avatar: asset('img/docs/avatar.png'),
        name: (this.userData || {}).name || 'John Doe'
      },
      chat
    );

    await sleep(NETWORK_LATENCY / 2);
    if (message.type === 'chat.block.saveTicket' && message.origin === 'user') {
      await this.endChat();
    } else if (
      'type' in message &&
      message.type === 'chat.message' &&
      message.origin === 'user'
    ) {
      const lowerMessage = message.message.toLowerCase().trim();
      if (lowerMessage.includes('transcript')) {
        await sleep(NETWORK_LATENCY);
        this.onMessageReceived({
          type: 'chat.block.transcript',
          origin: 'system',
          chat
        });
      } else if (lowerMessage.includes('rating')) {
        await sleep(NETWORK_LATENCY);
        this.onMessageReceived({
          type: 'chat.block.rate',
          origin: 'system',
          name: 'Nick',
          chat
        });
      } else if (['end', 'stop'].includes(lowerMessage)) {
        await this.endChat(chat);
      } else {
        // in case there is no agent yet, set flag to respond later and return.
        if (!this.agentAssigned) {
          this.hasUnasweredMessages = true;
          return;
        }
        await this.simulateAgentResponse(chat);
      }
    }
  }

  /**
   * Simulates agent response to the user's message.
   */
  async simulateAgentResponse(chat) {
    this.onMessageReceived({
      type: 'chat.typing.start',
      origin: 'agent',
      avatar: asset('img/dp-logo.svg'),
      name: 'Nick Green',
      chat
    });
    await sleep(NETWORK_LATENCY * 2);
    this.onMessageReceived({
      type: 'chat.message',
      origin: 'agent',
      message: _sample(agentAnswers),
      avatar: asset('img/dp-logo.svg'),
      name: 'Nick Green',
      chat
    });
  }

  /**
   * Loads user via API.
   */
  async loadUser(visitorId) {
    return {
      visitor_id: visitorId,
      guest: {
        name: null,
        email: null
      },
      chats: []
    };
  }

  async getAppInfo() {
    console.log('has agents', this.hasAgentsOnline);
    return {
      chat_departments: [
        { id: 3, title: 'Support' },
        { id: 4, title: 'Sales' }
      ],
      agents_online: this.hasAgentsOnline ? [{ id: 23, name: 'John Doe' }] : []
    };
  }
}
