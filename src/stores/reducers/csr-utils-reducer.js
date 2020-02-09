import PropTypes from 'prop-types';
import produce from 'immer';

import {
  ACTION_CSR_REDIRECT, ACTION_CSR_REDIRECT_FULFILLED, ACTION_CSR_REDIRECT_REJECTED
} from '../actions/csr-utils-actions';

import {CsrInitialState} from '../states/CsrInitialState';

/**
 * Updates csr_customer, csr_customer_requesting, csr_customer_error,
 * and csr_update_customer, csr_update_customer_requesting, csr_update_customer_error,
 * and csr_update_customer_id
 * 
 * @param {object} state [required] - Current state provided by Redux and initialized by CsrInitialState if not null
 * @param {object} action [required] - Current action originating on Component and provided by Redux
 */
export default function csrRedirectReducer(state = (CsrInitialState && CsrInitialState.csrRedirectReducer) || {}, action) {
  switch (action.type) {
    case ACTION_CSR_REDIRECT: {
      return produce(state, (draft) => {
        draft.csr_redirect_url = action.payload;
      })
    }
    case ACTION_CSR_REDIRECT_FULFILLED: {
      return produce(state, (draft) => {
        draft.csr_redirect_url = null;
      })
    }
    case ACTION_CSR_REDIRECT_REJECTED: {
      return produce(state, (draft) => {
        draft.csr_redirect_url = null;
        draft.csr_redirect_error = "Cannot redirect: action.payload is empty";
      })
    }
    default: {
      // return current state
      return state
    }
  }
}
// type declaration and enforcement
csrRedirectReducer.propTypes = {
  state: PropTypes.object.isRequired,
  action: PropTypes.object.isRequired,
};
