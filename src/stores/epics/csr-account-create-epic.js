import PropTypes from 'prop-types';
import { of } from "rxjs";
import { ofType } from "redux-observable";
import { catchError, map, mergeMap, concatMap } from "rxjs/operators";
import {
  ACTION_CSR_ACCOUNT_CREATE,
  ACTION_CSR_ACCOUNT_CREATE_FULFILLED,
  ACTION_CSR_ACCOUNT_CREATE_REJECTED,
  ACTION_CSR_DUPLICATE_USERNAME_CHECK,
  ACTION_CSR_DUPLICATE_USERNAME_CHECK_FULFILLED,
  ACTION_CSR_DUPLICATE_USERNAME_CHECK_REJECTED,
  ACTION_CSR_CREATE_CLEAR
} from "../actions/csr-account-create-actions";
import { BOINGO_EXTERNAL_API } from '../../settings';
import generateGuid from "../../utils/generateGuid";
import { csrAccountCreateEpicStub } from './csr-account-create-epic.stub';

/**
 * Create an account
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions dispatched by Redux components or RxJS epics
 * @param {object} state$ [required] - RxJS Observable that emits Redux state
 * @param {object} dependencies.ajax [required] - Object that contains epic dependencies (eg. { ajax })
 * 
 * @returns {object} RxJS Observable that emits an action for fulfillment or rejection
 */

export const csrAccountCreateEpic = (action$, state$, { ajax }) => action$.pipe(
  ofType(ACTION_CSR_ACCOUNT_CREATE),
  mergeMap(action =>
      ajax({
        url: `${BOINGO_EXTERNAL_API}/2/customers`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
          //'Cache-Control': 'no-cache',
        },
        body: {
          ...action.payload.request,
          transaction_id: generateGuid(),
          mail_message_id: "WELCOME",
          scc: "CCGCSR001",
          venue_id: "0000000",
          product_codes: Array.isArray(action.payload.request.product_code) ? action.payload.request.product_code : [action.payload.request.product_code],
        },
        __STUB_AJAX__: csrAccountCreateEpicStub,
      }).pipe(
        concatMap(ajaxResponse => 
          of({
            type: ACTION_CSR_ACCOUNT_CREATE_FULFILLED,
            payload: ajaxResponse
          },
          {
            type: ACTION_CSR_CREATE_CLEAR,
          })
        ),
        catchError(error =>
          of({
            type: ACTION_CSR_ACCOUNT_CREATE_REJECTED,
            payload: error,
            error: true
        }))
      )
    )
  );

// type declaration and enforcement
csrAccountCreateEpic.propTypes = {
  action$: PropTypes.object.isRequired,
  state$: PropTypes.object.isRequired,
  dependencies: PropTypes.shape({
    ajax: PropTypes.func.isRequired,
  }),
}

/**
 * Check if username is already taken
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions dispatched by Redux components or RxJS epics
 * @param {object} state$ [required] - RxJS Observable that emits Redux state
 * @param {object} dependencies.ajax [required] - Object that contains epic dependencies (eg. { ajax })
 * 
 * @returns {object} RxJS Observable that emits an action for fulfillment or rejection
 */
export const csrDuplicateUsernameCheckEpic = (action$, state$, { ajax }) => action$.pipe(
    ofType(ACTION_CSR_DUPLICATE_USERNAME_CHECK),
    mergeMap(action =>
      ajax({
        url: `${BOINGO_EXTERNAL_API}/2/customers/preflight`,
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          //'Cache-Control': 'no-cache',
          Authorization: action.payload.token
        },
        body: { username: action.payload.request },
        __STUB_AJAX__: csrAccountCreateEpicStub,
      }).pipe(
        map(ajaxResponse => ({
          type: ACTION_CSR_DUPLICATE_USERNAME_CHECK_FULFILLED,
          payload: ajaxResponse
        })),
        catchError(error =>
          of({
            type: ACTION_CSR_DUPLICATE_USERNAME_CHECK_REJECTED,
            payload: error,
            error: true
          })
        )
      )
    )
);

// type declaration and enforcement
csrDuplicateUsernameCheckEpic.propTypes = {
  action$: PropTypes.object.isRequired,
  state$: PropTypes.object.isRequired,
  dependencies: PropTypes.shape({
    ajax: PropTypes.func.isRequired,
  }),
}