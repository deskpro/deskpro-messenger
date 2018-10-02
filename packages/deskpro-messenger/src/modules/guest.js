import { produce } from 'immer';
import _isPlainObject from 'lodash/isPlainObject';

//#region ACTION TYPES
const SET_VISITOR = 'SET_VISITOR';
//#endregion

//#region ACTIONS
export const setVisitor = (payload) => ({ type: SET_VISITOR, payload });
//#endregion

//#region REDUCER
export default produce(
  (draft, { type, payload }) => {
    switch (type) {
      case SET_VISITOR:
        if (payload.visitorId) {
          draft.visitorId = payload.visitorId;
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
