import PropTypes from 'prop-types';
import produce from "immer";

import {
  ACTION_CSR_ACCOUNT_CREATE,
  ACTION_CSR_ACCOUNT_CREATE_FULFILLED,
  ACTION_CSR_ACCOUNT_CREATE_REJECTED,
  ACTION_CSR_CREATE_CLEAR,
  ACTION_CSR_DUPLICATE_USERNAME_CHECK,
  ACTION_CSR_DUPLICATE_USERNAME_CHECK_FULFILLED,
  ACTION_CSR_DUPLICATE_USERNAME_CHECK_REJECTED,
  ACTION_CSR_DUPLICATE_USERNAME_CHECK_CLEAR_ERROR
} from "../actions/csr-account-create-actions";

import { CsrInitialState } from "../states/CsrInitialState";

/**
 * Updates csr_account_create, csr_duplicate_username_check
 * 
 * @param {object} state [required] - Current state provided by Redux and initialized by CsrInitialState if not null
 * @param {object} action [required] - Current action originating on Component and provided by Redux
 */
export default function csrAccountCreateReducer(
  state = (CsrInitialState && CsrInitialState.csrAccountCreateReducer) || {},
  action
) {
  switch (action.type) {
    case ACTION_CSR_ACCOUNT_CREATE: {
      return produce(state, draft => {
        draft.csr_account_create = null;
        draft.csr_account_create_requesting = action.payload.request;
        draft.csr_account_create_error = null;
      });
    }
    case ACTION_CSR_ACCOUNT_CREATE_FULFILLED: {
      return produce(state, draft => {
        draft.csr_account_create = { ...action.payload.response };
        draft.csr_account_create_requesting = null;
        draft.csr_account_create_error = null;
      });
    }
    case ACTION_CSR_ACCOUNT_CREATE_REJECTED: {
      return produce(state, draft => {
        draft.csr_account_create = null;
        draft.csr_account_create_requesting = null;
        draft.csr_account_create_error = action.payload.xhr ? action.payload.xhr.response : action.payload;
      });
    }
    case ACTION_CSR_CREATE_CLEAR: {
      return produce(state, draft => {
        draft.csr_account_create = null;
        draft.csr_account_create_requesting = null;
        draft.csr_account_create_error = null;
      });
    }
    case ACTION_CSR_DUPLICATE_USERNAME_CHECK: {
      return produce(state, draft => {
        draft.csr_duplicate_username_check = null;
        draft.csr_duplicate_username_check_requesting = action.payload.request
        draft.csr_duplicate_username_check_error = null;
      });
    }
    case ACTION_CSR_DUPLICATE_USERNAME_CHECK_FULFILLED: {
      return produce(state, draft => {
        draft.csr_duplicate_username_check = action.payload.response;
        draft.csr_duplicate_username_check_requesting = null;
        draft.csr_duplicate_username_check_error = null;
      });
    }
    case ACTION_CSR_DUPLICATE_USERNAME_CHECK_REJECTED: {
      return produce(state, draft => {
        draft.csr_duplicate_username_check = null;
        draft.csr_duplicate_username_check_requesting = null;
        draft.csr_duplicate_username_check_error = action.payload.xhr.response;
      });
    }
    case ACTION_CSR_DUPLICATE_USERNAME_CHECK_CLEAR_ERROR: {
      return produce(state, draft => {
        draft.csr_duplicate_username_check_error = null;
        draft.csr_duplicate_username_check_touched = true;
      });
    }
    default: {
      return state;
    }
  }
}

// type declaration and enforcement
csrAccountCreateReducer.propTypes = {
  state: PropTypes.object.isRequired,
  action: PropTypes.object.isRequired,
};