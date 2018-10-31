import { produce } from 'immer';
import _isPlainObject from 'lodash/isPlainObject';
import { from, of } from 'rxjs';
import { ofType, combineEpics } from 'redux-observable';
import { switchMap, filter, tap, map, skip } from 'rxjs/operators';

import { APP_INIT } from './app';
import { CHAT_START, CHAT_SEND_MESSAGE } from './chat';
import apiService from '../services/ApiService';
import cache from '../services/Cache';
import { generateVisitorId } from '../utils/visitorId';

//#region ACTION TYPES
export const SET_VISITOR = 'SET_VISITOR';
//#endregion

//#region ACTIONS
export const setVisitor = (payload) => ({ type: SET_VISITOR, payload });
//#endregion

//#region EPICS
const initVisitorEpic = (action$, _, { config }) =>
  action$.pipe(
    ofType(APP_INIT),
    switchMap(() => {
      const visitorId = cache.getValue('visitor_id');
      if (visitorId) {
        return from(apiService.loadUser(visitorId));
      } else {
        const visitorId = generateVisitorId();
        apiService.visitorId = visitorId;
        return of({
          visitor_id: visitorId,
          guest: config.user || {
            name: null,
            email: null
          }
        });
      }
    }),
    tap((state) => {
      cache.setValue('guest', state.guest);
      cache.setValue('visitor_id', state.visitor_id);
    }),
    map(setVisitor)
  );

const updateGuestEpic = (action$) =>
  action$.pipe(
    ofType(CHAT_START, CHAT_SEND_MESSAGE),
    filter((action) => 'email' in action.payload),
    tap((action) => {
      cache.setValue('guest.name', action.payload.name);
      cache.setValue('guest.email', action.payload.email);
    }),
    skip()
  );

export const guestEpic = combineEpics(initVisitorEpic, updateGuestEpic);
//#endregion

//#region REDUCER
export default produce(
  (draft, { type, payload }) => {
    switch (type) {
      case SET_VISITOR:
        if (payload.visitor_id) {
          draft.visitorId = payload.visitor_id;
        }
        if (_isPlainObject(payload.guest)) {
          draft.name = payload.guest.name;
          draft.email = payload.guest.email;
        }
        return;

      default:
        return;
    }
  },
  { name: '', email: '' }
);
//#endregion

//#region SELECTORS
export const getUserData = (state) => state.guest;
//#endregion
