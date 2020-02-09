import { TestScheduler } from 'rxjs/testing';
import { ACTION_CSR_SIGN_IN, ACTION_CSR_SIGN_IN_FULFILLED, ACTION_CSR_SIGN_IN_REJECTED } from '../actions/csr-auth-actions';
import { csrSignInEpic } from './csr-auth-epic';
import { throwError } from 'rxjs';
import { RealDate, mockDate} from '../../utils/mock-date';

/**
 * Validates RxJS epics marbel testing
 * 
 * @see {@link https://medium.com/@bencabanes/marble-testing-observable-introduction-1f5ad39231c}
 * @see {@link https://rxjs-dev.firebaseapp.com/guide/testing/marble-testing}
 * @see {@link https://stackoverflow.com/questions/57804709/rxjs-how-to-expect-an-observable-to-throw-error}
 */
describe('Validate auth epics', () => {
  /**
   * Verify fetch auth token and write to localStorage
   */
  test('Success: test epic fetched auth token and save localStorage', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      // two objects are equal on ajax fake response
      expect(actual).toStrictEqual(expected);
    });

    testScheduler.run(({ hot, cold, expectObservable }) => {
      global.Date = mockDate('2019-11-20T00:00:00.000Z');

      const action$ = hot('-a', {
        a: {
          type: ACTION_CSR_SIGN_IN,
          payload: {
            partner_id: 'test-user',
            password: 'pass123',
          }
        }
      });
      const state$ = null;
      const dependencies = {
        ajax: request => cold('--a', {
          a: {
            response: {
              token: "sample_token",
              username: "jsmith@boingo.com",
            }
          }
        }),
        Date: Date,
      };

      const output$ = csrSignInEpic(action$, state$, dependencies);

      // verify equality using testScheduler
      expectObservable(output$).toBe('---a', { // success after frame 3
        a: {
          type: ACTION_CSR_SIGN_IN_FULFILLED,
          payload: {
            expired: new Date(), // mocked date
            response: {
              token: "sample_token",
              username: "jsmith@boingo.com",
            }
          }
        }
      });

      global.Date = RealDate;
    });

    // verify local storage here since we need to wait for execution to be finished
    testScheduler.run(props => {
      // verify token written to local storage by epic
      expect(JSON.parse(localStorage.getItem('csr-jwt'))).toStrictEqual({
        token: 'sample_token',
        username: 'jsmith@boingo.com'
      });

      // clear localStorage
      localStorage.removeItem('csr-jwt');
      localStorage.removeItem('csr-jwt-expired');
    });
  });

  /**
   * Verify fetch failed with invalid credentials
   */
  test('Failure: test epic with bad credentials', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
      // two objects are equal on ajax fake response
      expect(actual).toStrictEqual(expected);
    });

    testScheduler.run(({ hot, cold, expectObservable }) => {
      const action$ = hot('-a', {
        a: {
          type: ACTION_CSR_SIGN_IN,
          payload: {
            partner_id: 'test-user',
            password: 'pass123',
          }
        }
      });
      const state$ = null;
      const dependencies = {
        ajax: request => throwError({
          xhr: {
            response: {
              code:'104',
              message: "username/password not accepted",
            }
          }
        })
      };

      const output$ = csrSignInEpic(action$, state$, dependencies);

      expectObservable(output$).toBe('-a', { // terminate early hence frame 1
        a: {
          type: ACTION_CSR_SIGN_IN_REJECTED,
          payload: {
            xhr: {
              response: {
                code:'104',
                message: "username/password not accepted",
              }
            }
          },
          error: true,
        }
      });
    });
  });
});