import PropTypes from 'prop-types';
import { of, timer, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { STUB_DELAY } from '../../settings';

 /**
  * Simulate account create response
  * Errors triggered on:
  * request.payload.password = ['invalid-plan']
  * request.payload.password = ['cc-charge-fail']
  * 
  * @param {object} request [required] - Ajax request called by epic
  */

  export const csrAccountCreateEpicStub = (request) => timer(STUB_DELAY).pipe(
    mergeMap(event => {
      switch (request.body.first_name) {
        case 'invalid-plan':
          return throwError({
            xhr: {
              code: 400,
              response: {
                message: 'Invalid Plan',
              }
            }
          });
        case 'cc-charge-fail':
          return throwError({
            xhr: {
              code: 475,
              response: {
                message: 'Credit card charge failed',
              }
            }
          })
        case 'used-username':
          return throwError({
            xhr: {
              code: 409,
              response: {
                message: 'Username conflict',
              }
            }
          })
        default: 
          return of({
            code: 200,
            response: {
              message: 'Customer account created.',
            }
          })
        }
     })
  );

  csrAccountCreateEpicStub.propTypes = {
    request: PropTypes.object.isRequired,
  };
