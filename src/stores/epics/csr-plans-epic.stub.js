import PropTypes from 'prop-types';
import { of, timer, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { STUB_DELAY } from '../../settings';

import { BOINGO_EXTERNAL_API } from '../../settings';
import { CsrStubState } from '../states/CsrStubState';

/**
 * Simulate fetch deferred actions response
 * Errors triggered on url [customer_id=0]
 * 
 * @param {object} request [required] - Ajax request called by epic
 */
export const csrFetchDeferredActionsEpicStub = (request) => timer(STUB_DELAY).pipe(
  mergeMap(event => {
    switch (request.url) {
      case `${BOINGO_EXTERNAL_API}/2/customers/${0}/deferred_actions`:
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
          response: CsrStubState.csrDeferredActionsReducer.csr_deferred_actions
        })
    }
  })
);
// type declaration and enforcement
csrFetchDeferredActionsEpicStub.propTypes = {
  request: PropTypes.object.isRequired,
};