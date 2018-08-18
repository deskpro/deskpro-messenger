import { Observable, from } from 'rxjs';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import { createSelector } from 'reselect';
import _findLast from 'lodash/findLast';

import FakeChatService from '../services/FakeChatService';
const chatService = new FakeChatService();

//#region ACTION TYPES
const CHAT_START = 'CHART_START';
const CHAT_SAVE_CHAT_ID = 'CHAT_SAVE_CHAT_ID';
const CHAT_SEND_MESSAGE = 'CHAT_SEND_MESSAGE';
const CHAT_SEND_MESSAGE_SUCCESS = 'CHAT_SEND_MESSAGE_SUCCESS';
const CHAT_MESSAGE_RECEIVED = 'CHAT_MESSAGE_RECEIVED';
//#endregion

//#region ACTION CREATORS
export const createChat = data => ({ type: CHAT_START, payload: data });
export const saveChatId = chatId => ({
  type: CHAT_SAVE_CHAT_ID,
  payload: chatId
});
export const messageReceived = message => ({
  type: CHAT_MESSAGE_RECEIVED,
  payload: message
});
export const sendMessage = message => ({
  type: CHAT_SEND_MESSAGE,
  payload: message
});
//#endregion

//#region EPICS
const listenForMessages = () =>
  new Observable(observer => {
    const callback = message => observer.next(message);
    chatService.subscribe(callback);
    return () => chatService.unsubscribe(callback);
  });

export const chatEpic = action$ =>
  action$.ofType(CHAT_START).switchMap(action =>
    listenForMessages()
      .map(message => messageReceived(message))
      .merge(from(chatService.createChat(action.payload)).map(saveChatId))
      .merge(
        action$.ofType(CHAT_SEND_MESSAGE).switchMap(action =>
          from(chatService.sendMessage(action.payload)).map(() => ({
            type: CHAT_SEND_MESSAGE_SUCCESS,
            payload: action.payload
          }))
        )
      )
  );
//#endregion

//#region REDUCER
const initialState = { chatId: '', messages: [] };
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case CHAT_SAVE_CHAT_ID:
      return { ...state, chatId: payload };

    case CHAT_MESSAGE_RECEIVED:
      if (payload.type.startsWith('typing.')) {
        return {
          ...state,
          typing: payload.type === 'typing.start' ? payload : false
        };
      }
      if (payload.type.startsWith('chat.block.') && payload.origin === 'user') {
        const message = _findLast(
          state.messages,
          m => m.type === 'chat.block.transcript' && m.origin === 'system'
        );
        const index = state.messages.indexOf(message);
        return {
          ...state,
          messages: Object.assign(state.messages.slice(), {
            [index]: payload
          })
        };
      }
      return {
        ...state,
        messages: state.messages.concat([payload]),
        typing: payload.origin === 'agent' ? undefined : state.typing
      };

    case CHAT_SEND_MESSAGE_SUCCESS:
      if (payload.type === 'chat.block.transcript') {
        const { name, email } = payload;
        const transcriptIndex = _findLast(state.messages, [
          'type',
          'chat.block.transcript'
        ]);
        return {
          ...state,
          messages: Object.assign(state.messages.slice(), {
            [transcriptIndex]: {
              ...state.messages[transcriptIndex],
              name,
              email
            }
          })
        };
      }
      return state;

    default:
      return state;
  }
};
//#endregion

//#region SELECTORS
const getChatState = state => state.chat;
export const getChatId = createSelector(getChatState, state => state.chatId);
export const getMessages = createSelector(
  getChatState,
  state => state.messages
);
export const getTypingState = createSelector(
  getChatState,
  state => state.typing
);
//#endregion
