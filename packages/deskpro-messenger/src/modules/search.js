import { combineEpics, ofType } from 'redux-observable';
import { debounce, mergeMap, map, skipWhile, tap, skip, take } from 'rxjs/operators';
import { timer } from 'rxjs';
import { produce } from 'immer';
import { createSelector } from 'reselect';
import { SET_VISITOR } from './guest';

export const SEARCH_QUICK_SEARCH = 'SEARCH_QUICK_SEARCH';
export const SEARCH_QUICK_SEARCH_COMPLETE = 'SEARCH_QUICK_SEARCH_COMPLETE';
export const SEARCH_FULL = 'SEARCH_FULL';
export const SEARCH_FULL_COMPLETE = 'SEARCH_FULL_COMPLETE';
export const SEARCH_RESTORE = 'SEARCH_RESTORE';

export const quickSearch = (payload) => ({
  type: SEARCH_QUICK_SEARCH,
  payload
});
export const quickSearchComplete = (payload) => ({
  type: SEARCH_QUICK_SEARCH_COMPLETE,
  payload
});
export const search = (payload) => ({
  type: SEARCH_FULL,
  payload
});
export const searchComplete = (payload) => ({
  type: SEARCH_FULL_COMPLETE,
  payload
});

const searchRestore = (payload) => ({
  type: SEARCH_RESTORE,
  payload
});

const startupFillResultsEpic = (action$, _, { cache }) =>
  action$.pipe(
    ofType(SET_VISITOR),
    take(1),
    map(() => {
      return searchComplete(cache.getValue('search.results') || []);
    }),
  );

const startupFillQueryEpic = (action$, _, { cache }) =>
  action$.pipe(
    ofType(SET_VISITOR),
    take(1),
    map(() => {
      return searchRestore(cache.getValue('search.query') || '');
    }),
  );

const quickSearchEpic = (action$, _, { api }) =>
  action$.pipe(
    ofType(SEARCH_QUICK_SEARCH),
    skipWhile(p => p.length !== 0 && p.length < 3),
    debounce(() => timer(100)),
    mergeMap(async ({ payload }) => {
      try {
        const results = await api.quickSearch(payload);
        return quickSearchComplete(results);
      } catch (e) {
        return quickSearchComplete([]);
      }
    }),
  );

const fullSearchEpic = (action$, _, { api }) =>
  action$.pipe(
    ofType(SEARCH_FULL),
    skipWhile(p => p.length !== 0 && p.length < 3),
    debounce(() => timer(100)),
    mergeMap(async ({ payload }) => {
      try {
        const results = await api.search(payload);
        return searchComplete(results);
      } catch (e) {
        return searchComplete([]);
      }
    }),
  );

const cacheQueryEpic = (action$, _, { cache }) =>
  action$.pipe(
    ofType(SEARCH_FULL, SEARCH_QUICK_SEARCH),
    tap(({ payload }) => {
      cache.setValue('search.query', payload)
    }),
    skip()
  );

const cacheResultsEpic = (action$, _, { cache }) =>
  action$.pipe(
    ofType(SEARCH_QUICK_SEARCH_COMPLETE, SEARCH_FULL_COMPLETE),
    tap(({ payload }) => {
      cache.setValue('search.results', payload)
    }),
    skip()
  );

export const searchEpic = combineEpics(
  quickSearchEpic, fullSearchEpic, cacheQueryEpic, cacheResultsEpic, startupFillQueryEpic, startupFillResultsEpic
);

//#region REDUCER
export default produce((draft, { type, payload }) => {
  switch (type) {
    case SEARCH_QUICK_SEARCH_COMPLETE:
    case SEARCH_FULL_COMPLETE:
      draft.results = payload;
      return;

    case SEARCH_QUICK_SEARCH:
    case SEARCH_FULL:
    case SEARCH_RESTORE:
      draft.query = payload;
      return;

    default:
      return;
  }
}, {query: '', results: []});

//#endregion

//#region SELECTORS
const getSearchState = (state) => state.search;
export const getSearchResults = createSelector(getSearchState, (search) => search.results || []);
export const getSearchQuery = createSelector(getSearchState, (search) => search.query || '');
//#endregion
