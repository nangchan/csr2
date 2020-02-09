import PropTypes from 'prop-types';
import produce from 'immer';
import {
  ACTION_CSR_UPDATE_PRODUCTS,
  ACTION_CSR_UPDATE_PRODUCTS_FULFILLED,
  ACTION_CSR_UPDATE_PRODUCTS_REJECTED,
} from '../actions/csr-change-plans-actions';
import {CsrInitialState} from '../states/CsrInitialState';

/**
 * Fetch product catalog by base
 * 
 * @param {object} state [required] - Current state provided by Redux and initialized by CsrInitialState if not null
 * @param {object} action [required] - Current action originating on Component and provided by Redux
 */
export default function csrChangePlansReducer(state = (CsrInitialState && CsrInitialState.csrFetchProductCatalogReducer) || {}, action) {
  switch (action.type) {
    case ACTION_CSR_UPDATE_PRODUCTS: {
      return produce(state, (draft) => {
        // store request
        draft.csr_update_products = null;
        draft.csr_update_products_requesting = action.payload;
        draft.csr_update_products_error = null;
      })
    }
    case ACTION_CSR_UPDATE_PRODUCTS_FULFILLED: {
      return produce(state, (draft) => {
        // keep track of updated customer for proper messaging
        draft.csr_update_products_customer_id = state.csr_update_products_requesting.customer_id;
        draft.csr_update_products = action.payload.response;
        draft.csr_update_products_requesting = null
        draft.csr_update_products_error = null;
      })
    }
    case ACTION_CSR_UPDATE_PRODUCTS_REJECTED: {
      return produce(state, (draft) => {
        // store error
        draft.csr_update_products = null;
        draft.csr_update_products_requesting = null;
        draft.csr_update_products_error = action.payload.xhr ? action.payload.xhr.response : action.payload;
      })
    }
    default: {
      // return current state
      return state
    }
  }
}
// type declaration and enforcement
csrChangePlansReducer.propTypes = {
  state: PropTypes.object.isRequired,
  action: PropTypes.object.isRequired,
};
