import PropTypes from 'prop-types';
import { ofType } from 'redux-observable';
import { map } from 'rxjs/operators';

import {
  ACTION_CSR_CHECKOUT_CONFIRM,
} from '../actions/csr-checkout-actions';

/**
 * Checkout epic is a proxy that forwards the pending action stored in csr_checkout_action
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions dispatched by Redux components or RxJS epics
 * 
 * @returns {object} RxJS Observable that emits an action for fulfillment or rejection
 */
export const csrCheckoutEpic = (action$) => action$.pipe(
  ofType(ACTION_CSR_CHECKOUT_CONFIRM),
  map(action => action.payload.action), // forward pending action
);
// type declaration and enforcement
csrCheckoutEpic.propTypes = {
  action$: PropTypes.object.isRequired,
};