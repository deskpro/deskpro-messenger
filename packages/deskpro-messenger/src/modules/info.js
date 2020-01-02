import { ofType } from 'redux-observable';
import { from } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { produce } from 'immer';

import { SET_VISITOR } from './guest';

//#region ACTION TYPES
export const LOAD_APP_INFO = 'LOAD_APP_INFO';
export const LOAD_APP_INFO_SUCCESS = 'LOAD_APP_INFO_SUCCESS';
export const ALERT_RECEIVED = 'ALERT_RECEIVED';
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
export const alertReceived = (alert) => ({
  type: ALERT_RECEIVED,
  payload: alert
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
        draft.chatDepartments = payload.chat_departments.reduce(
          (acc, d) => ({ ...acc, [d.id]: d }),
          {}
        );
        draft.ticketDepartments = payload.ticket_departments.reduce(
          (acc, d) => ({ ...acc, [d.id]: d }),
          {}
        );
        draft.agents = payload.agents_online;
        return;
      }
      case ALERT_RECEIVED: {
        switch (payload.type) {
          case 'user_chat.agents_online':
            draft.agents = payload.data;
            return;
          case 'agent.update_status':
            if (payload.data.online) {
              draft.agents.push(payload.data.agent_id);
            } else {
              const agentIndex = draft.agents.indexOf(payload.data.agent_id);
              if (agentIndex !== -1) {
                draft.agents.splice(agentIndex, 1);
              }
            }
            return;
          default:
            return;
        }
      }
      default:
        return draft;
    }
  },
  { chatDepartments: {}, ticketDepartments: {}, agents: [] }
);
//#endregion

//#region SELECTORS
export const getChatDepartments = (state) => state.info.chatDepartments;
export const getTicketDepartments = (state) => state.info.ticketDepartments;
export const hasAgentsAvailable = (state) => state.info.agents.length;
//#endregion
