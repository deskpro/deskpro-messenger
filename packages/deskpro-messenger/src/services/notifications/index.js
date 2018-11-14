import { Observable } from 'rxjs';

const clients = {
  legacy: () => import('./PollingClient'),
  pusher: () => import('./PusherClient'),
  deskpro: () => import('./DpClient')
};

const createNotificationClient = ({ type, options }, ...args) => {
  if ('undefined' === typeof clients[type]) {
    throw new Error(`You should provide supported client. Given is ${type}`);
  }

  return new Observable((observer) => {
    let client;
    const callback = (message) => observer.next(message);
    clients[type]().then(({ default: ClientClass }) => {
      client = new ClientClass(options, ...args);
      client.subscribe(callback);
      client.startListening();
    });
    return () => {
      client.unsubscribe(callback);
      client.stopListening();
    };
  });
};

export default createNotificationClient;
