import { Observable, from } from 'rxjs';
import { ofType, combineEpics } from 'redux-observable';
import {
  withLatestFrom,
  tap,
  skip,
  filter,
  map,
  merge,
  switchMap
} from 'rxjs/operators';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import { createSelector } from 'reselect';
import _findLast from 'lodash/findLast';
import _mapValues from 'lodash/mapValues';

import asset from '../utils/asset';
import FakeChatService from '../services/FakeChatService';

const messengerOptions = window.parent.DESKPRO_MESSENGER_OPTIONS || {};
const sounds = _mapValues(
  messengerOptions.sounds || {},
  (path) => new Audio(path)
);
sounds.default = new Audio(asset('/audio/unconvinced.mp3'));

//#region ACTION TYPES
const CHAT_START = 'CHART_START';
const CHAT_SAVE_CHAT_ID = 'CHAT_SAVE_CHAT_ID';
const CHAT_SEND_MESSAGE = 'CHAT_SEND_MESSAGE';
const CHAT_SEND_MESSAGE_SUCCESS = 'CHAT_SEND_MESSAGE_SUCCESS';
const CHAT_MESSAGE_RECEIVED = 'CHAT_MESSAGE_RECEIVED';
const CHAT_TOGGLE_SOUND = 'CHAT_TOGGLE_SOUND';
//#endregion

//#region ACTION CREATORS
export const createChat = (data) => ({ type: CHAT_START, payload: data });
export const saveChatId = (chatId, category) => ({
  type: CHAT_SAVE_CHAT_ID,
  payload: chatId,
  meta: { category }
});
export const messageReceived = (message, category) => ({
  type: CHAT_MESSAGE_RECEIVED,
  payload: message,
  meta: { category }
});
export const sendMessage = (message, category) => ({
  type: CHAT_SEND_MESSAGE,
  payload: message,
  meta: { category }
});
export const toggleSound = () => ({ type: CHAT_TOGGLE_SOUND });
//#endregion

//#region EPICS
const listenForMessages = (chatService) =>
  new Observable((observer) => {
    const callback = (message) => observer.next(message);
    chatService.subscribe(callback);
    return () => chatService.unsubscribe(callback);
  });

export const chatMessagingEpic = (action$) =>
  action$.pipe(
    ofType(CHAT_START),
    switchMap((action) => {
      const { category } = action.payload;
      const chatService = new FakeChatService();
      return listenForMessages(chatService).pipe(
        map((message) => messageReceived(message, category)),
        merge(
          from(chatService.createChat(action.payload)).map((chatId) =>
            saveChatId(chatId, category)
          )
        ),
        merge(
          action$.pipe(
            ofType(CHAT_SEND_MESSAGE),
            filter(({ meta }) => meta.category === category),
            tap(({ payload }) => chatService.sendMessage(payload)),
            map((action) => ({
              ...action,
              type: CHAT_SEND_MESSAGE_SUCCESS
            }))
          )
        )
      );
    })
  );

export const soundEpic = (action$, state$) =>
  action$.pipe(
    ofType(CHAT_MESSAGE_RECEIVED),
    withLatestFrom(state$),
    filter(
      ([{ payload: message }, state]) =>
        message.type === 'chat.message' &&
        ['user', 'agent'].includes(message.origin) &&
        !isMuted(state)
    ),
    tap(([{ payload: message }]) => {
      const sound =
        message.origin in sounds ? sounds[message.origin] : sounds.default;
      sound.play();
    }),
    skip()
  );
export const chatEpic = combineEpics(chatMessagingEpic, soundEpic);
//#endregion

//#region REDUCER
const chatInitialState = { chatId: '', messages: [] };
const chatReducer = (state = chatInitialState, { type, payload }) => {
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
          (m) => m.type === payload.type && m.origin !== 'user'
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
const initialState = { chats: {}, mute: false };
export default (state = initialState, action) => {
  if (action.type === CHAT_TOGGLE_SOUND) {
    return { ...state, mute: !state.mute };
  } else if (action.meta && action.meta.category) {
    const { category } = action.meta;
    return {
      ...state,
      chats: {
        ...state.chats,
        [category]: chatReducer(state.chats[category], action)
      }
    };
  } else {
    return state;
  }
};
//#endregion

//#region SELECTORS
const getChatState = (state) => state.chat;
const getChats = createSelector(getChatState, (state) => state.chats || {});
const getChat = createSelector(
  getChats,
  (_, props) => props.category,
  (chats, category) => chats[category] || {}
);
export const getChatId = createSelector(getChat, (chat) => chat.chatId);
export const getMessages = createSelector(getChat, (chat) => chat.messages);
export const getTypingState = createSelector(getChat, (chat) => chat.typing);
export const isMuted = createSelector(getChatState, (state) => state.mute);
//#endregion
