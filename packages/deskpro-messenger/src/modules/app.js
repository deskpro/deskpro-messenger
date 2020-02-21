import { combineEpics, ofType } from 'redux-observable';
import { skip, map, take, tap, withLatestFrom } from 'rxjs/operators';
import { produce } from 'immer';

import { SET_VISITOR } from './guest';
import { CHAT_OPENED } from './chat';

//#region ACTION TYPES
export const APP_INIT                = 'APP_INIT';
export const APP_SHUTDOWN            = 'APP_SHUTDOWN';
export const TOGGLE_WINDOW           = 'TOGGLE_WINDOW';
export const PROACTIVE_WINDOW_CLOSED = 'PROACTIVE_WINDOW_CLOSED';
export const OPEN_WINDOW_ONCE        = 'OPEN_WINDOW_ONCE'; // will be handled just once
export const SET_WINDOW_STATE        = 'SET_WINDOW_STATE';
//#endregion

//#region ACTIONS
export const appInit               = () => ({ type: APP_INIT, payload: {} });
export const appShutdown           = () => ({ type: APP_SHUTDOWN, payload: {} });
export const toggleWindow          = () => ({ type: TOGGLE_WINDOW });
export const openWindowOnce        = () => ({ type: OPEN_WINDOW_ONCE });
export const proactiveWindowClosed = () => ({ type: PROACTIVE_WINDOW_CLOSED });
export const setWindowState        = (payload) => ({
  type: SET_WINDOW_STATE,
  payload
});
//#endregion

//#region EPICS
const startupRedirectEpic = (action$, _, { history, config, cache }) =>
  action$.pipe(
    ofType(SET_VISITOR),
    take(1),
    tap(({ payload }) => {
      if (config.screens.startChat && Array.isArray(payload.chats)) {
        const activeChat = payload.chats.find((c) => c.status === 'open');
        if(cache.getValue('app.lastLocation')) {
          history.push(cache.getValue('app.lastLocation'));
        } else if (activeChat) {
          history.push(`/screens/active-chat/${activeChat.id}`);
        }
      }
    }),
    skip()
  );

const restoreWindowState = (action$, _, { cache }) =>
  action$.pipe(
    ofType(SET_VISITOR),
    take(1),
    map(() => {
      return setWindowState(cache.getValue('app.windowOpened') || false);
    }),
  );

const proactiveWindowClosedEpic = (action$, _, { cache }) =>
  action$.pipe(
    ofType(PROACTIVE_WINDOW_CLOSED, TOGGLE_WINDOW, CHAT_OPENED),
    take(1),
    tap(() => {
      cache.setValue('app.proactiveWindowClosed', true);
    }),
    skip()
  );

const toggleWindowEpic = (action$, state$, { cache }) =>
  action$.pipe(
    ofType(TOGGLE_WINDOW),
    withLatestFrom(state$),
    tap(([_, state]) => {
      cache.setValue('app.windowOpened', state.app.windowState);
    }),
    skip()
  );

const openWindowEpic = (action$, _, { cache }) =>
  action$.pipe(
    ofType(OPEN_WINDOW_ONCE),
    tap(() => {
      cache.setValue('app.windowOpened', true);
    }),
    skip()
  );

const setWindowEpic = (action$, _, { cache }) =>
  action$.pipe(
    ofType(SET_WINDOW_STATE),
    tap(({ payload }) => {
      cache.setValue('app.windowOpened', !!payload);
    }),
    skip()
  );

export const appEpic   = combineEpics(
  startupRedirectEpic,
  proactiveWindowClosedEpic,
  toggleWindowEpic,
  openWindowEpic,
  setWindowEpic,
  restoreWindowState
);
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
