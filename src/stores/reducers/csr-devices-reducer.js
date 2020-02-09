import PropTypes from 'prop-types';
import produce from 'immer';
import {
  ACTION_CSR_FETCH_DEVICES,
  ACTION_CSR_FETCH_DEVICES_FULFILLED,
  ACTION_CSR_FETCH_DEVICES_REJECTED,

  ACTION_CSR_ADD_DEVICE,
  ACTION_CSR_ADD_DEVICE_FULFILLED,
  ACTION_CSR_ADD_DEVICE_REJECTED,

  ACTION_CSR_DELETE_DEVICE,
  ACTION_CSR_DELETE_DEVICE_FULFILLED,
  ACTION_CSR_DELETE_DEVICE_REJECTED,

  ACTION_CSR_EDIT_DEVICE,
  ACTION_CSR_EDIT_DEVICE_FULFILLED,
  ACTION_CSR_EDIT_DEVICE_REJECTED,
} from '../actions/csr-devices-actions';
import {CsrInitialState} from '../states/CsrInitialState';
import { ACTION_CSR_SIGN_OUT, ACTION_CSR_RELOAD } from '../actions/csr-auth-actions';

/**
 * Updates csr_devices, csr_devices_requesting, csr_devices_error,
 * and csr_add_device, csr_add_device_requesting, csr_add_device_error,
 * and csr_delete_device, csr_delete_device_requesting, csr_delete_device_error,
 * and csr_edit_device, csr_edit_device_requesting, csr_edit_device_error,
 * 
 * @param {object} state [required] - Current state provided by Redux and initialized by CsrInitialState if not null
 * @param {object} action [required] - Current action originating on Component and provided by Redux
 */
export default function csrDevicesReducer(state = (CsrInitialState && CsrInitialState.csrDevicesReducer) || {}, action) {
  switch (action.type) {
    case ACTION_CSR_FETCH_DEVICES: {
      return produce(state, (draft) => {
        // store username and password in state.cred
        // afterwards epic will auth using passed-in credentials
        // initiate fetch auth via epic
        draft.csr_devices = null;
        draft.csr_devices_requesting = {customer_id: action.payload.customer_id};
        draft.csr_devices_error = null;
      })
    }
    case ACTION_CSR_FETCH_DEVICES_FULFILLED: {
      return produce(state, (draft) => {
        // payload comes from return from ajax auth or from cache
        // auth token save to global state
        draft.csr_devices = {...action.payload.response};
        draft.csr_devices_requesting = null;
        draft.csr_devices_error = null;
      })
    }
    case ACTION_CSR_FETCH_DEVICES_REJECTED: {
      return produce(state, (draft) => {
        // store error in global store
        draft.csr_devices = null;
        draft.csr_devices_requesting = null;
        draft.csr_devices_error = {...action.payload.xhr.response};
      })
    }
    case ACTION_CSR_ADD_DEVICE: {
      return produce(state, (draft) => {
        // update device with new state
        draft.csr_add_device = null;
        draft.csr_add_device_requesting = action.payload;
        draft.csr_add_device_error = null;
      })
    }
    case ACTION_CSR_ADD_DEVICE_FULFILLED: {
      return produce(state, (draft) => {
        // update device with new state
        draft.csr_devices.devices.push({
          mac: draft.csr_add_device_requesting.mac,
          name: draft.csr_add_device_requesting.body.name,
          model: draft.csr_add_device_requesting.body.model,
          created_date: (new Date()).toISOString().substring(0,19) + 'Z'
        });
        draft.csr_add_device = action.payload.response;
        draft.csr_add_device_requesting = null
        draft.csr_add_device_error = null;
      })
    }
    case ACTION_CSR_ADD_DEVICE_REJECTED: {
      return produce(state, (draft) => {
        // update device with new state
        draft.csr_add_device = null;
        draft.csr_add_device_requesting = null
        draft.csr_add_device_error = {...action.payload.xhr.response};
      })
    }
    case ACTION_CSR_DELETE_DEVICE: {
      return produce(state, (draft) => {
        // update device with new state
        draft.csr_delete_device = null;
        draft.csr_delete_device_requesting = action.payload;
        draft.csr_delete_device_error = null;
      })
    }
    case ACTION_CSR_DELETE_DEVICE_FULFILLED: {
      return produce(state, (draft) => {
        // remove target device from global state
        draft.csr_devices.devices.splice(
          draft.csr_devices.devices.findIndex(
            device => device.mac === draft.csr_delete_device_requesting.mac),
          1);
        draft.csr_delete_device = action.payload.response;
        draft.csr_delete_device_requesting = null
        draft.csr_delete_device_error = null;
      })
    }
    case ACTION_CSR_DELETE_DEVICE_REJECTED: {
      return produce(state, (draft) => {
        // update device with new state
        draft.csr_delete_device = null;
        draft.csr_delete_device_requesting = null
        draft.csr_delete_device_error = {...action.payload.xhr.response};
      })
    }
    case ACTION_CSR_EDIT_DEVICE: {
      return produce(state, (draft) => {
        // update device with new state
        draft.csr_edit_device = null;
        draft.csr_edit_device_requesting = action.payload;
        draft.csr_edit_device_error = null;
      })
    }
    case ACTION_CSR_EDIT_DEVICE_FULFILLED: {
      return produce(state, (draft) => {
        // update device with new state
        const index = draft.csr_devices.devices.findIndex(device => device.mac === draft.csr_edit_device_requesting.mac);
        // if not -1 (aka flip all bits, aka ones-compliment)
        if (~index) {
          draft.csr_devices.devices[index].mac = draft.csr_edit_device_requesting.mac;
          draft.csr_devices.devices[index].name = draft.csr_edit_device_requesting.body.name;
          draft.csr_devices.devices[index].model = draft.csr_edit_device_requesting.body.model;
        }
        draft.csr_edit_device = action.payload.response;
        draft.csr_edit_device_requesting = null
        draft.csr_edit_device_error = null;
      })
    }
    case ACTION_CSR_EDIT_DEVICE_REJECTED: {
      return produce(state, (draft) => {
        // update device with new state
        draft.csr_edit_device = null;
        draft.csr_edit_device_requesting = null
        draft.csr_edit_device_error = {...action.payload.xhr.response};
      })
    }
    case ACTION_CSR_RELOAD: {
      return produce(state, (draft) => {
        // clear global state
        draft.csr_devices = null;
        draft.csr_devices_requesting = null;
        draft.csr_devices_error = null;
        draft.csr_add_device = null
        draft.csr_add_device_requesting = null
        draft.csr_add_device_error = null;
        draft.csr_delete_device = null;
        draft.csr_delete_device_requesting = null
        draft.csr_delete_device_error = null;
        draft.csr_edit_device = null;
        draft.csr_edit_device_requesting = null
        draft.csr_edit_device_error = null
      })
    }
    case ACTION_CSR_SIGN_OUT: {
      return produce(state, (draft) => {
        // clear global state
        draft.csr_devices = null;
        draft.csr_devices_requesting = null;
        draft.csr_devices_error = null;
        draft.csr_add_device = null
        draft.csr_add_device_requesting = null
        draft.csr_add_device_error = null;
        draft.csr_delete_device = null;
        draft.csr_delete_device_requesting = null
        draft.csr_delete_device_error = null;
        draft.csr_edit_device = null;
        draft.csr_edit_device_requesting = null
        draft.csr_edit_device_error = null
      })
    }
    default: {
      // return current state
      return state
    }
  }
}
// type declaration and enforcement
csrDevicesReducer.propTypes = {
  state: PropTypes.object.isRequired,
  action: PropTypes.object.isRequired,
};