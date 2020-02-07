import { combineEpics, ofType } from 'redux-observable';
import { debounce, mergeMap, skipWhile } from 'rxjs/operators';
import { timer } from 'rxjs';
import { produce } from 'immer';
import { createSelector } from 'reselect';

export const SEARCH_QUICK_SEARCH = 'SEARCH_QUICK_SEARCH';
export const SEARCH_QUICK_SEARCH_COMPLETE = 'SEARCH_QUICK_SEARCH_COMPLETE';
export const SEARCH_FULL = 'SEARCH_FULL';
export const SEARCH_FULL_COMPLETE = 'SEARCH_FULL_COMPLETE';

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

export const searchEpic = combineEpics(
  quickSearchEpic, fullSearchEpic
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
      draft.query = payload;

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
