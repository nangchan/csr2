import PropTypes from 'prop-types';
import { of } from 'rxjs';
import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import {
  ACTION_CSR_SIGN_IN,
  ACTION_CSR_SIGN_IN_FULFILLED,
  ACTION_CSR_SIGN_IN_REJECTED,
  ACTION_CSR_SIGN_IN_FROM_CACHE,
  ACTION_CSR_SIGN_IN_FROM_CACHE_FULFILLED,
  ACTION_CSR_SIGN_OUT,
  ACTION_CSR_SIGN_OUT_FULFILLED,
} from '../actions/csr-auth-actions';
import { BOINGO_EXTERNAL_API, AUTH_TOKEN_EXPIRATION_DURATION } from '../../settings';
import { csrSignInEpicStub } from './csr-auth-epic.stub';

/*
// delay 2 second
const loopDelay = (loopLength = 1000000000) => {
  let j, k=2;
  for(let i=0; i <loopLength; i++) {j = k*i;}
  console.log(j);
};
*/

/**
 * Retrieve auth token using credentials
 * Save to local storage on sign-in
 * Pass auth token to fulfillment (save to global state)
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions dispatched by Redux components or RxJS epics
 * @param {object} state$ [required] - RxJS Observable that emits Redux state
 * @param {object} dependencies.ajax [required] - Object that contains epic dependencies (eg. { ajax })
 * 
 * @returns {object} RxJS Observable that emits an action for fulfillment or rejection
 */
export const csrSignInEpic = (action$, state$, { ajax, Date }) => action$.pipe(
  ofType(ACTION_CSR_SIGN_IN),
  mergeMap((action) => (
    ajax({
      url: `${BOINGO_EXTERNAL_API}/2/auth`,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'Cache-Control': 'no-cache',
      },
      body: {
        partner_id: action.payload.partner_id,
        password: action.payload.password,
      },
      __STUB_AJAX__: csrSignInEpicStub,
    }).pipe(
      map(ajaxResponse => ({
        type: ACTION_CSR_SIGN_IN_FULFILLED,
        payload: {
          ...ajaxResponse,
          // cannot add new Date to in-coming parameter since parameters refresh only during reload
          expired: new Date(new Date().getTime() + AUTH_TOKEN_EXPIRATION_DURATION), // add one day
        },
      })),
      tap((action) => {
        // if supported save credentials to local storage
        if (typeof (Storage) !== "undefined") {
          localStorage.setItem('csr-jwt', JSON.stringify(action.payload.response));
          localStorage.setItem('csr-jwt-expired', action.payload.expired);
        }
        else {
          console.error('Cannot save token: localStorage not supported')
        }
      }),
      catchError(error => of({
        type: ACTION_CSR_SIGN_IN_REJECTED,
        payload: error,
        error: true,
      })),
    ))
  ),
);
// type declaration and enforcement
csrSignInEpic.propTypes = {
  action$: PropTypes.object.isRequired,
  state$: PropTypes.object.isRequired,
  dependencies: PropTypes.shape({
    ajax: PropTypes.func.isRequired,
  }),
};

/**
 * Read from local storage and pass to fulfillment (save auth token to global state)
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions
 */
export const csrSignInFromCacheEpic = (action$) => action$.pipe(
  ofType(ACTION_CSR_SIGN_IN_FROM_CACHE),
  map((action) => {
    // if save flag on and local storage supported: save credentials to local storage
    if (action.payload.save) {
      if (typeof (Storage) !== "undefined") {
          localStorage.setItem('csr-jwt', JSON.stringify(action.payload.response));
          localStorage.setItem('csr-jwt-expired', action.payload.expired);
      } else {
        console.error('Cannot save token: localStorage not supported')
      }
    }

    // always return success since reducer will save token to redux
    return {
      type: ACTION_CSR_SIGN_IN_FROM_CACHE_FULFILLED,
      payload: {
        response: action.payload.response,
        expired: action.payload.expired,
      }
    }
  })
);
// type declaration and enforcement
csrSignInFromCacheEpic.propTypes = {
  action$: PropTypes.object.isRequired,
};

/**
 * Read from local storage and pass to fulfillment (save auth token to global state)
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions
 */
export const csrSignOut = (action$) => action$.pipe(
  ofType(ACTION_CSR_SIGN_OUT),
  map((action) => {
    // clear out local storage
    if (typeof (Storage) !== "undefined") {
      localStorage.removeItem('csr-jwt');
      localStorage.removeItem('csr-jwt-expired');
    }

    // always return success since reducer will save token to redux
    return {
      type: ACTION_CSR_SIGN_OUT_FULFILLED,
    }
  })
);
// type declaration and enforcement
csrSignOut.propTypes = {
  action$: PropTypes.object.isRequired,
};