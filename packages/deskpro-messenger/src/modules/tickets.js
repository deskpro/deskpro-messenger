import { combineEpics, ofType } from 'redux-observable';
import { mergeMap, map, tap } from 'rxjs/operators';
import Immutable from 'immutable';
import { APP_INIT } from './app';

//#region ACTION TYPES
export const TICKET_SAVE_NEW          = 'TICKET_SAVE_NEW';
export const TICKET_NEW_OPEN          = 'TICKET_NEW_OPEN';
export const TICKET_SAVE_NEW_SUCCESS  = 'TICKET_SAVE_NEW_SUCCESS';
export const TICKET_SAVE_NEW_ERROR    = 'TICKET_SAVE_NEW_ERROR';
export const TICKET_CACHE_FORM        = 'TICKET_CACHE_FORM';
export const TICKET_CACHE_FORM_DONE   = 'TICKET_CACHE_FORM_DONE';
//#endregion

//#region ACTIONS
export const saveTicket = (data) => ({ type: TICKET_SAVE_NEW, payload: data });
export const newTicket  = () => ({ type: TICKET_NEW_OPEN });
export const cacheForm  = (form) => ({ type: TICKET_CACHE_FORM, payload: form });
//#endregion

const KEY_MAP = {
  user_field: 'user_field',
  field: 'ticket_field',
  organization_field: 'org_field',
}

const flattenErrors = (errors = {}, field, parentKey) => {
  let ek = parentKey;
  const m = ek.match('^(user_field|organization_field|field)s_(\\d+)')
  if(m) {
    ek = `${KEY_MAP[m[1]]}_${m[2]}`;
    if (!errors[ek]) {
      errors[ek] = {};
    }
  }

  if (field.errors) {
    errors[ek] = field.errors
      .map(error => error.message)
      .filter((item, pos, self) => self.indexOf(item) === pos)
      .join(' ');
  } else if (field.fields) {
    Object.keys(field.fields).forEach((childKey) => {
      flattenErrors(m ? errors[ek] : errors, field.fields[childKey], childKey);
    });
  }
};

//#region EPICS
export const createTicketEpic = (action$, _, { api }) =>
  action$.pipe(
    ofType(TICKET_SAVE_NEW),
    mergeMap(async ({ payload }) => {
      const flatErrors = {};
      try {
        const ticket = await api.createTicket(payload);
        let errors = {};
        console.log('api request')
        console.log(payload)
        console.log('api response')
        console.log(ticket)
        console.log(ticket['data']['data'])

        console.log('-------- created ticket --------')
        const submittedCcs = payload.cc ? payload.cc.split(',') : [];
        const submittedCcsCount = submittedCcs.length;
        const savedCcsCount = ticket.cc ? ticket.cc.length : 0;
  
        console.log('subbmitted: ', submittedCcs, ' saved: ', ticket.cc);
        console.log('subbmittedCount: ', submittedCcsCount, ' savedCount: ', savedCcsCount);

        if (submittedCcsCount > savedCcsCount) {
          errors.cc = 'ccs count mismatch';
        }

        console.log('errors: ', errors);

        return { type: TICKET_SAVE_NEW_SUCCESS, payload: ticket['data']['data'], errors: errors }
      } catch (e) {
        if (e.response && e.response.status === 400) {
          const { errors } = e.response.data;
          if (errors && errors.fields) {
            Object.keys(errors.fields).forEach((key) => {
              flattenErrors(flatErrors, errors.fields[key], key);
            });
          }
          if (errors && errors.errors) {
            const generalErrors = [];
            errors.errors.forEach((err) => {
              generalErrors.push(err.message);
            })
            flatErrors.general = generalErrors.join("<br/>");
          }
        } else {
          flatErrors.general = 'Server error. Please try later.';
          console.error(e);
        }
        return { type: TICKET_SAVE_NEW_ERROR, payload: flatErrors }
      }
    }),
  );

const cacheTicketFormData = (action$, _, { cache }) =>
  action$.pipe(
    ofType(TICKET_CACHE_FORM),
    map(( { payload } ) => {
      const val = Immutable.fromJS(cache.getValue('formCache') || {}).merge(Immutable.fromJS(payload.values)).toJS();
      cache.setValue('formCache', val);
      return {type: TICKET_CACHE_FORM_DONE, payload: val }
    }),
  );

const cacheCleanTicketFormData = (action$, _, { cache }) =>
  action$.pipe(
    ofType(TICKET_SAVE_NEW_SUCCESS),
    tap(() => {
      cache.setValue('formCache', {} );
    }),
    map(() => {
      return {type: TICKET_CACHE_FORM_DONE, payload: {} }
    }),
  );

const loadCacheTicketFormData = (action$, _, { cache }) =>
  action$.pipe(
    ofType(APP_INIT),
    map(() => {
      return {type: TICKET_CACHE_FORM_DONE, payload: cache.getValue('formCache') || {} }
    }),
  );

export const ticketEpics = combineEpics(createTicketEpic, cacheTicketFormData, loadCacheTicketFormData, cacheCleanTicketFormData);

//#region REDUCER
export default (state = { ticketSaving: false, ticketSaved: false, errors: {}, formCache: {}, ticket: {} }, { type, payload, errors }) => {
  switch (type) {
    case TICKET_NEW_OPEN:
      return { ...state, ticketSaving: false, ticketSaved: false };
    case TICKET_SAVE_NEW:
      return { ...state, ticketSaving: true, errors: {} };
    case TICKET_SAVE_NEW_SUCCESS:
      return { ...state, ticketSaving: false, ticketSaved: true, errors: errors, ticket: payload };
    case TICKET_SAVE_NEW_ERROR:
      return { ...state, ticketSaving: false, ticketSaved: false, errors: payload };
    case TICKET_CACHE_FORM_DONE:
      return { ...state, formCache: payload }
    default:
      return state;
  }
};
//#endregion

//#region SELECTORS
export const getTicketSavingState = (state) => state.tickets.ticketSaving;
export const getTicketSavedState  = (state) => state.tickets.ticketSaved;
export const getTicketFormCache  = (state) => state.tickets.formCache;
export const getTicket  = (state) => state.tickets.ticket;
export const getErrors  = (state) => state.tickets.errors;
//#endregion
