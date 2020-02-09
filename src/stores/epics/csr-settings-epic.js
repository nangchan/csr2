import PropTypes from 'prop-types';
import { ofType } from 'redux-observable';
import { map, tap } from 'rxjs/operators';
import {
  ACTION_CSR_SETTINGS_DARK_MODE,
  ACTION_CSR_SETTINGS_DARK_MODE_AUTO,
  ACTION_CSR_NO_OP,
} from '../actions/csr-settings-actions';

/**
 * Set dark-mode-auto and save to local storage
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions
 */
export const csrSetDarkModeAutoEpic = (action$) => action$.pipe(
  ofType(ACTION_CSR_SETTINGS_DARK_MODE_AUTO),
  tap((action) => {
    if (typeof (Storage) !== "undefined") {
      localStorage.setItem('csr-settings', JSON.stringify({dark_mode_auto: action.payload.auto}));
    }
    else {
      console.error('Cannot save settings: localStorage not supported')
    }
  }),
  map((action) => ({
    type: ACTION_CSR_SETTINGS_DARK_MODE,
    payload: action.payload.auto ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) : action.payload.dark
  })),
);
// type declaration and enforcement
csrSetDarkModeAutoEpic.propTypes = {
  action$: PropTypes.object.isRequired,
};

/**
 * Set dark-mode and save to local storage
 * 
 * @param {object} action$ [required] - RxJS Observable that emits actions
 */
export const csrSetDarkModeEpic = (action$) => action$.pipe(
  ofType(ACTION_CSR_SETTINGS_DARK_MODE),
  tap((action) => {
    if (typeof (Storage) !== "undefined") {
      const csrSettings = localStorage.getItem('csr-settings') && JSON.parse(localStorage.getItem('csr-settings'));
      localStorage.setItem('csr-settings', JSON.stringify({
        dark_mode_auto: csrSettings && csrSettings.dark_mode_auto, // set from local storage
        dark_mode: action.payload
      }));
    }
    else {
      console.error('Cannot save settings: localStorage not supported')
    }
  }),
  map((action) => ({
    type: ACTION_CSR_NO_OP, // dispatch no-op action (does nothing)
  })),
);
// type declaration and enforcement
csrSetDarkModeEpic.propTypes = {
  action$: PropTypes.object.isRequired,
};