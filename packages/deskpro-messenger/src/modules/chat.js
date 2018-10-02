import { Observable, from } from 'rxjs';
import { ofType, combineEpics } from 'redux-observable';
import {
  withLatestFrom,
  tap,
  skip,
  filter,
  map,
  switchMap
} from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import { createSelector } from 'reselect';
import { produce } from 'immer';
import _findLast from 'lodash/findLast';
import _mapValues from 'lodash/mapValues';
import _pick from 'lodash/pick';
import _isPlainObject from 'lodash/isPlainObject';

import asset from '../utils/asset';
import chatService from '../services/ApiService';
import currentUser from '../services/CurrentUser';

const spread = produce(Object.assign);

const messengerOptions = window.parent.DESKPRO_MESSENGER_OPTIONS || {};
const sounds = _mapValues(
  messengerOptions.sounds || {},
  (path) => new Audio(path)
);
sounds.default = new Audio(asset('audio/unconvinced.mp3'));

//#region ACTION TYPES
const CHAT_START = 'CHAT_START';
const CHAT_SAVE_CHAT_ID = 'CHAT_SAVE_CHAT_ID';
const CHAT_SEND_MESSAGE = 'CHAT_SEND_MESSAGE';
const CHAT_SEND_MESSAGE_SUCCESS = 'CHAT_SEND_MESSAGE_SUCCESS';
const CHAT_MESSAGE_RECEIVED = 'CHAT_MESSAGE_RECEIVED';
const CHAT_TOGGLE_SOUND = 'CHAT_TOGGLE_SOUND';
const CHAT_SAVE_TICKET_FORM = 'CHAT_SAVE_TICKET_FORM';
const CHAT_CREATE_TICKET_BLOCK = 'CHAT_CREATE_TICKET_BLOCK';
//#endregion

//#region ACTION CREATORS
export const createChat = (data) => ({ type: CHAT_START, payload: data });
export const saveChatId = (chatId) => ({
  type: CHAT_SAVE_CHAT_ID,
  payload: chatId
});
export const messageReceived = (message) => ({
  type: CHAT_MESSAGE_RECEIVED,
  payload: message
});
export const sendMessage = (message) => ({
  type: CHAT_SEND_MESSAGE,
  payload: message
});
export const toggleSound = () => ({ type: CHAT_TOGGLE_SOUND });
export const showSaveTicketForm = (data) => ({
  type: CHAT_SAVE_TICKET_FORM,
  payload: data,
  meta: data
});
export const showCreateTicket = (data) => ({
  type: CHAT_CREATE_TICKET_BLOCK,
  payload: data,
  meta: data
});
//#endregion

//#region EPICS
const listenForMessages = () =>
  new Observable((observer) => {
    const callback = (message) => observer.next(message);
    chatService.subscribe(callback);
    return () => chatService.unsubscribe(callback);
  });

const createChatEpic = (action$) =>
  action$.pipe(
    ofType(CHAT_START),
    switchMap((action) => from(chatService.createChat(action.payload))),
    map((chatId) => saveChatId(chatId)),
    tap(() => from(chatService.assignAgent()))
  );

const updateGuestEpic = (action$) =>
  action$.pipe(
    ofType(CHAT_START),
    filter((action) => 'email' in action.payload),
    tap((action) =>
      currentUser.updateCache({
        guest: _pick(action.payload, ['name', 'email'])
      })
    ),
    skip()
  );

const listenForMessagesEpic = (action$, state$) =>
  action$.pipe(
    ofType(CHAT_START),
    switchMap(listenForMessages),
    withLatestFrom(state$),
    map(([message, state]) =>
      messageReceived({ ...message, chatId: getActiveChat(state) })
    )
  );

const sendMessagesEpic = (action$, state$) =>
  action$.pipe(
    ofType(CHAT_SEND_MESSAGE),
    withLatestFrom(state$),
    tap(([{ payload }, state]) =>
      chatService.sendMessage({ ...payload, chatId: getActiveChat(state) })
    ),
    map(([action, state]) => ({
      ...action,
      chatId: getActiveChat(state),
      type: CHAT_SEND_MESSAGE_SUCCESS
    }))
  );

const soundEpic = (action$, state$) =>
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

export const chatEpic = combineEpics(
  listenForMessagesEpic,
  createChatEpic,
  updateGuestEpic,
  sendMessagesEpic,
  soundEpic
);
//#endregion

//#region REDUCER
const emptyChat = { messages: [] };
const chatReducer = produce((draft, { type, payload }) => {
  switch (type) {
    case CHAT_MESSAGE_RECEIVED:
      if (payload.type.startsWith('typing.')) {
        draft.typing = payload.type === 'typing.start' ? payload : false;
        return;
      }
      if (payload.type.startsWith('chat.block.') && payload.origin === 'user') {
        const message = _findLast(
          draft.messages,
          (m) => m.type === payload.type && m.origin !== 'user'
        );
        const index = draft.messages.indexOf(message);
        draft.messages[index] = payload;
        return;
      }
      draft.messages.push(payload);
      draft.typing = payload.origin === 'agent' ? undefined : draft.typing;
      draft.unanswered =
        payload.type === 'chat.noAgents' ? true : draft.unanswered;
      return;

    case CHAT_SEND_MESSAGE_SUCCESS: {
      if (
        ['chat.block.transcript', 'chat.block.saveTicket'].includes(
          payload.type
        )
      ) {
        const index = _findLast(draft.messages, ['type', payload.type]);
        draft.messages[index] = spread(draft.messages[index], payload);
      }
      return;
    }
    case CHAT_SAVE_TICKET_FORM:
      draft.messages.push({
        ...payload,
        type: 'chat.block.saveTicket',
        origin: 'system'
      });
      return;
    case CHAT_CREATE_TICKET_BLOCK:
      draft.messages.push({
        ...payload,
        type: 'chat.block.createTicket',
        origin: 'system'
      });
      return;
    default:
      return;
  }
}, emptyChat);

export default produce(
  (draft, action) => {
    const { type, payload } = action;
    if (type === CHAT_TOGGLE_SOUND) {
      draft.mute = !draft.mute;
    } else if (type === CHAT_SAVE_CHAT_ID) {
      draft.chats[payload] = { ...emptyChat };
      draft.activeChat = payload;
    } else if (
      type === 'SET_VISITOR' &&
      _isPlainObject(payload.chat) &&
      payload.chat.recentChats.length
    ) {
      payload.chat.recentChats.forEach(({ id, ...chat }) => {
        draft.chats[chat.id] = spread(emptyChat, chat);
        if (chat.status === 'active') {
          draft.activeChat = chat.id;
        }
      });
    } else if (payload && 'chatId' in payload) {
      draft.chats[payload.chatId] = chatReducer(
        draft.chats[payload.chatId],
        action
      );
      if (type === CHAT_MESSAGE_RECEIVED && payload.type === 'chat.ended') {
        delete draft.activeChat;
      }
    }
    return;
  },
  { chats: {}, mute: false }
);
//#endregion

//#region SELECTORS
const getChatState = (state) => state.chat;
const getChats = createSelector(getChatState, (state) => state.chats || {});
export const getActiveChat = createSelector(
  getChatState,
  (state) => state.activeChat
);
const getChat = createSelector(
  getChats,
  getActiveChat,
  (_, props) => props.chatId,
  (chats, activeChat, chatId) =>
    chatId || activeChat ? chats[chatId || activeChat] : {}
);
export const getChatId = createSelector(getChat, (chat) => chat.chatId);
export const getMessages = createSelector(getChat, (chat) => chat.messages);
export const getTypingState = createSelector(getChat, (chat) => chat.typing);
export const isUnanswered = createSelector(
  getChat,
  (chat) => !!chat.unanswered
);
export const isMuted = createSelector(getChatState, (state) => state.mute);
//#endregion
