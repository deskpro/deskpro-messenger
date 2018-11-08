import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { produce } from 'immer';

import { SET_VISITOR } from './guest';

//#region ACTION TYPES
export const LOAD_APP_INFO = 'LOAD_APP_INFO';
export const LOAD_APP_INFO_SUCCESS = 'LOAD_APP_INFO_SUCCESS';
//#endregion

//#region ACTIONS
export const loadAppInfo = () => ({
  type: LOAD_APP_INFO,
  payload: null
});
export const appInfoLoaded = (data) => ({
  type: LOAD_APP_INFO_SUCCESS,
  payload: data
});
//#endregion

//#region EPICS
export const loadAppInfoEpic = (action$, _, { api }) =>
  action$.pipe(
    ofType(SET_VISITOR),
    take(1),
    switchMap(() => from(api.getAppInfo()).pipe(map(appInfoLoaded)))
  );
//#endregion

//#region REDUCER
export default produce(
  (draft, { type, payload }) => {
    switch (type) {
      case LOAD_APP_INFO_SUCCESS: {
        draft.departments = payload.chat_departments.reduce(
          (acc, d) => ({ ...acc, [d.id]: d }),
          {}
        );
        draft.agents = payload.agents_online;
        return;
      }
      default:
        return draft;
    }
  },
  { departments: {}, agents: [] }
);
//#endregion

//#region SELECTORS
export const getDepartments = (state) => state.info.departments;
export const hasAgentsAvailable = (state) => state.info.agents.length;
//#endregion
