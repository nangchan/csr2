import PropTypes from 'prop-types';
import produce from 'immer';
import {
  ACTION_CSR_CHECKOUT,
  ACTION_CSR_CHECKOUT_CANCEL,
  ACTION_CSR_CHECKOUT_CONFIRM,
  ACTION_CSR_CHECKOUT_FULFILLED,
  ACTION_CSR_CHECKOUT_REJECTED,
} from '../actions/csr-checkout-actions';
import {CsrInitialState} from '../states/CsrInitialState';

/**
 * Function parameters defaults the initial page index and page size
 * 
 * Updates csr_checkout_action with payload of caller (change plans subpage)
 * 
 * @param {object} state [required] - Current state provided by Redux and initialized by CsrInitialState if not null
 * @param {object} action [required] - Current action originating on Component and provided by Redux
 */
export default function csrCheckoutReducer(state = (CsrInitialState && CsrInitialState.csrCheckoutReducer) || {}, action) {
  switch (action.type) {
    case ACTION_CSR_CHECKOUT: {
      return produce(state, (draft) => {
        // meta data
        draft.csr_checkout_confirmed = null;
        draft.csr_checkout_confirming = false;
        draft.csr_checkout_error = null;
        // display controls
        draft.csr_checkout_action = action.payload.action;
        draft.csr_checkout_show_billing = action.payload.show_billing;
        draft.csr_checkout_base_address = action.payload.base_address;
        draft.csr_checkout_product_codes = action.payload.product_codes;
        draft.csr_checkout_customer = action.payload.customer;
      });
    }
    case ACTION_CSR_CHECKOUT_CANCEL: {
      return produce(state, (draft) => {
        // meta data
        draft.csr_checkout_confirmed = null;
        draft.csr_checkout_confirming = false;
        draft.csr_checkout_error = null;
        // display controls
        draft.csr_checkout_action = null;
        draft.csr_checkout_show_billing = null;
        draft.csr_checkout_base_address = null;
        draft.csr_checkout_product_codes = null;
        draft.csr_checkout_customer = null;
      });
    }
    case ACTION_CSR_CHECKOUT_CONFIRM: {
      return produce(state, (draft) => {
        // meta data
        draft.csr_checkout_confirmed = null;
        draft.csr_checkout_confirming = true;
        draft.csr_checkout_error = null;
      });
    }
    case ACTION_CSR_CHECKOUT_FULFILLED: {
      return produce(state, (draft) => {
        // meta data
        draft.csr_checkout_confirmed = {
          customer_id: action.payload // set customer_id if needed
        };
        draft.csr_checkout_confirming = false;
        draft.csr_checkout_error = null;
        // display controls
        draft.csr_checkout_action = null;
        draft.csr_checkout_show_billing = null;
        draft.csr_checkout_customer = null;
        draft.csr_checkout_base_address = null;
        draft.csr_checkout_product_codes = null;
      });
    }
    case ACTION_CSR_CHECKOUT_REJECTED: {
      return produce(state, (draft) => {
        // meta data
        draft.csr_checkout_confirmed = null;
        draft.csr_checkout_confirming = false;
        draft.csr_checkout_error = action.payload;
      });
    }
    default: {
      // return current state
      return state
    }
  }
}
// type declaration and enforcement
csrCheckoutReducer.propTypes = {
  state: PropTypes.object.isRequired,
  action: PropTypes.object.isRequired,
};