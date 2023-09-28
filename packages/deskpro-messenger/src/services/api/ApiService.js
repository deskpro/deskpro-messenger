import axios from 'axios';
import _pick from 'lodash/pick';
import _merge from 'lodash/merge';
import createNotificationStream from '../notifications';

const KEY_MAP = {
  org: 'organization_fields',
  ticket: 'fields',
  user: 'user_fields',
  custom: 'contextual_fields'
};

const pickChat = (chat) =>
  _pick(chat, ['id', 'access_token', 'department', 'status', 'agent']);

export default class ApiService {
  polling = false;
  _visitorId = null;
  jwt = false;
  brandId = null;
  _config = {};

  constructor(config = {}) {
    let clientConfig      = {
      baseURL: config.helpdeskURL,
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json; charset=utf-8',
      }
    };

    this._config = config;
    this.apiClient = axios.create(clientConfig);
    if(config.jwt) {
      this.jwtToken = config.jwt;
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

  set jwtToken(value) {
    this._config.jwt = this.jwt = value;
    this.apiClient.defaults.headers['X-JWT-TOKEN'] = this.jwt
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

  async sendMessagesAck(messageIds, chat) {
    return await this.sendToChat({ type: 'chat.ack', messageIds }, chat);
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
    const allowedKeys = keys.filter(k => !k.match('^(ticket|user|org|custom)_field_'));

    const postData = Object.keys(values)
      .filter(key => allowedKeys.includes(key))
      .reduce((obj, key) => {
        return {
          ...obj,
          [key]: values[key]
        };
      }, {});

    let fields = {};
    keys.filter(k => k.match('^(ticket|user|org|custom)_field_')).map(k => {
      const m = k.match('^(ticket|user|org|custom)_field_');
      const key = KEY_MAP[m[1]];
      return {
        // that gives you either fields (if ticket_fields), or user_fields or organization_fields
        [key]: {[k.split('_').slice(-1)[0]]: values[k]}
      };
    }).forEach(v => fields = _merge(fields, v));

    if(Object.keys(fields).length > 0) {
      Object.keys(fields).forEach(key => {
        if(Object.keys(fields[key]).length > 0) {
          postData[key] = fields[key];
        }
      })
    }
    postData.message = { message: values.message, format: 'html' };
    if(typeof postData.captcha !== 'undefined') {
      delete postData.captcha;
    }
    ['fields', 'user_fields', 'organization_fields', 'contextual_fields'].forEach(fieldKey => {
      if(postData[fieldKey]) {
        // 0 is valid value for field, while 0 means value shouldn't be sent
        Object.keys(postData[fieldKey]).forEach((key) => {
          if(!postData[fieldKey][key] && postData[fieldKey][key] !== 0) {
            delete postData[fieldKey][key];
          }
        });
      }
    });


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
