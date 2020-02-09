import React from 'react';
import { act } from 'react-dom/test-utils';
import CsrAccountCreatePage from './CsrAccountCreatePage';
import configureStore from 'redux-mock-store'
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router';
import { Provider } from 'react-redux';
import { DEBOUNCE_TIMEOUT } from '../../settings';
import BoingoTheme from '../../styles/BoingoTheme';
import { ThemeProvider } from '@material-ui/styles';

const retailProducts = {
  'Boingo Day Pass': {
    USD: [
      {
        Name: 'Boingo Day Pass 695 USD',
        Id: '7ab845fe-2ceb-45d1-9a93-47c886443843',
        AccountType: {
          Name: 'DayPass',
          Id: 'cb7ce953-df63-4bb6-89ef-c8d91ebcc03c'
        },
        Currency: {
          Name: 'USD',
          Id: '8326976c-d2b1-408e-b195-704d4db8597f'
        },
        DowngradeProduct: '00000000-0000-0000-0000-000000000000',
        UpgradeProduct: '00000000-0000-0000-0000-000000000000',
        GaCategory: 'DayPass',
        IsNewUnlimited: false,
        ProductCode: 'PL_Boingo_Day_Pass_[6.95_USD]',
        ProductPrice: '6,95',
        DescriptionBulletText: '<ul>\n    <li>High-speed Wi-Fi access for 24 hours</li>\n    <li>Over 1 million hotspots worldwide</li>\n    <li>Connect up to four devices</li>\n</ul>',
        DescriptionLine2: '',
        DescriptionLine4: '',
        SignUpAfterPriceText: '',
        SignupPageBody: '&nbsp;',
        SignupPageHeading: 'Boingo Day Pass',
        SelfcareDescription: 'Enjoy Boingo Wi-Fi anywhere in the world for 24 consecutive hours on up to 4 devices.',
        SelfcareTitle: 'Boingo Day Pass'
      },
    ]
  }
};

const broadbandBases = {
  "afacdy": {
    "Cadet Area": [
      "2348",
      "2354",
      "2360"
    ],
    "Prep School": [
      "5210",
      "5212",
      "5214",
      "5216"
    ]
  },
  "afbark": {
    "Primary": [
      "4261",
      "4263",
      "4351",
      "4640",
      "4650",
      "4660",
      "4664"
    ]
  }
};

/**
 * Dispatch action on successful form submit
 */
describe('Validate Csr Account Create page functionality', () => {
  beforeAll(()=>{
    // use fake timer for debounce (eg. FfmTextField/FfmSelect/useDebounce)
    jest.useFakeTimers();
  });

  afterAll(()=>{
    // restore back to real timers
    jest.useRealTimers();
  });

  // Retail account creation
  it('Success: form submit for retail customer dispatches action', async () => {
    const mockStore = configureStore()
    const store = mockStore({
      csrAuthReducer: {
        csr_auth: {
          token: "sample_token",
          username: "jsmith@boingo.com",
        }
      },
      csrAccountCreateReducer: {
        csr_fetch_sitecore_products_data: retailProducts, 
        csr_fetch_sitecore_broadband_base_data: true
      }
    });
  
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/create-account']}>
          <CsrAccountCreatePage />
        </MemoryRouter>
      </Provider>
    );
    
    // set form values
    const customer_type = wrapper.find('select[name="customer_type"]').first();
    customer_type.simulate('change', {target: {name: 'customer_type', value: 'retail'}});

    const retail_plan_type = wrapper.find('select[name="retail_plan_type"]').first();

    retail_plan_type.simulate('change', {target: {name: 'retail_plan_type', value: 'Boingo Day Pass'}});

    const currency = wrapper.find('select[name="currency"]').first();
    currency.simulate('change', {target: {name: 'currency', value: 'USD'}});

    const retail_product = wrapper.find('select[name="product_code"]').first();
    retail_product.simulate('change', {target: {name: 'product_code', value: 'PL_Boingo_Day_Pass_[6.95_USD]'}});

    const username = wrapper.find('input[name="username"]').first();
    username.simulate('change', {target: {name: 'username', value: 'bwqatest'}});    

    const email = wrapper.find('input[name="email"]').first();
    email.simulate('change', {target: {name: 'email', value: 'a@b.com'}});

    const password = wrapper.find('input[name="password"]').first();
    password.simulate('change', {target: {name: 'password', value: 'password'}});

    const first_name = wrapper.find('input[name="first_name"]').first();
    first_name.simulate('change', {target: {name: 'first_name', value: 'To'}});

    const last_name = wrapper.find('input[name="last_name"]').first();
    last_name.simulate('change', {target: {name: 'last_name', value: 'Bunny'}});

    const credit_card_number = wrapper.find('input[name="payment_cc.credit_card_number"]').first();
    credit_card_number.simulate('change', {target: {name: 'payment_cc.credit_card_number', value: '4111111111111111'}});

    const exp_month = wrapper.find('select[name="exp_month"]').first();
    exp_month.simulate('change', {target: {name: 'exp_month', value: '4'}});

    const exp_year = wrapper.find('select[name="exp_year"]').first();
    exp_year.simulate('change', {target: {name: 'exp_year', value: '2099'}});

    const cvv2 = wrapper.find('input[name="cvv2"]').first();
    cvv2.simulate('change', {target: {name: 'cvv2', value: '123'}});

    const country = wrapper.find('select[name="country"]').first();
    country.simulate('change', {target: {name: 'country', value: 'US'}});

    const postal_code = wrapper.find('input[name="postal_code"]').first();
    postal_code.simulate('change', {target: {name: 'postal_code', value: '90024'}});

    const locale =  wrapper.find('select[name="locale"]').first();
    locale.simulate('change', {target: {name: 'locale', value: 'en_US'}});

    // wrap in act to encapsulate React state update
    act(()=>{
      // advance by debounce timeout
      jest.advanceTimersByTime(DEBOUNCE_TIMEOUT);
      // manually update wrapper state
      wrapper.update();
    });

    const form = {
      customer_type: wrapper.find('select[name="customer_type"]').first().props().value,
      retail_plan_type: wrapper.find('select[name="retail_plan_type"]').first().props().value,
      currency: wrapper.find('select[name="currency"]').first().props().value,
      retail_product: wrapper.find('select[name="product_code"]').first().props().value,
      username: wrapper.find('input[name="username"]').first().props().defaultValue,
      email: wrapper.find('input[name="email"]').first().props().defaultValue,
      password: wrapper.find('input[name="password"]').first().props().defaultValue,
      first_name: wrapper.find('input[name="first_name"]').first().props().defaultValue,
      last_name: wrapper.find('input[name="last_name"]').first().props().defaultValue,
      payment_cc: {
        credit_card_number: wrapper.find('input[name="payment_cc.credit_card_number"]').first().props().defaultValue,
        credit_card_expiration: wrapper.find('input[name="payment_cc.credit_card_expiration"]').first().props().value,
      },
      cvv2: wrapper.find('input[name="cvv2"]').first().props().defaultValue,
      country: wrapper.find('select[name="country"]').first().props().value,
      postal_code: wrapper.find('input[name="postal_code"]').first().props().defaultValue,
      locale: wrapper.find('select[name="locale"]').first().props().value,
    }

    expect(form).toStrictEqual({
      customer_type: 'retail',
      retail_plan_type: 'Boingo Day Pass',
      currency: 'USD',
      retail_product: 'PL_Boingo_Day_Pass_[6.95_USD]',
      username: 'bwqatest',
      email: 'a@b.com',
      password: 'password',
      first_name: 'To',
      last_name: 'Bunny',
      payment_cc: {
        credit_card_number: '4111111111111111',
        credit_card_expiration: '0499',
      },
      cvv2: '123',
      country: 'US',
      postal_code: '90024',
      locale: 'en_US',
    });

    const submit = wrapper.find('button[type="submit"]').first();

    // handle async submit handler
    await act(async ()=>{
      submit.simulate('submit');
    });

    // wrap in act to encapsulate React state update
    act(()=>{
      // advance by debounce timeout
      jest.advanceTimersByTime(DEBOUNCE_TIMEOUT);
      // manually update wrapper state
      wrapper.update();
    });

    expect(wrapper.find('[error=true]').first()).toHaveLength(0);
    
    // validate dispatch has correct data
    expect(store.getActions()).toStrictEqual([{
      type: 'ACTION_CSR_ACCOUNT_CREATE',
      payload: {
        token: 'sample_token',
        request: {
          "country": "US",
          "locale": "en_US",
          "customer_type": "retail",
          "payment_cc": {
            "credit_card_expiration": "0499",
            "credit_card_number": "4111111111111111"
          },
          "retail_plan_type": "Boingo Day Pass",
          "currency": "USD",
          "product_code": "PL_Boingo_Day_Pass_[6.95_USD]",
          "username": "bwqatest",
          "email": "a@b.com",
          "password": "password",
          "first_name": "To",
          "last_name": "Bunny",
          "cvv2": "123",
          "postal_code": "90024",
          "exp_month": "4",
          "exp_year": "2099",
        }
      }   
    }]);

    wrapper.unmount();
   });

   // Broadband account creation
   it('Success: form submit for broadband customer dispatches action', async () => {
    const mockStore = configureStore()
    const store = mockStore({
      csrAuthReducer: {
        csr_auth: {
          token: "sample_token",
          username: "jsmith@boingo.com",
        }
      },
      csrAccountCreateReducer: {
        csr_fetch_sitecore_products_data: true,
        csr_fetch_sitecore_broadband_base_data: broadbandBases,
      }
    });

    const theme = BoingoTheme(); 
  
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/create-account']}>
          <ThemeProvider theme={theme}>
            <CsrAccountCreatePage />
          </ThemeProvider>
        </MemoryRouter>
      </Provider>
    );
    
    // set form values
    const customer_type = wrapper.find('select[name="customer_type"]').first();
    customer_type.simulate('change', {target: {name: 'customer_type', value: 'broadband'}});

    // select location:

    const base = wrapper.find('select[name="base"]').first();
    base.simulate('change', {target: {name: 'base', value: 'Camp Pendleton'}});

    const area = wrapper.find('select[name="area"]').first();
    area.simulate('change', {target: {name: 'area', value: 'Area 13'}});

    const building = wrapper.find('select[name="building"]').first();
    building.simulate('change', {target: {name: 'building', value: '1396'}});

    const room =  wrapper.find('input[name="room"]').first();
    room.simulate('change', {target: {name: 'room', value: '123'}})

    // select plan options:

    const internet___basic_std_exp =  wrapper.find('input[value="internet___standard"]').first();
    internet___basic_std_exp.simulate('change', {target: {name: 'internet___basic_std_exp', value: 'internet___standard', checked: true}})

    const basic_tv =  wrapper.find('input[name="basic_tv"]').first();
    basic_tv.simulate('change', {target: {name: 'basic_tv', value: 'basic_tv___yes', checked: true}})

    // fill out customer info:

    const username = wrapper.find('input[name="username"]').first();
    username.simulate('change', {target: {name: 'username', value: 'bwqatest'}}); 

    const email = wrapper.find('input[name="email"]').first();
    email.simulate('change', {target: {name: 'email', value: 'a@b.com'}});

    const password = wrapper.find('input[name="password"]').first();
    password.simulate('change', {target: {name: 'password', value: 'password'}});

    const first_name = wrapper.find('input[name="first_name"]').first();
    first_name.simulate('change', {target: {name: 'first_name', value: 'To'}});

    const last_name = wrapper.find('input[name="last_name"]').first();
    last_name.simulate('change', {target: {name: 'last_name', value: 'Bunny'}});

    const credit_card_number = wrapper.find('input[name="payment_cc.credit_card_number"]').first();
    credit_card_number.simulate('change', {target: {name: 'payment_cc.credit_card_number', value: '4111111111111111'}});

    const exp_month = wrapper.find('select[name="exp_month"]').first();
    exp_month.simulate('change', {target: {name: 'exp_month', value: '4'}});

    const exp_year = wrapper.find('select[name="exp_year"]').first();
    exp_year.simulate('change', {target: {name: 'exp_year', value: '2099'}});

    const cvv2 = wrapper.find('input[name="cvv2"]').first();
    cvv2.simulate('change', {target: {name: 'cvv2', value: '123'}});

    const country = wrapper.find('select[name="country"]').first();
    country.simulate('change', {target: {name: 'country', value: 'US'}});

    const postal_code = wrapper.find('input[name="postal_code"]').first();
    postal_code.simulate('change', {target: {name: 'postal_code', value: '90024'}});

    const locale =  wrapper.find('select[name="locale"]').first();
    locale.simulate('change', {target: {name: 'locale', value: 'en_US'}});

    // wrap in act to encapsulate React state update
    act(()=>{
      // advance by debounce timeout
      jest.advanceTimersByTime(DEBOUNCE_TIMEOUT);
      // manually update wrapper state
      wrapper.update();
    });

    const form = {
      customer_type: wrapper.find('select[name="customer_type"]').first().props().value,
      base_address: {
        base: wrapper.find('select[name="base"]').first().props().value,
        area: wrapper.find('select[name="area"]').first().props().value,
        building: wrapper.find('select[name="building"]').first().props().value, 
        room: wrapper.find('input[name="room"]').first().props().value, 
      },      
      username: wrapper.find('input[name="username"]').first().props().defaultValue,
      email: wrapper.find('input[name="email"]').first().props().defaultValue,
      password: wrapper.find('input[name="password"]').first().props().defaultValue,
      first_name: wrapper.find('input[name="first_name"]').first().props().defaultValue,
      last_name: wrapper.find('input[name="last_name"]').first().props().defaultValue,
      payment_cc: {
        credit_card_number: wrapper.find('input[name="payment_cc.credit_card_number"]').first().props().defaultValue,
        credit_card_expiration: wrapper.find('input[name="payment_cc.credit_card_expiration"]').first().props().value,
      },
      cvv2: wrapper.find('input[name="cvv2"]').first().props().defaultValue,
      country: wrapper.find('select[name="country"]').first().props().value,
      postal_code: wrapper.find('input[name="postal_code"]').first().props().defaultValue,
      locale: wrapper.find('select[name="locale"]').first().props().value,
    }

    expect(wrapper.find('[error=true]').first()).toHaveLength(0);

    expect(form).toStrictEqual({
      customer_type: 'broadband',
      base_address: {
        base: 'Camp Pendleton',
        area: 'Area 13',
        building: '1396',
        room: '123',
      },
      username: 'bwqatest',
      email: 'a@b.com',
      password: 'password',
      first_name: 'To',
      last_name: 'Bunny',
      payment_cc: {
        credit_card_number: '4111111111111111',
        credit_card_expiration: '0499',
      },
      cvv2: '123',
      country: 'US',
      postal_code: '90024',
      locale: 'en_US',
    });

    const submit = wrapper.find('button[type="submit"]').first();

    // handle async submit handler
    await act(async ()=>{
      submit.simulate('submit');
    });

    // // wrap in act to encapsulate React state update
    act(()=>{
      // advance by debounce timeout
      jest.advanceTimersByTime(DEBOUNCE_TIMEOUT);
      // manually update wrapper state
      wrapper.update();
    });
    
    // // validate dispatch has correct data
    expect(store.getActions()).toStrictEqual([{
      type: 'ACTION_CSR_ACCOUNT_CREATE',
      payload: {
        token: 'sample_token',
        request: {
          base_address: {
            base: 'Camp Pendleton',
            area: 'Area 13',
            building: '1396',
            room: '123',
          },
          country: 'US',
          customer_type: 'broadband',
          cvv2: '123',
          email: 'a@b.com',
          first_name: 'To',
          last_name: 'Bunny',
          locale: 'en_US',
          password: 'password',
          payment_cc: {
            credit_card_number: '4111111111111111',
            credit_card_expiration: '0499',
          },
          product_code: [
            'DL_Extra_Broadband_Internet_[1_Month_Recurring_34.99]',
            'DL_Basic_TV_[1_Month_Recurring]',
          ],
          postal_code: '90024',          
          username: 'bwqatest',
          exp_month: '4',
          exp_year: '2099',
        }
      }
    }]);

    wrapper.unmount();
   });

   // Gratis account creation

});