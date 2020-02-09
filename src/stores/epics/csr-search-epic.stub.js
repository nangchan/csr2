import PropTypes from 'prop-types';
import { of, timer, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { STUB_DELAY } from '../../settings';

import { CsrStubState } from '../states/CsrStubState';

/**
 * Simulate search response
 * Errors triggered on request.body.first_name = ['empty']
 * 
 * @param {object} request [required] - Ajax request called by epic
 */
export const csrSearchEpicStub = (request) => timer(STUB_DELAY).pipe(
  mergeMap(event => {
    switch (request.body.first_name) {
      case 'empty':
        return throwError({
          xhr: {
            response: {
              message: "CSR Search requires a username, customer id, customer name, phone number, email address or last 4 credit card digits"
            }
          }
        });
      default:
        return of({
          response: CsrStubState.csrSearchReducer.csr_search
        })
    }
  })
);
// type declaration and enforcement
csrSearchEpicStub.propTypes = {
  request: PropTypes.object.isRequired,
};