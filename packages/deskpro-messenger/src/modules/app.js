import { ofType } from 'redux-observable';
import { take, tap, skip } from 'rxjs/operators';
import _sample from 'lodash/sample';

import { SET_VISITOR } from './guest';

//#region ACTION TYPES
export const APP_INIT = 'APP_INIT';
export const APP_SHUTDOWN = 'APP_SHUTDOWN';
//#endregion

//#region ACTIONS
export const appInit = () => ({ type: APP_INIT, payload: {} });
export const appShutdown = () => ({ type: APP_SHUTDOWN, payload: {} });
//#endregion

//#region EPICS
export const startupRedirectEpic = (action$, _, { history, config }) =>
  action$.pipe(
    ofType(SET_VISITOR),
    take(1),
    tap(({ payload }) => {
      if (Array.isArray(payload.chats)) {
        const activeChat = payload.chats.find(c => c.status === 'open');
        if (activeChat) {
          history.replace(`/screens/active-chat/${activeChat.id}`);
        } else if (Array.isArray(config.enabledGreetings)) {
          const randomGreeting = _sample(config.enabledGreetings);
          if (randomGreeting) {
            history.replace(randomGreeting);
          }
        }
      }
    }),
    skip(),
  );
//#endregion
