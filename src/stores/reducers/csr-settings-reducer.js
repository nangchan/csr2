import PropTypes from 'prop-types';
import produce from 'immer';

import {
  ACTION_CSR_SETTINGS_DARK_MODE,
  ACTION_CSR_SETTINGS_DARK_MODE_AUTO,
  ACTION_CSR_SETTINGS_DRAWER_CLOSE,
} from '../actions/csr-settings-actions';

import {CsrInitialState} from '../states/CsrInitialState';

/**
 * Retrieve the dark-mode and dark-mode-auto settings from local storage
 * If dark-mode-auto is turned on then check browser settings to determine if dark-mode should be activated
 */
const getSavedSettings = () => {
  const savedSettings =
    ( // get from local settings
      typeof (Storage) !== "undefined"
      && localStorage.getItem('csr-settings')
      && JSON.parse(localStorage.getItem('csr-settings'))
    ) || { // or default to false
      dark_mode_auto: false,
      dark_mode: false
    };

  const dark_mode_auto = savedSettings.dark_mode_auto;
  const dark_mode = dark_mode_auto
    ? window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches // if auto set then pull from media query
    : savedSettings.dark_mode; // otherwise pull from local storage

  // sync with local storage
  if (typeof (Storage) !== "undefined") {
    localStorage.setItem('csr-settings', JSON.stringify({dark_mode_auto, dark_mode}));
  }

  return {dark_mode_auto, dark_mode};
};

const {dark_mode_auto, dark_mode} = getSavedSettings();

/**
 * Function parameters defaults the initial dark mode settings and auto-detection from local-storage and browser settings
 * 
 * Updates csr_settings_dark_mode, csr_settings_dark_mode_auto, csr_settings_drawer_close
 * 
 * @param {object} state [required] - Current state provided by Redux and initialized by CsrInitialState if not null
 * @param {object} action [required] - Current action originating on Component and provided by Redux
 * 
 * @summary WARNING: When generating intial state be sure to include csr_settings_dark_mode_auto and csr_settings_dark_mode
 */
export default function csrSettingsReducer(
  state = (CsrInitialState && CsrInitialState.csrSettingsReducer) || {
    csr_settings_dark_mode_auto: dark_mode_auto,
    csr_settings_dark_mode: dark_mode,
  },
  action )
{
  switch (action.type) {
    case ACTION_CSR_SETTINGS_DARK_MODE: {
      return produce(state, (draft) => {
        draft.csr_settings_dark_mode = action.payload;
      })
    }
    case ACTION_CSR_SETTINGS_DARK_MODE_AUTO: {
      return produce(state, (draft) => {
        draft.csr_settings_dark_mode_auto = action.payload.auto;
      })
    }
    case ACTION_CSR_SETTINGS_DRAWER_CLOSE: {
      return produce(state, (draft) => {
        draft.csr_settings_drawer_close = action.payload;
      })
    }
    default: {
      return state // return current state
    }
  }
}
// type declaration and enforcement
csrSettingsReducer.propTypes = {
  state: PropTypes.object.isRequired,
  action: PropTypes.object.isRequired,
};