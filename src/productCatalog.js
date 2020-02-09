// internet___basic_extra_blz -> internet___basic_std_exp
// internet___extra -> internet___standard
// internet___blazing -> internet___expanded
const rawProductCatalog = {
  "Name": "mccpen",
  "Room": {
    "pages": {
      "internet_sales": ["internet___basic_extra_blz"],
      "additional_devices": ["device"],
      "tv_add_ons": ["basic_tv", "core_tv", "starz", "movies"],
      "checkout": ["duration"]
    },
    "options": {
      "internet___basic_extra_blz": {
        "requires": {},
        "choices": {
          "internet___basic": {
            "1_day": {
              "product_codes": ["DL_Basic_Broadband_Internet_[1_Day]"],
              "price": "0.00",
              "duration": "1_day",
              "currency_symbol": "$",
              "ga_category": "Internet",
              "ga_variant": "1 Day"
            },
            "1_week": {
              "product_codes": ["DL_Basic_Broadband_Internet_[1_Week]"],
              "price": "0.00",
              "duration": "1_week",
              "currency_symbol": "$",
              "ga_category": "Internet",
              "ga_variant": "1 Week"
            },
            "1_month": {
              "product_codes": ["DL_Basic_Broadband_Internet_[1_Month]"],
              "price": "0.00",
              "duration": "1_month",
              "currency_symbol": "$",
              "ga_category": "Internet",
              "ga_variant": "1 Month"
            }
          },
          "internet___extra": {
            "1_day": {
              "product_codes": ["DL_Extra_Broadband_Internet_[1_Day_4.99]"],
              "price": "4.99",
              "duration": "1_day",
              "currency_symbol": "$",
              "ga_category": "Internet",
              "ga_variant": "1 Day"
            },
            "1_week": {
              "product_codes": ["DL_Extra_Broadband_Internet_[1_Week_11.99]"],
              "price": "11.99",
              "duration": "1_week",
              "currency_symbol": "$",
              "ga_category": "Internet",
              "ga_variant": "1 Week"
            },
            "monthly": {
              "product_codes": ["DL_Extra_Broadband_Internet_[1_Month_Recurring_34.99]"],
              "price": "34.99",
              "duration": "monthly",
              "currency_symbol": "$",
              "ga_category": "Internet",
              "ga_variant": "1 Month Recurring"
            }
          },
          "internet___blazing": {
            "1_day": {
              "product_codes": ["DL_Blazing_Broadband_Internet_MCCS_[1_Day_9.99]"],
              "price": "9.99",
              "duration": "1_day",
              "currency_symbol": "$",
              "ga_category": "Internet",
              "ga_variant": "1 Day"
            },
            "1_week": {
              "product_codes": ["DL_Blazing_Broadband_Internet_MCCS_[1_Week_22.99]"],
              "price": "22.99",
              "duration": "1_week",
              "currency_symbol": "$",
              "ga_category": "Internet",
              "ga_variant": "1 Week"
            },
            "monthly": {
              "product_codes": ["DL_Blazing_Broadband_Internet_[1_Month_Recurring_54.99]"],
              "price": "54.99",
              "duration": "monthly",
              "currency_symbol": "$",
              "ga_category": "Internet",
              "ga_variant": "1 Month"
            }
          }
        }
      },
      "device": {
        "requires": {
          "internet___basic_std_exp": ["internet___standard", "internet___expanded"]
        },
        "choices": {
          "device___1": {
            "monthly": {
              "product_codes": ["DL_Broadband_Additional_Device_[1_Month_Recurring]"],
              "price": "10.00",
              "duration": "monthly",
              "currency_symbol": "$",
              "ga_category": "Additional_Device",
              "ga_variant": "1 Month Recurring"
            }
          },
          "device___2": {
            "monthly": {
              "product_codes": ["DL_Broadband_Additional_Device_[1_Month_Recurring]", "DL_Broadband_Additional_Device_[1_Month_Recurring]"],
              "price": "20.00",
              "duration": "monthly",
              "currency_symbol": "$",
              "ga_category": "Additional_Device",
              "ga_variant": "1 Month Recurring"
            }
          }
        }
      },
      "basic_tv": {
        "requires": {
          "internet___basic_std_exp": ["internet___expanded", "internet___standard"]
        },
        "choices": {
          "basic_tv___yes": {
            "1_day": {
              "product_codes": ["DL_Basic_TV_[1_Day]"],
              "price": "0.00",
              "duration": "1_day",
              "currency_symbol": "$",
              "ga_category": "TV",
              "ga_variant": "1 Day"
            },
            "1_week": {
              "product_codes": ["DL_Basic_TV_[1_Week]"],
              "price": "0.00",
              "duration": "1_week",
              "currency_symbol": "$",
              "ga_category": "TV",
              "ga_variant": "1 Month Recurring"
            },
            "monthly": {
              "product_codes": ["DL_Basic_TV_[1_Month_Recurring]"],
              "price": "0.00",
              "duration": "monthly",
              "currency_symbol": "$",
              "ga_category": "TV",
              "ga_variant": "1 Month Recurring"
            },
            "1_month": {
              "product_codes": ["DL_Basic_TV_[1_Month]"],
              "price": "0.00",
              "duration": "1_month",
              "currency_symbol": "$",
              "ga_category": "TV",
              "ga_variant": "1 Month"
            }
          }
        }
      },
      "core_tv": {
        "requires": {
          "internet___basic_std_exp": ["internet___expanded", "internet___standard"]
        },
        "choices": {
          "core_tv___yes": {
            "monthly": {
              "product_codes": ["DL_Core_TV_[1_Month_Recurring]"],
              "price": "19.95",
              "duration": "monthly",
              "currency_symbol": "$",
              "ga_category": "TV",
              "ga_variant": "1 Month Recurring"
            }
          }
        }
      },
      "starz": {
        "requires": {
          "core_tv": ["core_tv___yes"]
        },
        "choices": {
          "starz___yes": {
            "monthly": {
              "product_codes": ["DL_Starz_[1_Month_Recurring_14.95_USD]"],
              "price": "14.95",
              "duration": "monthly",
              "currency_symbol": "$",
              "ga_category": "Add-On",
              "ga_variant": "1 Month Recurring"
            }
          }
        }
      },
      "movies": {
        "requires": {
          "core_tv": ["core_tv___yes"]
        },
        "choices": {
          "movies___yes": {
            "monthly": {
              "product_codes": ["DL_Movies_[1_Month_Recurring]"],
              "price": "5.00",
              "duration": "monthly",
              "currency_symbol": "$",
              "ga_category": "Add-On",
              "ga_variant": "1 Month Recurring"
            }
          }
        }
      },
      "duration": {
        "requires": {},
        "choices": {
          "1_day": {
            "1_day": {
              "product_codes": [""],
              "price": "0.00",
              "duration": "1_day",
              "currency_symbol": "$",
              "ga_category": "",
              "ga_variant": ""
            }
          },
          "1_week": {
            "1_week": {
              "product_codes": [""],
              "price": "0.00",
              "duration": "1_week",
              "currency_symbol": "$",
              "ga_category": "",
              "ga_variant": ""
            }
          },
          "1_month": {
            "1_month": {
              "product_codes": [""],
              "price": "0.00",
              "duration": "1_month",
              "currency_symbol": "$",
              "ga_category": "",
              "ga_variant": ""
            }
          },
          "monthly": {
            "monthly": {
              "product_codes": [""],
              "price": "0.00",
              "duration": "monthly",
              "currency_symbol": "$",
              "ga_category": "",
              "ga_variant": ""
            }
          }
        }
      }
    },
    "config_settings": [{
      "checkout_settings_based_on_internet_options": {
        "internet___basic": {
          "hideCCOnFree": false,
          "showPromoCodeField": false
        },
        "internet___extra": {
          "hideCCOnFree": true,
          "showPromoCodeField": false
        },
        "internet___blazing": {
          "hideCCOnFree": true,
          "showPromoCodeField": true
        }
      }
    }]
  }
};

// reconcile product name differences
export const productCatalog = JSON.parse(
  JSON.stringify(rawProductCatalog)
    .replace(/"internet___basic_extra_blz"/g, '"internet___basic_std_exp"')
    .replace(/"internet___extra"/g, '"internet___standard"')
    .replace(/"internet___blazing"/g, '"internet___expanded"')
);