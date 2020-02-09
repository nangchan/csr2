import PropTypes from 'prop-types';
import produce from 'immer';

import {
  ACTION_CSR_SIGN_IN,
  ACTION_CSR_SIGN_IN_FULFILLED,
  ACTION_CSR_SIGN_IN_REJECTED,

  ACTION_CSR_SIGN_IN_FROM_CACHE,
  ACTION_CSR_SIGN_IN_FROM_CACHE_FULFILLED,
  ACTION_CSR_SIGN_IN_FROM_CACHE_REJECTED,

  ACTION_CSR_SIGN_OUT,
} from '../actions/csr-auth-actions';

import {CsrInitialState} from '../states/CsrInitialState';

// react forms
// https://rangle.io/blog/simplifying-controlled-inputs-with-hooks/

// save state
// https://itnext.io/updating-properties-of-an-object-in-react-state-af6260d8e9f5?gi=4357e64f66de

// running chrome without cors
// https://alfilatov.com/posts/run-chrome-without-cors/

/**
 * Updates csr_cred, csr_auth, csr_auth_requesting, csr_auth_error
 * 
 * @param {object} state [required] - Current state provided by Redux and initialized by CsrInitialState if not null
 * @param {object} action [required] - Current action originating on Component and provided by Redux
 */
export default function csrAuthReducer(state = (CsrInitialState && CsrInitialState.csrAuthReducer) || {}, action) {
  switch (action.type) {
    case ACTION_CSR_SIGN_IN: {
      return produce(state, (draft) => {
        // store username and password in state.cred
        // afterwards epic will auth using passed-in credentials
        // initiate fetch auth via epic
        draft.csr_cred = {...action.payload};
        draft.csr_auth = null;
        draft.csr_auth_expired = null;
        draft.csr_auth_requesting = true;
        draft.csr_auth_error = null;
      })
    }
    case ACTION_CSR_SIGN_IN_FROM_CACHE_FULFILLED:
    case ACTION_CSR_SIGN_IN_FULFILLED: {
      return produce(state, (draft) => {
        // payload comes from return from ajax auth or from cache
        // auth token save to global state
        draft.csr_auth = {...action.payload.response};
        draft.csr_auth_expired = action.payload.expired;
        draft.csr_auth_requesting = false;
        draft.csr_auth_error = null;
      })
    }
    case ACTION_CSR_SIGN_IN_FROM_CACHE_REJECTED:
    case ACTION_CSR_SIGN_IN_REJECTED: {
      return produce(state, (draft) => {
        // store error in global store
        draft.csr_auth = null;
        draft.csr_auth_expired = null;
        draft.csr_auth_requesting = false;
        draft.csr_auth_error = {...action.payload.xhr.response};
      })
    }
    case ACTION_CSR_SIGN_IN_FROM_CACHE: {
      return produce(state, (draft) => {
        // state.cred will be empty since we do not store username/passwords
        // afterwards epic pull auth token from local storage and pass to fulfillment
        draft.csr_auth = null;
        draft.csr_auth_expired = null;
        draft.csr_auth_requesting = true;
        draft.csr_auth_error = null;
      })
    }
    case ACTION_CSR_SIGN_OUT: {
      return produce(state, (draft) => {
        // clear global state
        draft.csr_auth = null;
        draft.csr_auth_expired = null;
        draft.csr_auth_requesting = false;
        draft.csr_auth_error = null;
      })
    }
    default: {
      // return current state
      return state
    }
  }
}
// type declaration and enforcement
csrAuthReducer.propTypes = {
  state: PropTypes.object.isRequired,
  action: PropTypes.object.isRequired,
};