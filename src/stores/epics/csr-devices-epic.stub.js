import PropTypes from 'prop-types';
import { of, timer, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { STUB_DELAY } from '../../settings';

import { BOINGO_EXTERNAL_API } from '../../settings';
import { CsrStubState } from '../states/CsrStubState';

/**
 * Simulate fetch devices response
 * Errors triggered on url [customer_id=0]
 * 
 * @param {object} request [required] - Ajax request called by epic
 */
export const csrFetchDevicesEpicStub = (request) => timer(STUB_DELAY).pipe(
  mergeMap(event => {
    switch (request.url) {
      case `${BOINGO_EXTERNAL_API}/2/customers/${0}/devices/`:
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
          response: CsrStubState.csrDevicesReducer.csr_devices
        })
    }
  })
);
// type declaration and enforcement
csrFetchDevicesEpicStub.propTypes = {
  request: PropTypes.object.isRequired,
};

/**
 * Simulate add devices response
 * Errors triggered on request.body.name = ['max','dupe','deny']
 * 
 * @param {object} request [required] - Ajax request called by epic
 */
export const csrAddDevicesEpicStub = (request) => timer(STUB_DELAY).pipe(
  mergeMap(event => {
    switch (request.body.name) {
      case 'max':
        return throwError({
          xhr: {
            code: 403,
            response: {
              code: '110',
              message: 'Maximum number of devices has been reached for this account'
            }
          }
        });
      case 'dupe':
        return throwError({
          xhr: {
            code: 403,
            response: {
              code: '302',
              message: 'Duplicate device'
            }
          }
        });
      case 'deny':
        return throwError({
          xhr: {
            code: 403,
            response: {
              code: '303',
              message: 'Not allowed to add devices'
            }
          }
        });
      default:
        return of({
          code: 200,
          response: {
            message: 'Device added.'
          }
        })
    }
  })
);
// type declaration and enforcement
csrAddDevicesEpicStub.propTypes = {
  request: PropTypes.object.isRequired,
};

/**
 * Simulate delete devices response
 * Errors triggered on url [customer_id=<stub>,mac='00-00-00-00-00-00']
 * 
 * @param {object} request [required] - Ajax request called by epic
 */
export const csrDeleteDevicesEpicStub = (request) => timer(STUB_DELAY).pipe(
  mergeMap(event => {
    const device = request.url.replace(new RegExp(`^${BOINGO_EXTERNAL_API}/2/customers/[^/]+/devices/([^/]+)$`), '$1');
    switch (device) {
      case '00-00-00-00-00-00':
        return throwError({
          xhr: {
            code: '404',
            response: {
              message: 'mac address not found'
            }
          }
        });
      default:
        return of({
          response: {
            message: 'Device deleted.',
          }
        })
    }
  })
);
// type declaration and enforcement
csrDeleteDevicesEpicStub.propTypes = {
  request: PropTypes.object.isRequired,
};