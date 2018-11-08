import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import { map, tap, switchMap, takeUntil, take } from 'rxjs/operators';

import { APP_SHUTDOWN } from './app';
import { SET_VISITOR } from './guest';
import { messageReceived } from './chat';

//#region ACTION TYPES
const START_LISTENING = 'START_LISTENING';
const STOP_LISTENING = 'STOP_LISTENING';
//#endregion

//#region ACTIONS
export const startListeningAlerts = () => ({
  type: START_LISTENING,
  payload: {}
});
export const stopListeningAlerts = () => ({
  type: STOP_LISTENING,
  payload: {}
});
//#endregion

//#region EPICS
const createAlertsObservable = (api) =>
  new Observable((observer) => {
    const callback = (message) => observer.next(message);
    api.subscribe(callback);
    return () => api.unsubscribe(callback);
  });

export const listenForAlertsEpic = (action$, _, { api }) =>
  action$.pipe(
    ofType(SET_VISITOR),
    take(1),
    tap(() => {
      api.startListening();
    }),
    switchMap(() => createAlertsObservable(api)),
    map((alert) => {
      if (alert.type.startsWith('chat.')) {
        return messageReceived(alert);
      }
      // TODO: handle other types of alerts if needed.
    }),
    takeUntil(
      action$.pipe(
        ofType(STOP_LISTENING, APP_SHUTDOWN),
        tap(() => {
          api.stopListening();
        })
      )
    )
  );
//#endregion
