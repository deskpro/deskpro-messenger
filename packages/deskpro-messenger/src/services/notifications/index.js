import { Observable } from 'rxjs';

import PollingClient from './PollingClient';
import PusherClient from './PusherClient';

const clients = {
  legacy: PollingClient,
  pusher: PusherClient
};

const createNotificationClient = ({ type, options }, ...args) => {
  if ('undefined' === typeof clients[type]) {
    throw new Error(`You should provide supported client. Given is ${type}`);
  }

  return new Observable((observer) => {
    const client = new clients[type](options, ...args);
    const callback = (message) => observer.next(message);
    client.subscribe(callback);
    client.startListening();
    return () => {
      client.unsubscribe(callback);
      client.stopListening();
    };
  });
};

export default createNotificationClient;
