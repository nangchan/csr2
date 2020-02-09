import PropTypes from 'prop-types';
import { of, timer, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { STUB_DELAY } from '../../settings';

import { BOINGO_EXTERNAL_API } from '../../settings';
import { CsrStubState } from '../states/CsrStubState';

/**
 * Simulate fetch notes response
 * Errors triggered on url [customer_id=0]
 * 
 * @param {object} request [required] - Ajax request called by epic
 */
export const csrFetchNotesEpicStub = (request) => timer(STUB_DELAY).pipe(
  mergeMap(event => {
    switch (request.url) {
      case `${BOINGO_EXTERNAL_API}/2/customers/${0}/notes`:
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
          response: CsrStubState.csrNotesReducer.csr_notes
        })
    }
  })
);
// type declaration and enforcement
csrFetchNotesEpicStub.propTypes = {
  request: PropTypes.object.isRequired,
};

/**
 * Simulate add note response
 * Errors triggered on request.payload.note = ['invalid']
 * 
 * @param {object} request [required] - Ajax request called by epic
 */
export const csrAddNoteEpicStub = (request) => timer(STUB_DELAY).pipe(
  mergeMap(event => {
    switch (request.body.note) {
      case 'invalid':
        return throwError({
          xhr: {
            code: 401,
            response: {
              message: 'Unauthorized',
            }
          }
        });
      default:
        return of({
          code: 200,
          response: {
            message: 'Customer note added successfully.'
          }
        })
    }
  })
);
// type declaration and enforcement
csrAddNoteEpicStub.propTypes = {
  request: PropTypes.object.isRequired,
};