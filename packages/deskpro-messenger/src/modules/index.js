import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import chat, { chatEpic } from './chat';
import tickets from './tickets';
import guest from './guest';
import departments, { loadDepartmentsEpic } from './departments';

export const rootReducer = combineReducers({
  guest,
  chat,
  tickets,
  departments
});
export const rootEpic = combineEpics(chatEpic, loadDepartmentsEpic);
