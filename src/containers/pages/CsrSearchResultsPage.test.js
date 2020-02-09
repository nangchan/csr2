import React from 'react';
import CsrSearchResultsPage from './CsrSearchResultsPage';
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router';
import Select from '@material-ui/core/Select';

/**
 * Validates sign-in page with form validation using enzyme and jest
 * 
 * @see {@link https://jestjs.io/docs/en/tutorial-react}
 */
describe('Validate csr search results functionality', () => {
  /**
   * Test next/previous page change event
   */
  it('Success: verify search table next and previous buttons dispatched actions', () => {
    const mockStore = configureStore();
    const store = mockStore({
      csrAuthReducer: {
        csr_auth: {
          token: "sample_token",
          username: "jsmith@boingo.com",
        }
      },
      csrSearchReducer: {
        csr_search_page_index: 1,
        csr_search_page_size: 12,
        csr_search: {
          results: [
            { customer_id: 5869095090, username: 'nc052019', email: 'nc052019@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868782781, username: 'nc51619121', email: 'nc5161912@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868778388, username: 'nc51619123', email: 'nc5161912@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868778929, username: 'nc5161911', email: 'nc51619@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868780763, username: 'nc5161902', email: 'nc516190@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868781126, username: 'nc5161901', email: 'nc51619@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868784477, username: 'nc516190', email: 'nc51619@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868785148, username: 'nc516199', email: 'nc51619@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868781211, username: 'nc516197', email: 'nc51619@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868778475, username: 'nc516196', email: 'nc51619@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868784062, username: 'nc516195', email: 'nc51619@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868773750, username: 'nc516194', email: 'nc51619@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' }
          ],
          total: 36,
          page: 2
        },
        csr_search_requesting: null,
        csr_search_requested: {
          first_name: 'n',
          last_name: 'c'
        },
        csr_search_error: null
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/search']}>
          <CsrSearchResultsPage />
        </MemoryRouter>
      </Provider>
    );

    // queue next page dispatch
    const nextButton = wrapper.find('[aria-label="next page"]').first();
    nextButton.simulate('click');

    // queue previous page dispatch
    const prevButton = wrapper.find('[aria-label="previous page"]').first();
    prevButton.simulate('click');

    expect(store.getActions()).toStrictEqual([
      {
        type: 'ACTION_CSR_SEARCH',
        payload: {
          token: 'sample_token',
          page_size: 12,
          page_index: 2,
          request: {
            first_name: 'n',
            last_name: 'c',
          }
        }
      },{
        type: 'ACTION_CSR_SEARCH',
        payload: {
          token: 'sample_token',
          page_size: 12,
          page_index: 0,
          request: {
            first_name: 'n',
            last_name: 'c',
          }
        }
      }
    ]);

    // unmount to clear memory
    wrapper.unmount();
  });

  /**
   * Test page size change event
   */
  it('Success: verify search table row per page buttons dispatches action', () => {
    const mockStore = configureStore();
    const store = mockStore({
      csrAuthReducer: {
        csr_auth: {
          token: "sample_token",
          username: "jsmith@boingo.com",
        }
      },
      csrSearchReducer: {
        csr_search_page_index: 1,
        csr_search_page_size: 12,
        csr_search: {
          results: [
            { customer_id: 5869095090, username: 'nc052019', email: 'nc052019@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868782781, username: 'nc51619121', email: 'nc5161912@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868778388, username: 'nc51619123', email: 'nc5161912@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868778929, username: 'nc5161911', email: 'nc51619@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868780763, username: 'nc5161902', email: 'nc516190@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868781126, username: 'nc5161901', email: 'nc51619@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868784477, username: 'nc516190', email: 'nc51619@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868785148, username: 'nc516199', email: 'nc51619@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868781211, username: 'nc516197', email: 'nc51619@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868778475, username: 'nc516196', email: 'nc51619@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868784062, username: 'nc516195', email: 'nc51619@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' },
            { customer_id: 5868773750, username: 'nc516194', email: 'nc51619@test.boingo.com', first_name: 'n', last_name: 'c', postal_code: '90024', country: 'US', status: 'ACTIVE', payment_type: 'CC', currency: 'USD' }
          ],
          total: 23,
          page: 2
        },
        csr_search_requesting: null,
        csr_search_requested: {
          first_name: 'n',
          last_name: 'c'
        },
        csr_search_error: null
      },
    });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/search']}>
          <CsrSearchResultsPage />
        </MemoryRouter>
      </Provider>
    );

    // trigger onChange directly since the following does not work:
    // rowsPerPage.simulate('change', {target: {value: '25'}});
    const rowsPerPage = wrapper.find('[name="tablePagination"]').find(Select).first();
    rowsPerPage.props().onChange({target: {value: '25'}});

    // verify rows per page change dispatches action
    expect(store.getActions()).toStrictEqual([
      {
        type: 'ACTION_CSR_SEARCH',
        payload: {
          token: 'sample_token',
          page_size: 25,
          page_index: 0,
          request: {
            first_name: 'n',
            last_name: 'c',
          }
        }
      }
    ]);

    // unmount to clear memory
    wrapper.unmount();
  });
});