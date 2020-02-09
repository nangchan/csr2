import React from 'react';
import CsrSignInPage from './CsrSignInPage';
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router';
import { Provider } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { SITECORE_URL, AUTH_TOKEN_EXPIRATION_DURATION } from '../../settings';

// https://create-react-app.dev/docs/debugging-tests
// https://artsy.github.io/blog/2018/08/24/How-to-debug-jest-tests/
// https://create-react-app.dev/docs/running-tests
// https://devhints.io/enzyme
// https://airbnb.io/enzyme/docs/api/ReactWrapper/find.html
//
// For intellisense add package @types/jest and file jsconifg.json
//
// To debug Create-React-App tests:
//  1. Run "Debug CRA Tests"
//  2. Either wait or run open chrome://about:inspect and click "Open dedicated DevTools for Node"
//
// To run an individual test:
//  1. yarn test CsrSignInPage.test.js
//
// To print out component or element for debugging:
//  console.log(wrapper.find('a[name="login_to_ad"]').debug());
//  console.log(wrapper.find('a[name="login_to_ad"]').html());

/**
 * Validates sign-in page with form validation using enzyme and jest
 */
describe('Validate csr sign-in page functionality', () => {
  it('Failure: form fields are being validated', () => {
    const mockStore = configureStore()
    const store = mockStore({})

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <CsrSignInPage />
        </MemoryRouter>
      </Provider>
    );

    const submit = wrapper.find('button[type="submit"]').first();

    // submit empty form
    submit.simulate('submit');

    // check error validation works
    expect(wrapper.find(TextField).filter('[name="partner_id"]').prop('error')).toBe(true);
    expect(wrapper.find(TextField).filter('[name="password"]').prop('error')).toBe(true);

    // check for validation errors
    expect(wrapper.find('[error=true]').first()).toHaveLength(1);

    // multiple ways to perform selection
    //console.log(wrapper.find('[name="password"][helperText="Required"]').first().props());
    //console.log(wrapper.find({ name: 'password', helperText: 'Required', }).first().props());

    // validate error message shows up
    expect(wrapper.find('[name="partner_id"] .MuiFormHelperText-root').text()).toBe('Required');
    expect(wrapper.find('[name="password"] .MuiFormHelperText-root').text()).toBe('Required');

    // unmount to clear memory
    wrapper.unmount();
  });

  it('Success: form submit dispatches action', () => {
    const mockStore = configureStore()
    const store = mockStore({})

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <CsrSignInPage />
        </MemoryRouter>
      </Provider>
    );

    // set partner_id and password
    const partner_id = wrapper.find('input[name="partner_id"]').first();
    partner_id.simulate('change', {target: {value: 'csr-partner'}});

    const password = wrapper.find('input[name="password"]').first();
    password.simulate('change', {target: {value: 'secret'}});

    // submit valid form
    const submit = wrapper.find('button[type="submit"]').first();
    submit.simulate('submit');

    // check for no validation errors
    expect(wrapper.find('[error=true]').first()).toHaveLength(0);

    // validate action has been sent
    expect(store.getActions()).toEqual([{
      type: 'ACTION_CSR_SIGN_IN',
      payload: {
        partner_id: 'csr-partner',
        password: 'secret'
      }
    }]);

    // unmount to clear memory
    wrapper.unmount();
  });

  it('Success: verify redirect on auth', () => {
    const mockStore = configureStore();
    const store = mockStore({
      csrAuthReducer: {
        csr_auth: {
          token: "sample_token",
          username: "jsmith@boingo.com",
        },
        csr_auth_expired: new Date(new Date().getTime() + AUTH_TOKEN_EXPIRATION_DURATION),
      }
    });

    let location;
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <CsrSignInPage />
          <Route path="*" render={({ history }) => location=history.location.pathname} />
        </MemoryRouter>
      </Provider>
    );

    expect(location).toBe('/search');

    // unmount to clear memory
    wrapper.unmount();
  })

  test('Success: verify login to AD button on page', () => {
    const mockStore = configureStore();
    const store = mockStore({});

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <CsrSignInPage />
        </MemoryRouter>
      </Provider>
    );

    // verify that url points to autentication page
    expect(wrapper.find('a[name="login_to_ad"]').prop('href')).toBe(`${SITECORE_URL}/csr/authentication?redirect_back=1`);

    // unmount to clear memory
    wrapper.unmount();
  })
});