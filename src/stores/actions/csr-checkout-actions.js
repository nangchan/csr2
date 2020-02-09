import PropTypes from 'prop-types';

export const ACTION_CSR_CHECKOUT = 'ACTION_CSR_CHECKOUT';
export const ACTION_CSR_CHECKOUT_CANCEL = 'ACTION_CSR_CHECKOUT_CANCEL';
export const ACTION_CSR_CHECKOUT_CONFIRM = 'ACTION_CSR_CHECKOUT_CONFIRM';
export const ACTION_CSR_CHECKOUT_FULFILLED = 'ACTION_CSR_CHECKOUT_FULFILLED';
export const ACTION_CSR_CHECKOUT_REJECTED = 'ACTION_CSR_CHECKOUT_REJECTED';

/**
 * Action creator for checkout page responsible dispatching pending action upon confirmation by user
 * 
 * @param {object} action [required] - Action to be dispatched after confirmation on checkout page
 * @param {boolean} show_billing [optional=false] - If true then show update billing form
 * @param {object} base_address [optional] - Show base address if changed
 * @param {object} product_codes [optional] - Product coes will be used to display order summary
 * @param {number} customer_id [optional] - Customer ID of existing customer used to redirect to account subpage
 * @param {object} customer [optional] - New customer object similar to the one embedded in action
 * 
 * @returns {object} Reducer action object
 */
export const checkoutAction = ({action, show_billing=false, customer_id=undefined, customer=undefined, base_address=undefined, product_codes=undefined}) => ({
  type: ACTION_CSR_CHECKOUT,
  payload: {
    action,
    show_billing,
    base_address,
    product_codes,
    customer_id,
    customer,
  }
});
// type declaration and enforcement
checkoutAction.propTypes = {
  action: PropTypes.object.isRequired,
  show_billing: PropTypes.bool,
  base_address: PropTypes.object,
  product_codes: PropTypes.object,
  customer_id: PropTypes.number,
  customer: PropTypes.object,
};

/**
 * Action creator for checkout page cancellation
 * 
 * @returns {object} Reducer action object
 */
export const checkoutCanelAction = () => ({
  type: ACTION_CSR_CHECKOUT_CANCEL,
});

/**
 * Action creator for checkout page confirmation which dispatches pending action
 * 
 * @param {object} action [required] - Action to be dispatched after confirmation on checkout page
 * 
 * @returns {object} Reducer action object
 */
export const checkoutConfirmAction = ({action}) => ({
  type: ACTION_CSR_CHECKOUT_CONFIRM,
  payload: {
    action,
  }
});
// type declaration and enforcement
checkoutAction.propTypes = {
  action: PropTypes.object.isRequired,
};