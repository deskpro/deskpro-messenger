import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import chat, { chatEpic } from './chat';

export const rootReducer = combineReducers({ chat });
export const rootEpic = combineEpics(chatEpic);
