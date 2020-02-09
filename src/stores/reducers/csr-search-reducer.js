import PropTypes from 'prop-types';
import produce from 'immer';
import {
  ACTION_CSR_SEARCH,
  ACTION_CSR_SEARCH_FULFILLED,
  ACTION_CSR_SEARCH_REJECTED,
} from '../actions/csr-search-actions';
import {CsrInitialState} from '../states/CsrInitialState';
import { ACTION_CSR_SIGN_OUT } from '../actions/csr-auth-actions';

/**
 * Function parameters defaults the initial page index and page size
 * 
 * Updates csr_search, csr_search_requesting, csr_search_error,
 * and csr_search_requested, csr_search_page_size, csr_search_page_index
 * 
 * @param {object} state [required] - Current state provided by Redux and initialized by CsrInitialState if not null
 * @param {object} action [required] - Current action originating on Component and provided by Redux
 * 
 * @summary WARNING: When generating intial state be sure to include csr_search_page_index and csr_search_page_size
 */
export default function csrSearchReducer(
  state = (CsrInitialState && CsrInitialState.csrSearchReducer) || {
    csr_search_page_index: 0,
    csr_search_page_size:12
  },
  action )
{
  switch (action.type) {
    case ACTION_CSR_SEARCH: {
      return produce(state, (draft) => {
        // store username and password in state.cred
        // afterwards epic will auth using passed-in credentials
        // initiate fetch auth via epic
        draft.csr_search = null;
        draft.csr_search_page_size = action.payload.page_size;
        draft.csr_search_page_index = action.payload.page_index;
        draft.csr_search_requesting = {...action.payload.request};
        draft.csr_search_requested = {...action.payload.request};
        draft.csr_search_error = null;
      })
    }
    case ACTION_CSR_SEARCH_FULFILLED: {
      return produce(state, (draft) => {
        // payload comes from return from ajax auth or from cache
        // auth token save to global state
        draft.csr_search = {...action.payload.response};
        draft.csr_search_requesting = null;
        draft.csr_search_error = null;
      })
    }
    case ACTION_CSR_SEARCH_REJECTED: {
      return produce(state, (draft) => {
        // store error in global store
        draft.csr_search = null;
        draft.csr_search_requesting = null;
        draft.csr_search_error = {...action.payload.xhr.response};
      })
    }
    case ACTION_CSR_SIGN_OUT: {
      return produce(state, (draft) => {
        // clear global state
        draft.csr_search = null;
        draft.csr_search_requesting = null;
        draft.csr_search_requested = null;
        draft.csr_search_error = null;
      })
    }
    default: {
      // return current state
      return state
    }
  }
}
// type declaration and enforcement
csrSearchReducer.propTypes = {
  state: PropTypes.object.isRequired,
  action: PropTypes.object.isRequired,
};