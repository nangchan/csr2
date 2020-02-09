import PropTypes from 'prop-types';
import { ofType } from 'redux-observable';
import { map, concatMap, withLatestFrom, pluck } from 'rxjs/operators';

import { ACTION_CSR_UPDATE_CUSTOMER, ACTION_CSR_UPDATE_CUSTOMER_FULFILLED, ACTION_CSR_UPDATE_CUSTOMER_REJECTED, ACTION_CSR_FETCH_CUSTOMER_REJECTED } from '../../stores/actions/csr-customer-actions';
import { ACTION_CSR_ADD_NOTE, ACTION_CSR_ADD_NOTE_FULFILLED, ACTION_CSR_ADD_NOTE_REJECTED } from '../../stores/actions/csr-notes-actions';
import { snackbarToggleAction } from '../actions/snackbar-actions';
import { SNACKBAR_INFO, SNACKBAR_SUCCESS, SNACKBAR_ERROR, SNACKBAR_GENERIC_ERROR } from '../../containers/sections/CsrSnackbar';
import { ACTION_CSR_SEARCH_REJECTED } from '../actions/csr-search-actions';
import {
  ACTION_CSR_ACCOUNT_CREATE,
  ACTION_CSR_ACCOUNT_CREATE_FULFILLED,
  ACTION_CSR_ACCOUNT_CREATE_REJECTED,
} from '../actions/csr-account-create-actions';
import {
  ACTION_CSR_ADD_DEVICE, ACTION_CSR_EDIT_DEVICE, ACTION_CSR_DELETE_DEVICE,
  ACTION_CSR_ADD_DEVICE_FULFILLED, ACTION_CSR_EDIT_DEVICE_FULFILLED, ACTION_CSR_DELETE_DEVICE_FULFILLED,
  ACTION_CSR_ADD_DEVICE_REJECTED, ACTION_CSR_EDIT_DEVICE_REJECTED, ACTION_CSR_DELETE_DEVICE_REJECTED,
} from '../actions/csr-devices-actions';
import {
  ACTION_CSR_SIGN_IN,
  ACTION_CSR_SIGN_IN_FULFILLED,
  ACTION_CSR_SIGN_IN_REJECTED,
  //ACTION_CSR_SIGN_OUT
} from '../actions/csr-auth-actions';
import {
  ACTION_CSR_UPDATE_PRODUCTS,
  ACTION_CSR_UPDATE_PRODUCTS_FULFILLED,
  ACTION_CSR_UPDATE_PRODUCTS_REJECTED
} from '../actions/csr-change-plans-actions';
import { of } from 'rxjs';
import { ACTION_CSR_REDIRECT } from '../actions/csr-utils-actions';
//import { ACTION_CSR_NO_OP } from '../actions/csr-settings-actions';

/**
 * Show snackbar notification message for in-progress
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions
 */
export const snackbarInprogressEpic = (action$) => action$.pipe(
  ofType(
    ACTION_CSR_SIGN_IN,
    ACTION_CSR_UPDATE_CUSTOMER,
    ACTION_CSR_ADD_NOTE,
    ACTION_CSR_ACCOUNT_CREATE,
    ACTION_CSR_ADD_DEVICE, ACTION_CSR_EDIT_DEVICE, ACTION_CSR_DELETE_DEVICE,
    ACTION_CSR_UPDATE_PRODUCTS,
  ),
  map((action) => snackbarToggleAction({
    open: true, // do not show for search/fetch since we have loading screen
    variant: SNACKBAR_INFO,
    message: 'Update in progress...',
    shown: false, // trigger display on completion as well
    auto_hide_duration: null, // disable auto-hide for in progress
  })),
);
// type declaration and enforcement
snackbarInprogressEpic.propTypes = {
  action$: PropTypes.object.isRequired,
};

/**
 * Show snackbar notification message for success
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions
 */
export const snackbarFulfillmentEpic = (action$) => action$.pipe(
  ofType(
    ACTION_CSR_SIGN_IN_FULFILLED,
    ACTION_CSR_UPDATE_CUSTOMER_FULFILLED,
    ACTION_CSR_ADD_NOTE_FULFILLED,
    ACTION_CSR_ACCOUNT_CREATE_FULFILLED,
    ACTION_CSR_ADD_DEVICE_FULFILLED, ACTION_CSR_EDIT_DEVICE_FULFILLED, ACTION_CSR_DELETE_DEVICE_FULFILLED,
    ACTION_CSR_UPDATE_PRODUCTS_FULFILLED,
  ),
  map((action) => snackbarToggleAction({
    open: true, // do not show for search/fetch since we have loading screen
    variant: SNACKBAR_SUCCESS,
    message: 'Success',
    shown: true, // suppress display if already seen by user
  })),
);
// type declaration and enforcement
snackbarFulfillmentEpic.propTypes = {
  action$: PropTypes.object.isRequired,
};

/**
 * Show snackbar notification message for error
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions
 */
export const snackbarRejectEpic = (action$, state$) => action$.pipe(
  ofType(
    ACTION_CSR_SIGN_IN_REJECTED,
    ACTION_CSR_FETCH_CUSTOMER_REJECTED,
    ACTION_CSR_UPDATE_CUSTOMER_REJECTED,
    ACTION_CSR_ADD_NOTE_REJECTED,
    ACTION_CSR_SEARCH_REJECTED,
    ACTION_CSR_ACCOUNT_CREATE_REJECTED,
    ACTION_CSR_ADD_DEVICE_REJECTED, ACTION_CSR_EDIT_DEVICE_REJECTED, ACTION_CSR_DELETE_DEVICE_REJECTED,
    ACTION_CSR_UPDATE_PRODUCTS_REJECTED,
  ),
  withLatestFrom(state$.pipe(pluck('csrAuthReducer'))),
  concatMap(([action, state]) => (
    action.payload && action.payload.status === 0 // on expired auth token
    ? of( snackbarToggleAction({
        open: true,
        variant: SNACKBAR_ERROR,
        message: new Date() > state.csr_auth_expired // if token expired
          ? "Authentication token has expired, please sign-in again."
          : SNACKBAR_GENERIC_ERROR,
        shown: true, // suppress display if already seen by user
        auto_hide_duration: null, // disable auto-hide for error message
      }), 
      // { // if token expired then sign-out (not yet required)
      //   type: new Date() > state.csr_auth_expired ? ACTION_CSR_SIGN_OUT : ACTION_CSR_NO_OP,
      // },
      { // if token expired then redirect to sign-in
        type: ACTION_CSR_REDIRECT,
        payload: new Date() > state.csr_auth_expired ? '/' : null, // redirect in drawer
      })
    : of( snackbarToggleAction({
        open: true,
        variant: SNACKBAR_ERROR,
        message: (action.payload.xhr.response && action.payload.xhr.response.message) || SNACKBAR_GENERIC_ERROR,
        shown: true, // suppress display if already seen by user
        auto_hide_duration: null, // disable auto-hide for error message
      }))
  )),
);
// type declaration and enforcement
snackbarRejectEpic.propTypes = {
  action$: PropTypes.object.isRequired,
};