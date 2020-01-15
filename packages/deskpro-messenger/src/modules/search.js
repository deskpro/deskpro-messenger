import { combineEpics, ofType } from 'redux-observable';
import { debounce, mergeMap, skipWhile } from 'rxjs/operators';
import { timer } from 'rxjs';
import { produce } from 'immer';
import { createSelector } from 'reselect';

export const SEARCH_QUICK_SEARCH = 'SEARCH_QUICK_SEARCH';
export const SEARCH_QUICK_SEARCH_COMPLETE = 'SEARCH_QUICK_SEARCH_COMPLETE';

export const quickSearch = (payload) => ({
  type: SEARCH_QUICK_SEARCH,
  payload
});
export const quickSearchComplete = (payload) => ({
  type: SEARCH_QUICK_SEARCH_COMPLETE,
  payload
});


const quickSearchEpic = (action$, _, { api }) =>
  action$.pipe(
    ofType(SEARCH_QUICK_SEARCH),
    skipWhile(p => p.length !== 0 && p.length < 3),
    debounce(() => timer(1000)),
    mergeMap(async ({ payload }) => {
      try {
        const results = await api.quickSearch(payload);
        return quickSearchComplete(results);
      } catch (e) {
        return quickSearchComplete([]);
      }
    }),
  );

export const searchEpic = combineEpics(
  quickSearchEpic
);

//#region REDUCER
export default produce((draft, { type, payload }) => {
  switch (type) {
    case SEARCH_QUICK_SEARCH_COMPLETE:
      draft.results = payload;
      return;

    default:
      return;
  }
}, {results: []});

//#endregion

//#region SELECTORS
const getSearchState = (state) => state.search;
export const getSearchResults = createSelector(getSearchState, (search) => search.results || []);
//#endregion
