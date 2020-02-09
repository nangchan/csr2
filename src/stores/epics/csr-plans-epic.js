import PropTypes from 'prop-types';
import { of } from 'rxjs';
import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import {
  ACTION_CSR_FETCH_DEFERRED_ACTIONS,
  ACTION_CSR_FETCH_DEFERRED_ACTIONS_FULFILLED,
  ACTION_CSR_FETCH_DEFERRED_ACTIONS_REJECTED,
} from '../actions/csr-plans-actions';
import { BOINGO_EXTERNAL_API } from '../../settings';
import { csrFetchDeferredActionsEpicStub } from './csr-plans-epic.stub';

/**
 * Fetch deferred actions using auth token
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions dispatched by Redux components or RxJS epics
 * @param {object} state$ [required] - RxJS Observable that emits Redux state
 * @param {object} dependencies.ajax [required] - Object that contains epic dependencies (eg. { ajax })
 * 
 * @returns {object} RxJS Observable that emits an action for fulfillment or rejection
 */
export const csrFetchDeferredActionsEpic = (action$, state$, { ajax }) => action$.pipe(
  ofType(ACTION_CSR_FETCH_DEFERRED_ACTIONS),
  mergeMap((action) => (
    ajax({
      url: `${BOINGO_EXTERNAL_API}/2/customers/${action.payload.customer_id}/deferred_actions`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'Cache-Control': 'no-cache',
        'Authorization': action.payload.token
      },
      __STUB_AJAX__: csrFetchDeferredActionsEpicStub,
    }).pipe(
      tap(ajaxResponse => console.log(ajaxResponse.response)),
      map(ajaxResponse => ({
        type: ACTION_CSR_FETCH_DEFERRED_ACTIONS_FULFILLED,
        payload: ajaxResponse
      })),
      catchError(error => of({
        type: ACTION_CSR_FETCH_DEFERRED_ACTIONS_REJECTED,
        payload: error,
        error: true
      }))
    )
  ))
);
// type declaration and enforcement
csrFetchDeferredActionsEpic.propTypes = {
  action$: PropTypes.object.isRequired,
  state$: PropTypes.object.isRequired,
  dependencies: PropTypes.shape({
    ajax: PropTypes.func.isRequired,
  }),
};