import PropTypes from 'prop-types';
import produce from 'immer';
import {
  ACTION_SNACKBAR_TOGGLE
} from '../actions/snackbar-actions';
import {CsrInitialState} from '../states/CsrInitialState';

/**
 * Reducer written to support partial-updates meaning the state will retained the previous value if not specified in action.payload
 * 
 * Updates snackbar_open, snackbar_variant, snackbar_message, snackbar_auto_hide_duration, snackbar_shown
 * 
 * @param {object} state [required] - Current state provided by Redux and initialized by CsrInitialState if not null
 * @param {object} action [required] - Current action originating on Component and provided by Redux
 */
export default function snackbarReducer(state = (CsrInitialState && CsrInitialState.snackbarReducer) || {}, action) {
  switch (action.type) {
    case ACTION_SNACKBAR_TOGGLE: {
      return produce(state, (draft) => {
        // non-destructive update using previous state as fallback
        draft.snackbar_open = action.payload.open === undefined ? state.snackbar_open : action.payload.open;
        draft.snackbar_variant = action.payload.variant === undefined ? state.snackbar_variant : action.payload.variant;
        draft.snackbar_message = action.payload.message === undefined ? state.snackbar_message : action.payload.message;
        draft.snackbar_auto_hide_duration = action.payload.auto_hide_duration === undefined ? state.snackbar_auto_hide_huration : action.payload.auto_hide_duration;
        draft.snackbar_shown = action.payload.shown === undefined ? state.snackbar_shown : action.payload.shown;
      })
    }
    default: {
      // return current state
      return state
    }
  }
}
// type declaration and enforcement
snackbarReducer.propTypes = {
  state: PropTypes.object.isRequired,
  action: PropTypes.object.isRequired,
};