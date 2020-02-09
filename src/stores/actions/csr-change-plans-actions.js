import PropTypes from 'prop-types';

export const ACTION_CSR_UPDATE_PRODUCTS = 'ACTION_CSR_UPDATE_PRODUCTS';
export const ACTION_CSR_UPDATE_PRODUCTS_FULFILLED = 'ACTION_CSR_UPDATE_PRODUCTS_FULFILLED';
export const ACTION_CSR_UPDATE_PRODUCTS_REJECTED = 'ACTION_CSR_UPDATE_PRODUCTS_REJECTED';

/**
 * Action creator for change plans responsible updating customers
 * 
 * @param {string} token [required]  - Authentication token from csr_auth.token
 * @param {number} customer_id [required] - Customer ID from csr_customer.customer_id
 * @param {string[]} product_codes [required] - Array of product codes from change plan page
 * @param {object} base_address [required] - Update base address since plans are per base
 */
export const updateProductsAction = ({token, customer_id, product_codes, base_address}) => ({
  type: ACTION_CSR_UPDATE_PRODUCTS,
  payload: {
    token,
    customer_id,
    base_address,
    product_codes,
    // reset_bdom: 0 // 1 for inactive accounts
  }
});
// type declaration and enforcement
updateProductsAction.propTypes = {
  token: PropTypes.string.isRequired,
  customer_id: PropTypes.number.isRequired,
  product_codes: PropTypes.array.isRequired,
  base_address: PropTypes.object.isRequired,
};