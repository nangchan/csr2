import PropTypes from 'prop-types';
import { of } from 'rxjs';
import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import {
  ACTION_CSR_SEARCH,
  ACTION_CSR_SEARCH_FULFILLED,
  ACTION_CSR_SEARCH_REJECTED,
} from '../actions/csr-search-actions';
import { BOINGO_EXTERNAL_API } from '../../settings';
import { csrSearchEpicStub } from './csr-search-epic.stub';

/*
// delay 2 second
const loopDelay = (loopLength = 1000000000) => {
  let j, k=2;
  for(let i=0; i <loopLength; i++) {j = k*i;}
  console.log(j);
};
*/

/**
 * Fetch customers using auth token
 * Pass customer data to fulfillment (save to global state)
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions dispatched by Redux components or RxJS epics
 * @param {object} state$ [required] - RxJS Observable that emits Redux state
 * @param {object} dependencies.ajax [required] - Object that contains epic dependencies (eg. { ajax })
 * 
 * @returns {object} RxJS Observable that emits an action for fulfillment or rejection
 */
export const csrSearchEpic = (action$, state$, { ajax }) => action$.pipe(
  ofType(ACTION_CSR_SEARCH),
  mergeMap((action) => (
    ajax({
      url: `${BOINGO_EXTERNAL_API}/2/search`,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'Cache-Control': 'no-cache',
        'Authorization': action.payload.token
      },
      body: {
        ...action.payload.request,
        page_size: action.payload.page_size,
        page: action.payload.page_index+1,
      },
      __STUB_AJAX__: csrSearchEpicStub,
    }).pipe(
      tap(ajaxResponse => console.log(ajaxResponse.response)),
      map(ajaxResponse => ({
        type: ACTION_CSR_SEARCH_FULFILLED,
        payload: ajaxResponse
      })),
      catchError(error => of({
        type: ACTION_CSR_SEARCH_REJECTED,
        payload: error,
        error: true
      }))
    )
  ))
);
// type declaration and enforcement
csrSearchEpic.propTypes = {
  action$: PropTypes.object.isRequired,
  state$: PropTypes.object.isRequired,
  dependencies: PropTypes.shape({
    ajax: PropTypes.func.isRequired,
  }),
};