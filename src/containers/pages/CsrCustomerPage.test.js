import React from 'react';
import CsrCustomerPage from './CsrCustomerPage';
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router';

/**
 * Validates sign-in page with form validation using enzyme and jest
 * 
 * @see {@link https://jestjs.io/docs/en/tutorial-react}
 */
describe('Validate csr customer page functionality', () => {
  it('Success: verify url (with customer id) dispatches action', () => {
    const mockStore = configureStore();
    const store = mockStore({
      csrAuthReducer: {
        csr_auth: {
          token: "sample_token",
          username: "jsmith@boingo.com",
        }
      },
    });

    let location;
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/customer/5869095090/account']}>
          <Route path="/customer/:customer_id/:tab_name" component={CsrCustomerPage} />
        </MemoryRouter>
      </Provider>
    );

    expect(store.getActions()).toStrictEqual([
      {
        type: 'ACTION_CSR_FETCH_CUSTOMER',
        payload: {
          token: 'sample_token',
          customer_id: '5869095090'
        }
      },
      {
        type: 'ACTION_CSR_FETCH_DEVICES',
        payload: {
          token: 'sample_token',
          customer_id: '5869095090'
        }
      },
      {
        type: 'ACTION_CSR_FETCH_NOTES',
        payload: {
          token: 'sample_token',
          customer_id: '5869095090'
        }
      }
    ]);

    // unmount to clear memory
    wrapper.unmount();
  });
});
