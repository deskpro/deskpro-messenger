import axios from 'axios';
import _pick from 'lodash/pick';
import createNotificationStream from '../notifications';

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

export default class ApiService {
  polling = false;
  _visitorId = null;

  set visitorId(value) {
    this._visitorId = value;
    apiClient.defaults.headers['X-DESKPRO-VISITORID'] = value;
  }
  get visitorId() {
    return this._visitorId;
  }
  set jwt(value) {
    apiClient.defaults.headers['X-JWT-TOKEN'] = value;
  }

  /**
   * Create Chat instance.
   *
   * @param {object} data Parameters of the chat.
   *  — department (required) — Department ID of the chat
   *  — name — Name of the user (required for the fake chat)
   *  — submitted values from the pre-chat form (if configured)
   *  — message (object) — first message (if there is no pre-chat form)
   *  @returns {object} Chat model.
   */
  async createChat(data) {
    const { department: chat_department, ...chatValues } = data;
    const response = await apiClient.post('/api/messenger/chat', {
      ...chatValues,
      chat_department
    });

    return pickChat(response.data.data);
  }

  getAlertsStream() {
    if (!this.alertsStream) {
      if (!this.clientConfig) {
        throw new Error('There is not config to create notification client');
      }

      this.alertsStream = createNotificationStream(
        this.clientConfig,
        apiClient,
        this.visitorId
      );
    }
    return this.alertsStream;
  }

  async sendToChat(data, chat) {
    return await apiClient.post(
      `/api/messenger/chat/${chat.id}-${chat.access_token}/send`,
      data
    );
  }

  /**
   * Send user's message to the chat.
   * @param {object} message Message model
   * @param {object} chat Chat model
   */
  async sendMessage(message, chat) {
    // await this.notifier.onNotificationReceived(message);
    return this.sendToChat(message, chat);
  }

  /**
   * Track page navigation.
   * @param {object} data Object with `page_url` and `page_title` arguments.
   * @param {object} chat Chat model.
   */
  async trackPage(data, chat) {
    return this.sendToChat(
      {
        type: 'chat.track',
        origin: 'user',
        ...data
      },
      chat
    );
  }

  /**
   * Loads chat history.
   * @param {object} chat Chat model
   * @returns {Array}
   */
  async getChatHistory(chat) {
    return await apiClient
      .get(`/api/messenger/chat/${chat.id}-${chat.access_token}/messages`)
      .then(({ data }) =>
        data.map((m) => {
          if (m.origin === 'system') {
            return {
              ...m,
              type: 'chat.system',
              message: JSON.parse(m.message)
            };
          }
          return { ...m, type: 'chat.message' };
        })
      );
  }

  async getAppInfo() {
    return apiClient.get('/api/messenger/user/info').then(({ data }) => {
      if (typeof data.client === 'object') {
        this.clientConfig = data.client;
      }
      return data;
    });
  }

  /**
   * Loads user via API.
   */
  async loadUser(visitorId) {
    this.visitorId = visitorId;
    return apiClient.get(`/api/messenger/user`).then(({ data }) => {
      return {
        ...data,
        chats: (data.chats || []).map(pickChat)
      };
    });
  }
}
