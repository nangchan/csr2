import PropTypes from 'prop-types';
import { of } from 'rxjs';
import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import {
  ACTION_CSR_FETCH_DEVICES,
  ACTION_CSR_FETCH_DEVICES_FULFILLED,
  ACTION_CSR_FETCH_DEVICES_REJECTED,
  ACTION_CSR_EDIT_DEVICE,
  ACTION_CSR_EDIT_DEVICE_FULFILLED,
  ACTION_CSR_EDIT_DEVICE_REJECTED,
  ACTION_CSR_ADD_DEVICE,
  ACTION_CSR_ADD_DEVICE_FULFILLED,
  ACTION_CSR_ADD_DEVICE_REJECTED,
  ACTION_CSR_DELETE_DEVICE,
  ACTION_CSR_DELETE_DEVICE_FULFILLED,
  ACTION_CSR_DELETE_DEVICE_REJECTED,
} from '../actions/csr-devices-actions';
import { BOINGO_EXTERNAL_API } from '../../settings';
import { csrFetchDevicesEpicStub, csrAddDevicesEpicStub, csrDeleteDevicesEpicStub } from './csr-devices-epic.stub';

/*
// delay 2 second
const loopDelay = (loopLength = 1000000000) => {
  let j, k=2;
  for(let i=0; i <loopLength; i++) {j = k*i;}
  console.log(j);
};
*/

/**
 * Fetch devices using auth token
 * Pass customer data to fulfillment (save to global state)
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions dispatched by Redux components or RxJS epics
 * @param {object} state$ [required] - RxJS Observable that emits Redux state
 * @param {object} dependencies.ajax [required] - Object that contains epic dependencies (eg. { ajax })
 * 
 * @returns {object} RxJS Observable that emits an action for fulfillment or rejection
 */
export const csrFetchDevicesEpic = (action$, state$, { ajax }) => action$.pipe(
  ofType(ACTION_CSR_FETCH_DEVICES),
  mergeMap((action) => (
    ajax({
      url: `${BOINGO_EXTERNAL_API}/2/customers/${action.payload.customer_id}/devices/`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'Cache-Control': 'no-cache',
        'Authorization': action.payload.token
      },
      __STUB_AJAX__: csrFetchDevicesEpicStub,
    }).pipe(
      tap(ajaxResponse => console.log(ajaxResponse.response)),
      map(ajaxResponse => ({
        type: ACTION_CSR_FETCH_DEVICES_FULFILLED,
        payload: ajaxResponse
      })),
      catchError(error => of({
        type: ACTION_CSR_FETCH_DEVICES_REJECTED,
        payload: error,
        error: true
      }))
    )
  ))
);
// type declaration and enforcement
csrFetchDevicesEpic.propTypes = {
  action$: PropTypes.object.isRequired,
  state$: PropTypes.object.isRequired,
  dependencies: PropTypes.shape({
    ajax: PropTypes.func.isRequired,
  }),
};

/**
 * Udpate device using auth token
 * Pass device data to fulfillment (save to global state)
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions dispatched by Redux components or RxJS epics
 * @param {object} state$ [required] - RxJS Observable that emits Redux state
 * @param {object} dependencies.ajax [required] - Object that contains epic dependencies (eg. { ajax })
 * 
 * @returns {object} RxJS Observable that emits an action for fulfillment or rejection
 */
export const csrAddDeviceEpic = (action$, state$, { ajax }) => action$.pipe(
  ofType(ACTION_CSR_ADD_DEVICE),
  mergeMap((action) => (
    ajax({
      url: `${BOINGO_EXTERNAL_API}/2/customers/${action.payload.customer_id}/devices/${action.payload.mac}`,
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Authorization': action.payload.token
      },
      body: action.payload.body,
      __STUB_AJAX__: csrAddDevicesEpicStub,
    }).pipe(
      tap(ajaxResponse => console.log(ajaxResponse.response)),
      map(ajaxResponse => ({
        type: ACTION_CSR_ADD_DEVICE_FULFILLED,
        payload: ajaxResponse
      })),
      catchError(error => of({
        type: ACTION_CSR_ADD_DEVICE_REJECTED,
        payload: error,
        error: true
      }))
    )
  ))
);
// type declaration and enforcement
csrAddDeviceEpic.propTypes = {
  action$: PropTypes.object.isRequired,
  state$: PropTypes.object.isRequired,
  dependencies: PropTypes.shape({
    ajax: PropTypes.func.isRequired,
  }),
};

/**
 * Delete device using auth token
 * Pass device data to fulfillment (save to global state)
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions dispatched by Redux components or RxJS epics
 * @param {object} state$ [required] - RxJS Observable that emits Redux state
 * @param {object} dependencies.ajax [required] - Object that contains epic dependencies (eg. { ajax })
 * 
 * @returns {object} RxJS Observable that emits an action for fulfillment or rejection
 */
export const csrDeleteDeviceEpic = (action$, state$, { ajax }) => action$.pipe(
  ofType(ACTION_CSR_DELETE_DEVICE),
  mergeMap((action) => (
    ajax({
      url: `${BOINGO_EXTERNAL_API}/2/customers/${action.payload.customer_id}/devices/${action.payload.mac}`,
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Authorization': action.payload.token
      },
      __STUB_AJAX__: csrDeleteDevicesEpicStub,
    }).pipe(
      tap(ajaxResponse => console.log(ajaxResponse.response)),
      map(ajaxResponse => ({
        type: ACTION_CSR_DELETE_DEVICE_FULFILLED,
        payload: ajaxResponse
      })),
      catchError(error => of({
        type: ACTION_CSR_DELETE_DEVICE_REJECTED,
        payload: error,
        error: true
      }))
    )
  ))
);
// type declaration and enforcement
csrDeleteDeviceEpic.propTypes = {
  action$: PropTypes.object.isRequired,
  state$: PropTypes.object.isRequired,
  dependencies: PropTypes.shape({
    ajax: PropTypes.func.isRequired,
  }),
};

/**
 * Edit device using auth token
 * Pass device data to fulfillment (save to global state)
 * concatMap will wait for first observerable to finish before merging the next
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions dispatched by Redux components or RxJS epics
 * @param {object} state$ [required] - RxJS Observable that emits Redux state
 * @param {object} dependencies.ajax [required] - Object that contains epic dependencies (eg. { ajax })
 * 
 * @returns {object} RxJS Observable that emits an action for fulfillment or rejection
 * 
 * @see {@link https://javascript.tutorialhorizon.com/2017/03/29/switchmap-vs-flatmap-rxjs/}
 * @see {@link http://rudiyardley.com/redux-single-line-of-code-rxjs/}
 * @see {@link https://redux-observable.js.org/docs/basics/Epics.html}
 */
export const csrEditDeviceEpic = (action$, state$, { ajax }) => action$.pipe(
  ofType(ACTION_CSR_EDIT_DEVICE),
  mergeMap((action) => (
    ajax({
      url: `${BOINGO_EXTERNAL_API}/2/customers/${action.payload.customer_id}/devices/${action.payload.mac}`,
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Authorization': action.payload.token
      },
      __STUB_AJAX__: csrDeleteDevicesEpicStub,
    }).pipe(
      tap(ajaxResponse => console.log(ajaxResponse.response)),
      map(ajaxResponse => ({
        type: ACTION_CSR_EDIT_DEVICE_FULFILLED,
        payload: {
          ...action.payload, // pass along to next operator
          response: ajaxResponse.response,
        }
      })),
      catchError(error => of({
        type: ACTION_CSR_EDIT_DEVICE_REJECTED,
        payload: error,
        error: true
      }))
    )
  )),
  mergeMap((action) => (
    action.type !== ACTION_CSR_EDIT_DEVICE_FULFILLED
    ? of(action) // create observable from in-coming action and pass-thru if error ocurrs
    : ajax({ // re-add if successful
        url: `${BOINGO_EXTERNAL_API}/2/customers/${action.payload.customer_id}/devices/${action.payload.mac}`,
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Authorization': action.payload.token
        },
        body: action.payload.body,
        __STUB_AJAX__: csrAddDevicesEpicStub,
      }).pipe(
        tap(ajaxResponse => console.log(ajaxResponse.response)),
        map(ajaxResponse => ({
          type: ACTION_CSR_EDIT_DEVICE_FULFILLED,
          payload: ajaxResponse
        })),
        catchError(error => of({
          type: ACTION_CSR_EDIT_DEVICE_REJECTED,
          payload: error,
          error: true
        }))
      )
  ))
);
// type declaration and enforcement
csrEditDeviceEpic.propTypes = {
  action$: PropTypes.object.isRequired,
  state$: PropTypes.object.isRequired,
  dependencies: PropTypes.shape({
    ajax: PropTypes.func.isRequired,
  }),
};