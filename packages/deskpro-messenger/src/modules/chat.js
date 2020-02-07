import { empty, from, interval, merge, of, race } from 'rxjs';
import { combineEpics, ofType } from 'redux-observable';
import {
  filter,
  ignoreElements,
  map,
  mapTo,
  mergeMap,
  skip,
  switchMap,
  take,
  tap,
  withLatestFrom,
  distinctUntilKeyChanged
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

import { SET_VISITOR } from './guest';
import { setWindowState } from './app';

const spread = produce(Object.assign);

const messengerOptions = window.parent.DESKPRO_MESSENGER_OPTIONS || {};
const sounds = _mapValues(
  messengerOptions.sounds || {},
  (path) => new Audio(path)
);
sounds.default = new Audio(asset('audio/unconvinced.mp3'));

const endedEvents = ['chat.ended', 'chat.waitTimeout', 'chat.userTimeout'];
const isEndEvent = (payload) => -1 !== endedEvents.indexOf(payload.type);

//#region ACTION TYPES
export const CHAT_START = 'CHAT_START';
export const CHAT_SAVE_CHAT = 'CHAT_SAVE_CHAT';
export const CHAT_INIT_CHATS = 'CHAT_INIT_CHATS';
export const CHAT_SEND_MESSAGE = 'CHAT_SEND_MESSAGE';
export const CHAT_SEND_END_CHAT = 'CHAT_SEND_END_CHAT';
export const CHAT_SEND_MESSAGE_SUCCESS = 'CHAT_SEND_MESSAGE_SUCCESS';
export const CHAT_MESSAGE_RECEIVED = 'CHAT_MESSAGE_RECEIVED';
export const CHAT_HISTORY_LOADED = 'CHAT_HISTORY_LOADED';
export const CHAT_TOGGLE_SOUND = 'CHAT_TOGGLE_SOUND';
export const CHAT_OPENED = 'CHAT_OPENED';
//#endregion

//#region ACTION CREATORS
export const createChat = (data, meta) => ({
  type: CHAT_START,
  payload: data,
  meta
});
export const chatOpened = () => ({
  type: CHAT_OPENED
});
export const saveChat = (payload, meta) => ({
  type: CHAT_SAVE_CHAT,
  payload,
  meta
});
export const initChats = (chats) => ({
  type: CHAT_INIT_CHATS,
  payload: chats
});
export const messageReceived = (message) => ({
  type: CHAT_MESSAGE_RECEIVED,
  payload: message
});
export const chatHistoryLoaded = (messages) => ({
  type: CHAT_HISTORY_LOADED,
  payload: messages
});
export const noAgentsMessage = (chat) =>
  messageReceived({
    type: 'chat.noAgents',
    origin: 'system',
    chat
  });
export const sendMessage = (message, chat) => ({
  type: CHAT_SEND_MESSAGE,
  payload: message,
  meta: { chat }
});
export const endChatMessage = (chat) => ({
  type: CHAT_SEND_END_CHAT,
  payload: { origin: 'user', type: 'chat.end' },
  meta: { chat }
});
export const messageSent = (message, chat) => ({
  type: CHAT_SEND_MESSAGE_SUCCESS,
  payload: message,
  meta: { chat }
});
export const toggleSound = () => ({ type: CHAT_TOGGLE_SOUND });
//#endregion

//#region EPICS
const initChatsEpic = (action$, _, { cache }) =>
  action$.pipe(
    ofType(SET_VISITOR),
    filter(({ payload }) => Array.isArray(payload.chats)),
    tap(({ payload }) => cache.mergeArray('chats', payload.chats)),
    map(() => initChats(cache.getValue('chats') || []))
  );
const loadHistoryEpic = (action$, _, { api }) =>
  action$.pipe(
    ofType(CHAT_INIT_CHATS),
    mergeMap(({ payload }) => {
      // this should be rewritten (also search for CHAT_INIT_CHATS)
      let activeChat = null;
      payload.sort((a,b) => a.id - b.id).forEach((chat) => {
        if(chat.status === 'open') {
          activeChat = chat;
        }
      });
      if (activeChat) {
        return merge(
          from(api.getChatHistory(activeChat)).pipe(
            filter((messages) => messages.length > 0),
            map(chatHistoryLoaded)
          ),
          from(
            api.trackPage(
              {
                page_url: window.parent.location.href,
                page_title: window.parent.document.title
              },
              activeChat
            )
          ).pipe(ignoreElements())
        );
      }
      return empty();
    })
  );
const createChatEpic = (action$, state$, { api }) =>
  action$.pipe(
    ofType(CHAT_START),
    switchMap(({ payload, meta }) => {
      return from(api.createChat(payload)).pipe(
        withLatestFrom(state$),
        mergeMap(([chat, state]) => {
          // save new chat
          const streams = [
            of(saveChat({ ...chat, fromScreen: meta.fromScreen }, meta))
          ];
          if (meta.message) {
            // send user's first message.
            streams.push(of(sendMessage(meta.message, chat)));
          }
          if (!hasAgentsAvailable(state)) {
            streams.push(of(noAgentsMessage(chat.id)));
          }
          return merge(...streams);
        })
      );
    })
  );

const forceChatOpenEpic = (action$) =>
  action$.pipe(
    ofType(CHAT_SAVE_CHAT),
    mergeMap(() => of(setWindowState(true)))
  );

const agentAssignementTimeout = (action$, _, { config }) =>
  action$.pipe(
    ofType(CHAT_SAVE_CHAT),
    mergeMap(({ payload: chat }) =>
      race(
        action$.pipe(
          ofType(CHAT_MESSAGE_RECEIVED),
          filter(({ payload: message }) =>
            ['chat.agentAssigned', 'chat.ended', 'chat.noAgents'].includes(message.type)
          ),
          mapTo(false)
        ),
        interval((config.screens.startChat.timeout || 60) * 1000).pipe(
          take(1),
          mapTo(true)
        )
      ).pipe(
        switchMap((timedOut) =>
          timedOut ? of(noAgentsMessage(chat.id)) : empty()
        )
      )
    )
  );

const cacheNewChatEpic = (action$, _, { history, cache }) =>
  action$.pipe(
    ofType(CHAT_SAVE_CHAT),
    tap(({ payload }) => {
      cache.setValue(['chats', []], {
        ...payload,
        status: 'open'
      });
      history.push(`/screens/active-chat/${payload.id}`);
    }),
    skip()
  );

const deactivateChatEpic = (action$, _, { cache }) =>
  action$.pipe(
    ofType(CHAT_MESSAGE_RECEIVED),
    filter(({ payload }) => isEndEvent(payload)),
    tap(({ payload }) => {
      cache.setValue(['chats', ['id', payload.chat], 'status'], 'ended');
    }),
    skip()
  );

const sendMessagesEpic = (action$, _, { api, cache }) =>
  action$.pipe(
    ofType(CHAT_SEND_MESSAGE),
    map(({ payload, meta: { chat } }) => {
      if (chat) {
        const message = {
          ...payload,
          chat: chat.id,
          uuid: uuid()
        };
        return {message, chat};
      }
      throw new Error('Cannot send a message to the undefined chat.');
    }),
    tap((args) => {
      const { message, chat } = args;
      api.sendMessage(message, chat);
    }),
    map((args) => {
      const { message, chat } = args;
      message.avatar = cache.getValue('guest.avatar');
      return messageSent({message, chat});
    })
  );

const sendEndChatEpic = (action$, _, { api }) =>
  action$.pipe(
    ofType(CHAT_SEND_END_CHAT),
    distinctUntilKeyChanged('meta', (prev, current) => prev.chat.id === current.chat.id),
    map(({ payload, meta: { chat } }) => {
      if (chat) {
        const message = {
          ...payload,
          chat: chat.id,
          uuid: uuid()
        };
        return [message, chat];
      }
      throw new Error('Cannot send a message to the undefined chat.');
    }),
    tap((args) => {
      api.sendMessage(...args);
    }),
    skip()
  );

const soundEpic = (action$, state$) =>
  action$.pipe(
    ofType(CHAT_MESSAGE_RECEIVED, CHAT_SEND_MESSAGE_SUCCESS),
    withLatestFrom(state$),
    filter(
      ([{ type, payload: message }, state]) =>
        ((type === CHAT_MESSAGE_RECEIVED &&
          message.type === 'chat.message' &&
          message.origin === 'agent') ||
          (type === CHAT_SEND_MESSAGE_SUCCESS &&
            message.type === 'chat.message')) &&
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
  initChatsEpic,
  loadHistoryEpic,
  createChatEpic,
  sendMessagesEpic,
  sendEndChatEpic,
  cacheNewChatEpic,
  deactivateChatEpic,
  soundEpic,
  agentAssignementTimeout,
  forceChatOpenEpic
);
//#endregion

//#region REDUCER
const emptyChat = { messages: [] };
const chatReducer = produce((draft, { type, payload }) => {
  switch (type) {
    case CHAT_SEND_MESSAGE_SUCCESS:
      if (!payload.type.startsWith('chat.end')) {
        draft.messages.push(payload);
      }
      return;

    case CHAT_MESSAGE_RECEIVED:
      if (payload.type.startsWith('chat.typing.')) {
        draft.typing = payload.type === 'chat.typing.start' && payload.origin === 'agent' ? payload : false;
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
      if (payload.type === 'chat.message' && payload.origin === 'user') {
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
      if (payload.type === 'chat.agentAssigned' || payload.type === 'chat.agentUnassigned') {
        draft.agent = _pick(payload, ['name', 'avatar']);
      } else {
        draft.messages.push(payload);
      }
      draft.typing = payload.origin === 'agent' ? undefined : draft.typing;
      if (isEndEvent(payload)) {
        draft.data.status = 'ended';
      }
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
      draft.chatAssigned = false;
    } else if (type === CHAT_INIT_CHATS) {
      payload.sort((a,b) => a.id - b.id).forEach((chat) => {
        const id = chat.id;
        draft.chats[id] = spread(
          draft.chats[id] ? draft.chats[id] : emptyChat,
          { data: chat }
        );
        if (chat.status === 'open') {
          draft.activeChat = id;
        }
        if (chat.agent) {
          draft.chatAssigned = true;
        }
      });
    } else if (
      [CHAT_MESSAGE_RECEIVED, CHAT_SEND_MESSAGE_SUCCESS].includes(type)
    ) {
      if (payload.chat in draft.chats) {
        draft.chats[payload.chat] = chatReducer(
          draft.chats[payload.chat],
          action
        );
      }
      if (isEndEvent(payload) && payload.chat === draft.activeChat) {
        delete draft.activeChat;
      }
      if (payload.type === 'chat.agentAssigned' && payload.chat === draft.activeChat) {
        draft.chatAssigned = true;
      }
    } else if (type === CHAT_HISTORY_LOADED) {
      const chatId = payload[0].chat || draft.activeChat;
      draft.chats[chatId].messages = payload.concat(
        draft.chats[chatId].messages
      );
    }

    return;
  },
  { chats: {}, mute: false, activeChat: null, chatAssigned: false }
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
export const getChatAgent = createSelector(getChat, (chat) => chat.agent || {});
export const getChatData = createSelector(getChat, (chat) => chat.data);
export const getMessages = createSelector(getChat, (chat) => chat.messages);
export const getTypingState = createSelector(getChat, (chat) => chat.typing);
export const isMuted = createSelector(getChatState, (state) => state.mute);
export const isChatAssigned = createSelector(getChatState, (state) => state.chatAssigned);
//#endregion
