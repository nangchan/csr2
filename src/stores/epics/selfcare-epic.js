import { of } from 'rxjs';
import { ofType } from 'redux-observable';
import { ajax } from 'rxjs/ajax';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import {
  ACTION_SELFCARE_SIGN_IN,
  ACTION_SELFCARE_SIGN_IN_FULFILLED,
  ACTION_SELFCARE_SIGN_IN_REJECTED,

  ACTION_SELFCARE_SIGN_IN_FROM_CACHE,
  ACTION_SELFCARE_SIGN_IN_FROM_CACHE_FULFILLED,
  ACTION_SELFCARE_SIGN_IN_FROM_CACHE_REJECTED,

  ACTION_FETCH_CUSTOMER_FULFILLED,
  ACTION_FETCH_CUSTOMER_REJECTED,

  ACTION_FETCH_DEVICES_FULFILLED,
  ACTION_FETCH_DEVICES_REJECTED,

  ACTION_SELFCARE_SIGN_OUT,
  ACTION_SELFCARE_SIGN_OUT_FULFILLED,

  ACTION_FETCH_CUSTOMER,
  ACTION_FETCH_DEVICES,
} from './actions';
import { BOINGO_EXTERNAL_API } from '../../settings';

/*
// delay 2 second
const loopDelay = (loopLength = 1000000000) => {
  let j, k=2;
  for(let i=0; i <loopLength; i++) {j = k*i;}
  console.log(j);
};
*/

// retrieve auth token using credentials
// save to local storage on sign-in
// pass auth token to fulfillment (save to global state)
export const selfcareSignInEpic = (action$) => action$.pipe(
  ofType(ACTION_SELFCARE_SIGN_IN),
  mergeMap((action) => (
    ajax({
      url: `${BOINGO_EXTERNAL_API}/2/customers/auth`,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: {
        username: action.payload.username,
        password: action.payload.password,
      }
    }).pipe(
      tap((ajaxResponse) => {
        // if supported save credentials to local storage
        if (typeof (Storage) !== "undefined") {
          localStorage.setItem('jwt', JSON.stringify(ajaxResponse.response));
        }
        else {
          alert("Sorry, your browser does not support web storage...");
        }
      }),
      map(ajaxResponse => ({
        type: ACTION_SELFCARE_SIGN_IN_FULFILLED,
        payload: ajaxResponse
      })),
      catchError(error => of({
        type: ACTION_SELFCARE_SIGN_IN_REJECTED,
        payload: error, error: true
      }))
    )
  ))
);

// read from local storage and pass to fulfillment (save auth token to global state)
export const selfcareSignInFromCacheEpic = (action$) => action$.pipe(
  ofType(ACTION_SELFCARE_SIGN_IN_FROM_CACHE),
  map((action) => {
    // if local storage supported
    if (typeof (Storage) !== "undefined") {
      // get auth token
      let json_web_token_string = localStorage.getItem('jwt');
      if (json_web_token_string) {

        return {
          type: ACTION_SELFCARE_SIGN_IN_FROM_CACHE_FULFILLED,
          payload: {response: JSON.parse(json_web_token_string)}
        };
      }
    }
    else {
      alert("Sorry, your browser does not support web storage...");
    }
    return {
      type: ACTION_SELFCARE_SIGN_IN_FROM_CACHE_REJECTED,
      payload: {
        xhr: {
          response: {
            code:'104',
            message:'auth token not found in local storage'
          }
        }
      },
      error: true
    };
  })
);

// chain sign-in to fetch-customer
// fetch customer using auth token
// pass customer data to fulfillment (save to global state)
export const fetchCustomerEpic = (action$) => action$.pipe(
  ofType(ACTION_FETCH_CUSTOMER, ACTION_SELFCARE_SIGN_IN_FULFILLED, ACTION_SELFCARE_SIGN_IN_FROM_CACHE_FULFILLED),
  mergeMap((action) => (
    ajax({
      url: `${BOINGO_EXTERNAL_API}/2/customers/${action.payload.response.customer_id}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Authorization': action.payload.response.token
      }
    }).pipe(
      tap(ajaxResponse => console.log(ajaxResponse.response)),
      map(ajaxResponse => ({
        type: ACTION_FETCH_CUSTOMER_FULFILLED,
        payload: ajaxResponse
      })),
      catchError(error => of({
        type: ACTION_FETCH_CUSTOMER_REJECTED,
        payload: error,
        error: true
      }))
    )
  ))
);

// chain sign-in to fetch-devices
// fetch devices using auth token
// pass devices to fulfillment (save to global state)
export const fetchDevicesEpic = (action$) => action$.pipe(
  ofType(ACTION_FETCH_DEVICES, ACTION_SELFCARE_SIGN_IN_FULFILLED, ACTION_SELFCARE_SIGN_IN_FROM_CACHE_FULFILLED),
  mergeMap((action) => (
    ajax({
      url: `${BOINGO_EXTERNAL_API}/2/customers/${action.payload.response.customer_id}/devices`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Authorization': action.payload.response.token
      }
    }).pipe(
      tap(ajaxResponse => console.log(ajaxResponse.response)),
      map(ajaxResponse => ({
        type: ACTION_FETCH_DEVICES_FULFILLED,
        payload: ajaxResponse
      })),
      catchError(error => of({
        type: ACTION_FETCH_DEVICES_REJECTED,
        payload: error,
        error: true
      }))
    )
  ))
);

// clear local storage on sign-out
export const selfcareSignOutEpic = (action$, state$) => action$.pipe(
  ofType(ACTION_SELFCARE_SIGN_OUT),
  map((action) => {
    // if local storage supported
    if (typeof (Storage) !== "undefined") {
      localStorage.removeItem('jwt');
    }
    else {
        alert("Sorry, your browser does not support web storage...");
    }

    return {
      type: ACTION_SELFCARE_SIGN_OUT_FULFILLED,
      payload: null };
  })
);