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
  polling = false;
  agentAssigned = false;

  async createChat(data) {
    await super.createChat(data);
    return _uniqueId('chat-');
  }

  async hasAvailableAgents() {
    await sleep(NETWORK_LATENCY);
    // simulate "no available agents" one of 3 times.
    const isAgentsAvailable = rand() % 3 !== 0;
    return isAgentsAvailable;
  }

  async assignAgent() {
    if (await this.hasAvailableAgents()) {
      // one of 5 times do not assign an agent.
      if (rand() % 5 !== 0) {
        this.agentAssigned = true;

        await sleep(NETWORK_LATENCY);
        await this.onMessageReceived({
          type: 'chat.agentAssigned',
          origin: 'system',
          name: 'Nick Green'
        });

        // simulate agent answer for the message sent before he has been assigned.
        if (this.hasUnasweredMessages) {
          this.hasUnasweredMessages = false;
          await sleep(NETWORK_LATENCY);
          await this.simulateAgentResponse();
        }
        return;
      } else {
        await sleep(NETWORK_LATENCY * 3);
      }
    }
    // no available agents or timeout.
    await this.onMessageReceived({
      type: 'chat.noAgents',
      origin: 'system'
    });
  }

  async onMessageReceived(message) {
    super.onMessageReceived(message);
    if (message.type === 'chat.ended') {
      this.isRunning = false;
      this.hasAvailableAgents = false;
      this.hasUnasweredMessages = false;
    }
  }

  async sendMessage(message) {
    await super.sendMessage({
      ...message,
      avatar: asset('img/docs/avatar.png'),
      name: (this.userData || {}).name || 'John Doe'
    });

    await sleep(NETWORK_LATENCY / 2);
    if (
      'type' in message &&
      message.type === 'chat.message' &&
      message.origin === 'user'
    ) {
      // in case there is no agent yet, set flag to respond later and return.
      if (!this.agentAssigned) {
        this.hasUnasweredMessages = true;
        return;
      }

      const lowerMessage = message.message.toLowerCase().trim();
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
      } else if (['end', 'stop'].includes(lowerMessage)) {
        await sleep(NETWORK_LATENCY);
        this.onMessageReceived({
          type: 'chat.ended',
          origin: 'system'
        });
      } else {
        await this.simulateAgentResponse();
      }
    }
  }

  /**
   * Simulates agent response to the user's message.
   */
  async simulateAgentResponse() {
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

  /**
   * Loads user via API.
   */
  async loadUser(visitorId) {
    return {
      visitorId,
      guest: {
        name: 'John Doe',
        email: 'joe.doe@example.com'
      },
      chat: {
        recentChats: []
      }
    };
  }
}