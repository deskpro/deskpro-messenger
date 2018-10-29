import axios from 'axios';
import _pick from 'lodash/pick';
import BaseApiService from './BaseApiService';

const POLLING_INTERVAL = 1000;

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

const pickChat = (chat) =>
  _pick(chat, ['id', 'access_token', 'department', 'status']);

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
    const { department: chat_department, ...chatValues } = data;
    const response = await apiClient.post('/api/messenger/chat', {
      ...chatValues,
      chat_department
    });

    await super.createChat(data);

    return pickChat(response.data.data);
  }

  async startListening() {
    await super.startListening();
    console.log('start listening');
    this.listen();
  }

  async listen() {
    while (true) {
      const alerts = await apiClient(
        `/api/messenger/user/action_alerts/${this.lastActionAlert || 0}`
      ).then(({ data }) => data);
      if (alerts.length) {
        alerts.forEach(({ data, ...alert }) => {
          const message = {
            ...data,
            type: alert.type,
            // set the single `chat` property to identify the chat ID the alert belongs to.
            chat: data.chat ? data.chat : data.id
          };
          this.onMessageReceived(message);
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
    return apiClient.get(`/api/messenger/user`).then(({ data }) => {
      if (data.last_action_alert) {
        this.lastActionAlert = data.last_action_alert;
      }
      return {
        ...data,
        chats: (data.chats || []).map(pickChat)
      };
    });
  }
}
