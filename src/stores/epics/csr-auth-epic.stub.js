import PropTypes from 'prop-types';
import { of, timer, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { STUB_DELAY } from '../../settings';

import { CsrStubState } from '../states/CsrStubState';

/**
 * Simulate sign-in response
 * Errors triggered on request.payload.partner_id = ['invalid']
 * 
 * @param {object} request [required] - Ajax request called by epic
 * @param {object} state$ [required] - RxJS Observable that emits Redux state
 * @param {object} dependencies.ajax [required] - Object that contains epic dependencies (eg. { ajax })
 */
export const csrSignInEpicStub = (request) => timer(STUB_DELAY).pipe(
  mergeMap(event => {
    switch (request.body.partner_id) {
      case 'invalid':
        return throwError({
          xhr: {
            response: {
              code: '104',
              message: 'username/password not accepted',
            }
          }
        });
      default:
        return of({
          response: CsrStubState.csrAuthReducer.csr_auth
        })
    }
  })
);
// type declaration and enforcement
csrSignInEpicStub.propTypes = {
  request: PropTypes.object.isRequired,
  state$: PropTypes.object.isRequired,
  dependencies: PropTypes.shape({
    ajax: PropTypes.func.isRequired,
  }),
};