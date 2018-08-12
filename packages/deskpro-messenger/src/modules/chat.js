import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import { createSelector } from 'reselect';

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
      .merge(of(chatService.createChat(action.payload)).map(saveChatId))
      .merge(
        action$.ofType(CHAT_SEND_MESSAGE).switchMap(action =>
          of(chatService.sendMessage(action.payload)).map(() => ({
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
      return { ...state, messages: state.messages.concat([payload]) };

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
//#endregion
