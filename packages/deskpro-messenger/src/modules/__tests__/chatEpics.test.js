import { ActionsObservable } from 'redux-observable';
import { of } from 'rxjs';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/filter';
import { TestScheduler } from 'rxjs/testing';
import {
  chatEpic,
  createChat,
  saveChat,
  CHAT_SAVE_CHAT,
  CHAT_MESSAGE_RECEIVED,
  CHAT_SEND_MESSAGE,
  sendMessage,
  CHAT_SEND_MESSAGE_SUCCESS,
  noAgentsMessage,
  messageReceived,
  initChats,
  CHAT_HISTORY_LOADED
} from '../chat';
import FakeApiService from '../../services/api/FakeApiService';

const api = new FakeApiService();

describe('Chat epics', () => {
  describe('Chat initialization', () => {
    it('should load history for active chat from loaded chats', (done) => {
      const api = {
        getChatHistory: jest.fn(async (chat) => [
          {
            chat: chat.id,
            type: 'chat.message',
            origin: 'user',
            message: 'Hello World'
          }
        ]),
        trackPage: jest.fn(async () => true)
      };
      const chats = [{ id: 21, status: 'ended' }, { id: 22, status: 'open' }];
      const action$ = ActionsObservable.of(initChats(chats));
      const state$ = of({});
      chatEpic(action$, state$, { api })
        .toArray()
        .subscribe((resultActions) => {
          expect(resultActions).toBeArrayOfSize(1);
          expect(api.getChatHistory).toBeCalled();
          expect(api.getChatHistory).toBeCalledWith(chats[1]);
          const [historyLoadedAction] = resultActions;
          expect(historyLoadedAction.type).toBe(CHAT_HISTORY_LOADED);
          expect(historyLoadedAction.payload).toBeArrayOfSize(1);
          expect(api.trackPage).toBeCalled();
          expect(api.trackPage.mock.calls[0][0]).toBeObject();
          expect(api.trackPage.mock.calls[0][0]).toHaveProperty('page_url');
          expect(api.trackPage.mock.calls[0][0]).toHaveProperty('page_title');
          expect(api.trackPage.mock.calls[0][1]).toEqual(chats[1]);
          done();
        });
    });

    it("shouldn't update history if it's empty", (done) => {
      const api = {
        getChatHistory: jest.fn(async () => []),
        trackPage: jest.fn(async () => true)
      };
      const chats = [{ id: 21, status: 'ended' }, { id: 22, status: 'open' }];
      const action$ = ActionsObservable.of(initChats(chats));
      const state$ = of({});
      chatEpic(action$, state$, { api })
        .toArray()
        .subscribe((resultActions) => {
          expect(resultActions).toBeArrayOfSize(0);
          expect(api.getChatHistory).toBeCalled();
          expect(api.trackPage).toBeCalled();
          done();
        });
    });

    it("shouldn't update history if there is no active chats", (done) => {
      const api = {
        getChatHistory: jest.fn(async () => []),
        trackPage: jest.fn(async () => true)
      };
      const chats = [{ id: 21, status: 'ended' }];
      const action$ = ActionsObservable.of(initChats(chats));
      const state$ = of({});
      chatEpic(action$, state$, { api })
        .toArray()
        .subscribe((resultActions) => {
          expect(resultActions).toBeArrayOfSize(0);
          expect(api.getChatHistory).not.toBeCalled();
          expect(api.trackPage).not.toBeCalled();
          done();
        });
    });
  });

  describe('Chat creation', () => {
    it('should create chat and generate noAgents message', (done) => {
      const action$ = ActionsObservable.of(
        createChat({}, { fromScreen: 'startSupportChat' })
      );
      const state$ = of({
        info: { agents: [] }
      });
      chatEpic(action$, state$, { api })
        .toArray()
        .subscribe((resultActions) => {
          expect(resultActions).toBeArrayOfSize(2);
          const [chatAction, messageAction] = resultActions;
          expect(chatAction).toBeObject();
          expect(chatAction.type).toBe(CHAT_SAVE_CHAT);
          expect(chatAction.payload.id).toBeTruthy();
          expect(chatAction.payload.fromScreen).toBe('startSupportChat');
          expect(messageAction).toBeObject();
          expect(messageAction.type).toBe(CHAT_MESSAGE_RECEIVED);
          expect(messageAction.payload.type).toBe('chat.noAgents');
          done();
        });
    });

    it('should create chat and send message', (done) => {
      const action$ = ActionsObservable.of(
        createChat(
          {},
          {
            fromScreen: 'startSupportChat',
            message: {
              type: 'chat.message',
              origin: 'user',
              message: 'Hello World',
              uuid: '1234'
            }
          }
        )
      );
      const state$ = of({
        chat: { chats: {} },
        info: {
          agents: [
            { id: 1, name: 'John Doe', avatar: 'http://deskpro.com/avatar.png' }
          ]
        }
      });
      chatEpic(action$, state$, { api })
        .toArray()
        .subscribe((resultActions) => {
          expect(resultActions).toBeArrayOfSize(2);
          const [chatAction, messageAction] = resultActions;
          expect(chatAction).toBeObject();
          expect(chatAction.type).toBe(CHAT_SAVE_CHAT);
          expect(messageAction).toBeObject();
          expect(messageAction.type).toBe(CHAT_SEND_MESSAGE);
          expect(messageAction.payload.type).toBe('chat.message');
          expect(messageAction.payload.origin).toBe('user');
          expect(messageAction.payload.message).toBe('Hello World');
          done();
        });
    });

    it('should update cache and redirect user to the chat screen', (done) => {
      const chat = { id: 21 };
      const state$ = of({});
      const history = { push: jest.fn() };
      const cache = { setValue: jest.fn(), getValue: jest.fn() };

      const testScheduler = new TestScheduler((expected, actual) => {
        expect(actual).toEqual(expected);
        expect(cache.setValue).toBeCalled();
        expect(cache.setValue.mock.calls[0][1]).toBeObject();
        expect(cache.setValue.mock.calls[0][1]).toHaveProperty('id');
        expect(cache.setValue.mock.calls[0][1].id).toBe(21);
        expect(cache.setValue.mock.calls[0][1].status).toBe('open');
        expect(history.push).toBeCalledWith('/screens/active-chat/21');
        done();
      });

      testScheduler.run(({ hot, expectObservable }) => {
        const action$ = hot('a', { a: saveChat(chat) });
        const output$ = chatEpic(action$, state$, {
          history,
          config: { chatTimeout: 100 },
          cache
        });
        expectObservable(output$).toBe('100ms a', {
          a: noAgentsMessage(chat.id)
        });
      });
    });
  });

  describe('Agent assignment timeout', () => {
    const chat = { id: 21 };
    const state$ = of({});
    const history = { push: jest.fn() };
    const cache = { setValue: jest.fn(), getValue: jest.fn() };

    it('should create noAgents message once time is out', (done) => {
      const testScheduler = new TestScheduler((expected, actual) => {
        expect(actual).toEqual(expected);
        done();
      });

      testScheduler.run(({ hot, expectObservable }) => {
        const action$ = hot('a', { a: saveChat(chat) });
        const output$ = chatEpic(action$, state$, {
          history,
          config: { chatTimeout: 100 },
          cache
        });
        expectObservable(output$).toBe('100ms a', {
          a: noAgentsMessage(chat.id)
        });
      });
    });

    it('shoud not generate noAgents message when agent assigned', (done) => {
      const testScheduler = new TestScheduler((expected, actual) => {
        expect(actual).toEqual(expected);
        done();
      });

      testScheduler.run(({ hot, expectObservable }) => {
        const action$ = hot('a b|', {
          a: saveChat(chat),
          b: messageReceived({
            chat: 21,
            type: 'chat.agentAssigned',
            origin: 'system',
            name: 'John Doe'
          })
        });
        const output$ = chatEpic(action$, state$, {
          history,
          config: { chatTimeout: 100 },
          cache
        });
        expectObservable(output$).toBe('--|', {});
      });
    });
  });

  describe('Sending the message', () => {
    it('should call api method and update state', (done) => {
      const action$ = ActionsObservable.of(
        sendMessage(
          {
            type: 'chat.message',
            origin: 'user',
            message: 'Hello World'
          },
          { id: 21 }
        )
      );
      const apiMock = { sendMessage: jest.fn() };
      chatEpic(action$, of({}), { api: apiMock })
        .toArray()
        .subscribe((resultActions) => {
          expect(apiMock.sendMessage).toBeCalled();
          expect(resultActions).toBeArrayOfSize(1);
          const [action] = resultActions;
          expect(action.type).toBe(CHAT_SEND_MESSAGE_SUCCESS);
          expect(action.payload.message).toBe('Hello World');
          done();
        });
    });
  });
});
