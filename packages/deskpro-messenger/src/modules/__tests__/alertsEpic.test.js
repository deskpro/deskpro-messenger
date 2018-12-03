import { of } from 'rxjs';
import 'rxjs/add/operator/toArray';
import { TestScheduler } from 'rxjs/testing';

import { listenForAlertsEpic } from '../alerts';
import { appShutdown } from '../app';
import { appInfoLoaded } from '../info';
import { messageReceived } from '../chat';

describe('Alerts subscription', () => {
  it('should start listen for alerts until app shutdowns', (done) => {
    const testScheduler = new TestScheduler((expected, actual) => {
      expect(actual).toEqual(expected);
      done();
    });

    testScheduler.run(({ hot, cold, expectObservable }) => {
      const action$ = hot('a--b', {
        a: appInfoLoaded({}),
        b: appShutdown()
      });
      const state$ = of({});
      const message = {
        chat: 21,
        type: 'chat.message',
        origin: 'agent',
        message: 'Hello World'
      };
      const api = {
        getAlertsStream: jest.fn(() => cold('-a', { a: message }))
      };
      const output$ = listenForAlertsEpic(action$, state$, { api });
      expectObservable(output$).toBe('-a-|', {
        a: messageReceived(message)
      });
    });
  });
});
