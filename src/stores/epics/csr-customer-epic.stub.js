import PropTypes from 'prop-types';
import { of, timer, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { STUB_DELAY } from '../../settings';

import { BOINGO_EXTERNAL_API } from '../../settings';
import { CsrStubState } from '../states/CsrStubState';

/**
 * Simulate fetch customer response
 * Errors triggered on url [customer_id=0]
 * 
 * @param {object} request [required] - Ajax request called by epic
 */
export const csrFetchCustomerEpicStub = (request) => timer(STUB_DELAY).pipe(
  mergeMap(event => {
    switch (request.url) {
      case `${BOINGO_EXTERNAL_API}/2/customers/${0}`:
        return throwError({
          xhr: {
            response: {
              code: '401',
              message: 'Unauthorized',
            }
          }
        });
      default:
        return of({
          response: CsrStubState.csrCustomerReducer.csr_customer
        })
    }
  })
);
// type declaration and enforcement
csrFetchCustomerEpicStub.propTypes = {
  request: PropTypes.object.isRequired,
};

/**
 * Simulate update customer response
 * Errors triggered on request.body.first_name = ['invalid']
 * 
 * @param {object} request [required] - Ajax request called by epic
 */
export const csrUpdateCustomerEpicStub = (request) => timer(STUB_DELAY).pipe(
  mergeMap(event => {
    switch (request.body.first_name) {
      case 'invalid':
        return throwError({
          xhr: {
            response: {
              message: 'Please provide a valid email address.'
            }
          }
        });
      default:
        return of({
          response: {
            message: 'Customer updated successfully.'
          }
        })
    }
  })
);
// type declaration and enforcement
csrUpdateCustomerEpicStub.propTypes = {
  request: PropTypes.object.isRequired,
};