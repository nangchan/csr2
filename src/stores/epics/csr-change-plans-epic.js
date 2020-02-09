import PropTypes from 'prop-types';
import { of } from 'rxjs';
import { ofType } from 'redux-observable';
import { catchError, mergeMap, tap, concatMap } from 'rxjs/operators';
import {
  ACTION_CSR_UPDATE_PRODUCTS,
  ACTION_CSR_UPDATE_PRODUCTS_FULFILLED,
  ACTION_CSR_UPDATE_PRODUCTS_REJECTED,
} from '../actions/csr-change-plans-actions';
import { ACTION_CSR_RELOAD } from '../actions/csr-auth-actions';
import { BOINGO_EXTERNAL_API } from '../../settings';
import { csrUpdateProductsEpicStub } from './csr-change-plans-epic.stub';
import { ACTION_CSR_CHECKOUT_FULFILLED, ACTION_CSR_CHECKOUT_REJECTED } from '../actions/csr-checkout-actions';

/**
 * Update customer products
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions dispatched by Redux components or RxJS epics
 * @param {object} state$ [required] - RxJS Observable that emits Redux state
 * @param {object} dependencies.ajax [required] - Object that contains epic dependencies (eg. { ajax })
 * 
 * @returns {object} RxJS Observable that emits an action for fulfillment or rejection
 */
export const csrUpdateProductsEpic = (action$, state$, { ajax }) => action$.pipe(
  ofType(ACTION_CSR_UPDATE_PRODUCTS),
  mergeMap((action) => 
    ajax({
      url: `${BOINGO_EXTERNAL_API}/2/customers/${action.payload.customer_id}`,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Authorization': action.payload.token
      },
      body: {
        base_address: action.payload.base_address,
        product_codes: action.payload.product_codes,
      },
      __STUB_AJAX__: csrUpdateProductsEpicStub,
    }).pipe(
      tap(ajaxResponse => console.log(ajaxResponse.response)),
      // since updating customer products reload and redirect to customer account page
      concatMap(ajaxResponse =>
        of({
            type: ACTION_CSR_UPDATE_PRODUCTS_FULFILLED,
            payload: ajaxResponse
          }, {
            type: ACTION_CSR_RELOAD, // reload data
          }, {
            type: ACTION_CSR_CHECKOUT_FULFILLED, // confirm checkout
            payload: action.payload.customer_id, // redirect to new customer for create customer
        })
      ),
      catchError(error => of({
          type: ACTION_CSR_UPDATE_PRODUCTS_REJECTED, // udpate products actions are used for the entire action as a whole
          payload: error,
          error: true
        }, {
          type: ACTION_CSR_CHECKOUT_REJECTED, // fail checkout
          payload: error,
          error: true
      }))
    )
  ),
);
// type declaration and enforcement
csrUpdateProductsEpic.propTypes = {
  action$: PropTypes.object.isRequired,
  state$: PropTypes.object.isRequired,
  dependencies: PropTypes.shape({
    ajax: PropTypes.func.isRequired,
  }),
};