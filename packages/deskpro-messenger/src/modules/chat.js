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
  map,
  mapTo,
  ignoreElements
} from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import { createSelector } from 'reselect';
import { produce } from 'immer';
import _findLast from 'lodash/findLast';
import _mapValues from 'lodash/mapValues';

import asset from '../utils/asset';
import uuid from '../utils/uuid';
import { hasAgentsAvailable } from './info';
import chatService from '../services/ApiService';
import cache from '../services/Cache';
import { SET_VISITOR } from './guest';

const spread = produce(Object.assign);

const messengerOptions = window.parent.DESKPRO_MESSENGER_OPTIONS || {};
const sounds = _mapValues(
  messengerOptions.sounds || {},
  (path) => new Audio(path)
);
sounds.default = new Audio(asset('audio/unconvinced.mp3'));

//#region ACTION TYPES
export const CHAT_START = 'CHAT_START';
export const CHAT_SAVE_CHAT = 'CHAT_SAVE_CHAT';
export const CHAT_INIT_CHATS = 'CHAT_INIT_CHATS';
export const CHAT_SEND_MESSAGE = 'CHAT_SEND_MESSAGE';
export const CHAT_MESSAGE_RECEIVED = 'CHAT_MESSAGE_RECEIVED';
export const CHAT_HISTORY_LOADED = 'CHAT_HISTORY_LOADED';
export const CHAT_TOGGLE_SOUND = 'CHAT_TOGGLE_SOUND';
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
export const toggleSound = () => ({ type: CHAT_TOGGLE_SOUND });
//#endregion

//#region EPICS
const initChatsEpic = (action$) =>
  action$.pipe(
    ofType(SET_VISITOR),
    filter(({ payload }) => Array.isArray(payload.chats)),
    tap(({ payload }) => cache.mergeArray('chats', payload.chats)),
    map(() => initChats(cache.getValue('chats') || []))
  );
const loadHistoryEpic = (action$) =>
  action$.pipe(
    ofType(CHAT_INIT_CHATS),
    mergeMap(({ payload }) => {
      const activeChat = payload.find((c) => c.status === 'open');
      if (activeChat) {
        return merge(
          from(chatService.getChatHistory(activeChat)).pipe(
            filter((messages) => messages.length > 0),
            map(chatHistoryLoaded)
          ),
          from(
            chatService.trackPage(
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
const createChatEpic = (action$, state$) =>
  action$.pipe(
    ofType(CHAT_START),
    switchMap(({ payload, meta }) => {
      return from(chatService.createChat(payload)).pipe(
        withLatestFrom(state$),
        mergeMap(([chat, state]) => {
          // save new chat
          const streams = [
            of(saveChat({ ...chat, fromScreen: meta.fromScreen }, meta))
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
            streams.push(of(sendMessage(meta.message, chat)));
          }
          if (!hasAgentsAvailable(state)) {
            console.log('no agents online');
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
        interval(config.chatTimeout || 60 * 1000).pipe(
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
      cache.setValue(['chats', []], {
        ...payload,
        status: 'open'
      });
      meta.history.push(`/screens/active-chat/${payload.id}`);
    }),
    skip()
  );

const deactivateChatEpic = (action$) =>
  action$.pipe(
    ofType(CHAT_MESSAGE_RECEIVED),
    filter(({ payload }) => payload.type === 'chat.ended'),
    tap(({ payload }) => {
      cache.setValue(['chats', ['id', payload.chat], 'status'], 'ended');
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

const sendMessagesEpic = (action$) =>
  action$.pipe(
    ofType(CHAT_SEND_MESSAGE),
    tap(({ payload, meta: { chat } }) => {
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
  initChatsEpic,
  loadHistoryEpic,
  createChatEpic,
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
      draft.messages.push(payload);
      draft.typing = payload.origin === 'agent' ? undefined : draft.typing;
      if (payload.type === 'chat.ended') {
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
    } else if (type === CHAT_INIT_CHATS) {
      payload.forEach((chat) => {
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
      if (payload.type === 'chat.ended' && payload.chat === draft.activeChat) {
        delete draft.activeChat;
      }
    } else if (type === CHAT_HISTORY_LOADED) {
      const chatId = payload[0].chat || draft.activeChat;
      draft.chats[chatId].messages = payload.concat(
        draft.chats[chatId].messages
      );
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
