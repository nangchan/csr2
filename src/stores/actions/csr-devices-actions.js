import PropTypes from 'prop-types';

export const ACTION_CSR_FETCH_DEVICES = 'ACTION_CSR_FETCH_DEVICES';
export const ACTION_CSR_FETCH_DEVICES_FULFILLED = 'ACTION_CSR_FETCH_DEVICES_FULFILLED';
export const ACTION_CSR_FETCH_DEVICES_REJECTED = 'ACTION_CSR_FETCH_DEVICES_REJECTED';

export const ACTION_CSR_EDIT_DEVICE = 'ACTION_CSR_EDIT_DEVICE';
export const ACTION_CSR_EDIT_DEVICE_FULFILLED = 'ACTION_CSR_EDIT_DEVICE_FULFILLED';
export const ACTION_CSR_EDIT_DEVICE_REJECTED = 'ACTION_CSR_EDIT_DEVICE_REJECTED';

export const ACTION_CSR_ADD_DEVICE = 'ACTION_CSR_ADD_DEVICE';
export const ACTION_CSR_ADD_DEVICE_FULFILLED = 'ACTION_CSR_ADD_DEVICE_FULFILLED';
export const ACTION_CSR_ADD_DEVICE_REJECTED = 'ACTION_CSR_ADD_DEVICE_REJECTED';

export const ACTION_CSR_DELETE_DEVICE = 'ACTION_CSR_DELETE_DEVICE';
export const ACTION_CSR_DELETE_DEVICE_FULFILLED = 'ACTION_CSR_DELETE_DEVICE_FULFILLED';
export const ACTION_CSR_DELETE_DEVICE_REJECTED = 'ACTION_CSR_DELETE_DEVICE_REJECTED';

/**
 * Action creator for add/edit/delete devices
 * 
 * @param {object} csr_customer [required] - Redux state for customer object
 * @param {object} csr_auth [required] - Redux state for authentication object
 * @param {string} type [required] - Redux action dispatch type defined above
 * @param {string} data.mac [required] - MAC address of device (eg. 11-22-33-AA-BB-CC)
 * @param {string} data.name [required] - Name of device (eg. XBox)
 * @param {string} data.model [required] - Type of device (eg. Gaming)
 */
export const deviceUpdateAction = ({csr_customer, csr_auth, type, data: {mac, name, model}}) => ({
  type: type,
  payload: {
    token: csr_auth.token,
    customer_id: csr_customer.customer_id,
    mac: mac,
    body: {
      name: name,
      model: model,
    }
  }
});
// type declaration and enforcement
deviceUpdateAction.propTypes = {
  csr_customer: PropTypes.object.isRequired,
  csr_auth: PropTypes.object.isRequired,
  type: PropTypes.oneOf([ACTION_CSR_ADD_DEVICE, ACTION_CSR_EDIT_DEVICE, ACTION_CSR_DELETE_DEVICE]).isRequired,
  data: PropTypes.shape({
    mac: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
  }),
};