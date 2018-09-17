//#region ACTION TYPES
export const TICKET_SAVE_NEW = 'TICKET_SAVE_NEW';
//#endregion

//#region ACTIONS
export const saveTicket = (data) => ({ type: TICKET_SAVE_NEW, payload: data });
//#endregion

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
