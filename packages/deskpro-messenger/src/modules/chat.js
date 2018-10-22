import { Observable, from, of, merge, empty } from 'rxjs';
import { ofType, combineEpics } from 'redux-observable';
import {
  withLatestFrom,
  tap,
  skip,
  filter,
  map,
  mergeMap,
  ignoreElements,
  switchMap
} from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import { createSelector } from 'reselect';
import { produce } from 'immer';
import _findLast from 'lodash/findLast';
import _mapValues from 'lodash/mapValues';
import _pick from 'lodash/pick';

import asset from '../utils/asset';
import uuid from '../utils/uuid';
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
const CHAT_SAVE_CHAT = 'CHAT_SAVE_CHAT';
const START_LISTENING = 'START_LISTENING';
const CHAT_SEND_MESSAGE = 'CHAT_SEND_MESSAGE';
const CHAT_MESSAGE_RECEIVED = 'CHAT_MESSAGE_RECEIVED';
const CHAT_TOGGLE_SOUND = 'CHAT_TOGGLE_SOUND';
//#endregion

//#region ACTION CREATORS
export const createChat = (data, meta) => ({
  type: CHAT_START,
  payload: data,
  meta
});
export const saveChat = (payload, meta) => ({
  type: CHAT_SAVE_CHAT,
  payload,
  meta
});
export const startListeningMessages = () => ({
  type: START_LISTENING,
  payload: {}
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
    switchMap(({ payload, meta }) => {
      return from(chatService.createChat(payload)).pipe(
        mergeMap((chatId) => {
          // save new chat
          const streams = [
            of(saveChat({ chatId, fromScreen: meta.fromScreen }, meta)),
            of(startListeningMessages())
          ];
          if (meta.prompt) {
            // create prompt message for chat dialog
            streams.push(
              of(
                messageReceived({
                  type: 'chat.message',
                  origin: 'system',
                  message: meta.prompt,
                  chatId
                })
              )
            );
          }
          if (meta.message) {
            // send user's first message.
            streams.push(of(sendMessage(meta.message)));
          }
          // request an agent.
          streams.push(
            from(chatService.assignAgent(chatId)).pipe(ignoreElements())
          );
          return merge(...streams);
        })
      );
    })
  );

const cacheNewChatEpic = (action$) =>
  action$.pipe(
    ofType(CHAT_SAVE_CHAT),
    tap(({ payload: { chatId, ...payload }, meta }) => {
      const cache = currentUser.getCache();
      cache.chats.push({
        id: chatId,
        ...payload,
        status: 'active'
      });
      currentUser.updateCache(cache, false);
      meta.history.push(`/screens/active-chat/${chatId}`);
    }),
    skip()
  );

const deactivateChatEpic = (action$) =>
  action$.pipe(
    ofType(CHAT_MESSAGE_RECEIVED),
    filter(({ payload }) => payload.type === 'chat.ended'),
    tap(({ payload }) => {
      const cache = currentUser.getCache();
      cache.chats = cache.chats.map(
        (chat) =>
          chat.id === payload.chatId ? { ...chat, status: 'ended' } : chat
      );
      currentUser.updateCache(cache, false);
    }),
    skip()
  );

const noChatAnswerEpic = (action$, state$, { config }) =>
  action$.pipe(
    ofType(CHAT_MESSAGE_RECEIVED),
    filter(({ payload }) => payload.type === 'chat.noAgents'),
    withLatestFrom(state$),
    mergeMap(([_, state]) => {
      const chatId = getActiveChat(state);
      const screenName = getChatData(state).fromScreen;
      const chatConfig =
        screenName && config.screens[screenName]
          ? config.screens[screenName]
          : {};
      switch (chatConfig.noAnswerBehavior) {
        case 'save_ticket':
          return of(
            messageReceived({
              chatId,
              type: 'chat.block.saveTicket',
              origin: 'system'
            })
          );
        case 'new_ticket':
          return of(
            messageReceived({
              chatId,
              type: 'chat.block.createTicket',
              origin: 'system'
            })
          );
        default:
          return empty();
      }
    })
  );

const updateGuestEpic = (action$) =>
  action$.pipe(
    ofType(CHAT_START, CHAT_SEND_MESSAGE),
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
    ofType(START_LISTENING),
    switchMap(listenForMessages),
    withLatestFrom(state$),
    tap(([message]) =>
      currentUser.updateCache({ last_action_alert: message.id }, false)
    ),
    map(([message, state]) =>
      messageReceived({ ...message, chatId: getActiveChat(state) })
    )
  );

const sendMessagesEpic = (action$, state$) =>
  action$.pipe(
    ofType(CHAT_SEND_MESSAGE),
    withLatestFrom(state$),
    tap(([{ payload }, state]) =>
      chatService.sendMessage({
        ...payload,
        chatId: getActiveChat(state),
        uuid: uuid()
      })
    ),
    skip()
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
  cacheNewChatEpic,
  noChatAnswerEpic,
  deactivateChatEpic,
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
        draft.messages[index] = spread(message, payload);
        return;
      }
      if (payload.origin === 'user') {
        const messageIdx = draft.messages.findIndex(
          (m) => m.uuid === payload.uuid
        );
        if (messageIdx !== -1) {
          draft.messages[messageIdx] = spread(
            draft.messages[messageIdx],
            payload
          );
          return;
        }
      }
      draft.messages.push(payload);
      draft.typing = payload.origin === 'agent' ? undefined : draft.typing;
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
    } else if (type === CHAT_SAVE_CHAT) {
      const { chatId, ...data } = payload;
      draft.chats[chatId] = { ...emptyChat, data };
      draft.activeChat = chatId;
    } else if (type === 'SET_VISITOR' && Array.isArray(payload.chats)) {
      payload.chats.forEach(({ id, status, ...data }) => {
        draft.chats[id] = spread(
          draft.chats[id] ? draft.chats[id] : emptyChat,
          { data }
        );
        if (status === 'active') {
          draft.activeChat = id;
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
  (_, props = {}) =>
    props.match && props.match.params ? props.match.params.chatId : null,
  (chats, activeChat, chatId) =>
    chatId || activeChat ? chats[chatId || activeChat] : {}
);
export const getChatData = createSelector(getChat, (chat) => chat.data);
export const getMessages = createSelector(getChat, (chat) => chat.messages);
export const getTypingState = createSelector(getChat, (chat) => chat.typing);
export const isMuted = createSelector(getChatState, (state) => state.mute);
//#endregion
