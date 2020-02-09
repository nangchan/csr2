import React from 'react';
import { act } from 'react-dom/test-utils';
import CsrAccountSubPage from './CsrAccountSubPage';
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router';
import { Provider } from 'react-redux';
import { DEBOUNCE_TIMEOUT } from '../../settings';

/**
 * Customer data used for unit/integration tests
 */
const customerState = {
  csr_customer: {
    username: 'nc052019',
    email: 'nc052019@test.boingo.com',
    locale: 'en_US',
    currency: 'USD',
    products: [
      {
        startDate: '2019-06-21T00:00:00Z',
        product_code: 'PL_Boingo_Unlimited_67_Percent_Off_First_Month_[4.98_USD_Unlimited]'
      }
    ],
    customer_id: 5869095090,
    first_name: 'John',
    last_name: 'Smith',
    phone_number: '1-310-586-5180',
    mailing_address: {
      mailing_address_line_1: '10960 Wilshire Blvd',
      mailing_address_line_2: 'Suite 2300',
      mailing_city: 'Los Angeles',
      mailing_postal_code: '90024-3809',
      mailing_state: 'CA',
      mailing_country: 'US'
    },
    base_address: {},
    payment_cc: {
      credit_card_expiration: '0120',
      postal_code: '90024',
      country: 'US',
      credit_card_type: 'CC',
      bin: '411111'
    },
    payment_star: {},
    payment_paypal: {},
    payment_type: 'CC',
    tenant_profile: {},
    credit_card_last_4: '1111',
    next_billing_amount: '14.99',
    last_billing_amount: '14.99',
    next_billing_date: '2019-12-21T00:00:00Z',
    created_date: '2019-05-21T01:43:16Z',
    product_codes: [
      'PL_Boingo_Unlimited_67_Percent_Off_First_Month_[4.98_USD_Unlimited]'
    ],
    purchased_deals: [
      {
        name: 'Boingo Unlimited 67 Percent Off First Month [4.98 USD Unlimited]',
        products: [
          {
            name: 'Boingo Unlimited 67 Percent Off First Month [4.98 USD Unlimited]',
            startDate: '2019-06-21T00:00:00Z'
          }
        ]
      }
    ],
    bdom: '2019-12-21T00:00:00Z',
    scc: 'CCGJFK001',
    send_email_receipt: false,
    email_opt_in: true,
    sms_opt_in: false,
    status: 'ACTIVE',
    venue_id: '261217',
    plan_type: 'Unlimited'
  },
  csr_customer_requesting: null,
  csr_customer_error: null
};

/**
 * Validates account subpage with form validation using enzyme and jest
 */
describe('Validate csr account subpage functionality', () => {
  beforeAll(()=>{
    // use fake timer for debounce (eg. FfmTextField/FfmSelect/useDebounce)
    jest.useFakeTimers();
  });

  afterAll(()=>{
    // restore back to real timers
    jest.useRealTimers();
  });

  /**
   * Verify account form shows data from state
   */
  it('Success: account form filled with customer state data', () => {
    const mockStore = configureStore();
    const store = mockStore({
      csrAuthReducer: {
        csr_auth: {
          token: "sample_token",
          username: "jsmith@boingo.com",
        }
      },
      csrCustomerReducer: customerState,
    });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/customer/5869095090/account']}>
          <CsrAccountSubPage/>
        </MemoryRouter>
      </Provider>
    );

    // pull form content
    const form = {
      username: wrapper.find('input[name="username"]').first().props().value,
      customer_id: wrapper.find('input[name="customer_id"]').first().props().value,
      status: wrapper.find('select[name="status"]').first().props().value,
      first_name: wrapper.find('input[name="first_name"]').first().props().defaultValue,
      last_name: wrapper.find('input[name="last_name"]').first().props().defaultValue,
      email: wrapper.find('input[name="email"]').first().props().defaultValue,
      phone_number: wrapper.find('input[name="phone_number"]').first().props().defaultValue,
      mailing_address: {
        mailing_address_line_1: wrapper.find('input[name="mailing_address.mailing_address_line_1"]').first().props().defaultValue,
        mailing_address_line_2: wrapper.find('input[name="mailing_address.mailing_address_line_2"]').first().props().defaultValue,
        mailing_city: wrapper.find('input[name="mailing_address.mailing_city"]').first().props().defaultValue,
        mailing_state: wrapper.find('select[name="mailing_address.mailing_state"]').first().props().value,
        mailing_postal_code: wrapper.find('input[name="mailing_address.mailing_postal_code"]').first().props().defaultValue,
        mailing_country: wrapper.find('input[name="mailing_address.mailing_country"]').first().props().defaultValue,
      }
    };

    // validate form contains what we put in customer state
    expect(form).toStrictEqual({
      username: 'nc052019',
      customer_id: 5869095090,
      status: 'ACTIVE',
      first_name: 'John',
      last_name: 'Smith',
      email: 'nc052019@test.boingo.com',
      phone_number: '1-310-586-5180',
      mailing_address: {
        mailing_address_line_1: '10960 Wilshire Blvd',
        mailing_address_line_2: 'Suite 2300',
        mailing_city: 'Los Angeles',
        mailing_state: 'CA',
        mailing_postal_code: '90024-3809',
        mailing_country: 'US'
      }
    });

    // unmount to clear memory
    wrapper.unmount();
  });

  /**
   * Verify account submit dispatches action
   */
  it('Success: account form submit dispatches action', () => {
    const mockStore = configureStore();
    const store = mockStore({
      csrAuthReducer: {
        csr_auth: {
          token: "sample_token",
          username: "jsmith@boingo.com",
        }
      },
      csrCustomerReducer: customerState,
    });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/customer/5869095090/account']}>
          <CsrAccountSubPage/>
        </MemoryRouter>
      </Provider>
    );

    // input form data

    const first_name = wrapper.find('input[name="first_name"]').first();
    first_name.simulate('change', {target: {value: 'Bob'}});

    const last_name = wrapper.find('input[name="last_name"]').first();
    last_name.simulate('change', {target: {value: 'Baker'}});

    const email = wrapper.find('input[name="email"]').first();
    email.simulate('change', {target: {value: 'bbaker\@boingo.com'}});

    const phone_number = wrapper.find('input[name="phone_number"]').first();
    phone_number.simulate('change', {target: {value: '1-123-123-1234'}});

    const mailing_address_line_1 = wrapper.find('input[name="mailing_address.mailing_address_line_1"]').first();
    mailing_address_line_1.simulate('change', {target: {value: '555 Random Ave.'}});

    const mailing_address_line_2 = wrapper.find('input[name="mailing_address.mailing_address_line_2"]').first();
    mailing_address_line_2.simulate('change', {target: {value: 'Apt. 476'}});

    const mailing_city = wrapper.find('input[name="mailing_address.mailing_city"]').first();
    mailing_city.simulate('change', {target: {value: 'Seattle'}});

    const mailing_state = wrapper.find('select[name="mailing_address.mailing_state"]').first();
    mailing_state.simulate('change', {target: {value: 'WA'}});

    const mailing_postal_code = wrapper.find('input[name="mailing_address.mailing_postal_code"]').first();
    mailing_postal_code.simulate('change', {target: {value: '98109'}});

    // wrap in act to encapsulate React state update
    act(()=>{
      // advance by debounce timeout
      jest.advanceTimersByTime(DEBOUNCE_TIMEOUT);
      // manually update wrapper state
      wrapper.update();
    });

    // pull form content
    const form = {
      username: wrapper.find('input[name="username"]').first().props().value,
      customer_id: wrapper.find('input[name="customer_id"]').first().props().value,
      status: wrapper.find('select[name="status"]').first().props().value,
      first_name: wrapper.find('input[name="first_name"]').first().props().defaultValue,
      last_name: wrapper.find('input[name="last_name"]').first().props().defaultValue,
      email: wrapper.find('input[name="email"]').first().props().defaultValue,
      phone_number: wrapper.find('input[name="phone_number"]').first().props().defaultValue,
      mailing_address: {
        mailing_address_line_1: wrapper.find('input[name="mailing_address.mailing_address_line_1"]').first().props().defaultValue,
        mailing_address_line_2: wrapper.find('input[name="mailing_address.mailing_address_line_2"]').first().props().defaultValue,
        mailing_city: wrapper.find('input[name="mailing_address.mailing_city"]').first().props().defaultValue,
        mailing_state: wrapper.find('select[name="mailing_address.mailing_state"]').first().props().value,
        mailing_postal_code: wrapper.find('input[name="mailing_address.mailing_postal_code"]').first().props().defaultValue,
        mailing_country: wrapper.find('input[name="mailing_address.mailing_country"]').first().props().defaultValue,
      }
    };

    // validate form updated correctly
    expect(form).toStrictEqual({
      username: 'nc052019',
      customer_id: 5869095090,
      status: 'ACTIVE',
      first_name: 'Bob',
      last_name: 'Baker',
      email: 'bbaker@boingo.com',
      phone_number: '1-123-123-1234',
      mailing_address: {
        mailing_address_line_1: '555 Random Ave.',
        mailing_address_line_2: 'Apt. 476',
        mailing_city: 'Seattle',
        mailing_state: 'WA',
        mailing_postal_code: '98109',
        mailing_country: 'US'
      }
    });

    // submit valid form
    const submit = wrapper.find('button[type="submit"]').first();
    submit.simulate('submit');

    // wrap in act to encapsulate React state update
    act(()=>{
      // advance by debounce timeout
      jest.advanceTimersByTime(DEBOUNCE_TIMEOUT);
      // manually update wrapper state
      wrapper.update();
    });

    // validate dispatch has correct data
    expect(store.getActions()).toStrictEqual([{
      type: 'ACTION_CSR_UPDATE_CUSTOMER',
      payload: {
        token: 'sample_token',
        customer_id: 5869095090,
        body: {
          username: 'nc052019',
          customer_id: 5869095090,
          status: 'ACTIVE',
          first_name: 'Bob',
          last_name: 'Baker',
          email: 'bbaker@boingo.com',
          phone_number: '1-123-123-1234',
          mailing_address: {
            mailing_address_line_1: '555 Random Ave.',
            mailing_address_line_2: 'Apt. 476',
            mailing_city: 'Seattle',
            mailing_state: 'WA',
            mailing_postal_code: '98109',
            mailing_country: 'US'
          }
        }
      }
    }]);

    // unmount to clear memory
    wrapper.unmount();
  });

  /**
   * Verify account submit international address dispatches action
   */
  it('Success: account form submit with intl address dispatches action', () => {
    const mockStore = configureStore();
    const store = mockStore({
      csrAuthReducer: {
        csr_auth: {
          token: "sample_token",
          username: "jsmith@boingo.com",
        }
      },
      csrCustomerReducer: customerState,
    });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/customer/5869095090/account']}>
          <CsrAccountSubPage/>
        </MemoryRouter>
      </Provider>
    );

    // input form data

    const first_name = wrapper.find('input[name="first_name"]').first();
    first_name.simulate('change', {target: {value: 'James'}});

    const last_name = wrapper.find('input[name="last_name"]').first();
    last_name.simulate('change', {target: {value: 'Who'}});

    const email = wrapper.find('input[name="email"]').first();
    email.simulate('change', {target: {value: 'jwho\@boingo.com'}});

    const phone_number = wrapper.find('input[name="phone_number"]').first();
    phone_number.simulate('change', {target: {value: '010-8531-3000'}});

    // update country first to turn off US validation
    const mailing_country = wrapper.find('input[name="mailing_address.mailing_country"]').first();
    mailing_country.simulate('change', {target: {value: 'CN'}});

    // onChange is delayed by debounce therefore we need to advance time
    // wrap in act to encapsulate React state update
    act(()=>{
      // advance by debounce timeout
      jest.advanceTimersByTime(DEBOUNCE_TIMEOUT);
      // manually update wrapper state
      wrapper.update();
    });

    const mailing_address_line_1 = wrapper.find('input[name="mailing_address.mailing_address_line_1"]').first();
    mailing_address_line_1.simulate('change', {target: {value: '55 Anjialou Rd'}});

    const mailing_address_line_2 = wrapper.find('input[name="mailing_address.mailing_address_line_2"]').first();
    mailing_address_line_2.simulate('change', {target: {value: ''}});

    const mailing_city = wrapper.find('input[name="mailing_address.mailing_city"]').first();
    mailing_city.simulate('change', {target: {value: 'Chaoyang District'}});

    const mailing_state = wrapper.find('input[name="mailing_address.mailing_state"]').first();
    mailing_state.simulate('change', {target: {value: 'Beijing'}});

    const mailing_postal_code = wrapper.find('input[name="mailing_address.mailing_postal_code"]').first();
    mailing_postal_code.simulate('change', {target: {value: '100600'}});

    // wrap in act to encapsulate React state update
    act(()=>{
      // advance by debounce timeout
      jest.advanceTimersByTime(DEBOUNCE_TIMEOUT);
      // manually update wrapper state
      wrapper.update();
    });

    // pull form content
    const form = {
      username: wrapper.find('input[name="username"]').first().props().value,
      customer_id: wrapper.find('input[name="customer_id"]').first().props().value,
      status: wrapper.find('select[name="status"]').first().props().value,
      first_name: wrapper.find('input[name="first_name"]').first().props().defaultValue,
      last_name: wrapper.find('input[name="last_name"]').first().props().defaultValue,
      email: wrapper.find('input[name="email"]').first().props().defaultValue,
      phone_number: wrapper.find('input[name="phone_number"]').first().props().defaultValue,
      mailing_address: {
        mailing_address_line_1: wrapper.find('input[name="mailing_address.mailing_address_line_1"]').first().props().defaultValue,
        mailing_address_line_2: wrapper.find('input[name="mailing_address.mailing_address_line_2"]').first().props().defaultValue,
        mailing_city: wrapper.find('input[name="mailing_address.mailing_city"]').first().props().defaultValue,
        mailing_state: wrapper.find('input[name="mailing_address.mailing_state"]').first().props().defaultValue,
        mailing_postal_code: wrapper.find('input[name="mailing_address.mailing_postal_code"]').first().props().defaultValue,
        mailing_country: wrapper.find('input[name="mailing_address.mailing_country"]').first().props().defaultValue,
      }
    };

    // validate form updated correctly
    expect(form).toStrictEqual({
      username: 'nc052019',
      customer_id: 5869095090,
      status: 'ACTIVE',
      first_name: 'James',
      last_name: 'Who',
      email: 'jwho@boingo.com',
      phone_number: '010-8531-3000',
      mailing_address: {
        mailing_address_line_1: '55 Anjialou Rd',
        mailing_address_line_2: '',
        mailing_city: 'Chaoyang District',
        mailing_state: 'Beijing',
        mailing_postal_code: '100600',
        mailing_country: 'CN'
      }
    });

    // submit valid form
    const submit = wrapper.find('button[type="submit"]').first();
    submit.simulate('submit');

    // wrap in act to encapsulate React state update
    act(()=>{
      // advance by debounce timeout
      jest.advanceTimersByTime(DEBOUNCE_TIMEOUT);
      // manually update wrapper state
      wrapper.update();
    });

    // validate dispatch has correct data
    expect(store.getActions()).toStrictEqual([{
      type: 'ACTION_CSR_UPDATE_CUSTOMER',
      payload: {
        token: 'sample_token',
        customer_id: 5869095090,
        body: {
          username: 'nc052019',
          customer_id: 5869095090,
          status: 'ACTIVE',
          first_name: 'James',
          last_name: 'Who',
          email: 'jwho@boingo.com',
          phone_number: '010-8531-3000',
          mailing_address: {
            mailing_address_line_1: '55 Anjialou Rd',
            mailing_city: 'Chaoyang District',
            mailing_state: 'Beijing',
            mailing_postal_code: '100600',
            mailing_country: 'CN'
          }
        }
      }
    }]);

    // unmount to clear memory
    wrapper.unmount();
  });

  /**
   * Verify account form validation and submit fails on invalid form
   */
  describe('Failure: account form validation and submit fails on invalid form', () => {
    let store, wrapper;

    beforeAll(()=>{
      const mockStore = configureStore();
      store = mockStore({
        csrAuthReducer: {
          csr_auth: {
            token: "sample_token",
            username: "jsmith@boingo.com",
          }
        },
        csrCustomerReducer: customerState,
      });

      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/customer/5869095090/account']}>
            <CsrAccountSubPage/>
          </MemoryRouter>
        </Provider>
      );
    })

    afterAll(()=>{
      // unmount to clear memory
      wrapper.unmount();
    })

    test('first_name required', ()=> {
      // blank first_name
      const first_name = wrapper.find('input[name="first_name"]').first();
      first_name.simulate('change', {target: {value: ''}});

      // wrap in act to encapsulate React state update
      act(()=>{
        // advance by debounce timeout
        jest.advanceTimersByTime(DEBOUNCE_TIMEOUT);
        // manually update wrapper state
        wrapper.update();
      });

      // submit valid form
      const submit = wrapper.find('button[type="submit"]').first();
      submit.simulate('submit');

      // validate error and helptext is Required
      expect(wrapper.find('[name="first_name"]').find('ForwardRef(FormHelperText) p').text()).toBe('Required');

      // validate dispatch blocked
      expect(store.getActions()).toHaveLength(0);
    });

    test('last_name required', ()=> {
      // blank last_name
      const last_name = wrapper.find('input[name="last_name"]').first();
      last_name.simulate('change', {target: {value: ''}});

      // wrap in act to encapsulate React state update
      act(()=>{
        // advance by debounce timeout
        jest.advanceTimersByTime(DEBOUNCE_TIMEOUT);
        // manually update wrapper state
        wrapper.update();
      });

      // submit valid form
      const submit = wrapper.find('button[type="submit"]').first();
      submit.simulate('submit');

      // validate error and helptext is Required
      expect(wrapper.find('[name="last_name"]').find('ForwardRef(FormHelperText) p').text()).toBe('Required');

      // validate dispatch blocked
      expect(store.getActions()).toHaveLength(0);
    });

    test('email required', ()=> {
      // blank email
      const email = wrapper.find('input[name="email"]').first();
      email.simulate('change', {target: {value: ''}});

      // wrap in act to encapsulate React state update
      act(()=>{
        // advance by debounce timeout
        jest.advanceTimersByTime(DEBOUNCE_TIMEOUT);
        // manually update wrapper state
        wrapper.update();
      });

      // submit valid form
      const submit = wrapper.find('button[type="submit"]').first();
      submit.simulate('submit');

      // validate error and helptext is Required
      expect(wrapper.find('[name="email"]').find('ForwardRef(FormHelperText) p').text()).toBe('Required');

      // validate dispatch blocked
      expect(store.getActions()).toHaveLength(0);
    });

    test('email valid', ()=> {
      // blank email
      const email = wrapper.find('input[name="email"]').first();
      email.simulate('change', {target: {value: 'invalid'}});

      // wrap in act to encapsulate React state update
      act(()=>{
        // advance by debounce timeout
        jest.advanceTimersByTime(DEBOUNCE_TIMEOUT);
        // manually update wrapper state
        wrapper.update();
      });

      // submit valid form
      const submit = wrapper.find('button[type="submit"]').first();
      submit.simulate('submit');

      // validate error and helptext is Required
      expect(wrapper.find('[name="email"]').find('ForwardRef(FormHelperText) p').text()).toBe('Invalid email address');

      // validate dispatch blocked
      expect(store.getActions()).toHaveLength(0);
    });

    test('phone_number not required', async ()=> {
      // blank phone_number
      const phone_number = wrapper.find('input[name="phone_number"]').first();
      phone_number.simulate('change', {target: {value: ''}});

      // wrap in act to encapsulate React state update
      act(()=>{
        // advance by debounce timeout
        jest.advanceTimersByTime(DEBOUNCE_TIMEOUT);
        // manually update wrapper state
        wrapper.update();
      });

      // submit valid form
      const submit = wrapper.find('button[type="submit"]').first();

      // wrap in act to encapsulate React state update
      await act(async()=>{
        submit.simulate('submit');
      });

      // validate error and helptext is Required
      const phone_number_error = wrapper.find('[name="phone_number"][error=true]').first();
      expect(phone_number_error).toHaveLength(0);
      //expect(wrapper.find('[name="phone_number"]').find('ForwardRef(FormHelperText) p').text()).toBe('Required');

      // validate dispatch blocked
      expect(store.getActions()).toHaveLength(0);
    });

    test('phone_number invalid', ()=> {
      // blank phone_number
      const phone_number = wrapper.find('input[name="phone_number"]').first();
      phone_number.simulate('change', {target: {value: 'abc'}});

      // wrap in act to encapsulate React state update
      act(()=>{
        // advance by debounce timeout
        jest.advanceTimersByTime(DEBOUNCE_TIMEOUT);
        // manually update wrapper state
        wrapper.update();
      });

      // submit valid form
      const submit = wrapper.find('button[type="submit"]').first();
      submit.simulate('submit');

      // validate error and helptext is Required
      const phone_number_error = wrapper.find('[name="phone_number"][error=true]').first();
      expect(phone_number_error).toHaveLength(1);
      expect(wrapper.find('[name="phone_number"]').find('ForwardRef(FormHelperText) p').text()).toBe('Enter valid US phone number (eg. 1-123-555-5555)');

      // validate dispatch blocked
      expect(store.getActions()).toHaveLength(0);
    });
  });

  /**
   * Verify submit notes dispatches action
   */
  it('Success: notes form submit dispatches action', async () => {
    const mockStore = configureStore();
    const store = mockStore({
      csrAuthReducer: {
        csr_auth: {
          token: "sample_token",
          username: "jsmith@boingo.com",
        }
      },
      csrCustomerReducer: customerState,
    });

    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/customer/5869095090/account']}>
          <CsrAccountSubPage/>
        </MemoryRouter>
      </Provider>
    );

    // input form data

    const note = wrapper.find('textarea[name="note"]').first();
    note.simulate('change', {target: {value: 'my sample note'}});

    // wrap in act to encapsulate React state update
    act(()=>{
      // advance by debounce timeout
      jest.advanceTimersByTime(DEBOUNCE_TIMEOUT);
      // manually update wrapper state
      wrapper.update();
    });

    // pull form content
    const form = {
      note: wrapper.find('textarea[name="note"]').first().props().defaultValue,
    };

    // validate form updated correctly
    expect(form).toStrictEqual({
      note: 'my sample note',
    });

    // submit valid form
    const submit = wrapper.find('button[type="submit"][name="noteSubmit"]').first();

    // wrap in act to encapsulate React state update
    await act(async()=>{
      submit.simulate('submit');
    });

    // validate dispatch has correct data
    expect(store.getActions()).toStrictEqual([{
      type: 'ACTION_CSR_ADD_NOTE',
      payload: {
        token: 'sample_token',
        customer_id: 5869095090,
        body: {
          note: 'my sample note',
          user: 'jsmith@boingo.com',
        }
      }
    }]);

    // unmount to clear memory
    wrapper.unmount();
  });
});
