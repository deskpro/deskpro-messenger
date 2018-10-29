import { Observable } from 'rxjs';
import { ofType } from 'redux-observable';
import { map, tap, switchMap, takeUntil } from 'rxjs/operators';

import { messageReceived } from './chat';
import apiService from '../services/ApiService';

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
const createAlertsObservable = () =>
  new Observable((observer) => {
    const callback = (message) => observer.next(message);
    apiService.subscribe(callback);
    return () => apiService.unsubscribe(callback);
  });

export const listenForAlertsEpic = (action$) =>
  action$.pipe(
    ofType(START_LISTENING),
    tap(() => {
      apiService.startListening();
    }),
    switchMap(createAlertsObservable),
    map((alert) => {
      if (alert.type.startsWith('chat.')) {
        return messageReceived(alert);
      }
      // TODO: handle other type of alerts if needed;
    }),
    takeUntil(
      action$.pipe(
        ofType(STOP_LISTENING),
        tap(() => {
          apiService.stopListening();
        })
      )
    )
  );
//#endregion
