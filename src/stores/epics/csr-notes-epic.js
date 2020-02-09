import PropTypes from 'prop-types';
import { of } from 'rxjs';
import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import {
  ACTION_CSR_FETCH_NOTES,
  ACTION_CSR_FETCH_NOTES_FULFILLED,
  ACTION_CSR_FETCH_NOTES_REJECTED,
  ACTION_CSR_ADD_NOTE,
  ACTION_CSR_ADD_NOTE_FULFILLED,
  ACTION_CSR_ADD_NOTE_REJECTED,
} from '../actions/csr-notes-actions';
import { BOINGO_EXTERNAL_API } from '../../settings';
import { csrFetchNotesEpicStub, csrAddNoteEpicStub } from './csr-notes-epic.stub';

/*
// delay 2 second
const loopDelay = (loopLength = 1000000000) => {
  let j, k=2;
  for(let i=0; i <loopLength; i++) {j = k*i;}
  console.log(j);
};
*/

/**
 * Fetch notes using auth token
 * Pass customer data to fulfillment (save to global state)
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions dispatched by Redux components or RxJS epics
 * @param {object} state$ [required] - RxJS Observable that emits Redux state
 * @param {object} dependencies.ajax [required] - Object that contains epic dependencies (eg. { ajax })
 * 
 * @returns {object} RxJS Observable that emits an action for fulfillment or rejection
 */
export const csrFetchNotesEpic = (action$, state$, { ajax }) => action$.pipe(
  ofType(ACTION_CSR_FETCH_NOTES),
  mergeMap((action) => (
    ajax({
      url: `${BOINGO_EXTERNAL_API}/2/customers/${action.payload.customer_id}/notes`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'Cache-Control': 'no-cache',
        'Authorization': action.payload.token
      },
      __STUB_AJAX__: csrFetchNotesEpicStub,
    }).pipe(
      tap(ajaxResponse => console.log(ajaxResponse.response)),
      map(ajaxResponse => ({
        type: ACTION_CSR_FETCH_NOTES_FULFILLED,
        payload: ajaxResponse
      })),
      catchError(error => of({
        type: ACTION_CSR_FETCH_NOTES_REJECTED,
        payload: error,
        error: true
      }))
    )
  ))
);
// type declaration and enforcement
csrFetchNotesEpic.propTypes = {
  action$: PropTypes.object.isRequired,
  state$: PropTypes.object.isRequired,
  dependencies: PropTypes.shape({
    ajax: PropTypes.func.isRequired,
  }),
};

/**
 * udpate notes using auth token
 * Pass customer data to fulfillment (save to global state)
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions dispatched by Redux components or RxJS epics
 * @param {object} state$ [required] - RxJS Observable that emits Redux state
 * @param {object} dependencies.ajax [required] - Object that contains epic dependencies (eg. { ajax })
 * 
 * @returns {object} RxJS Observable that emits an action for fulfillment or rejection
 */
export const csrAddNoteEpic = (action$, state$, { ajax }) => action$.pipe(
  ofType(ACTION_CSR_ADD_NOTE),
  mergeMap((action) => (
    ajax({
      url: `${BOINGO_EXTERNAL_API}/2/customers/${action.payload.customer_id}/notes`,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Authorization': action.payload.token
      },
      body: action.payload.body,
      __STUB_AJAX__: csrAddNoteEpicStub,
    }).pipe(
      tap(ajaxResponse => console.log(ajaxResponse.response)),
      map(ajaxResponse => ({
        type: ACTION_CSR_ADD_NOTE_FULFILLED,
        payload: ajaxResponse
      })),
      catchError(error => of({
        type: ACTION_CSR_ADD_NOTE_REJECTED,
        payload: error,
        error: true
      }))
    )
  ))
);
// type declaration and enforcement
csrAddNoteEpic.propTypes = {
  action$: PropTypes.object.isRequired,
  state$: PropTypes.object.isRequired,
  dependencies: PropTypes.shape({
    ajax: PropTypes.func.isRequired,
  }),
};