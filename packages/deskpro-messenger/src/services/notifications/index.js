import PollingClient from './PollingClient';
import PusherClient from './PusherClient';

const createNotificationClient = ({ type, options }, ...args) => {
  switch (type) {
    case 'legacy':
      return new PollingClient(options, ...args);

    case 'pusher':
      return new PusherClient(options, ...args);

    default:
      throw new Error(`You should provide supported client. Given is ${type}`);
  }
};

export default createNotificationClient;
