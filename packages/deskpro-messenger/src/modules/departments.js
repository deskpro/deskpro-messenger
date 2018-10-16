import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import apiService from '../services/ApiService';

//#region ACTION TYPES
export const LOAD_DEPARTMENTS = 'LOAD_DEPARTMENTS';
export const LOAD_DEPARTMENTS_SUCCESS = 'LOAD_DEPARTMENTS_SUCCESS';
//#endregion

//#region ACTIONS
export const loadDepartments = () => ({
  type: LOAD_DEPARTMENTS,
  payload: null
});
export const setDepartments = (data) => ({
  type: LOAD_DEPARTMENTS_SUCCESS,
  payload: data
});
//#endregion

//#region EPICS
export const loadDepartmentsEpic = (action$) =>
  action$.pipe(
    ofType(LOAD_DEPARTMENTS),
    switchMap(() => from(apiService.getDepartments())),
    map(setDepartments)
  );
//#endregion

//#region REDUCER
const initialState = {};
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_DEPARTMENTS_SUCCESS:
      return payload.reduce((acc, d) => ({ ...acc, [d.id]: d }), {});
    default:
      return state;
  }
};
//#endregion

//#region SELECTORS
export const getDepartments = (state) => state.departments;
//#endregion
