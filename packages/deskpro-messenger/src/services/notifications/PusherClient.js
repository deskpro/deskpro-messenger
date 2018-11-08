import Pusher from 'pusher-js';
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

    Pusher.logToConsole = !!options.debug;

    this.socket = new Pusher(options.appKey, {
      encrypted: true,
      cluster: options.cluster,
      authTransport: 'rest',
      authorizer: () => ({
        authorize: (socketId, callback) => {
          this.apiClient
            .post('/api/messenger/user/pusher/auth', {
              socket_id: socketId,
              channel_name: this.channelName
            })
            .then(({ data }) => callback(false, data))
            .catch((err) => callback(true, err));
        }
      })
    });
  }

  /**
   * Subscribes to the private channel and binds to action_alert events.
   */
  async startListening() {
    await super.startListening();
    this.channel = this.socket.subscribe(this.channelName);
    this.channel.bind('action_alert', (data) => {
      const alert = this.transformNotification(data);
      this.onNotificationReceived(alert);
    });
  }

  /**
   * Unsubscribe from the channel.
   */
  async stopListening() {
    await super.stopListening();
    this.socket.unsubscribe(this.channelName);
  }
}
