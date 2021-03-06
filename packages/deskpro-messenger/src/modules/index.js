import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { listenForAlertsEpic } from './alerts';
import chat, { chatEpic } from './chat';
import tickets, { ticketEpics } from './tickets';
import guest, { guestEpic } from './guest';
import info, { loadAppInfoEpic } from './info';
import app, { appEpic } from './app';
import search, { searchEpic } from './search';

export const rootReducer = combineReducers({
  app,
  guest,
  chat,
  tickets,
  info,
  search
});
export const rootEpic = combineEpics(
  appEpic,
  guestEpic,
  loadAppInfoEpic,
  listenForAlertsEpic,
  chatEpic,
  ticketEpics,
  searchEpic
);
