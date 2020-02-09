import PropTypes from 'prop-types';
import { useState } from 'react';

import { DEBOUNCE_TIMEOUT } from './settings';

/**
 * Function used to implement debounce
 * 
 * @param {number} timeout [optional=200] - Time between executions
 * @param {boolean} disabled [optional=(process.env.NODE_ENV==='test')] - Disable for unit testing
 * 
 * @returns {function} Function that takes an anonymous function to execute
 *  and passes the anonymous function the DOM event object (if event exists)
 * 
 * @see {@link https://reactjs.org/docs/events.html#event-pooling}
 * 
 * @example
 *  const SampleInputWithDebounce = () => {
 *    const [text, setText] = useState('');
 *    const handleChange = (event) => {
 *      // any state change can be done here
 *      setText(event.target.value);
 *    };
 *    const debouncer = useDebounce();
 *    return (
 *      // bind handleChange to the onChange event and delay handleChange event via debouncer
 *      // NOTE: if debouncing onChange event then form input must be uncontrolled (ie. defaultValue used not value)
 *      <input type="text" defaultValue={text} onChange={debouncer(handleChange)} />
 *    );
 *  };
 */
const useDebounce = (timeout=DEBOUNCE_TIMEOUT, disabled/*=process.env.NODE_ENV === 'test'*/) => {
  // timeout id from setTimeout and used to implement debounce
  // setTimeoutId not used since we do not want to re-render
  const [timeoutId] = useState({value:null});

  return (callback, timeoutOverride) => (event, ...rest) => {
    // synthetic events are pooled therefore event object
    // cannot be access asynchronously (eg. inside of setTimeout) 
    if (event && typeof(event.persist) === 'function') {
      // persist event for asynchronous access
      event.persist();
    }

    // if unit/integration testing then bypass debounce
    if (disabled) {
      callback(event);
    }
    // use clearTimeout/setTimeout to implement debounce
    else {
      // clear previous timeout
      if (timeoutId.value) {
        window.clearTimeout(timeoutId.value);
      }

      // save timeout Id without using setter to bypass re-rendering
      // setTimeout used to implement debounce
      timeoutId.value = setTimeout(
        () => {
          callback(event, ...rest);
        },
        typeof(timeoutOverride) !== 'undefined' ? timeoutOverride : timeout
      );
    }
  };
};
// define argument types for function above
useDebounce.propTypes = {
  timeout: PropTypes.number,
  disabled: PropTypes.bool,
};

export default useDebounce;