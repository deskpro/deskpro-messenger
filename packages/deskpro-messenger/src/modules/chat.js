import { from, of, merge, empty, race, interval } from 'rxjs';
import { ofType, combineEpics } from 'redux-observable';
import {
  withLatestFrom,
  tap,
  skip,
  filter,
  mergeMap,
  switchMap,
  take,
  mapTo
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
import { hasAgentsAvailable } from './info';
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
export const messageReceived = (message) => ({
  type: CHAT_MESSAGE_RECEIVED,
  payload: message
});
export const noAgentsMessage = (chat) =>
  messageReceived({
    type: 'chat.noAgents',
    origin: 'system',
    chat
  });
export const sendMessage = (message) => ({
  type: CHAT_SEND_MESSAGE,
  payload: message
});
export const toggleSound = () => ({ type: CHAT_TOGGLE_SOUND });
//#endregion

//#region EPICS
const createChatEpic = (action$, state$) =>
  action$.pipe(
    ofType(CHAT_START),
    switchMap(({ payload, meta }) => {
      return from(chatService.createChat(payload)).pipe(
        withLatestFrom(state$),
        mergeMap(([chat, state]) => {
          // save new chat
          const streams = [
            of(saveChat({ ...chat, fromScreen: meta.fromScreen }, meta)),
          ];
          if (meta.prompt) {
            // create prompt message for chat dialog
            streams.push(
              of(
                messageReceived({
                  type: 'chat.message',
                  origin: 'system',
                  message: meta.prompt,
                  chat: chat.id
                })
              )
            );
          }
          if (meta.message) {
            // send user's first message.
            streams.push(of(sendMessage(meta.message)));
          }
          if (!hasAgentsAvailable(state)) {
            streams.push(of(noAgentsMessage(chat.id)));
          }
          return merge(...streams);
        })
      );
    })
  );

const agentAssignementTimeout = (action$, _, { config }) =>
  action$.pipe(
    ofType(CHAT_SAVE_CHAT),
    mergeMap(({ payload: chat }) =>
      race(
        action$.pipe(
          ofType(CHAT_MESSAGE_RECEIVED),
          filter(({ payload: message }) =>
            ['chat.agentAssigned', 'chat.noAgents'].includes(message.type)
          ),
          mapTo(false)
        ),
        interval(config.chatTimeout || 3000).pipe(
          take(1),
          mapTo(true)
        )
      ).pipe(
        switchMap(
          (timedOut) => (timedOut ? of(noAgentsMessage(chat.id)) : empty())
        )
      )
    )
  );

const cacheNewChatEpic = (action$) =>
  action$.pipe(
    ofType(CHAT_SAVE_CHAT),
    tap(({ payload, meta }) => {
      const cache = currentUser.getCache();
      cache.chats.push({
        ...payload,
        status: 'open'
      });
      currentUser.updateCache(cache, false);
      meta.history.push(`/screens/active-chat/${payload.id}`);
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
          chat.id === payload.chat ? { ...chat, status: 'ended' } : chat
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
              chat: chatId,
              type: 'chat.block.saveTicket',
              origin: 'system'
            })
          );
        case 'new_ticket':
          return of(
            messageReceived({
              chat: chatId,
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

const sendMessagesEpic = (action$, state$) =>
  action$.pipe(
    ofType(CHAT_SEND_MESSAGE),
    withLatestFrom(state$),
    tap(([{ payload }, state]) => {
      const chat = getChatData(state);
      if (chat) {
        chatService.sendMessage(
          {
            ...payload,
            chat: chat.id,
            uuid: uuid()
          },
          chat
        );
      }
    }),
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
  createChatEpic,
  updateGuestEpic,
  sendMessagesEpic,
  cacheNewChatEpic,
  noChatAnswerEpic,
  deactivateChatEpic,
  soundEpic,
  agentAssignementTimeout
);
//#endregion

//#region REDUCER
const emptyChat = { messages: [] };
const chatReducer = produce((draft, { type, payload }) => {
  switch (type) {
    case CHAT_MESSAGE_RECEIVED:
      if (payload.type.startsWith('chat.typing.')) {
        draft.typing = payload.type === 'chat.typing.start' ? payload : false;
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
      draft.chats[payload.id] = { ...emptyChat, data: payload };
      draft.activeChat = payload.id;
    } else if (type === 'SET_VISITOR' && Array.isArray(payload.chats)) {
      payload.chats.forEach((chat) => {
        const id = chat.id;
        draft.chats[id] = spread(
          draft.chats[id] ? draft.chats[id] : emptyChat,
          { data: chat }
        );
        if (chat.status === 'open') {
          draft.activeChat = id;
        }
      });
    } else if (type === CHAT_MESSAGE_RECEIVED) {
      draft.chats[payload.chat] = chatReducer(
        draft.chats[payload.chat],
        action
      );
      if (payload.type === 'chat.ended') {
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
