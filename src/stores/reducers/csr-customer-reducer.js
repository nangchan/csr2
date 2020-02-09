import PropTypes from 'prop-types';
import produce from 'immer';

import {
  ACTION_CSR_FETCH_CUSTOMER,
  ACTION_CSR_FETCH_CUSTOMER_FULFILLED,
  ACTION_CSR_FETCH_CUSTOMER_REJECTED,

  ACTION_CSR_UPDATE_CUSTOMER,
  ACTION_CSR_UPDATE_CUSTOMER_FULFILLED,
  ACTION_CSR_UPDATE_CUSTOMER_REJECTED,

} from '../actions/csr-customer-actions';

import {CsrInitialState} from '../states/CsrInitialState';
import { ACTION_CSR_SIGN_OUT, ACTION_CSR_RELOAD } from '../actions/csr-auth-actions';

/**
 * Updates csr_customer, csr_customer_requesting, csr_customer_error,
 * and csr_update_customer, csr_update_customer_requesting, csr_update_customer_error,
 * and csr_update_customer_id
 * 
 * @param {object} state [required] - Current state provided by Redux and initialized by CsrInitialState if not null
 * @param {object} action [required] - Current action originating on Component and provided by Redux
 */
export default function csrCustomerReducer(state = (CsrInitialState && CsrInitialState.csrCustomerReducer) || {}, action) {
  switch (action.type) {
    case ACTION_CSR_FETCH_CUSTOMER: {
      return produce(state, (draft) => {
        // store username and password in state.cred
        // afterwards epic will auth using passed-in credentials
        // initiate fetch auth via epic
        draft.csr_customer = null;
        draft.csr_customer_venue_name = null;
        draft.csr_customer_requesting = {customer_id: action.payload.customer_id};
        draft.csr_customer_error = null;
      })
    }
    case ACTION_CSR_FETCH_CUSTOMER_FULFILLED: {
      return produce(state, (draft) => {
        // payload comes from return from ajax auth or from cache
        // auth token save to global state
        draft.csr_customer = action.payload.response;
        draft.csr_customer_venue_name = action.payload.response && action.payload.response.base_address && action.payload.response.base_address.base;
        draft.csr_customer_requesting = null;
        draft.csr_customer_error = null;
      })
    }
    case ACTION_CSR_FETCH_CUSTOMER_REJECTED: {
      return produce(state, (draft) => {
        // store error in global store
        draft.csr_customer = null;
        draft.csr_customer_venue_name = null;
        draft.csr_customer_requesting = null;
        draft.csr_customer_error = {...action.payload.xhr.response};
      })
    }
    case ACTION_CSR_UPDATE_CUSTOMER: {
      return produce(state, (draft) => {
        // store username and password in state.cred
        // afterwards epic will auth using passed-in credentials
        // initiate fetch auth via epic
        draft.csr_update_customer = null;
        draft.csr_update_customer_requesting = action.payload;
        draft.csr_update_customer_error = null;
      })
    }
    case ACTION_CSR_UPDATE_CUSTOMER_FULFILLED: {
      return produce(state, (draft) => {
        // update customer with new state
        // special case for nested properties (ie. mailing_address)
        draft.csr_customer = {
          ...draft.csr_customer, // copy current state
          ...draft.csr_update_customer_requesting.body, // override with request
          mailing_address: {
            ...state.csr_customer.mailing_address, // restore nested properties that were overridden by above
            ...draft.csr_update_customer_requesting.body.mailing_address // override with request for mailing_address
          }
        };
        // keep track of updated customer for proper messaging
        draft.csr_update_customer_id = draft.csr_customer.customer_id;
        draft.csr_update_customer = action.payload.response;
        draft.csr_update_customer_requesting = null
        draft.csr_update_customer_error = null;
      })
    }
    case ACTION_CSR_UPDATE_CUSTOMER_REJECTED: {
      return produce(state, (draft) => {
        // store username and password in state.cred
        // afterwards epic will auth using passed-in credentials
        // initiate fetch auth via epic
        draft.csr_update_customer = null;
        draft.csr_update_customer_requesting = null
        draft.csr_update_customer_error = {...action.payload.xhr.response};
      })
    }
    case ACTION_CSR_RELOAD: {
      return produce(state, (draft) => {
        // clear global state
        draft.csr_customer = null;
        draft.csr_customer_venue_name = null;
        draft.csr_customer_id = null;
        draft.csr_customer_requesting = null;
        draft.csr_customer_error = null;
        // flip reload to trigger data fetch
        draft.csr_customer_reload = state.csr_customer_reload ? false : true;
      })
    }
    case ACTION_CSR_SIGN_OUT: {
      return produce(state, (draft) => {
        // clear global state
        draft.csr_customer = null;
        draft.csr_customer_venue_name = null;
        draft.csr_customer_id = null;
        draft.csr_customer_requesting = null;
        draft.csr_customer_error = null;
      })
    }
    default: {
      // return current state
      return state
    }
  }
}
// type declaration and enforcement
csrCustomerReducer.propTypes = {
  state: PropTypes.object.isRequired,
  action: PropTypes.object.isRequired,
};