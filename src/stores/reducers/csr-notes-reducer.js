import PropTypes from 'prop-types';
import produce from 'immer';
import {
  ACTION_CSR_FETCH_NOTES,
  ACTION_CSR_FETCH_NOTES_FULFILLED,
  ACTION_CSR_FETCH_NOTES_REJECTED,

  ACTION_CSR_ADD_NOTE,
  ACTION_CSR_ADD_NOTE_FULFILLED,
  ACTION_CSR_ADD_NOTE_REJECTED,
} from '../actions/csr-notes-actions';
import {CsrInitialState} from '../states/CsrInitialState';
import { ACTION_CSR_SIGN_OUT, ACTION_CSR_RELOAD } from '../actions/csr-auth-actions';

/**
 * Updates csr_notes, csr_notes_requesting, csr_notes_error,
 * and csr_update_notes, csr_update_notes_requesting, csr_update_notes_error
 * 
 * @param {object} state [required] - Current state provided by Redux and initialized by CsrInitialState if not null
 * @param {object} action [required] - Current action originating on Component and provided by Redux
 */
export default function csrNotesReducer(state = (CsrInitialState && CsrInitialState.csrNotesReducer) || {}, action) {
  switch (action.type) {
    case ACTION_CSR_FETCH_NOTES: {
      return produce(state, (draft) => {
        // store username and password in state.cred
        // afterwards epic will auth using passed-in credentials
        // initiate fetch auth via epic
        draft.csr_notes = null;
        draft.csr_notes_requesting = {customer_id: action.payload.customer_id};
        draft.csr_notes_error = null;
      })
    }
    case ACTION_CSR_FETCH_NOTES_FULFILLED: {
      return produce(state, (draft) => {
        // payload comes from return from ajax auth or from cache
        // auth token save to global state
        draft.csr_notes = {...action.payload.response};
        draft.csr_notes_requesting = null;
        draft.csr_notes_error = null;
      })
    }
    case ACTION_CSR_FETCH_NOTES_REJECTED: {
      return produce(state, (draft) => {
        // store error in global store
        draft.csr_notes = null;
        draft.csr_notes_requesting = null;
        draft.csr_notes_error = {...action.payload.xhr.response};
      })
    }
    case ACTION_CSR_ADD_NOTE: {
      return produce(state, (draft) => {
        // store username and password in state.cred
        // afterwards epic will auth using passed-in credentials
        // initiate fetch auth via epic
        draft.csr_update_notes = null;
        draft.csr_update_notes_requesting = action.payload;
        draft.csr_update_notes_error = null;
      })
    }
    case ACTION_CSR_ADD_NOTE_FULFILLED: {
      return produce(state, (draft) => {
        // update notes with new state
        // manually update notes state
        draft.csr_notes = draft.csr_notes || {notes: []};
        draft.csr_notes = {
          notes: [
            {
              ...draft.csr_update_notes_requesting.body,
              date: (new Date()).toISOString().substring(0,19) + 'Z'
            },
            ...draft.csr_notes.notes
          ]
        }
        draft.csr_update_notes = action.payload.response;
        draft.csr_update_notes_requesting = null
        draft.csr_update_notes_error = null;
      })
    }
    case ACTION_CSR_ADD_NOTE_REJECTED: {
      return produce(state, (draft) => {
        // store username and password in state.cred
        // afterwards epic will auth using passed-in credentials
        // initiate fetch auth via epic
        draft.csr_update_notes = null
        draft.csr_update_notes_requesting = null
        draft.csr_update_notes_error = {...action.payload.xhr.response};
      })
    }
    case ACTION_CSR_RELOAD: {
      return produce(state, (draft) => {
        // clear global state
        draft.csr_notes = null;
        draft.csr_notes_requesting = null;
        draft.csr_notes_error = null;
        draft.csr_update_notes = null
        draft.csr_update_notes_requesting = null
        draft.csr_update_notes_error = null
      })
    }
    case ACTION_CSR_SIGN_OUT: {
      return produce(state, (draft) => {
        // clear global state
        draft.csr_notes = null;
        draft.csr_notes_requesting = null;
        draft.csr_notes_error = null;
        draft.csr_update_notes = null
        draft.csr_update_notes_requesting = null
        draft.csr_update_notes_error = null
      })
    }
    default: {
      // return current state
      return state
    }
  }
}
// type declaration and enforcement
csrNotesReducer.propTypes = {
  state: PropTypes.object.isRequired,
  action: PropTypes.object.isRequired,
};