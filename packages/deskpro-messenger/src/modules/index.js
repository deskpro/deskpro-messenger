import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import chat, { chatEpic } from './chat';
import tickets from './tickets';

export const rootReducer = combineReducers({ chat, tickets });
export const rootEpic = combineEpics(chatEpic);
