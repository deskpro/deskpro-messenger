import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';

const epicMiddleware = createEpicMiddleware();
const rootReducer = (state = {}) => state;
const rootEpic = action$ => action$;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default (initialState = {}) => {
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(epicMiddleware))
  );

  epicMiddleware.run(rootEpic);

  return store;
};
