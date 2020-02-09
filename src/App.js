import React from 'react';

import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { ajax } from 'rxjs/ajax';

import { BrowserRouter as Router} from 'react-router-dom'

import CsrLayout from './containers/layouts/CsrLayout';

import csrAuthReducer from './stores/reducers/csr-auth-reducer';
import csrCustomerReducer from './stores/reducers/csr-customer-reducer';
import csrDevicesReducer from './stores/reducers/csr-devices-reducer';
import csrNotesReducer from './stores/reducers/csr-notes-reducer';
import csrSearchReducer from './stores/reducers/csr-search-reducer';
import csrDeferredActionsReducer from './stores/reducers/csr-plans-reducer';
import csrSettingsReducer from './stores/reducers/csr-settings-reducer';
import csrRedirectReducer from './stores/reducers/csr-utils-reducer';
import snackbarReducer from './stores/reducers/snackbar-reducer';
import csrChangePlansReducer from './stores/reducers/csr-change-plans-reducer';
import csrCheckoutReducer from './stores/reducers/csr-checkout-reducer';
import csrAccountCreateReducer from './stores/reducers/csr-account-create-reducer';

import { csrSignInEpic, csrSignInFromCacheEpic, csrSignOut } from './stores/epics/csr-auth-epic';
import { csrSearchEpic } from './stores/epics/csr-search-epic';
import { csrFetchCustomerEpic, csrUpdateCustomerEpic } from './stores/epics/csr-customer-epic';
import {
  csrFetchDevicesEpic,
  csrAddDeviceEpic,
  csrDeleteDeviceEpic,
  csrEditDeviceEpic,
} from './stores/epics/csr-devices-epic';
import { csrFetchNotesEpic, csrAddNoteEpic } from './stores/epics/csr-notes-epic';
import { csrFetchDeferredActionsEpic } from './stores/epics/csr-plans-epic';
import { csrSetDarkModeAutoEpic, csrSetDarkModeEpic } from './stores/epics/csr-settings-epic';
import { snackbarInprogressEpic, snackbarFulfillmentEpic, snackbarRejectEpic } from './stores/epics/snackbar-epic';
import { csrUpdateProductsEpic } from './stores/epics/csr-change-plans-epic';
import { csrCheckoutEpic, } from './stores/epics/csr-checkout-epic';

import { STUB_EPIC } from './settings';
import { csrAccountCreateEpic, csrDuplicateUsernameCheckEpic } from './stores/epics/csr-account-create-epic';

//import logo from './logo.svg';
import './App.css';
import { ThemeProvider } from '@material-ui/styles';
import BoingoTheme from './styles/BoingoTheme';

// This is the main JSX entry point of the app invoked by the renderer (server or client rendering).
// By default the app's normal rendering is delegated to <RouteHandler> that handles the loading of JSS route data.

// support languages in the URL prefix
// e.g. /da-DK/path, or /en/path, or /path
export const routePatterns = [
  '/:lang([a-z]{2}-[A-Z]{2})/:sitecoreRoute*',
  '/:lang([a-z]{2})/:sitecoreRoute*',
  '/:sitecoreRoute*',
];

// for debugging
// get last action that was dispatched by setting state to the last action
//const lastAction = (state = null, action) => ( action )

export function configureStore() {
  // window check for server-side rendering
  const composeEnhancers = ((typeof(window) !== 'undefined') && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true, traceLimit: 25 })) || compose;
  const epicMiddleware = createEpicMiddleware({
    dependencies: {
      // if stubbing turned on then call the stub in the request if exists or else call normal ajax
      ajax: !STUB_EPIC ? ajax : (request) => (request.__STUB_AJAX__ ? request.__STUB_AJAX__(request) : ajax(request)),
      Date: Date,
    }
  });
  const rootReducer = combineReducers({
    csrAuthReducer,
    csrCustomerReducer,
    csrDevicesReducer,
    csrNotesReducer,
    csrSearchReducer,
    csrDeferredActionsReducer,
    csrSettingsReducer,
    csrRedirectReducer,
    snackbarReducer,
    csrChangePlansReducer,
    csrCheckoutReducer,
    csrAccountCreateReducer,
    //lastAction
  });
  const rootEpic = combineEpics(
    csrSignInEpic,
    csrSignInFromCacheEpic,
    csrSignOut,
    csrSearchEpic,
    csrFetchCustomerEpic,
    csrUpdateCustomerEpic,
    csrFetchDevicesEpic,
    csrAddDeviceEpic,
    csrDeleteDeviceEpic,
    csrEditDeviceEpic,
    csrFetchNotesEpic,
    csrAddNoteEpic,
    csrFetchDeferredActionsEpic,
    csrSetDarkModeAutoEpic,
    csrSetDarkModeEpic,
    snackbarInprogressEpic,
    snackbarFulfillmentEpic,
    snackbarRejectEpic,
    csrUpdateProductsEpic,
    csrCheckoutEpic,
    csrAccountCreateEpic,
    csrDuplicateUsernameCheckEpic,
  );

  const store = createStore(
    rootReducer,
    composeEnhancers(
      applyMiddleware(epicMiddleware)
    )
  );

  epicMiddleware.run(rootEpic);

  return store;
}

const LayoutThemed = ({state}) => (
  <ThemeProvider theme={BoingoTheme(state.csr_settings_dark_mode)}>
    <CsrLayout />
  </ThemeProvider>
);

const mapStateToProps = (state) => ({
  state: state.csrSettingsReducer,
});

const LayoutThemedConnected = connect(
  mapStateToProps,
)(LayoutThemed)

function App() {
  return (
    <Provider store={configureStore()}>
      <Router>
        <LayoutThemedConnected />
      </Router>
    </Provider>
  );
}

export default App;