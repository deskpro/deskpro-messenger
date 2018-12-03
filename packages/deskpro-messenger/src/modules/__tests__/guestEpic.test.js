import { ActionsObservable } from 'redux-observable';
import { of } from 'rxjs';

import { guestEpic, SET_VISITOR } from '../guest';
import { appInit } from '../app';
import { createChat } from '../chat';

describe('Guest Epics', () => {
  const appInitAction$ = ActionsObservable.of(appInit());
  const state$ = of({});

  it('should create visitor ID for new user', (done) => {
    const cache = {
      getValue: jest.fn(),
      setValue: jest.fn()
    };
    const api = {
      loadUser: jest.fn(async () => ({}))
    };
    const config = {};

    guestEpic(appInitAction$, state$, { cache, api, config }).subscribe(
      (action) => {
        expect(action.type).toBe(SET_VISITOR);
        expect(action.payload).toHaveProperty('visitor_id');
        expect(action.payload.guest).toBeObject();
        expect(action.payload.guest.name).toBeNull();
        expect(action.payload.guest.email).toBeNull();
        done();
      }
    );
  });

  it('should take new user data from config', (done) => {
    const cache = {
      getValue: jest.fn(),
      setValue: jest.fn()
    };
    const api = {
      loadUser: jest.fn(async () => ({}))
    };
    const config = {
      user: { name: 'Artem Berdyshev', email: 'artem.berdyshev@deskpro.com' }
    };

    guestEpic(appInitAction$, state$, { cache, api, config }).subscribe(
      (action) => {
        expect(action.type).toBe(SET_VISITOR);
        expect(action.payload).toHaveProperty('visitor_id');
        expect(action.payload.guest).toEqual(config.user);
        done();
      }
    );
  });

  it('should init visitor data from cache', (done) => {
    const cache = {
      getValue: jest.fn((name) => {
        switch (name) {
          case 'visitor_id':
            return '12ab34de56';
          case 'guest.name':
            return 'John Doe';
          case 'guest.email':
            return 'john.doe@deskpro.com';
          default:
            break;
        }
      }),
      setValue: jest.fn()
    };
    const api = {
      loadUser: jest.fn(async () => ({}))
    };
    const config = {};

    guestEpic(appInitAction$, state$, { cache, api, config }).subscribe(
      (action) => {
        expect(action.type).toBe(SET_VISITOR);
        expect(api.loadUser).toBeCalledWith('12ab34de56');
        expect(action.payload.visitor_id).toBe('12ab34de56');
        expect(action.payload.guest).toBeObject();
        expect(action.payload.guest.name).toBe('John Doe');
        expect(action.payload.guest.email).toBe('john.doe@deskpro.com');
        expect(cache.setValue.mock.calls[0][0]).toBe('guest');
        expect(cache.setValue.mock.calls[0][1]).toEqual({
          name: 'John Doe',
          email: 'john.doe@deskpro.com'
        });
        expect(cache.setValue.mock.calls[1][0]).toBe('visitor_id');
        expect(cache.setValue.mock.calls[1][1]).toBe('12ab34de56');
        done();
      }
    );
  });

  it('should take name/email from cache instead of config if set both', (done) => {
    const cache = {
      getValue: jest.fn((name) => {
        switch (name) {
          case 'visitor_id':
            return '12ab34de56';
          case 'guest.name':
            return 'John Doe';
          case 'guest.email':
            return 'john.doe@deskpro.com';
          default:
            break;
        }
      }),
      setValue: jest.fn()
    };
    const api = {
      loadUser: jest.fn(async () => ({}))
    };
    const config = {
      user: { name: 'Artem Berdyshev', email: 'artem.berdyshev@deskpro.com' }
    };

    guestEpic(appInitAction$, state$, { cache, api, config }).subscribe(
      (action) => {
        expect(action.type).toBe(SET_VISITOR);
        expect(api.loadUser).toBeCalledWith('12ab34de56');
        expect(action.payload.visitor_id).toBe('12ab34de56');
        expect(action.payload.guest).toBeObject();
        expect(action.payload.guest.name).toBe('John Doe');
        expect(action.payload.guest.email).toBe('john.doe@deskpro.com');
        expect(cache.setValue.mock.calls[0][0]).toBe('guest');
        expect(cache.setValue.mock.calls[0][1]).toEqual({
          name: 'John Doe',
          email: 'john.doe@deskpro.com'
        });
        expect(cache.setValue.mock.calls[1][0]).toBe('visitor_id');
        expect(cache.setValue.mock.calls[1][1]).toBe('12ab34de56');
        done();
      }
    );
  });

  it('should update user data when it is passed into create chat', (done) => {
    const user = { name: 'John Doe', email: 'john.doe' };
    const action$ = ActionsObservable.of(createChat(user));
    const cache = {
      getValue: jest.fn(),
      setValue: jest.fn()
    };

    guestEpic(action$, state$, { cache }).subscribe((action) => {
      expect(action.type).toBe(SET_VISITOR);
      expect(action.payload.guest).toEqual(user);
      expect(cache.setValue.mock.calls[0][0]).toBe('guest.name');
      expect(cache.setValue.mock.calls[0][1]).toEqual(user.name);
      expect(cache.setValue.mock.calls[1][0]).toBe('guest.email');
      expect(cache.setValue.mock.calls[1][1]).toBe(user.email);
      done();
    });
  });
});
