import PropTypes from 'prop-types';
import { of, timer, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { STUB_DELAY, BOINGO_EXTERNAL_API } from '../../settings';

import { CsrStubState } from '../states/CsrStubState';

/**
 * Simulate fetch product catalog from sitecore by venue id
 * Errors triggered on url [customer_id=null]
 * 
 * @param {object} request [required] - Ajax request called by epic
 */
export const csrUpdateProductsEpicStub = (request) => timer(STUB_DELAY).pipe(
  mergeMap(event => {
    switch (request.url) {
      case `${BOINGO_EXTERNAL_API}/2/customers/${null}/products`:
        return throwError({
          xhr: {
            response: {
              code : 501,
              message : 'missing input product code',
            }
          }
        });
      default:
        return of({
          response: CsrStubState.csrChangePlansReducer.csr_update_products,
        })
    }
  })
);
// type declaration and enforcement
csrUpdateProductsEpicStub.propTypes = {
  request: PropTypes.object.isRequired,
};