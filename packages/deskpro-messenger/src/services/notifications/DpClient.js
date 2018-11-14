import io from 'socket.io-client';
import AbstractClient from './AbstractClient';

export default class PusherClient extends AbstractClient {
  /**
   * Creates instance of the client.
   * @param {object} options Options for the client.
   * @param {object} apiClient Axios instance for the API backend.
   * @param {string} visitorId Visitor ID
   */
  constructor(options, apiClient, visitorId) {
    super(options, apiClient, visitorId);

    const channelPrefix = options.channelPrefix
      ? `${options.channelPrefix}-`
      : '';
    this.channelName = `private-${channelPrefix}${visitorId}`;

    this.client = io(
      `http${options.secure ? 's' : ''}://${options.host}:${options.port}`
    );
    this.client.on('connect', () => {
      this.client.emit('authenticate', { token: options.token });

      this.client.on('authenticated', () => {
        if (options.debug) {
          console.log('Successfully authenticated on DP Notifications server');
        }
      });

      this.client.on('unauthorized', () => {
        console.error(
          'Failed to auth on DP Notifications server. Please - check your settings and server is running'
        );
      });
    });
  }

  /**
   * Subscribes to the private channel and binds to action_alert events.
   */
  async startListening() {
    await super.startListening();
    this.client.on(`${this.channelName}-action_alert`, (data) => {
      const alert = this.transformNotification(data);
      this.onNotificationReceived(alert);
    });
  }

  /**
   * Unsubscribe from the channel.
   */
  async stopListening() {
    await super.stopListening();
    this.client.disconnect();
  }
}
