import PropTypes from 'prop-types';

export const ACTION_SNACKBAR_TOGGLE = 'ACTION_SNACKBAR_TOGGLE';

/**
 * Action creator for snackbar responsible for toggling snackbar
 * 
 * @param {boolean} open [optional]  - Indicates if snackbar is open
 * @param {string} variant [optional] - Type of snackbar to show
 * @param {string} message [optional] - Message in snackbar to show
 * @param {number} auto_hide_duration [optional=5000] - Milliseconds before snackbar auto-hides (defaults to 5000)
 * @param {boolean} shown [optional] - Used by caller to suppress inadvertent activateion of older messages (Not used to noted)
 */
export const snackbarToggleAction = ({open, variant, message, auto_hide_duration = 5000, shown}) => ({
  type: ACTION_SNACKBAR_TOGGLE,
  payload: {open, variant, message, auto_hide_duration, shown},
});
// type declaration and enforcement
snackbarToggleAction.propTypes = {
  open: PropTypes.bool,
  variant: PropTypes.string,
  message: PropTypes.string,
  auto_hide_duration: PropTypes.number,
  shown: PropTypes.bool,
};