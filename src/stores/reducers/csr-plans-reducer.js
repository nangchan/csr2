import PropTypes from 'prop-types';
import produce from 'immer';
import {
  ACTION_CSR_FETCH_DEFERRED_ACTIONS,
  ACTION_CSR_FETCH_DEFERRED_ACTIONS_FULFILLED,
  ACTION_CSR_FETCH_DEFERRED_ACTIONS_REJECTED,
} from '../actions/csr-plans-actions';
import {CsrInitialState} from '../states/CsrInitialState';
import { ACTION_CSR_SIGN_OUT, ACTION_CSR_RELOAD } from '../actions/csr-auth-actions';

/**
 * Updates csr_deferred_actions, csr_deferred_actions_requesting, csr_deferred_actions_error
 * 
 * @param {object} state [required] - Current state provided by Redux and initialized by CsrInitialState if not null
 * @param {object} action [required] - Current action originating on Component and provided by Redux
 */
export default function csrDeferredActionReducer(state = (CsrInitialState && CsrInitialState.csrDeferredActionReducer) || {}, action) {
  switch (action.type) {
    case ACTION_CSR_FETCH_DEFERRED_ACTIONS: {
      return produce(state, (draft) => {
        draft.csr_deferred_actions = null;
        draft.csr_deferred_actions_requesting = {customer_id: action.payload.customer_id};
        draft.csr_deferred_actions_error = null;
      })
    }
    case ACTION_CSR_FETCH_DEFERRED_ACTIONS_FULFILLED: {
      return produce(state, (draft) => {
        // isolate call for each customer
        draft.csr_deferred_actions = {...action.payload.response};
        draft.csr_deferred_actions_requesting = null;
        draft.csr_deferred_actions_error = null;
      })
    }
    case ACTION_CSR_FETCH_DEFERRED_ACTIONS_REJECTED: {
      return produce(state, (draft) => {
        // store error in global store
        draft.csr_deferred_actions = null;
        draft.csr_deferred_actions_requesting = null;
        draft.csr_deferred_actions_error = {...action.payload.xhr.response};
      })
    }
    case ACTION_CSR_RELOAD: {
      return produce(state, (draft) => {
        // clear global state
        draft.csr_deferred_actions = null;
        draft.csr_deferred_actions_requesting = null;
        draft.csr_deferred_actions_error = null;
        // switch bool to trigger fetch
        draft.csr_deferred_actions_reload = state.csr_deferred_actions_reload ? false : true;
      })
    }
    case ACTION_CSR_SIGN_OUT: {
      return produce(state, (draft) => {
        // clear global state
        draft.csr_deferred_actions = null;
        draft.csr_deferred_actions_requesting = null;
        draft.csr_deferred_actions_error = null
      })
    }
    default: {
      // return current state
      return state
    }
  }
}
// type declaration and enforcement
csrDeferredActionReducer.propTypes = {
  state: PropTypes.object.isRequired,
  action: PropTypes.object.isRequired,
};