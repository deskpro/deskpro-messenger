import { combineEpics, ofType } from 'redux-observable';
import { mergeMap } from 'rxjs/operators';

//#region ACTION TYPES
export const TICKET_SAVE_NEW          = 'TICKET_SAVE_NEW';
export const TICKET_NEW_OPEN          = 'TICKET_NEW_OPEN';
export const TICKET_SAVE_NEW_SUCCESS  = 'TICKET_SAVE_NEW_SUCCESS';
export const TICKET_SAVE_NEW_ERROR    = 'TICKET_SAVE_NEW_ERROR';
//#endregion

//#region ACTIONS
export const saveTicket = (data) => ({ type: TICKET_SAVE_NEW, payload: data });
export const newTicket  = () => ({ type: TICKET_NEW_OPEN });
//#endregion

//#region EPICS
export const createTicketEpic = (action$, _, { api }) =>
  action$.pipe(
    ofType(TICKET_SAVE_NEW),
    mergeMap(async ({ payload }) => {
      try {
        await api.createTicket(payload);
        return { type: TICKET_SAVE_NEW_SUCCESS }
      } catch (e) {
        return { type: TICKET_SAVE_NEW_ERROR }
      }
    }),
  );

export const ticketEpics = combineEpics(createTicketEpic);

//#region REDUCER
export default (state = { ticketSaving: false, ticketSaved: false }, { type, payload }) => {
  switch (type) {
    case TICKET_NEW_OPEN:
      return { ...state, ticketSaving: false, ticketSaved: false };
    case TICKET_SAVE_NEW:
      return { ...state, ticketSaving: true };
    case TICKET_SAVE_NEW_SUCCESS:
      return { ...state, ticketSaving: false, ticketSaved: true };
    case TICKET_SAVE_NEW_ERROR:
      return { ...state, ticketSaving: false, ticketSaved: false };
    default:
      return state;
  }
};
//#endregion

//#region SELECTORS
export const getTicketSavingState = (state) => state.tickets.ticketSaving;
export const getTicketSavedState  = (state) => state.tickets.ticketSaved;
//#endregion
