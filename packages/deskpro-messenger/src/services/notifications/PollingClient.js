import AbstractClient from './AbstractClient';

const POLLING_INTERVAL = process.env.REACT_APP_POLLING_INTERVAL || 1000;

const sleep = (time) => new Promise((res) => setTimeout(res, time));

export default class PollingClient extends AbstractClient {
  /**
   * Creates instance of the client.
   * @param {object} options Options for the client.
   * @param {object} apiClient Axios instance for the API backend.
   * @param {string} visitorId Visitor ID
   */
  constructor(options, apiClient, visitorId) {
    super(options, apiClient, visitorId);
    this.lastActionAlert = options.last_alert;
  }

  /**
   * Start listening for new alerts.
   */
  async startListening() {
    await super.startListening();
    this.listen();
  }

  /**
   * Infinite loop to poll the API for new alerts.
   */
  async listen() {
    while (true) {
      const alerts = await this.apiClient
        .get(`/api/messenger/user/action_alerts/${this.lastActionAlert || 0}`)
        .then(({ data }) => data);
      if (alerts.length) {
        alerts.forEach((alert) => {
          let message;
          if(alert.target_id === -200) { // public message for all users connected
            message = alert;
          } else {
            message = this.transformNotification(alert);
          }
          this.onNotificationReceived(message);
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
}
