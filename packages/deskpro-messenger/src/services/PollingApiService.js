import BaseApiService from './BaseApiService';

const POLLING_INTERVAL = 2000;

const apiCall = async (url, method, data) => {
  const options = {
    cors: true,
    method: method || 'GET',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: data ? JSON.stringify(data) : undefined
  };
  const response = await fetch(url, options);
  return response.json();
};

const sleep = (time) =>
  new Promise((res) => {
    setTimeout(res, time);
  });

export default class PollingChatService extends BaseApiService {
  polling = false;
  chatId = null;

  async createChat(data) {
    if (this.chatId) {
      throw new Error('Chat is already started');
    }
    const response = await apiCall('/api/chat', 'POST', data);
    this.chatId = response.chatId;
    await super.createChat(data);

    return this.chatId;
  }

  async startListening() {
    await super.startListening();
    while (true) {
      const response = await apiCall('/api/chat');
      this.onMessageReceived(response);
      // stop AJAX polling when polling become falsy.
      if (!this.isRunning || !this.chatId) {
        break;
      }

      await sleep(POLLING_INTERVAL);
    }
  }

  async sendMessage(message) {
    await super.sendMessage(message);
    return await apiCall('/api/chat', 'PUT', message);
  }
}
