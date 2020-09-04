import axios from 'axios';
import _pick from 'lodash/pick';
import createNotificationStream from '../notifications';

const pickChat = (chat) =>
  _pick(chat, ['id', 'access_token', 'department', 'status', 'agent']);

export default class ApiService {
  polling = false;
  _visitorId = null;
  jwt = false;
  brandId = null;

  constructor(config = {}) {
    let clientConfig      = {
      baseURL: config.helpdeskURL,
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json; charset=utf-8',
      }
    };

    this.apiClient = axios.create(clientConfig);
    if(config.jwt) {
      this.apiClient.defaults.headers['X-JWT-TOKEN'] = this.jwt = config.jwt;
    }
    if(config.brandId) {
      this.apiClient.defaults.headers['X-DESKPRO-BRANDID'] = this.brandId = config.brandId;
    }
  }

  set visitorId(value) {
    this._visitorId = value;
    this.apiClient.defaults.headers['X-DESKPRO-VISITORID'] = value;
  }
  get visitorId() {
    return this._visitorId;
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
    if(this.jwt) {
      chatValues.jwt = this.jwt;
    }
    const response = await this.apiClient.post('/api/messenger/chat', chatValues);

    return pickChat(response.data.data);
  }

  getAlertsStream() {
    if (!this.alertsStream) {
      if (!this.clientConfig) {
        throw new Error('There is not config to create notification client');
      }

      this.alertsStream = createNotificationStream(
        this.clientConfig,
        this.apiClient,
        this.visitorId
      );
    }
    return this.alertsStream;
  }

  async sendToChat(data, chat) {
    return await this.apiClient.post(
      `/api/messenger/chat/${chat.id}-${chat.access_token}/send`,
      data
    );
  }

  pingChat(chat) {
    return this.apiClient.post(
      `/api/messenger/chat/${chat.id}-${chat.access_token}/ping`
    );
  }

  evaluateChat(chat) {
    return this.apiClient.get(
      `/api/messenger/chat/${chat.id}-${chat.access_token}/evaluate`
    );
  }

  getTranslation(language) {
    return this.apiClient.get(
      `/api/messenger/service/translation?language=${language}`
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
    return await this.apiClient
      .get(`/api/messenger/chat/${chat.id}-${chat.access_token}/messages`)
      .then(({ data }) =>
        data.map((m) => {
          if (m.origin === 'system') {
            return {
              ...m,
              type: m.meta && m.meta.type ? m.meta.type : 'chat.system',
              message: JSON.parse(m.message)
            };
          }
          return { ...m, type: 'chat.message' };
        })
      );
  }

  async getAppInfo() {
    return this.apiClient.get('/api/messenger/user/info').then(({ data }) => {
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
    return this.apiClient.get(`/api/messenger/user`).then(({ data }) => {
      return {
        ...data,
        chats: (data.chats || []).map(pickChat)
      };
    });
  }

  /**
   * Create ticket.
   * @param {object} values Ticket values.
   */
  async createTicket(values, config) {
    if(values.attachments) {
      values.attachments = values.attachments.map(a => ({ blob_auth: a.authcode }));
    }
    const keys = Object.keys(values);
    const allowedKeys = keys.filter(k => k.indexOf('ticket_field_') === -1);

    const postData = Object.keys(values)
      .filter(key => allowedKeys.includes(key))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: values[key]
        };
      }, {});

    const fields = Object.fromEntries(keys.filter(k => k.indexOf('ticket_field_') === 0).map(k => {
      return [k.split('_').slice(-1)[0], values[k]];
    }));
    if(Object.keys(fields).length > 0) {
      postData.fields = fields;
    }
    postData.message = { message: values.message, format: 'html' };
    if(postData.capthca) {
      delete postData.capthca;
    }
    if(values.cc) {
      postData.cc = values.cc ? [ values.cc ] : '';
    }

    return this.apiClient.post(`/api/messenger/ticket`, postData);
  }

  /**
   * Do a quick search
   *
   * @param {string} query a search query.
   *
   *  @returns {array} array of results
   */
  async quickSearch(query) {
    return this.apiClient.get(`/api/messenger/search/quick?q=${query}`).then(({data}) => data);
  }

  /**
   * Do a quick search
   *
   * @param {string} query a search query.
   *
   *  @returns {array} array of results
   */
  async search(query) {
    return this.apiClient.get(`/api/messenger/search/full?q=${query}`).then(({data}) => data);
  }
}
