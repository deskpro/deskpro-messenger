import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import chat, { chatEpic } from './chat';
import tickets from './tickets';
import guest from './guest';

export const rootReducer = combineReducers({ guest, chat, tickets });
export const rootEpic = combineEpics(chatEpic);
