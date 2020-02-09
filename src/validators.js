import { US_STATES } from './constants/default.const';

export const composeValidators = (...validators) => value => validators.reduce((error, validator) => error || validator(value), undefined)

// numerical validation
export const required = message => value => value ? undefined : message || 'Required'
export const minLength = (min, message) => value => (typeof(value) === 'undefined' || value.length >= min) ? undefined : message || `Should be at least ${min}`
export const mustBeNumber = message => value => (typeof(value) === 'undefined' || !isNaN(value)) ? undefined : message || 'Must be a number'

// regular expression validation
export const pattern = (pattern, message) => value => (typeof(value) === 'undefined' || value === null || value.match(pattern)) ? undefined : message || 'Does not match expected pattern'
export const mustBeEmail = message => value => (typeof(value) === 'undefined' || value === null || value.match(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) ? undefined : message || "Invalid email address"
export const mustBeMac = message => value => (typeof(value) === 'undefined' || value === null || value.match(/^(:?-?[0-9a-fA-F]:?-?){12}$/)) ? undefined : message || "Enter 12 hex [0-9,A-F] ('-', ':' optional)."
export const mustBePhoneUS = message => value => (typeof(value) === 'undefined' || value === null || value.match(/^\+?(\(? ?-?[0-9]\)? ?-?){10,11}$/)) ? undefined : message || "Enter valid US phone number (eg. 1-123-555-5555)"
export const mustBePhoneIntl = message => value => (typeof(value) === 'undefined' || value === null || value.match(/^\+?(\(? ?-?[0-9]\)? ?-?){8,15}$/)) ? undefined : message || "Enter valid phone number"
export const mustBePostalUS = message => value => (typeof(value) === 'undefined' || value === null || value.match(/^[0-9]{5}(-[0-9]{4})?$/)) ? undefined : message || "Enter valid zip code (eg. 90024 or 90024-3809)"
export const mustBePostalIntl = message => value => (typeof(value) === 'undefined' || value === null || value.match(/^(-? ?[0-9a-zA-Z]-? ?){4,9}?$/)) ? undefined : message || "Enter valid postal code"
export const mustBeStateUS = message => value => (typeof(value) === 'undefined' || value === null || US_STATES.filter(state => state.abbr === value.toUpperCase()).length) ? undefined : message || "Enter valid state (eg. CA)"
export const mustBeCountry = message => value => (typeof(value) === 'undefined' || value === null || value.match(/^[a-zA-Z]{2}$/)) ? undefined : message || "Enter valid two-letter country abbreviation (eg. US)"

export const validCreditCard = message => value => {
  // Accept only digits, dashes or spaces
  if (/[^0-9-\s]+/.test(value)) return 'Must be a number';
  
  if (value.length < 13) return 'Must be greater than 13 digits';

	// The Luhn Algorithm. It's so pretty.
	let nCheck = 0, bEven = false;
	value = value.replace(/\D/g, "");

	for (var n = value.length - 1; n >= 0; n--) {
		var cDigit = value.charAt(n),
			  nDigit = parseInt(cDigit, 10);

		if (bEven && (nDigit *= 2) > 9) nDigit -= 9;

		nCheck += nDigit;
		bEven = !bEven;
	}

	return (nCheck % 10) === 0 ? undefined : message || 'Invalid credit card number';
}
export const mustBeFutureYearAndMonth = (month, year, message, currentMonth = new Date().getMonth(),currentYear = new Date().getFullYear()) => (
  ((month >= currentMonth && year >= currentMonth) || year > currentYear) ? undefined : message || 'Expiration date cannot be in the past'
)
