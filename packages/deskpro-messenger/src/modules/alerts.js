import { ofType } from 'redux-observable';
import { map, switchMap, take, takeUntil } from 'rxjs/operators';

import { APP_SHUTDOWN, OPEN_WINDOW_ONCE } from './app';
import { alertReceived } from './info';
import { CHAT_START, messageReceived } from './chat';

export const listenForAlertsEpic = (action$, _, { api }) =>
  action$.pipe(
    ofType(OPEN_WINDOW_ONCE, CHAT_START),
    take(1),
    switchMap(() => {
      return api.getAlertsStream().pipe(
        map((alert) => {
          if (alert.type.startsWith('chat.')) {
            return messageReceived(alert);
          } else {
            return alertReceived(alert);
          }
        }),
        takeUntil(action$.pipe(ofType(APP_SHUTDOWN)))
      );
    })
  );
//#endregion
