import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/styles';
import { grey } from '@material-ui/core/colors';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';

import AccessAlarm from '@material-ui/icons/AccessAlarm';
import AccountBalanceWalletOutlinedIcon from '@material-ui/icons/AccountBalanceWalletOutlined';
import BallotOutlinedIcon from '@material-ui/icons/BallotOutlined';
import Brightness2Icon from '@material-ui/icons/Brightness2';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import DevicesOtherIcon from '@material-ui/icons/DevicesOther';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import StarBorder from '@material-ui/icons/StarBorder';
import SupervisorAccountOutlinedIcon from '@material-ui/icons/SupervisorAccountOutlined';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ExposureIcon from '@material-ui/icons/Exposure';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ControlPointIcon from '@material-ui/icons/ControlPoint';

import CsrSearchForm from '../sections/CsrSearchForm';

//import { SITECORE_URL, STUB_EPIC } from '../../settings';
import { ACTION_CSR_SIGN_OUT } from '../../stores/actions/csr-auth-actions'
import { ACTION_CSR_SETTINGS_DARK_MODE, ACTION_CSR_SETTINGS_DRAWER_CLOSE, ACTION_CSR_SETTINGS_DARK_MODE_AUTO } from '../../stores/actions/csr-settings-actions';
import { ACTION_CSR_REDIRECT_FULFILLED } from '../../stores/actions/csr-utils-actions';

const DarkSwitch = withStyles({
  root: { // shrink to fit list (drawer in close mode)
    paddingTop: 9,
    paddingBottom: 9,
    height: 32,
    overflow: 'visible', // for hover bubble
  },
  switchBase: {
    top: -3,
    color: grey[300],
    overflow: 'hidden', // for width scrollbar on windows
    '&$checked': {
      color: 'black',
    },
    '&$checked.Mui-disabled': {
      color: grey[600],
    },
    '&$checked + $track': {
      backgroundColor: grey[500],
    },
  },
  checked: {},
  track: {},
})(Switch);

const DarkCheckbox = withStyles({
  root: {
    padding: 4,
    color: grey[400],
    '&$checked': {
      color: grey[400],
    },
  },
  checked: {},
})(Checkbox);

const useStyles = makeStyles(theme => ({
  nested: drawer => ({
    paddingLeft: drawer.closed ? theme.spacing(0) : theme.spacing(2),
    paddingRight: drawer.closed ? theme.spacing(0) : theme.spacing(2),
  }),
  createAccountButton: {
    marginBottom: '15px',
    backgroundColor: '#35c0e2',
    color: 'white',
  }
}));

/**
 * Side drawer used to show navigation and search form
 * 
 * @param {object} state [required] - Redux state
 * @param {object} dispatch [required] - Redux object that contains dispatch functions
 * @param {object} match [required] - React-Router match generated by parent component path regular expression that is used to determine page and tab names
 * @param {object} history [required] - React-Router history used to update url
 */
function CsrDrawer({state, dispatch, match, history}) {
  const classes = useStyles({closed:state.csr_settings_drawer_close}); // cannot be false
  
  const toggleDarkMode = event => {
    // to read checked value: event.target.checked
    dispatch.csrSetDarkMode(!state.csr_settings_dark_mode);
  };

  const toggleDrawer = event => {
    // to read checked value: event.target.checked
    dispatch.csrSetDrawerClose(!state.csr_settings_drawer_close);
  };

  const toggleDarkModeAuto = event => {
    // to read checked value: event.target.checked
    dispatch.csrSetDarkModeAuto({
      auto: !state.csr_settings_dark_mode_auto,
      dark: state.csr_settings_dark_mode,
    });
  };

  // if redirect request made then redirect and clear using action dispatch
  useEffect(() => {
    if (state.csr_redirect_url) {
      history.push(state.csr_redirect_url);
      dispatch.csrRedirect();
    }
    // disable lint dependency checks for history
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.csr_redirect_url]);

  return (
    !state.csr_auth ?
    <List>
      <ListItem button selected>
        <ListItemIcon><VpnKeyIcon/></ListItemIcon>
        <ListItemText primary="Sign-in" />
      </ListItem>
    </List>
    :
    <List>
      <ListItem>
        <ListItemIcon><SupervisorAccountOutlinedIcon/></ListItemIcon>
        <ListItemText primary={state.csr_auth.username} />
      </ListItem>
      <ListItem name="logout" button onClick={(event) => {
        // clear out all data in redux
        dispatch.csrSignOut(event);
        // redierct to login page
        history.push('/');
        // logout of active directory if not in stub mode (not yet needed)
        // if (!STUB_EPIC && state.csr_auth.username) {
        //   window.location.href = `${SITECORE_URL}/csr/logout`;
        // }
      }}>
        <ListItemIcon><ExitToAppIcon/></ListItemIcon>
        <ListItemText primary="Sign-out" />
      </ListItem>
      {state.csr_settings_drawer_close ?
      <ListItem name="toggleDrawer" button onClick={toggleDrawer}>
        <ListItemIcon><Brightness2Icon/></ListItemIcon>
        <ListItemText primary="Dark Mode" />
      </ListItem>
      :
      <ListItem>
        <ListItemIcon><Brightness2Icon/></ListItemIcon>
        <ListItemText primary="Dark Mode" />
        <DarkCheckbox 
          name="darkCheckbox"
          checked={!!state.csr_settings_dark_mode_auto} // checked must be boolean
          onChange={toggleDarkModeAuto}
        />
        <ListItemText primary="Auto" />
        <DarkSwitch
          name="darkSwitch"
          color="primary"
          checked={!!state.csr_settings_dark_mode} // checked must be boolean
          onChange={toggleDarkMode}
          disabled={state.csr_settings_dark_mode_auto}
        />
      </ListItem>
      }
      <Divider />
      <ListItem button component={Link} to={'/create-account'} selected={match.params.page_name==='create-account'}>
        <ListItemIcon><ControlPointIcon /></ListItemIcon>
        <ListItemText primary="Create Account"/>
      </ListItem>
      {state.csr_checkout_action && // show if pending action exists
      <ListItem button component={Link} to={'/checkout'} selected={match.params.page_name==='checkout'}>
        <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
        <ListItemText primary="Checkout"/>
      </ListItem>
      }
      {state.csr_customer &&
      <>
      <ListItem button component={Link} to={`/customer/${state.csr_customer.customer_id}/account`}>
        <ListItemIcon><HowToRegIcon/></ListItemIcon>
        <ListItemText primary="Customer"/>
      </ListItem>
      {match.params.page_name === 'customer' &&
      <div className={classes.nested}>
        <ListItem button component={Link} to={`/customer/${state.csr_customer.customer_id}/account`} selected={match.params.tab_name==='account'}>
          <ListItemIcon><AccountBalanceWalletOutlinedIcon/></ListItemIcon>
          <ListItemText primary="Account" />
        </ListItem>
        <ListItem button component={Link} to={`/customer/${state.csr_customer.customer_id}/plans`} selected={match.params.tab_name==='plans' && !match.params.subtab_name}>
          <ListItemIcon><BallotOutlinedIcon/></ListItemIcon>
          <ListItemText primary="Plans" />
          {match.params.tab_name==='plans' ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={match.params.tab_name==='plans'} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className={classes.nested}>
            <ListItem button component={Link} to={`/customer/${state.csr_customer.customer_id}/plans/change`} selected={match.params.subtab_name==='change'}>
              <ListItemIcon>
                <ExposureIcon />
              </ListItemIcon>
              <ListItemText primary="Change Plans" />
            </ListItem>
          </List>
        </Collapse>
        <ListItem button component={Link} to={`/customer/${state.csr_customer.customer_id}/devices`} selected={match.params.tab_name==='devices'}>
          <ListItemIcon><DevicesOtherIcon/></ListItemIcon>
          <ListItemText primary="Devices" />
        </ListItem>
        <ListItem button component={Link} to={`/customer/${state.csr_customer.customer_id}/billing`} selected={match.params.tab_name==='billing' && !match.params.subtab_name}>
          <ListItemIcon><CreditCardIcon/></ListItemIcon>
          <ListItemText primary="Billing" />
          {match.params.tab_name==='billing' ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={match.params.tab_name==='billing'} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className={classes.nested}>
            <ListItem button component={Link} to={`/customer/${state.csr_customer.customer_id}/billing/starred`} selected={match.params.subtab_name==='starred'}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Starred" />
            </ListItem>
            <ListItem button component={Link} to={`/customer/${state.csr_customer.customer_id}/billing/access`} selected={match.params.subtab_name==='access'}>
              <ListItemIcon>
                <AccessAlarm />
              </ListItemIcon>
              <ListItemText primary="AccessAlarm" />
            </ListItem>
          </List>
        </Collapse>
      </div>
      }
      </>
      }
      <CsrSearchForm />
    </List>
  )
}
// type declaration and enforcement
CsrDrawer.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  state: {
    ...state.csrAuthReducer,
    ...state.csrCustomerReducer,
    ...state.csrRedirectReducer,
    ...state.csrSettingsReducer,
    ...state.csrCheckoutReducer,
  }
});
const mapDispatchToProps = (dispatch) => ({
  dispatch: {
    csrSignOut: (payload) => dispatch({
      type: ACTION_CSR_SIGN_OUT,
    }),
    csrRedirect: (payload) => dispatch({
      type: ACTION_CSR_REDIRECT_FULFILLED,
    }),
    csrSetDarkMode: (isDark) => dispatch({
      type: ACTION_CSR_SETTINGS_DARK_MODE,
      payload: isDark,
    }),
    csrSetDarkModeAuto: ({auto, dark}) => dispatch({
      type: ACTION_CSR_SETTINGS_DARK_MODE_AUTO,
      payload: {
        auto: auto,
        dark: dark,
      },
    }),
    csrSetDrawerClose: (isClose) => dispatch({
      type: ACTION_CSR_SETTINGS_DRAWER_CLOSE,
      payload: isClose,
    }),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CsrDrawer)