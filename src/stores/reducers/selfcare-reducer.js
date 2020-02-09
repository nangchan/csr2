import {
  ACTION_SELFCARE_SIGN_IN,
  ACTION_SELFCARE_SIGN_IN_FULFILLED,
  ACTION_SELFCARE_SIGN_IN_REJECTED,

  ACTION_SELFCARE_SIGN_IN_FROM_CACHE,
  ACTION_SELFCARE_SIGN_IN_FROM_CACHE_REJECTED,
  ACTION_SELFCARE_SIGN_IN_FROM_CACHE_FULFILLED,

  ACTION_FETCH_CUSTOMER,
  ACTION_FETCH_CUSTOMER_FULFILLED,
  ACTION_FETCH_CUSTOMER_REJECTED,

  ACTION_FETCH_DEVICES,
  ACTION_FETCH_DEVICES_FULFILLED,
  ACTION_FETCH_DEVICES_REJECTED,

  ACTION_SELFCARE_SIGN_OUT,
} from './actions';
import produce from 'immer';

// react forms
// https://rangle.io/blog/simplifying-controlled-inputs-with-hooks/

// save state
// https://itnext.io/updating-properties-of-an-object-in-react-state-af6260d8e9f5?gi=4357e64f66de

// running chrome without cors
// https://alfilatov.com/posts/run-chrome-without-cors/

export default function selfcareReducer(state = {}, action) {
  switch (action.type) {
    case ACTION_SELFCARE_SIGN_IN: {
      return produce(state, (draft) => {
        // store username and password in state.cred
        // afterwards epic will auth using passed-in credentials
        // initiate fetch auth via epic
        draft.cred = {...action.payload};
        draft.auth = null;
        draft.auth_requesting = true;
        draft.auth_error = null;
      })
    }
    case ACTION_SELFCARE_SIGN_IN_FROM_CACHE: {
      return produce(state, (draft) => {
        // state.cred will be empty since we do not store username/passwords
        // afterwards epic pull auth token from local storage and pass to fulfillment
        draft.auth = null;
        draft.auth_requesting = true;
        draft.auth_error = null;
      })
    }
    case ACTION_SELFCARE_SIGN_IN_FROM_CACHE_FULFILLED:
    case ACTION_SELFCARE_SIGN_IN_FULFILLED: {
      return produce(state, (draft) => {
        // payload comes from return from ajax auth or from cache
        // auth token save to global state
        draft.auth = {...action.payload.response};
        draft.auth_requesting = false;
        draft.auth_error = null;
      })
    }
    case ACTION_SELFCARE_SIGN_IN_FROM_CACHE_REJECTED:
    case ACTION_SELFCARE_SIGN_IN_REJECTED: {
      return produce(state, (draft) => {
        // store error in global store
        draft.auth = null;
        draft.auth_requesting = false;
        draft.auth_error = {...action.payload.xhr.response};
      })
    }
    case ACTION_FETCH_CUSTOMER: {
      return produce(state, (draft) => {
        // initiate fetch customer via epic
        draft.customer = null;
        draft.customer_requesting = true;
        draft.customer_error = null;
      })
    }
    case ACTION_FETCH_CUSTOMER_FULFILLED: {
      return produce(state, (draft) => {
        // save customer data to global state
        draft.customer = {...action.payload.response};
        draft.customer_requesting = false;
        draft.customer_error = null;
      })
    }
    case ACTION_FETCH_CUSTOMER_REJECTED: {
      return produce(state, (draft) => {
        // store error in global store
        draft.customer = null;
        draft.customer_requesting = false;
        draft.customer_error = {...action.payload.xhr.response}; 
      })
    }
    case ACTION_FETCH_DEVICES: {
      return produce(state, (draft) => {
        // initiate fetch devices via epic
        draft.devices = null;
        draft.devices_requesting = true;
        draft.devices_error = null;
      })
    }
    case ACTION_FETCH_DEVICES_FULFILLED: {
      return produce(state, (draft) => {
        // save devices to global state
        draft.devices = {...action.payload.response};
        draft.devices_requesting = false;
        draft.devices_error = null;
      })
    }
    case ACTION_FETCH_DEVICES_REJECTED: {
      return produce(state, (draft) => {
        // store error in global store
        draft.devices = null;
        draft.devices_requesting = false;
        draft.devices_error = {...action.payload.xhr.response}; 
      })
    }
    case ACTION_SELFCARE_SIGN_OUT: {
      return produce(state, (draft) => {
        // clear global state
        draft.auth = null;
        draft.devices = null;
        draft.customer = null;
      })
    }
    default: {
      // return current state
      return state
    }
  }
}