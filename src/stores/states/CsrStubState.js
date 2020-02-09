/**
 * Stubbing system used for off-line function validation and local smoke testing
 * This can be leverage for development of new functions to replay specific test scenarios
 */
export const CsrStubState =
{
  csrAuthReducer: {
    csr_cred: {
      partner_id: 'partner_id_here',
      password: 'some_password_here'
    },
    csr_auth: {
      token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXJ0bmVyX2lkIjoiYm9pbmdvLXNpdGVjb3JlLWNzciIsImlkZW50aXR5X2lkIjoidXMtd2VzdC0yOjgxMGQ1MjJhLTAwNDMtNGQ1NC05MjZjLWQwZjczNWJhZTU0YyIsInRva2VuIjoiZXlKcmFXUWlPaUoxY3kxM1pYTjBMVEl4SWl3aWRIbHdJam9pU2xkVElpd2lZV3huSWpvaVVsTTFNVElpZlEuZXlKemRXSWlPaUoxY3kxM1pYTjBMVEk2T0RFd1pEVXlNbUV0TURBME15MDBaRFUwTFRreU5tTXRaREJtTnpNMVltRmxOVFJqSWl3aVlYVmtJam9pZFhNdGQyVnpkQzB5T2pNMVpUY3dZakZsTFdZd016WXRORGRtWVMwNFpEQXlMVEl4Wm1ZMVpqRmhNbU16TmlJc0ltRnRjaUk2V3lKaGRYUm9aVzUwYVdOaGRHVmtJaXdpWW05cGJtZHZYMkZ3YVNJc0ltSnZhVzVuYjE5aGNHazZkWE10ZDJWemRDMHlPak0xWlRjd1lqRmxMV1l3TXpZdE5EZG1ZUzA0WkRBeUxUSXhabVkxWmpGaE1tTXpOanBpYjJsdVoyOHRjMmwwWldOdmNtVXRZM055SWwwc0ltbHpjeUk2SW1oMGRIQnpPaTh2WTI5bmJtbDBieTFwWkdWdWRHbDBlUzVoYldGNmIyNWhkM011WTI5dElpd2laWGh3SWpveE5UWTROakV3T1RJeExDSnBZWFFpT2pFMU5qZzFNalExTWpGOS5hcVVFVzczcjZ3MU1oRy1iNHQzSnl4ZWFyUW9MTm5HMkRBSHJoeHdiaE8yeThHelhtdG1DUmZiV3NLM2FuUUxyZlNxYXJNb2lqdFFFZHZTUUZTOVFhWGtPUEJIV1NXRkVWVTlhTHE3REdiOVozTVMzVXJmUXJ3bnpWUnhoNjNHTV9fQ0U1Ry1oa1Bld3hTSzVVQTRjUDFtQ1ZRTTVpMGhCRC1oZ3RBNmprQ1kwbjRGTTFjSXpjNjVSYVJKWlhreC03REdmem5rMjEzSmdWcU12WjJGVUJlTVlwd0xsMzNRaWNpVXFnZFlxNDBQRUpnY2FmaXRCM1dPNDFKWFlPU29xV29oaWdpZVZaN0JZTTJjY0V3YVZ3eWRIOTh6Zk5yano0ZkYwM3RXWEdOb2lmRmtLTzZlTVczeHZURlphd2U1RkZNTy1oR1pTUXprQ2FpaTlKTE9oekEiLCJpYXQiOjE1Njg1MjQ1MjF9.iCfa2WwjpKgSCE-3szkTZB7oDlR6C3_Gl7Ty608HuEsjICCMOQG9sQ2RAjOtR1TKgVtSMS2lQVtY0WxoH9QKSe8v5u03ZiM9z6FDZL0dQdeVYsuj9eycrgCbblGCakXuc6d76QH7nq8URiVDQVI2Gojl0RPyYkS3qv21tkc0CNfIVAoUDHAxxwIvRONO9ccZThqtHSaWJGWFbaddYEdcfBvmYoM2zOMTHgfAhcPGaex4tjqMhKSUx-2A5Vk0Tz_2LAMeYXe7FJsM10NwRnURwESevbyqq_RTEAO2Hgw1pfopw449DXfEpAsMXEUzX1XWES5wGpbgaxzzOXyFl1kcBg",
      username: "stub@boingo.com",
    },
    csr_auth_requesting: false,
    csr_auth_error: null
  },
  csrCustomerReducer: {
    csr_customer: {
      username: 'nc052019',
      email: 'nc052019@test.boingo.com',
      locale: 'en_US',
      currency: 'USD',
      products: [
        {
          startDate: '2019-10-27T00:00:00Z',
          product_code: 'DL_Movies_[1_Month_Recurring]'
        },
        {
          startDate: '2019-10-27T00:00:00Z',
          product_code: 'DL_Starz_[1_Month_Recurring_14.95_USD]'
        },
        {
          startDate: '2019-10-27T00:00:00Z',
          product_code: 'DL_Broadband_Additional_Device_[1_Month_Recurring]'
        },
        {
          startDate: '2019-10-27T00:00:00Z',
          product_code: 'DL_Blazing_Broadband_Internet_[1_Month_Recurring_54.99]'
        },
        {
          startDate: '2019-10-27T00:00:00Z',
          product_code: 'DL_Core_TV_[1_Month_Recurring]'
        },
        {
          startDate: '2019-10-27T00:00:00Z',
          product_code: 'DL_Basic_TV_[1_Month_Recurring]'
        }
      ],
      customer_id: 5869095090,
      first_name: 'n',
      last_name: 'c',
      phone_number: '1-310-586-5180',
      mailing_address: {
        mailing_address_line_1: '10960 Wilshire Blvd',
        mailing_address_line_2: 'Suite 2300',
        mailing_city: 'Los Angeles',
        mailing_postal_code: '90024-3809',
        mailing_state: 'CA',
        mailing_country: 'US'
      },
      base_address: {
        base: 'Camp Pendleton',
        area: 'Area 13',
        building: '1397',
        room: '123'
      },
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
      next_billing_amount: '114.89',
      last_billing_amount: '3.05',
      next_billing_date: '2019-11-27T00:00:00Z',
      created_date: '2019-10-18T21:01:26Z',
      product_codes: [
        'DL_Broadband_Additional_Device_[1_Month_Recurring]',
        'DL_Broadband_Additional_Device_[1_Month_Recurring]',
        'DL_Blazing_Broadband_Internet_[1_Month_Recurring_54.99]',
        'DL_Movies_[1_Month_Recurring]',
        'DL_Core_TV_[1_Month_Recurring]',
        'DL_Starz_[1_Month_Recurring_14.95_USD]',
        'DL_Basic_TV_[1_Month_Recurring]'
      ],
      purchased_deals: [
        {
          name: 'Movies [1 Month Recurring]',
          products: [
            {
              name: 'Movies [1 Month]',
              startDate: '2019-10-27T00:00:00Z'
            }
          ]
        },
        {
          name: 'Starz [1 Month Recurring 14.95 USD]',
          products: [
            {
              name: 'Starz [14.95 1 Month]',
              startDate: '2019-10-27T00:00:00Z'
            }
          ]
        },
        {
          name: 'Broadband Additional Device [1 Month Recurring]',
          products: [
            {
              name: 'Broadband Additional Device',
              startDate: '2019-10-27T00:00:00Z'
            },
            {
              name: 'Broadband Additional Device',
              startDate: '2019-10-27T00:00:00Z'
            }
          ]
        },
        {
          name: 'Blazing Broadband Internet [1 Month Recurring 54.99]',
          products: [
            {
              name: 'Blazing Broadband Internet [1 Month Recurring 54.99]',
              startDate: '2019-10-27T00:00:00Z'
            }
          ]
        },
        {
          name: 'Core TV [1 Month Recurring]',
          products: [
            {
              name: 'Core TV [1 Month]',
              startDate: '2019-10-27T00:00:00Z'
            }
          ]
        },
        {
          name: 'Basic TV [1 Month Recurring]',
          products: [
            {
              name: 'Basic TV',
              startDate: '2019-10-27T00:00:00Z'
            }
          ]
        }
      ],
      deferred_actions: [
        {
          id: 5879845196,
          opcode: 900542,
          type: 'Plan Change to PL_Boingo_AsYouGo_[USD]_-_No_Signup_Charges',
          status: 'Status Pending',
          action_date: '2019-09-17T00:00:00Z'
        }
      ],
      bdom: '2019-11-27T00:00:00Z',
      scc: 'BRDMCCPEN001',
      send_email_receipt: true,
      email_opt_in: true,
      sms_opt_in: false,
      status: 'ACTIVE',
      venue_id: '1405298',
      plan_type: 'BROADBAND',
      offer_set: 'bundle_set=bundles&offer_set='
    },
    csr_customer_venue_name: 'Camp Pendleton',
    csr_customer_requesting: null,
    csr_customer_error: null
  },
  csrDevicesReducer: {
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
        {
          mac: '48-21-EB-F2-21-42',
          name: 'Samsung 4K HDR',
          type: '',
          model: 'TV',
          mac_randomized: false,
          created_date: '2019-10-06T05:35:58Z'
        },
        {
          mac: '00-00-00-00-00-00',
          name: 'stub',
          type: '',
          model: 'Tablet',
          mac_randomized: false,
          created_date: '2019-10-06T05:55:27Z'
        }
      ],
      plan_type_device_limit: 4,
      current_device_limit: 4
    },
    csr_devices_requesting: null,
    csr_devices_error: null
  },
  csrNotesReducer: {
    csr_notes: {
      notes: [
        {
          note: 'hello',
          user: 'nc51619121',
          date: '2019-09-09T00:39:10Z'
        },
        {
          note: 'orange\nand blue',
          user: 'nc51619121',
          date: '2019-09-03T16:03:50Z'
        },
        {
          note: 'green',
          user: 'nc51619121',
          date: '2019-08-29T20:03:26Z'
        },
        {
          note: 'yellow',
          user: 'nc51619121',
          date: '2019-08-29T20:01:31Z'
        },
        {
          note: 't2',
          user: 'nc51619121',
          date: '2019-08-29T20:00:52Z'
        },
        {
          note: 't1',
          user: 'nc51619121',
          date: '2019-08-29T19:52:31Z'
        },
        {
          note: 'why',
          user: 'nc51619121',
          date: '2019-08-29T19:37:52Z'
        },
        {
          note: 'hello',
          user: 'nc51619121',
          date: '2019-08-29T19:37:39Z'
        }
      ]
    },
    csr_notes_requesting: null,
    csr_notes_error: null
  },
  csrSearchReducer: {
    csr_search_page_index: 0,
    csr_search_page_size: 12,
    csr_search: {
      results: [
        {
          customer_id: 5869095090,
          username: 'nc052019',
          email: 'nc052019@test.boingo.com',
          first_name: 'n',
          last_name: 'c',
          postal_code: '90024',
          country: 'US',
          status: 'ACTIVE',
          payment_type: 'CC',
          currency: 'USD'
        },
        {
          customer_id: 5868782781,
          username: 'nc51619121',
          email: 'nc5161912@test.boingo.com',
          first_name: 'n',
          last_name: 'c',
          postal_code: '90024',
          country: 'US',
          status: 'ACTIVE',
          payment_type: 'CC',
          currency: 'USD'
        },
        {
          customer_id: 5868778388,
          username: 'nc51619123',
          email: 'nc5161912@test.boingo.com',
          first_name: 'n',
          last_name: 'c',
          postal_code: '90024',
          country: 'US',
          status: 'ACTIVE',
          payment_type: 'CC',
          currency: 'USD'
        },
        {
          customer_id: 5868778929,
          username: 'nc5161911',
          email: 'nc51619@test.boingo.com',
          first_name: 'n',
          last_name: 'c',
          postal_code: '90024',
          country: 'US',
          status: 'ACTIVE',
          payment_type: 'CC',
          currency: 'USD'
        },
        {
          customer_id: 5868780763,
          username: 'nc5161902',
          email: 'nc516190@test.boingo.com',
          first_name: 'n',
          last_name: 'c',
          postal_code: '90024',
          country: 'US',
          status: 'ACTIVE',
          payment_type: 'CC',
          currency: 'USD'
        },
        {
          customer_id: 5868781126,
          username: 'nc5161901',
          email: 'nc51619@test.boingo.com',
          first_name: 'n',
          last_name: 'c',
          postal_code: '90024',
          country: 'US',
          status: 'ACTIVE',
          payment_type: 'CC',
          currency: 'USD'
        },
        {
          customer_id: 5868784477,
          username: 'nc516190',
          email: 'nc51619@test.boingo.com',
          first_name: 'n',
          last_name: 'c',
          postal_code: '90024',
          country: 'US',
          status: 'ACTIVE',
          payment_type: 'CC',
          currency: 'USD'
        },
        {
          customer_id: 5868785148,
          username: 'nc516199',
          email: 'nc51619@test.boingo.com',
          first_name: 'n',
          last_name: 'c',
          postal_code: '90024',
          country: 'US',
          status: 'ACTIVE',
          payment_type: 'CC',
          currency: 'USD'
        },
        {
          customer_id: 5868781211,
          username: 'nc516197',
          email: 'nc51619@test.boingo.com',
          first_name: 'n',
          last_name: 'c',
          postal_code: '90024',
          country: 'US',
          status: 'ACTIVE',
          payment_type: 'CC',
          currency: 'USD'
        },
        {
          customer_id: 5868778475,
          username: 'nc516196',
          email: 'nc51619@test.boingo.com',
          first_name: 'n',
          last_name: 'c',
          postal_code: '90024',
          country: 'US',
          status: 'ACTIVE',
          payment_type: 'CC',
          currency: 'USD'
        },
        {
          customer_id: 5868784062,
          username: 'nc516195',
          email: 'nc51619@test.boingo.com',
          first_name: 'n',
          last_name: 'c',
          postal_code: '90024',
          country: 'US',
          status: 'ACTIVE',
          payment_type: 'CC',
          currency: 'USD'
        },
        {
          customer_id: 5868773750,
          username: 'nc516194',
          email: 'nc51619@test.boingo.com',
          first_name: 'n',
          last_name: 'c',
          postal_code: '90024',
          country: 'US',
          status: 'ACTIVE',
          payment_type: 'CC',
          currency: 'USD'
        }
      ],
      total: 23,
      page: 1
    },
    csr_search_requesting: null,
    csr_search_requested: {
      first_name: 'n',
      last_name: 'c'
    },
    csr_search_error: null
  },
  csrDeferredActionsReducer: {
    csr_deferred_actions: {
      customer_id: 5869095090,
      deferred_actions: [
        {
          status: 'PENDING',
          action_id: 5879845196,
          action_name: 'PLANDOWNGRADE',
          description: 'SSG Change Plan',
          scheduled_time: '2019-09-17T00:00:00Z',
          created_date: '2019-09-15T07:41:57Z',
          updated_date: '2019-09-15T07:41:57Z'
        }
      ]
    },
    csr_deferred_actions_requesting: null,
    csr_deferred_actions_error: null
  },
  csrChangePlansReducer: {
    // internet___basic_extra_blz -> internet___basic_std_exp
    // internet___extra -> internet___standard
    // internet___blazing -> internet___expanded
    csr_product_catalog: {
      Name: 'mccpen',
      Room: {
        pages: {
          internet_sales: [
            'internet___basic_extra_blz'
          ],
          additional_devices: [
            'device'
          ],
          tv_add_ons: [
            'basic_tv',
            'core_tv',
            'starz',
            'movies'
          ],
          checkout: [
            'duration'
          ]
        },
        options: {
          internet___basic_extra_blz: {
            requires: {},
            choices: {
              internet___basic: {
                '1_day': {
                  product_codes: [
                    'DL_Basic_Broadband_Internet_[1_Day]'
                  ],
                  price: '0.00',
                  duration: '1_day',
                  currency_symbol: '$',
                  ga_category: 'Internet',
                  ga_variant: '1 Day'
                },
                '1_week': {
                  product_codes: [
                    'DL_Basic_Broadband_Internet_[1_Week]'
                  ],
                  price: '0.00',
                  duration: '1_week',
                  currency_symbol: '$',
                  ga_category: 'Internet',
                  ga_variant: '1 Week'
                },
                '1_month': {
                  product_codes: [
                    'DL_Basic_Broadband_Internet_[1_Month]'
                  ],
                  price: '0.00',
                  duration: '1_month',
                  currency_symbol: '$',
                  ga_category: 'Internet',
                  ga_variant: '1 Month'
                }
              },
              internet___extra: {
                '1_day': {
                  product_codes: [
                    'DL_Extra_Broadband_Internet_[1_Day_4.99]'
                  ],
                  price: '4.99',
                  duration: '1_day',
                  currency_symbol: '$',
                  ga_category: 'Internet',
                  ga_variant: '1 Day'
                },
                '1_week': {
                  product_codes: [
                    'DL_Extra_Broadband_Internet_[1_Week_11.99]'
                  ],
                  price: '11.99',
                  duration: '1_week',
                  currency_symbol: '$',
                  ga_category: 'Internet',
                  ga_variant: '1 Week'
                },
                monthly: {
                  product_codes: [
                    'DL_Extra_Broadband_Internet_[1_Month_Recurring_34.99]'
                  ],
                  price: '34.99',
                  duration: 'monthly',
                  currency_symbol: '$',
                  ga_category: 'Internet',
                  ga_variant: '1 Month Recurring'
                }
              },
              internet___blazing: {
                '1_day': {
                  product_codes: [
                    'DL_Blazing_Broadband_Internet_MCCS_[1_Day_9.99]'
                  ],
                  price: '9.99',
                  duration: '1_day',
                  currency_symbol: '$',
                  ga_category: 'Internet',
                  ga_variant: '1 Day'
                },
                '1_week': {
                  product_codes: [
                    'DL_Blazing_Broadband_Internet_MCCS_[1_Week_22.99]'
                  ],
                  price: '22.99',
                  duration: '1_week',
                  currency_symbol: '$',
                  ga_category: 'Internet',
                  ga_variant: '1 Week'
                },
                monthly: {
                  product_codes: [
                    'DL_Blazing_Broadband_Internet_[1_Month_Recurring_54.99]'
                  ],
                  price: '54.99',
                  duration: 'monthly',
                  currency_symbol: '$',
                  ga_category: 'Internet',
                  ga_variant: '1 Month'
                }
              }
            }
          },
          device: {
            requires: {
              internet___basic_std_exp: [
                'internet___standard',
                'internet___expanded'
              ]
            },
            choices: {
              device___1: {
                monthly: {
                  product_codes: [
                    'DL_Broadband_Additional_Device_[1_Month_Recurring]'
                  ],
                  price: '10.00',
                  duration: 'monthly',
                  currency_symbol: '$',
                  ga_category: 'Additional_Device',
                  ga_variant: '1 Month Recurring'
                }
              },
              device___2: {
                monthly: {
                  product_codes: [
                    'DL_Broadband_Additional_Device_[1_Month_Recurring]',
                    'DL_Broadband_Additional_Device_[1_Month_Recurring]'
                  ],
                  price: '20.00',
                  duration: 'monthly',
                  currency_symbol: '$',
                  ga_category: 'Additional_Device',
                  ga_variant: '1 Month Recurring'
                }
              }
            }
          },
          basic_tv: {
            requires: {
              internet___basic_std_exp: [
                'internet___expanded',
                'internet___standard'
              ]
            },
            choices: {
              basic_tv___yes: {
                '1_day': {
                  product_codes: [
                    'DL_Basic_TV_[1_Day]'
                  ],
                  price: '0.00',
                  duration: '1_day',
                  currency_symbol: '$',
                  ga_category: 'TV',
                  ga_variant: '1 Day'
                },
                '1_week': {
                  product_codes: [
                    'DL_Basic_TV_[1_Week]'
                  ],
                  price: '0.00',
                  duration: '1_week',
                  currency_symbol: '$',
                  ga_category: 'TV',
                  ga_variant: '1 Month Recurring'
                },
                monthly: {
                  product_codes: [
                    'DL_Basic_TV_[1_Month_Recurring]'
                  ],
                  price: '0.00',
                  duration: 'monthly',
                  currency_symbol: '$',
                  ga_category: 'TV',
                  ga_variant: '1 Month Recurring'
                },
                '1_month': {
                  product_codes: [
                    'DL_Basic_TV_[1_Month]'
                  ],
                  price: '0.00',
                  duration: '1_month',
                  currency_symbol: '$',
                  ga_category: 'TV',
                  ga_variant: '1 Month'
                }
              }
            }
          },
          core_tv: {
            requires: {
              internet___basic_std_exp: [
                'internet___expanded',
                'internet___standard'
              ]
            },
            choices: {
              core_tv___yes: {
                monthly: {
                  product_codes: [
                    'DL_Core_TV_[1_Month_Recurring]'
                  ],
                  price: '19.95',
                  duration: 'monthly',
                  currency_symbol: '$',
                  ga_category: 'TV',
                  ga_variant: '1 Month Recurring'
                }
              }
            }
          },
          starz: {
            requires: {
              core_tv: [
                'core_tv___yes'
              ]
            },
            choices: {
              starz___yes: {
                monthly: {
                  product_codes: [
                    'DL_Starz_[1_Month_Recurring_14.95_USD]'
                  ],
                  price: '14.95',
                  duration: 'monthly',
                  currency_symbol: '$',
                  ga_category: 'Add-On',
                  ga_variant: '1 Month Recurring'
                }
              }
            }
          },
          movies: {
            requires: {
              core_tv: [
                'core_tv___yes'
              ]
            },
            choices: {
              movies___yes: {
                monthly: {
                  product_codes: [
                    'DL_Movies_[1_Month_Recurring]'
                  ],
                  price: '5.00',
                  duration: 'monthly',
                  currency_symbol: '$',
                  ga_category: 'Add-On',
                  ga_variant: '1 Month Recurring'
                }
              }
            }
          },
          duration: {
            requires: {},
            choices: {
              '1_day': {
                '1_day': {
                  product_codes: [
                    ''
                  ],
                  price: '0.00',
                  duration: '1_day',
                  currency_symbol: '$',
                  ga_category: '',
                  ga_variant: ''
                }
              },
              '1_week': {
                '1_week': {
                  product_codes: [
                    ''
                  ],
                  price: '0.00',
                  duration: '1_week',
                  currency_symbol: '$',
                  ga_category: '',
                  ga_variant: ''
                }
              },
              '1_month': {
                '1_month': {
                  product_codes: [
                    ''
                  ],
                  price: '0.00',
                  duration: '1_month',
                  currency_symbol: '$',
                  ga_category: '',
                  ga_variant: ''
                }
              },
              monthly: {
                monthly: {
                  product_codes: [
                    ''
                  ],
                  price: '0.00',
                  duration: 'monthly',
                  currency_symbol: '$',
                  ga_category: '',
                  ga_variant: ''
                }
              }
            }
          }
        },
        config_settings: [
          {
            checkout_settings_based_on_internet_options: {
              internet___basic: {
                hideCCOnFree: false,
                showPromoCodeField: false
              },
              internet___extra: {
                hideCCOnFree: true,
                showPromoCodeField: false
              },
              internet___blazing: {
                hideCCOnFree: true,
                showPromoCodeField: true
              }
            }
          }
        ]
      }
    },
    csr_product_catalog_requesting: null,
    csr_product_catalog_error: null,
    csr_update_products: {
      product_codes: [
        'DL_Basic_TV_[1_Month_Recurring]',
        'DL_Movies_[1_Month_Recurring]',
        'DL_Core_TV_[1_Month_Recurring]',
        'DL_Starz_[1_Month_Recurring_14.95_USD]',
        'DL_Broadband_Additional_Device_[1_Month_Recurring]',
        'DL_Broadband_Additional_Device_[1_Month_Recurring]',
        'DL_Blazing_Broadband_Internet_[1_Month_Recurring_54.99]'
      ],
      revenue_collected: 0,
      revenue_pending: 0
    },
    csr_update_products_requesting: null,
    csr_update_products_error: null,
    csr_update_products_customer_id: 5869095090,
  },
}