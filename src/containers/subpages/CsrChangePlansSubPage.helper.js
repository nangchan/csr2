import React from 'react';
import PropTypes from 'prop-types';

import { BROADBAND_PRODUCTS } from '../../constants/broadband-products.const';

const choiceName = {
  internet___basic: 'Basic Internet',
  internet___standard: 'Extra Internet',
  internet___expanded: 'Blazing Internet',
  device___1: '1 Additional Devices	',
  device___2: '2 Additional Devices	',
  basic_tv___yes: 'Basic TV',
  core_tv___yes: 'Core TV',
  starz___yes: 'Starz',
  movies___yes: 'Movies',
};

const symbolToCurrency = {
  '$': 'USD',
};

export const durationName = {
  '1_day': '1 Day',
  '1_week': '1 Week',
  '1_month': '1 Month',
  'monthly': 'Monthly',
};

/**
 * Take two arrays and return another array with elements that are in both arrays
 * 
 * @param {any[]} array1 [required]
 * @param {any[]} array2 [required]
 * 
 * @returns {any[]} Array of intersected elements
 */
const arrayIntersection = (array1, array2) => (
  array1.filter(value => ~array2.indexOf(value)) // ~x same as x !== -1
);
// define argument types for function above
arrayIntersection.propTypes = {
  array1: PropTypes.array.isRequired,
  array2: PropTypes.array.isRequired,
};

/**
 * Given an option name this verifies that the the user picked choices that
 * fulfilled the requires section of the given option in the product catalog
 * (ie. to determine to show devices the user needs to pick either internet___standard or internet___expanded)
 * 
 * @param {string} optionName [required] - Name of the option to inquire
 * @param {object} optionState [required] - State containing options
 * @param {object} optionCatalog [option=productCatalog.Room.options] - Catalog to determine requirements
 * 
 * @returns {boolean} True if requirements are fulfilled
 * 
 * @example
 *  ...
 *  "device": {
 *    "requires": {
 *      "internet___basic_std_exp": ["internet___standard", "internet___expanded"]
 *    },
 *  ...
 */
const hasRequirements = (optionName, optionState, optionCatalog) => (
  Object.keys(optionCatalog[optionName].requires).length === 0 || // no requirements
  Object.keys(optionCatalog[optionName].requires).reduce((fulfilled, catalogOption) => ( // requirements fulfilled
    fulfilled && // verify if all choices in requires are present in optionState
    optionCatalog[optionName].requires[catalogOption].includes(optionState[catalogOption])
  ), true)
);
// define argument types for function above
hasRequirements.propTypes = {
  optionName: PropTypes.string.isRequired,
  optionState: PropTypes.object.isRequired,
  catalog: PropTypes.object.isRequired,
};

/**
 * Format number to money format based on currency symbol
 * 
 * @param {number} price [required] - Price to format
 * @param {string} currencySymbol [optional='$'] - Currency symbole (eg. $)
 */
const formatPriceForCurrencySymbol = (price, currencySymbol='$') => {
  const currency = symbolToCurrency[currencySymbol];
  return currency ? new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price) : `${currencySymbol}${price}`;
}
// define argument types for function above
formatPriceForCurrencySymbol.propTypes = {
  price: PropTypes.number.isRequired,
  currencySymbol: PropTypes.string,
};

/**
 * Format number to money format based on currency
 * 
 * @param {number} price [required] - Price to format
 * @param {string} currency [optional='USD'] - Currency symbole (eg. $)
 */
const formatPriceForCurrency = (price, currency='USD') => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
}
// define argument types for function above
formatPriceForCurrency.propTypes = {
  price: PropTypes.number.isRequired,
  currency: PropTypes.string,
};

/**
 * Returns new update to options metadata object based on user selection
 * 
 * @param {object} event - DOM click event
 * @param {object} optionMetadata - State of options selected and metadata around those options
 * @param {string[]} durationAll - All durations (eg. 1 day, 1 week, 1 month, monthly, etc.)
 * @param {object} optionCatalog - Options list from product catalog
 */
export const newOptionMetadata = (event, optionMetadata, durationAll, optionCatalog) => {
  // setting a new option
  const optionChosen = {
    ...optionMetadata.optionChosen,
    [event.target.name]: event.target.type === 'checkbox' && !event.target.checked ? '' : event.target.value,
  };

  // reconcile differences between what was chosen vs what is not enabled
  // reconcile selected option that fail the requirements test (eg. for tv add-ons if checked starz then unchecked core tv)
  // NOTE: warning if processing chained dependecies then order matters (ie. if a option has a dependency on a subsequent option it will not disable the option properly)
  Object.keys(optionChosen).forEach(optionName => {
    // cannot use !optionEnabled[optionName] since requirements will change since we're manipulating what is chosen
    if (optionChosen[optionName] && !hasRequirements(optionName, optionChosen, optionCatalog)) {
      optionChosen[optionName] = '';
    }
  });

  // enabled options when requirements met
  // NOTE: this section needs to be after reconciliation above
  const optionEnabled = Object.keys(optionCatalog).reduce((enabledList, optionName) => {
    enabledList[optionName] = hasRequirements(optionName, optionChosen, optionCatalog);
    return enabledList;
  }, {});

  // get array availble durations by intersecting durations based on chosen options
  const durationAllowedArray = Object.keys(optionChosen).filter(optionName => optionChosen[optionName]).reduce((durations, optionName) => {
    // get chosen choice from product catalog
    const choiceCatalog = optionCatalog[optionName].choices[optionChosen[optionName]];
    // if choice not found or processing duration then return durations untouched
    // otherwise intersect with durations that have been processed (ie. intersected)
    return !choiceCatalog || optionName === 'duration' ? durations : arrayIntersection(durations, Object.keys(choiceCatalog));
  }, durationAll); // recalulate from all available durations

  // transform array to hash for fast lookup
  const durationAllowed = durationAllowedArray.reduce((hash, duration)=>{
    hash[duration] = true;
    return hash;
  }, {});

  // deselect duration if it is not available
  if (!durationAllowed[optionChosen.duration]) {
    optionChosen.duration = '';
  }

  // auto-select duration 1-month/monthly if not chosen
  // NOTE: auto-select duration needs to be after deselection above
  if (!optionChosen.duration) {
    optionChosen.duration = durationAllowedArray[durationAllowedArray.length-1];
  }

  // build order summary table
  let currencySymbol; // last currency
  let totalPrice = 0.0; // total price
  const {purchasing, productCodes} = Object.keys(optionChosen).reduce((order, optionName) => {
    const friendlyName = choiceName[optionChosen[optionName]];

    if (friendlyName) {
      const choiceCatalog = optionCatalog[optionName].choices[optionChosen[optionName]][optionChosen.duration];
      const price = choiceCatalog.price;
      const codes = choiceCatalog.product_codes;
      currencySymbol = choiceCatalog.currency_symbol;

      totalPrice += +price;

      // add to order summary
      order.purchasing.push({
        name: friendlyName,
        price: `$${price}`,
      });

      // merge two array
      order.productCodes = order.productCodes.concat(codes);
    }

    // return updated order object
    return order;
  }, {purchasing:[], productCodes:[]});

  // convert to USD
  const totalPriceFormatted = formatPriceForCurrencySymbol(totalPrice, currencySymbol);

  // calculate total price of purchase and add to purchase table
  purchasing.push({
    name: 'Total',
    price: (<>{totalPriceFormatted}<br/>{durationName[optionChosen.duration]}</>),
  })

  // debug output
  //console.warn(JSON.stringify(optionChosen, null, 2))
  //console.log(JSON.stringify(optionEnabled, null, 2))

  // return newly constructed options metadata object
  return {
    optionChosen,
    optionEnabled,
    durationAllowed,
    purchasing,
    productCodes,
  };
}
// define argument types for function above
newOptionMetadata.propTypes = {
  event: PropTypes.object.isRequired,
  optionMetadata: PropTypes.object.isRequired,
  durationAll: PropTypes.array.isRequired,
  optionCatalog: PropTypes.object.isRequired,
};

/**
 * Builds a table of purchasing/purchased products based on product codes
 * 
 * @param {string[]} productCodes [required] - List of product codes
 * 
 * @returns {object[]} Returns an array of [{name,price}]
 */
export const buildTableProducts = (productCodes) => {
  // turn product codes into keys into BROADBAND_PRODUCTS
  // turn [ "internet", "1-device", "1-device", "basic-tv" ] to [ "internet", "1-device,1-device", "basic-tv" ]
  // work-around for 2 devices: "DL_Broadband_Additional_Device_[1_Month_Recurring],DL_Broadband_Additional_Device_[1_Month_Recurring]"
  const productLookup = Object.values(productCodes.reduce((lookup_table, product_code) => ({
    ...lookup_table,
    [product_code]: lookup_table[product_code] // if product code exists in table already
      ? lookup_table[product_code] +',' + product_code // concatenate product codes together for lookup into BROADBAND_PRODUCTS
      : product_code, // push product codes
  }), {}))

  // create array of name/price objects (eg. [{name, price}]) that will be fed into material table
  const purchasedProducts = productLookup
    .map(product_code_key => (!BROADBAND_PRODUCTS[product_code_key] ? {} : {
      // retrieve data from broadband products object
      name: BROADBAND_PRODUCTS[product_code_key].name,
      product_code: product_code_key,
      sort_order: BROADBAND_PRODUCTS[product_code_key].sort_order,
      price: BROADBAND_PRODUCTS[product_code_key].price,
      duration: BROADBAND_PRODUCTS[product_code_key].duration,
      currency: BROADBAND_PRODUCTS[product_code_key].currency,
    }))
    .sort((a,b) => 
      // sort by sort_order and alphabetically
      (a.sort_order - b.sort_order) || // sort by sort order
      (a.name < b.name ? -1 : 1) // for same sort order order alphabetically
    )
    .reduce(
      // reduct to flat object with embedded table
      (summary, product) => ({
        // use spread operator for readability
        ...summary,
        total: summary.total + (typeof(product.price) === 'undefined' ? 0 : +product.price),
        duration: product.duration,
        currency: product.currency,
        table: [
          ...summary.table,
          ...(Object.keys(product).length === 0 ? [] : [{ // do not add object if no properties
            name: product.name,
            price: product.price
          }])
        ]
      }), {
        // object final layout
        total: 0,
        duration: null,
        currency: null,
        table: [],
      }
    );

  // calculate total price of purchase and add to purchase table
  purchasedProducts.table.push({
    name: 'Total',
    price: (<>{formatPriceForCurrency(purchasedProducts.total, purchasedProducts.currency)}<br/>{purchasedProducts.duration}</>),
  })

  // set local state
  return purchasedProducts.table;
};
// define argument types for function above
buildTableProducts.propTypes = {
  productCodes: PropTypes.array.isRequired,
};

/**
 * Lookup price from product catalog
 * 
 * @param {string} optionName [required] - Option name from product catalog
 * @param {string} choiceName [required] - Choice name from product catalog 
 * @param {object} optionCatalog [required] - Slice of product catalog that pertains to the selected option
 * @param {object} optionMetadata [required] - Object that stores chosen options and meta data for those options
 * 
 * @example
 *  priceCatalogLookup('internet___basic_std_exp', 'internet___standard', optionCatalog, optionMetadata)
 */
export const priceCatalogLookup = (optionName, choiceName, optionCatalog, optionMetadata) => {
  if (!optionCatalog) { // return empty string if optionCatalog not yet loaded
    return '';
  }

  const choiceCatalog = optionCatalog[optionName].choices[choiceName];
  const choice = choiceCatalog && (choiceCatalog[optionMetadata.optionChosen.duration] || Object.values(choiceCatalog).slice(-1)[0]); // choose last choice (ie. 1-month/monthly)
  return choice ? '(' + formatPriceForCurrencySymbol(choice.price, choice.currency_symbol) + ')' : '*';
};
// define argument types for function above
priceCatalogLookup.propTypes = {
  optionName: PropTypes.string.isRequired,
  choiceName: PropTypes.string.isRequired,
  optionCatalog: PropTypes.object.isRequired,
  optionMetadata: PropTypes.object.isRequired,
};

/**
 * Lookup product from product catalog
 * 
 * @param {string} optionName [required] - Option name from product catalog
 * @param {string} choiceName [required] - Choice name from product catalog 
 * @param {object} optionCatalog [required] - Slice of product catalog that pertains to the selected option
 * @param {object} optionMetadata [required] - Object that stores chosen options and meta data for those options
 * 
 * @example
 *  priceCatalogLookup('internet___basic_std_exp', 'internet___standard', optionCatalog, optionMetadata)
 */
export const productCatalogLookup = (optionName, choiceName, optionCatalog, optionMetadata) => (
  optionCatalog &&
  optionCatalog[optionName].choices[choiceName] &&
  Object.values(optionCatalog[optionName].choices[choiceName]).length &&
  Object.values(optionCatalog[optionName].choices[choiceName])[0].name
);
// define argument types for function above
productCatalogLookup.propTypes = {
  optionName: PropTypes.string.isRequired,
  choiceName: PropTypes.string.isRequired,
  optionCatalog: PropTypes.object.isRequired,
  optionMetadata: PropTypes.object.isRequired,
};

/**
 * Lookup choice friendly name from product catalog for requirement caption
 * 
 * @param {string} optionName [required] - Option name from product catalog
 * @param {string} choiceName [required] - Choice name from product catalog 
 * @param {object} optionCatalog [required] - Slice of product catalog that pertains to the selected option
 * @param {object} optionMetadata [required] - Object that stores chosen options and meta data for those options
 * 
 * @example
 *  choiceRequiredCatalogLookup('core_tv')
 */
export const choiceRequiredCatalogLookup = (optionName, optionCatalog, optionMetadata) => {
  if (optionCatalog) {
    // cycle through all options and choices to generate requires message
    const requiresMessage = Object.keys(optionCatalog[optionName].requires).reduce((optionsMessage, optionRequired) => (
      // cycle through required options and add up all choices message
      optionsMessage += optionCatalog[optionName].requires[optionRequired].reduce((choicesMessage, choiceRequired) => (
        // cycle through all choices and add to requires message
        choicesMessage += optionCatalog[optionRequired].choices[choiceRequired][optionMetadata.optionChosen.duration]
          ? optionCatalog[optionRequired].choices[choiceRequired][optionMetadata.optionChosen.duration].name + ' or '
          // show duration instead if required duration (first requirement) is not chosen
          : durationName[Object.keys(optionCatalog[optionRequired].choices[choiceRequired])[0]]
      ), '')
    ), '')
    if (requiresMessage) {
      return '[Requires: ' + requiresMessage.replace(/ or $/, '') + ']';
    }
  }
};
// define argument types for function above
choiceRequiredCatalogLookup.propTypes = {
  optionName: PropTypes.string.isRequired,
  choiceName: PropTypes.string.isRequired,
  optionCatalog: PropTypes.object.isRequired,
  optionMetadata: PropTypes.object.isRequired,
};