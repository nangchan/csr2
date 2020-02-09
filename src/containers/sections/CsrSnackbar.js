import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { useDispatch, useSelector } from "react-redux";

import { makeStyles } from '@material-ui/core/styles';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';

import { snackbarToggleAction } from '../../stores/actions/snackbar-actions';

// snackbar variant
export const SNACKBAR_SUCCESS = 'success';
export const SNACKBAR_INFO = 'info';
export const SNACKBAR_ERROR = 'error';
export const SNACKBAR_WARNING = 'warning';

// generic error if no response from server for an error occurs
export const SNACKBAR_GENERIC_ERROR = 'An error occurred';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const useStyles1 = makeStyles(theme => ({
  success: {
    backgroundColor: theme.palette.type === 'light' ? green[600] : green[400],
  },
  error: {
    backgroundColor: theme.palette.type === 'light' ? theme.palette.error.dark : theme.palette.error.light,
  },
  info: {
    backgroundColor: theme.palette.type === 'light' ? theme.palette.primary.main : theme.palette.primary.light,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

/**
 * Styling for the snackbar notification system
 * 
 * @param {string} className [optional] - CSS class attached to the SnackbarContent component
 * @param {string} message [optional] - Message to display in snackbar
 * @param {function} onClose [optional] - Handler for close event
 * @param {string} variant [required] - Enum['error', 'info', 'success', 'warning'] used to control snackbar styling
 */
function MySnackbarContentWrapper({ className, message, onClose, variant }) {
  const classes = useStyles1();
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
    />
  );
}
// type declaration and enforcement
MySnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,
};

/**
 * Show customized snackbar in specified location (horizontal, vertical)
 * 
 * @param {string} vertical [required] - Vertical position of snackbar
 * @param {string} horizontal [required]  - Horizontal position of snackbar
 */
export default function CustomizedSnackbars({vertical, horizontal}) {
  const state = useSelector(state => state.snackbarReducer);
  const dispatch = useDispatch();
  const dispatchSnackbarToggle = (payload) => dispatch(snackbarToggleAction(payload));

  const onCloseHandler = (event, reason) => {
    // if not clicking but hitting return then do not dispatch close
    // otherwise close and open will dispatch at the same time causing snackbar to not appear
    if (reason !== 'clickaway') { // || event.screenX || event.screenY // do not close if clicking away
      dispatchSnackbarToggle({
        open: false
      })
    }
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: vertical,
        horizontal: horizontal,
      }}
      open={!!state.snackbar_open}
      autoHideDuration={state.snackbar_auto_hide_duration}
      onClose={onCloseHandler}
    >
      <MySnackbarContentWrapper
        onClose={onCloseHandler}
        variant={state.snackbar_variant || SNACKBAR_SUCCESS}
        message={state.snackbar_message}
      />
    </Snackbar>
  );
}
// type declaration and enforcement
CustomizedSnackbars.propTypes = {
  vertical: PropTypes.string.isRequired,
  horizontal: PropTypes.string.isRequired,
};