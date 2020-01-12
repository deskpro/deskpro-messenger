import { combineEpics, ofType } from 'redux-observable';
import { debounce, map } from 'rxjs/operators';
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
    debounce(() => timer(1000)),
    map(async ({ payload }) => {
      try {
        const results = await api.quickSearch(payload);
        return { type: SEARCH_QUICK_SEARCH_COMPLETE, payload: results }
      } catch (e) {
        return { type: SEARCH_QUICK_SEARCH_COMPLETE, payload: [] }
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
      draft.results.push(payload.data);
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
