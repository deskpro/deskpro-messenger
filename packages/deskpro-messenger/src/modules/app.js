import { ofType, combineEpics } from 'redux-observable';
import { of } from 'rxjs';
import { take, tap, skip, switchMap, delay } from 'rxjs/operators';
import _sample from 'lodash/sample';
import { produce } from 'immer';

import { SET_VISITOR } from './guest';
import { LOAD_APP_INFO_SUCCESS } from './info';

//#region ACTION TYPES
export const APP_INIT = 'APP_INIT';
export const APP_SHUTDOWN = 'APP_SHUTDOWN';
export const TOGGLE_WINDOW = 'TOGGLE_WINDOW';
export const OPEN_WINDOW_ONCE = 'OPEN_WINDOW_ONCE'; // will be handled just once
export const SET_WINDOW_STATE = 'SET_WINDOW_STATE';
//#endregion

//#region ACTIONS
export const appInit = () => ({ type: APP_INIT, payload: {} });
export const appShutdown = () => ({ type: APP_SHUTDOWN, payload: {} });
export const toggleWindow = () => ({ type: TOGGLE_WINDOW });
export const openWindowOnce = () => ({ type: OPEN_WINDOW_ONCE });
export const setWindowState = (payload) => ({
  type: SET_WINDOW_STATE,
  payload
});
//#endregion

//#region EPICS
const startupRedirectEpic = (action$, _, { history, config }) =>
  action$.pipe(
    ofType(SET_VISITOR),
    take(1),
    tap(({ payload }) => {
      if (config.screens.startChat && Array.isArray(payload.chats)) {
        const activeChat = payload.chats.find((c) => c.status === 'open');
        if (activeChat) {
          history.push(`/screens/active-chat/${activeChat.id}`);
        }
      }
    }),
    skip()
  );
const autoOpenWindowEpic = (action$, _, { history, config }) =>
  action$.pipe(
    ofType(LOAD_APP_INFO_SUCCESS),
    delay(config.autoStart ? config.autoStartTimeout * 1000 : 0),
    switchMap(() => {
      // only for cases when we have no history (usually on start only)
      if (history.location.pathname === config.entranceUrl && history.length < 3) {
        history.push(`/screens/${config.autoStart ? 'proactiveChat' : 'index'}`);
        return of(setWindowState(config.autoStart));
      } else {
        return of(setWindowState(false));
      }
    })
  );
export const appEpic = combineEpics(startupRedirectEpic, autoOpenWindowEpic);
//#endregion

//#region REDUCER
export default produce(
  (draft, { type, payload }) => {
    switch (type) {
      case TOGGLE_WINDOW:
        draft.windowState = !draft.windowState;
        break;

      case SET_WINDOW_STATE:
        draft.windowState = !!payload;
        break;

      default:
        break;
    }
  },
  { windowState: false }
);
//#endregion

//#region SELECTORS
export const isWindowOpened = (state) => state.app.windowState;
//#endregion
