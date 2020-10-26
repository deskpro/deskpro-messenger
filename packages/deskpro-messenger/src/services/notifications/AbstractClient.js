export default class AbstractClient {
  listeners = [];
  isRunning = false;

  constructor(options, apiClient, visitorId) {
    this.apiClient = apiClient;
    this.options = options;
    this.visitorId = visitorId;
  }

  /**
   * Starts listening for the incoming alerts.
   */
  async startListening() {
    this.isRunning = true;
  }

  /**
   * Stops listenning of the incoming alerts.
   */
  async stopListening() {
    this.isRunning = false;
  }

  /**
   * Method to handle incoming message.
   */
  async onNotificationReceived(message) {
    this.listeners.forEach((callback) => callback(message));
  }

  /**
   * Common transformations for the server's alert object.
   * @param {object} notification Alert object.
   * @retorn {object} New transformed object.
   */
  transformNotification({ data, ...alert }) {
    return {
      ...data,
      type: alert.type || 'unknown.alert.type',
      // set the single `chat` property to identify the chat ID the alert belongs to.
      chat: data.chat || data.id,
      uuid: data.uuid || alert.uuid,
      meta: data.meta || {},
      message:
        data.origin === 'system' &&
        typeof data.message === 'string' &&
        data.message.length
          ? JSON.parse(data.message)
          : data.message
    };
  }

  /**
   * Subscribe a client for new messages.
   * @param {Function} callback Listener callback
   */
  subscribe(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    } else {
      console.error('Subscription listener is not a function');
    }
  }

  /**
   * Remove all or specified listener.
   * @param {bool} callback (optional) The callback passed to the subscribe method.
   */
  unsubscribe(callback = false) {
    if (callback) {
      this.listeners = this.listeners.filter((l) => l === callback);
    } else {
      this.listeners = [];
    }

    if (!this.listeners.length) {
      this.isRunning = false;
    }
  }
}
