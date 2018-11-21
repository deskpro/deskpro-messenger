import { ofType, combineEpics } from 'redux-observable';
import { tap, skip } from 'rxjs/operators';

//#region ACTION TYPES
export const TICKET_SAVE_NEW = 'TICKET_SAVE_NEW';
//#endregion

//#region ACTIONS
export const saveTicket = (data) => ({ type: TICKET_SAVE_NEW, payload: data });
//#endregion

//#region EPICS
export const createTicketEpic = (action$, _, { api }) =>
  action$.pipe(
    ofType(TICKET_SAVE_NEW),
    tap(({ payload }) => api.createTicket(payload)),
    skip()
  );
export const ticketEpics = combineEpics(createTicketEpic);

//#region REDUCER
export default (state = {}, { type, payload }) => {
  switch (type) {
    case TICKET_SAVE_NEW:
      return state;

    default:
      return state;
  }
};
//#endregion

//#region SELECTORS
// const getTicketsState = (state) => state.tickets;
//#endregion
