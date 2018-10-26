export default class BaseChatService {
  listeners = [];
  isRunning = false;

  /**
   * Create Chat instance.
   *
   * @param {object} data Data required for the chat
   *  — department (required) — Department ID of the chat
   *  — name — Name of the user (required for the fake chat)
   *  — submitted values from the pre-chat form (if configured)
   *  — message (object) — first message (if there is no pre-chat form)
   *  @returns {string} Chat ID.
   */
  async createChat(data = {}) {
    this.userData = data;
    await this.startListening();
  }

  /**
   * Starts listening for the incoming messages.
   */
  async startListening() {
    if (this.isRunning) {
      throw new Error('Chat is already started');
    }
    this.isRunning = true;

    return this.isRunning;
  }

  /**
   * Check if there is available agents to be assigned to the chat.
   */
  async hasAvailableAgents() {
    return true;
  }

  /**
   * Request a agent to assign to the current chat.
   */
  async assignAgent() {}

  /**
   * Method to handle incoming message.
   */
  async onMessageReceived(message) {
    if (typeof message === 'object') {
      this.listeners.forEach((callback) => callback(message));
    } else {
      console.warn('Something went wrong. Message received: ', message);
    }
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

  /**
   * Send user's message to the chat.
   */
  async sendMessage(message) {
    this.onMessageReceived(message);
  }

  /**
   * Loads user via API.
   */
  async loadUser(visitorId) {
    return {
      visitor_id: visitorId,
      guest: {
        name: 'John Doe',
        email: 'joe.doe@example.com'
      },
      chats: []
    };
  }
}
