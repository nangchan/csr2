import React from 'react';
import { act } from 'react-dom/test-utils';
import CsrDevicesSubPage, { MaterialTableToolbar, materialTableOnEditActions } from './CsrDevicesSubPage';
import configureStore from 'redux-mock-store'
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router';
import { deviceUpdateAction } from '../../stores/actions/csr-devices-actions';
import { DEBOUNCE_TIMEOUT } from '../../settings';

/**
 * Devices data used for unit/integration tests
 */
const devicesState = {
  csr_devices: {
    devices: [
      {
        mac: '48-21-EB-F2-21-40',
        name: 'XBox One',
        type: '',
        model: 'Gaming',
        mac_randomized: false,
        created_date: '2019-09-29T22:12:47Z'
      },
      {
        mac: '73-57-23-12-AF-2F',
        name: 'Pixel 3 XL',
        type: '',
        model: 'Smart Device',
        mac_randomized: true,
        created_date: '2019-10-01T17:16:47Z'
      },
    ],
    plan_type_device_limit: 3,
    current_device_limit: 3
  },
  csr_devices_requesting: null,
  csr_devices_error: null
};

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
 * Validates devices page with form validation using enzyme and jest
 * 
 * @see {@link https://jestjs.io/docs/en/tutorial-react}
 */
describe('Validate csr devices page functionality', () => {
  beforeAll(()=>{
    // use fake timer for debounce (eg. FfmTextField/FfmSelect/useDebounce)
    jest.useFakeTimers();
  });

  afterAll(()=>{
    // restore back to real timers
    jest.useRealTimers();
  });

  /**
   * Verify integration with material-table and test basic functionality
   */
  describe('Success: verify devices table renders and can be updated', () => {
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
        csrDevicesReducer: devicesState,
      });

      wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/customer/5869095090/devices']}>
            <Route path="/customer/:customer_id/devices" component={CsrDevicesSubPage} />
          </MemoryRouter>
        </Provider>
      );
    });

    afterAll(()=>{
      // unmount to clear memory
      wrapper.unmount();
    });

    it('verify table data from Redux state', ()=>{
      // validate sample row
      expect(wrapper.find('MTableCell[value="Other"]').first()).toHaveLength(1); // type
      expect(wrapper.find('MTableCell[value="Pixel 3 XL"]').first()).toHaveLength(1); // name
      expect(wrapper.find('MTableCell[value="73-57-23-12-AF-2F"]').first()).toHaveLength(1); // mac address
      expect(wrapper.find('MTableCell[value=true]').first()).toHaveLength(1); // mac randomized
      expect(wrapper.find('MTableCell[value="2019-10-01T17:16:47Z"]').first()).toHaveLength(1); // date added
      expect(wrapper.find('MTableCell[value="Included"]').first()).toHaveLength(1); // Cost
    });

    it('verify table editable', ()=>{
      // validate form validation
      const editButton = wrapper.find('button[title="Edit"]').first();
      editButton.simulate('click');

      const modelInput = wrapper.find('select[name="model"]').first();
      const nameInput = wrapper.find('input[name="name"]').first();

      modelInput.simulate('change', {target:{value:'Smart Phone'}});
      nameInput.simulate('change', {target:{value:'OnePlus7'}});

      // wrap in act to encapsulate React state update
      act(()=>{
        // advance by debounce timeout
        jest.advanceTimersByTime(DEBOUNCE_TIMEOUT);
        // manually update wrapper state
        wrapper.update();
      });

      // verify form updated
      expect(wrapper.find('select[name="model"]').first().props().value).toBe('Smart Phone');
      expect(wrapper.find('input[name="name"]').first().props().defaultValue).toBe('OnePlus7');

      //console.log(wrapper.find('MTableActions').at(0).html())
    });
  });

  /**
   * Verify custom toolbar
   */
  it('Success: verify toolbar', () => {
    const mockStore = configureStore();
    const store = mockStore({
      csrAuthReducer: {
        csr_auth: {
          token: "sample_token",
          username: "jsmith@boingo.com",
        }
      },
      csrDevicesReducer: devicesState,
    });

    const Toolbar = MaterialTableToolbar(store.getState().csrDevicesReducer.csr_devices);

    const wrapper = shallow(
      <Toolbar />
    );

    expect(wrapper.find('[label="Device Limit: 2/3"]').first()).toHaveLength(1);
    expect(wrapper.find('[label="Purchase 1 Additional: $10"]').first()).toHaveLength(1);
    expect(wrapper.find('[label="Purchase 2 Additional: $20"]').first()).toHaveLength(1);

    // unmount to clear memory
    wrapper.unmount();
  });

  /**
   * Verify dispatch actions on editable table
   */
  describe('Success: verify edit device dispatches action', () => {
    let store, mockProps, onEditActions;

    /**
     * Setup Redux state and dispatch actions
     */
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
        csrDevicesReducer: devicesState,
      });

      mockProps = {
        form: {submit: jest.fn(x=>true)},
        valid: true,
        state: {
          ...store.getState().csrAuthReducer,
          ...store.getState().csrCustomerReducer,
          ...store.getState().csrDevicesReducer,
        },
        dispatch: {
          csrUpdateDevice: (payload) => {
            store.dispatch(deviceUpdateAction(payload));
          }
        }
      };

      onEditActions = materialTableOnEditActions(mockProps);
    });

    /**
     * Validate add devices
     */
    test('verify add devices dispatches action', async ()=>{
      await onEditActions.onRowAdd({model: "Smart Device", name: "Tivo DVR", mac: "11-22-33-44-55-66"});

      // verify dispatch action
      expect(store.getActions()).toStrictEqual([{
        type: 'ACTION_CSR_ADD_DEVICE',
        payload: {
          token: 'sample_token',
          customer_id: 5869095090,
          mac: '11-22-33-44-55-66',
          body: {
            model: 'Smart Device',
            name: 'Tivo DVR',
          }
        }
      }]);
    });

    /**
     * Validate update devices
     */
    test('verify update devices dispatches action', async ()=>{
      await onEditActions.onRowUpdate(
        {model: "TV", name: "Samsung 4K", mac: "AA-BB-CC-DD-EE-FF"},
        {model: "Smart Device", name: "Tivo DVR", mac: "11-22-33-44-55-66"}
      );

      // verify no dispatch action
      expect(store.getActions()).toStrictEqual([{
        type: 'ACTION_CSR_EDIT_DEVICE',
          payload: {
            token: 'sample_token',
            customer_id: 5869095090,
            mac: 'AA-BB-CC-DD-EE-FF',
            body: {
              model: "TV",
              name: "Samsung 4K",
            }
          }
      }]);
    });

    /**
     * Validate delete devices
     */
    test('verify delete devices dispatches action', async ()=>{
      await onEditActions.onRowDelete(
        {model: "TV", name: "Samsung 4K", mac: "AA-BB-CC-DD-EE-FF"},
      );

      // verify no dispatch action
      expect(store.getActions()).toStrictEqual([{
        type: 'ACTION_CSR_DELETE_DEVICE',
          payload: {
            token: 'sample_token',
            customer_id: 5869095090,
            mac: 'AA-BB-CC-DD-EE-FF',
            body: {
              model: "TV",
              name: "Samsung 4K",
            }
          }
      }]);
    });

    /**
     * clear actions and mocked functions after each run
     */
    afterEach(()=>{
      store.clearActions();
      jest.clearAllMocks();
    });
  });

  /**
   * Verify form validaion on invalid input
   */
  describe('Failure: verify error thrown and dispatch stopped on invalid form', () => {
    let store, mockProps, onEditActions;

    /**
     * Setup Redux state and dispatch actions
     */
    beforeAll(()=>{
      const mockStore = configureStore();
      store = mockStore({
        csrAuthReducer: {
          csr_auth: {
            token: "sample_token",
            username: "jsmith@boingo.com",
          }
        },
        csrDevicesReducer: devicesState,
      });

      mockProps = {
        form: {submit: jest.fn(x=>true)},
        valid: false,
        state: store.getState().csrDevicesReducer,
        dispatch: {
          csrUpdateDevice: (payload) => {
            store.dispatch(deviceUpdateAction(payload));
          }
        }
      };

      onEditActions = materialTableOnEditActions(mockProps);
    });

    /**
     * Validate add device error on invalid input
     */
    test('verify add devices throws error', async ()=>{
      let errorThrown;

      try {
        await onEditActions.onRowAdd({model: "Smart Device", name: "Tivo DVR", mac: "11-22-33-44-55-66"});
      } catch (error) {
        errorThrown = error;
      }

      // validate error thrown
      expect(JSON.parse(errorThrown.message)).toStrictEqual({
        event: 'onRowAdd',
        error: 'hasValidationErrors'
      });

      // validate form submitted
      // @see: jest.fn(x=>true)
      expect(mockProps.form.submit.mock.results[0].value).toBeTruthy;

      // verify no dispatch action
      expect(store.getActions()).toHaveLength(0);
    });

    /**
     * Validate udpate device error on invalid input
     */
    test('verify update devices throws error', async ()=>{
      let errorThrown;

      try {
        await onEditActions.onRowUpdate(
          {model: "TV", name: "Samsung 4K", mac: "AA-BB-CC-DD-EE-FF"},
          {model: "Smart Device", name: "Tivo DVR", mac: "11-22-33-44-55-66"}
        );
      } catch (error) {
        errorThrown = error;
      }

      // validate error thrown
      expect(JSON.parse(errorThrown.message)).toStrictEqual({
        event: 'onRowUpdate',
        error: 'hasValidationErrors'
      });

      // validate form not submitted
      expect(mockProps.form.submit.mock.results).toHaveLength(0);

      // verify no dispatch action
      expect(store.getActions()).toHaveLength(0);
    });

    /**
     * clear actions and mocked functions after each run
     */
    afterEach(()=>{
      store.clearActions();
      jest.clearAllMocks();
    });
  });
});