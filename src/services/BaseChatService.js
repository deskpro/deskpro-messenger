export default class BaseChatService {
  listeners = [];
  chatId = null;
  isRunning = false;

  async createChat(data) {
    this.userData = data;
    // await this.onMessageReceived(data.messages[0]);
    await this.startListening();
  }

  async startListening() {
    if (this.isRunning) {
      throw new Error('Chat is already started');
    }
    this.isRunning = true;

    return this.isRunning;
  }

  async onMessageReceived(message) {
    if (typeof message === 'object') {
      this.listeners.forEach(callback => callback(message));
      if (message.type === 'chat.ended') {
        this.chatId = null;
      }
    } else {
      console.warn('Something went wrong. Message received: ', message);
    }
  }

  subscribe(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    } else {
      console.error('Subscription listener is not a function');
    }
  }

  unsubscribe(callback = false) {
    if (callback) {
      this.listeners = this.listeners.filter(l => l === callback);
    } else {
      this.listeners = [];
    }

    if (!this.listeners.length) {
      this.isRunning = false;
      this.chatId = null;
    }
  }

  async sendMessage(message) {
    this.onMessageReceived(message);
  }
}
