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
        draft.canUseChat = payload.canUseChat;
        draft.canUseTickets = payload.canUseTickets;
        draft.chatDepartments = payload.chat_departments.reduce(
          (acc, d) => ({ ...acc, [d.id]: d }),
          {}
        );
        draft.ticketDepartments = payload.ticket_departments.reduce(
          (acc, d) => ({ ...acc, [d.id]: d }),
          {}
        );
        payload.agents_online.forEach((a) => draft.agents[a.id] = a);
        draft.agents_online = payload.agents_online.map((a) => a.id);
        return;
      }
      case ALERT_RECEIVED: {
        switch (payload.type) {
          case 'user_chat.agents_online':
            draft.agents = payload.data;
            draft.agents_online = payload.data.map((a) => a.id);
            return;
          case 'agent.update_status':
            draft.agents[payload.data.agent.id] = payload.data.agent;
            if (payload.data.online) {
              draft.agents_online.push(payload.data.agent.id);
            } else {
              const agentIndex = draft.agents_online.indexOf(payload.data.agent.id);
              if (agentIndex !== -1) {
                draft.agents_online.splice(agentIndex, 1);
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
  { chatDepartments: {}, ticketDepartments: {}, agents: {}, agents_online: [] }
);
//#endregion

//#region SELECTORS
export const getChatDepartments = (state) => state.info.chatDepartments;
export const getTicketDepartments = (state) => state.info.ticketDepartments;
export const hasAgentsAvailable = (state) => state.info.agents_online.length;
export const getAgentsAvailable = (state) => state.info.agents;
export const canUseChat = (state) => state.info.canUseChat;
export const canUseTickets = (state) => state.info.canUseTickets;
//#endregion
