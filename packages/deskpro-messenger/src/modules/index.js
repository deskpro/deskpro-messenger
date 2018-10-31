import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { listenForAlertsEpic } from './alerts';
import chat, { chatEpic } from './chat';
import tickets from './tickets';
import guest, { guestEpic } from './guest';
import info, { loadAppInfoEpic } from './info';
import { startupRedirectEpic } from './app';

export const rootReducer = combineReducers({
  guest,
  chat,
  tickets,
  info
});
export const rootEpic = combineEpics(
  startupRedirectEpic,
  guestEpic,
  loadAppInfoEpic,
  listenForAlertsEpic,
  chatEpic
);
