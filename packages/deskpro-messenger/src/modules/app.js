import { combineEpics, ofType } from 'redux-observable';
import { skip, map, take, tap, withLatestFrom } from 'rxjs/operators';
import { produce } from 'immer';
import isMobile from 'is-mobile';

import { SET_VISITOR } from './guest';
import { CHAT_OPENED } from './chat';

const mobile = isMobile();

//#region ACTION TYPES
export const APP_INIT                = 'APP_INIT';
export const APP_SHUTDOWN            = 'APP_SHUTDOWN';
export const TOGGLE_WINDOW           = 'TOGGLE_WINDOW';
export const PROACTIVE_WINDOW_CLOSED = 'PROACTIVE_WINDOW_CLOSED';
export const OPEN_WINDOW_ONCE        = 'OPEN_WINDOW_ONCE'; // will be handled just once
export const SET_WINDOW_STATE        = 'SET_WINDOW_STATE';

export const SET_MESSAGE_FORM_FOCUS  = 'SET_MESSAGE_FORM_FOCUS';

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

export const setMessageFormFocus = (payload) => ({
  type: SET_MESSAGE_FORM_FOCUS,
  payload
});
//#endregion

//#region EPICS
const startupRedirectEpic = (action$, _, { history, config, cache }) =>
  action$.pipe(
    ofType(SET_VISITOR),
    take(1),
    tap(({ payload }) => {
      if(!/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
        const lastLocation = cache.getValue('app.lastLocation');
        let activeChat;
        if (config.screens.startChat && Array.isArray(payload.chats)) {
          activeChat = payload.chats.find((c) => c.status === 'open');
        }
        if (lastLocation) {
          if (lastLocation.indexOf('/screens/active-chat/') === 0 && !activeChat) {
            history.push('/screens/index');
          } else {
            history.push(lastLocation);
          }
        } else if (config.screens.startChat && activeChat) {
          history.push(`/screens/active-chat/${activeChat.id}`);
        } else {
          history.push('/screens/index');
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
      return setWindowState((!/MSIE \d|Trident.*rv:/.test(navigator.userAgent) && cache.getValue('app.windowOpened')) || false);
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
        if (mobile) {
          window.parent.document.getElementsByTagName('body')[0].style.overflow = draft.windowState ? 'hidden' : 'initial';
        }
        break;

      case SET_WINDOW_STATE:
        draft.windowState = !!payload;
        if (mobile) {
          window.parent.document.getElementsByTagName('body')[0].style.overflow = draft.windowState ? 'hidden' : 'initial';
        }
        break;

      case SET_MESSAGE_FORM_FOCUS:
        draft.messageFormFocused = !!payload;
        break;

      default:
        break;
    }
  },
  { windowState: false, messageFormFocused: false }
);
//#endregion

//#region SELECTORS
export const isWindowOpened = (state) => state.app.windowState;
export const isMessageFormFocused = (state) => state.app.messageFormFocused;
//#endregion
