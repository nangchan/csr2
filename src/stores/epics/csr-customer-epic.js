import PropTypes from 'prop-types';
import { of } from 'rxjs';
import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, tap, concat } from 'rxjs/operators';
import {
  ACTION_CSR_FETCH_CUSTOMER,
  ACTION_CSR_FETCH_CUSTOMER_FULFILLED,
  ACTION_CSR_FETCH_CUSTOMER_REJECTED,
  ACTION_CSR_UPDATE_CUSTOMER,
  ACTION_CSR_UPDATE_CUSTOMER_FULFILLED,
  ACTION_CSR_UPDATE_CUSTOMER_REJECTED,
} from '../actions/csr-customer-actions';
import { BOINGO_EXTERNAL_API } from '../../settings';
import { csrFetchCustomerEpicStub, csrUpdateCustomerEpicStub } from './csr-customer-epic.stub';
import { ACTION_CSR_CHECKOUT_CANCEL } from '../actions/csr-checkout-actions';

/*
// delay 2 second
const loopDelay = (loopLength = 1000000000) => {
  let j, k=2;
  for(let i=0; i <loopLength; i++) {j = k*i;}
  console.log(j);
};
*/

/**
 * Fetch customer using auth token
 * Pass customer data to fulfillment (save to global state)
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions dispatched by Redux components or RxJS epics
 * @param {object} state$ [required] - RxJS Observable that emits Redux state
 * @param {object} dependencies.ajax [required] - Object that contains epic dependencies (eg. { ajax })
 * 
 * @returns {object} RxJS Observable that emits an action for fulfillment or rejection
 */
export const csrFetchCustomerEpic = (action$, state$, { ajax }) => action$.pipe(
  ofType(ACTION_CSR_FETCH_CUSTOMER),
  mergeMap((action) => (
    ajax({
      url: `${BOINGO_EXTERNAL_API}/2/customers/${action.payload.customer_id}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'Cache-Control': 'no-cache',
        'Authorization': action.payload.token
      },
      __STUB_AJAX__: csrFetchCustomerEpicStub,
    }).pipe(
      tap(ajaxResponse => console.log(ajaxResponse.response)),
      map(ajaxResponse => ({
        type: ACTION_CSR_FETCH_CUSTOMER_FULFILLED,
        payload: ajaxResponse
      })),
      concat(of({
        type: ACTION_CSR_CHECKOUT_CANCEL, // cancel any pending checkout process
      })),
      catchError(error => of({
        type: ACTION_CSR_FETCH_CUSTOMER_REJECTED,
        payload: error,
        error: true
      }))
    )
  ))
);
// type declaration and enforcement
csrFetchCustomerEpic.propTypes = {
  action$: PropTypes.object.isRequired,
  state$: PropTypes.object.isRequired,
  dependencies: PropTypes.shape({
    ajax: PropTypes.func.isRequired,
  }),
};

/**
 * Udpate customer using auth token
 * Pass customer data to fulfillment (save to global state)
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions dispatched by Redux components or RxJS epics
 * @param {object} state$ [required] - RxJS Observable that emits Redux state
 * @param {object} dependencies.ajax [required] - Object that contains epic dependencies (eg. { ajax })
 * 
 * @returns {object} RxJS Observable that emits an action for fulfillment or rejection
 */
export const csrUpdateCustomerEpic = (action$, state$, { ajax }) => action$.pipe(
  ofType(ACTION_CSR_UPDATE_CUSTOMER),
  mergeMap((action) => (
    ajax({
      url: `${BOINGO_EXTERNAL_API}/2/customers/${action.payload.customer_id}`,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Authorization': action.payload.token
      },
      body: action.payload.body,
      __STUB_AJAX__: csrUpdateCustomerEpicStub,
    }).pipe(
      tap(ajaxResponse => console.log(ajaxResponse.response)),
      map(ajaxResponse => ({
        type: ACTION_CSR_UPDATE_CUSTOMER_FULFILLED,
        payload: ajaxResponse
      })),
      catchError(error => of({
        type: ACTION_CSR_UPDATE_CUSTOMER_REJECTED,
        payload: error,
        error: true
      }))
    )
  ))
);
// type declaration and enforcement
csrUpdateCustomerEpic.propTypes = {
  action$: PropTypes.object.isRequired,
  state$: PropTypes.object.isRequired,
  dependencies: PropTypes.shape({
    ajax: PropTypes.func.isRequired,
  }),
};