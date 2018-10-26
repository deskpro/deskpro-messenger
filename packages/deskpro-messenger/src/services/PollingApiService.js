import axios from 'axios';
import BaseApiService from './BaseApiService';

const POLLING_INTERVAL = 1000;

const rand = () => Math.round(Math.random() * 10);

const sleep = (time) =>
  new Promise((res) => {
    setTimeout(res, time);
  });

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE,
  headers: {
    Accept: 'application/json',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json; charset=utf-8'
  }
});

export default class PollingChatService extends BaseApiService {
  polling = false;
  _visitorId = null;

  set visitorId(value) {
    this._visitorId = value;
    apiClient.defaults.headers['X-DESKPRO-VISITORID'] = value;
  }
  get visitorId() {
    return this._visitorId;
  }

  async createChat(data) {
    if (this.isRunning) {
      throw new Error('Chat is already running');
    }
    const { department, ...chatValues } = data;
    const response = await apiClient.post('/api/messenger/chat', {
      ...chatValues,
      chat_department: department
    });

    await super.createChat(data);

    return response.data.data;
  }

  async startListening() {
    await super.startListening();
    this.listen();
  }

  async listen() {
    while (true) {
      const alerts = await apiClient(
        `/api/messenger/user/action_alerts/${this.lastActionAlert || 0}`
      ).then(({ data }) => data);
      if (alerts.length) {
        alerts.forEach(({ data: message, ...alert }) => {
          this.onMessageReceived({ ...alert, ...message });
          this.lastActionAlert = alert.id;
        });
      }
      // stop AJAX polling when polling become falsy.
      if (!this.isRunning) {
        break;
      }

      await sleep(POLLING_INTERVAL);
    }
  }

  async hasAvailableAgents() {
    await sleep(2000);
    // simulate "no available agents" one of 3 times.
    const isAgentsAvailable = rand() % 3 !== 0;
    return isAgentsAvailable;
  }

  async assignAgent() {
    if (await this.hasAvailableAgents()) {
      // one of 5 times do not assign an agent.
      if (rand() % 5 !== 0) {
        this.agentAssigned = true;

        await sleep(2000);
        await this.onMessageReceived({
          type: 'chat.agentAssigned',
          origin: 'system',
          name: 'Nick Green'
        });

        // simulate agent answer for the message sent before he has been assigned.
        if (this.hasUnasweredMessages) {
          this.hasUnasweredMessages = false;
          await sleep(2000);
          await this.simulateAgentResponse();
        }
        return;
      } else {
        await sleep(3000);
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
      this.hasUnasweredMessages = false;
    }
  }

  async sendMessage(message, chat) {
    await super.sendMessage(message, chat);
    return await apiClient.post(
      `/api/messenger/chat/${chat.id}-${chat.access_token}/send`,
      message
    );
  }

  async getAppInfo() {
    return apiClient.get('/api/messenger/user/info').then(({ data }) => data);
  }

  async loadUser() {
    return apiClient.get(`/api/messenger/user`).then(({ data }) => data);
  }
}
