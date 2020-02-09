import React from 'react';
import CsrDrawer from './CsrDrawer';
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router';
import { createMemoryHistory } from 'history'
import { SITECORE_URL, STUB_EPIC } from '../../settings';

/**
 * Validates sign-in page with form validation using enzyme and jest
 * 
 * @see {@link https://jestjs.io/docs/en/tutorial-react}
 * @see {@link https://remarkablemark.org/blog/2018/11/17/mock-window-location/}
 */
describe('Validate csr drawer functionality', () => {
  const { location } = window;

  /**
   * Mock window.location
   */
  beforeAll(() => {
    delete window.location;
    window.location = { reload: jest.fn() };
  });

  /**
   * Restore window.location
   */
  afterAll(() => {
    window.location = location;
  });

  it('Success: verify toggle drawer (open) dispatches action', () => {
    const mockStore = configureStore();
    const store = mockStore({
      csrAuthReducer: {
        csr_auth: {
          token: "sample_token",
          username: "jsmith@boingo.com",
        }
      },
      csrSettingsReducer: {
        csr_settings_drawer_close: true,
      }
    });

    let location;
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/search']}>
          <CsrDrawer  history={history} match={{
            params: {
              page_name: 'search',
              customer_id: null,
              tab_name: null,
              subtab_name: null
            }}} />
        </MemoryRouter>
      </Provider>
    );

    const toggleDrawer = wrapper.find('[name="toggleDrawer"]').first();

    // simulate logout
    toggleDrawer.simulate('click');

    // validate action has been sent
    expect(store.getActions()).toEqual([{
      type: 'ACTION_CSR_SETTINGS_DRAWER_CLOSE',
      payload: false,
    }]);

    // unmount to clear memory
    wrapper.unmount();
  });

  it('Success: verify logout dispatches action and redirects', () => {
    const mockStore = configureStore();
    const store = mockStore({
      csrAuthReducer: {
        csr_auth: {
          token: "sample_token",
          username: "jsmith@boingo.com",
        }
      }
    });
    const history = createMemoryHistory();

    // set location to search
    history.push('/search');
    expect(history.location.pathname).toBe('/search');

    let location;
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/search']}>
          <CsrDrawer  history={history} match={{
            params: {
              page_name: 'search',
              customer_id: null,
              tab_name: null,
              subtab_name: null
            }}} />
          <Route path="*" render={({ history }) => location=history.location.pathname} />
        </MemoryRouter>
      </Provider>
    );

    const logout = wrapper.find('[name="logout"]').first();

    // simulate logout
    logout.simulate('click');

    // validate user redirects to oath logout link if not in stub mode
    // if (!STUB_EPIC) {
    //   expect(window.location.href).toBe(`${SITECORE_URL}/csr/logout`);
    // }

    // validate action has been sent
    expect(store.getActions()).toEqual([{
      type: 'ACTION_CSR_SIGN_OUT',
    }]);

    // validate path redirect to sign-in
    expect(history.location.pathname).toBe('/');

    // unmount to clear memory
    wrapper.unmount();
  });

  it('Success: verify dark switch dispatches action', () => {
    const mockStore = configureStore();
    const store = mockStore({
      csrAuthReducer: {
        csr_auth: {
          token: "sample_token",
          username: "jsmith@boingo.com",
        }
      },
      csrSettingsReducer: {
        csr_settings_dark_mode_auto: false,
        csr_settings_dark_mode: false,
      }
    });
    const history = createMemoryHistory();

    // set location to search
    history.push('/search');
    expect(history.location.pathname).toBe('/search');

    let location;
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/search']}>
          <CsrDrawer  history={history} match={{
            params: {
              page_name: 'search',
              customer_id: null,
              tab_name: null,
              subtab_name: null
            }}} />
          <Route path="*" render={({ history }) => location=history.location.pathname} />
        </MemoryRouter>
      </Provider>
    );

    const darkSwitch = wrapper.find('[name="darkSwitch"]').first();

    // simulate logout
    darkSwitch.find('input').simulate('change');

    expect(store.getActions()).toEqual([{
      type: 'ACTION_CSR_SETTINGS_DARK_MODE',
      payload: true,
    }]);

    // unmount to clear memory
    wrapper.unmount();
  });

  it('Success: verify dark (auto) checkbox dispatches action', () => {
    const mockStore = configureStore();
    const store = mockStore({
      csrAuthReducer: {
        csr_auth: {
          token: "sample_token",
          username: "jsmith@boingo.com",
        }
      },
      csrSettingsReducer: {
        csr_settings_dark_mode_auto: false,
        csr_settings_dark_mode: false,
      }
    });
    const history = createMemoryHistory();

    // set location to search
    history.push('/search');
    expect(history.location.pathname).toBe('/search');

    let location;
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/search']}>
          <CsrDrawer  history={history} match={{
            params: {
              page_name: 'search',
              customer_id: null,
              tab_name: null,
              subtab_name: null
            }}} />
          <Route path="*" render={({ history }) => location=history.location.pathname} />
        </MemoryRouter>
      </Provider>
    );

    const darkCheckbox = wrapper.find('[name="darkCheckbox"]').first();

    // simulate logout
    darkCheckbox.find('input').simulate('change');

    expect(store.getActions()).toEqual([{
      type: 'ACTION_CSR_SETTINGS_DARK_MODE_AUTO',
      payload: {
        auto: true,
        dark: false,
      },
    }]);

    // unmount to clear memory
    wrapper.unmount();
  });
});