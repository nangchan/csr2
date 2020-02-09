import React from 'react';
import { CsrLayoutTestable } from './CsrLayout';
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router';
import { Provider } from 'react-redux';
import { RealDate, mockDate} from '../../utils/mock-date';

/**
 * Validates sign-in page with form validation using enzyme and jest
 */
describe('Validate csr layout page functionality', () => {
  it('Success: verify close drawer dispatches action', () => {
    const mockStore = configureStore()
    const store = mockStore({snackbarReducer:{}})

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <CsrLayoutTestable width="lg" />
        </MemoryRouter>
      </Provider>
    );

    const toggleDrawer = wrapper.find('button[aria-label="open drawer"]');
    toggleDrawer.simulate('click');

    // validate action has been sent
    expect(store.getActions()).toEqual([{
      type: 'ACTION_CSR_SETTINGS_DRAWER_CLOSE',
      payload: true,
    }]);

    // unmount to clear memory
    wrapper.unmount();
  });

  test('Success: verify url with token dispatches action', () => {
    const mockStore = configureStore();
    const store = mockStore({snackbarReducer:{}})

    global.Date = mockDate('2019-11-20T00:00:00.000Z');

    // set query string through memory router
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{pathname: '/', search: '?token=sample_token&username=jsmith@boingo.com'}]}>
          <CsrLayoutTestable width="lg" />
        </MemoryRouter>
      </Provider>
    );

    // validate action has been sent
    expect(store.getActions()).toEqual([{
      type: 'ACTION_CSR_SIGN_IN_FROM_CACHE',
      payload: {
        save: true,
        expired: new Date(),
        response: {
          token: "sample_token",
          username: "jsmith@boingo.com",
        }
      },
    }]);

    // unmount to clear memory
    wrapper.unmount();

    global.Date = RealDate;
  });

  describe('Success: verify local storage with token dispatches action', () => {
    beforeEach(() => {
      // mock global date object
      global.Date = mockDate('2019-11-20T00:00:00.000Z');

      // set local storage
      localStorage.setItem('csr-jwt', JSON.stringify({
        token: 'sample_token',
        username: "jsmith@boingo.com",
      }));

      // set local storage
      localStorage.setItem('csr-jwt-expired', new Date());
    });

    afterEach(() => {
      // restore global date object
      global.Date = RealDate;

      // clear local storage for proceeding tests
      localStorage.removeItem('csr-jwt');
      localStorage.removeItem('csr-jwt-expired');

    });

    test('local storage test', () => {
      const mockStore = configureStore();
      const store = mockStore({snackbarReducer:{}})

      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <CsrLayoutTestable width="lg" />
          </MemoryRouter>
        </Provider>
      );

      // validate action has been sent
      expect(store.getActions()).toEqual([{
        type: 'ACTION_CSR_SIGN_IN_FROM_CACHE',
        payload: {
          save: false,
          expired: new Date(),
          response: {
            token: "sample_token",
            username: "jsmith@boingo.com",
          },
        },
      }]);

      // unmount to clear memory
      wrapper.unmount();
    });
  });

  test('Success: verify redirect on unauth', () => {
    const mockStore = configureStore();
    const store = mockStore({snackbarReducer:{}})

    let location;
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/notfound']}>
          <CsrLayoutTestable width="lg" />
          <Route path="*" render={({ history }) => location=history.location.pathname} />
        </MemoryRouter>
      </Provider>
    );

    expect(location).toBe('/');

    // unmount to clear memory
    wrapper.unmount();
  });
});