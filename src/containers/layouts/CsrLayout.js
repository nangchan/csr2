import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Switch, Route, Link } from 'react-router-dom'

import queryString from 'query-string'
import clsx from 'clsx';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import withWidth, { isWidthDown } from '@material-ui/core/withWidth';

import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';

import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

import { grey } from '@material-ui/core/colors'

import CsrSearchResultsPage from '../pages/CsrSearchResultsPage';
import CsrCustomerPage from '../pages/CsrCustomerPage';
import CsrDrawer from '../navigations/CsrDrawer';
import CsrSignInPage from '../pages/CsrSignInPage';
import CsrAccountCreatePage from '../pages/CsrAccountCreatePage';

import CsrSnackbar from '../sections/CsrSnackbar';

import { ACTION_CSR_SIGN_IN_FROM_CACHE, ACTION_CSR_RELOAD } from '../../stores/actions/csr-auth-actions';
import { ACTION_CSR_SETTINGS_DRAWER_CLOSE } from '../../stores/actions/csr-settings-actions';
import { STUB_EPIC, AUTH_TOKEN_EXPIRATION_DURATION, REACT_APP_HOST_COLOR, REACT_APP_HOST_COLOR_ENUM } from '../../settings';
import CsrCheckoutPage from '../pages/CsrCheckoutPage';
import { Badge } from '@material-ui/core';
import { buildTableProducts } from '../subpages/CsrChangePlansSubPage.helper';

const drawerWidth = 340;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    background: theme.palette.type === 'light' ? grey[700] : grey[900],
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
    textTransform: 'uppercase',
  },
  messageBlueContainer: {
    marginLeft:10,
    color: 'white',
    borderColor: 'blue',
    backgroundColor: 'rgba(0,0,255,0.2)',
    '&:hover': {
      backgroundColor: 'rgba(0,0,255,0.5)',
    }
  },
  messageGreenContainer: {
    marginLeft:10,
    color: 'white',
    borderColor: 'green',
    backgroundColor: 'rgba(0,255,0,0.2)',
    '&:hover': {
      backgroundColor: 'rgba(0,255,0,0.5)',
    }
  },
  messageContainer: {
    marginLeft:10,
    color: 'white',
    borderColor: 'yellow',
    backgroundColor: 'rgba(255,255,0,0.2)',
    '&:hover': {
      backgroundColor: 'rgba(255,255,0,0.5)',
    }
  },
  message: {
    [theme.breakpoints.down('xs')]: {
      width: 100,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  // stub: {
  //    fontWeight:'bold',
  //    color: 'red',
  //   '&::before': {
  //     color: 'white',
  //     content: '" | "',
  //   }
  // },
  iconReload: { // reload icon animation
    transform: 'rotate(-8100deg)',
    transition: 'all 15s linear',
  },
}));

/**
 * Layout adds the starting components that appear on the page
 * 
 * @param {object} state [required] - Redux state
 * @param {object} dispatch [required] - Redux object that contains dispatch functions
 * @param {object} location [required] - React-Router location used to access query strings
 * @param {object} history [required] - React-Router history used to update url
 */
function CsrLayout({state, dispatch, location, history, width}) {
  const theme = useTheme();
  const classes = useStyles();
  const [message] = useState(STUB_EPIC ? 'stub mode on' : 'stub mode off'); // placeholder for messages meant for csr agents

  function toggleDrawer() {
    dispatch.csrSetDrawerClose(!state.csr_settings_drawer_close);
  }

  // if shrinking page to md or smaller then close drawer
  useEffect(() => {
    if (isWidthDown('md', width)) {
      dispatch.csrSetDrawerClose(true);
    }
  }, [width, dispatch]);

  // auto-sign-in if already auth
  useEffect(() => {
    const query = queryString.parse(location.search)
    // sign-in from query string
    if (query.token) {
      dispatch.csrSignInFromCache({
        save:true,
        expired:new Date(new Date().getTime() + AUTH_TOKEN_EXPIRATION_DURATION), // add one day
        response:{
          token:query.token,
          username:query.username
        },
      }) // add one day
    }
    // sign-in from local storage if not already authedj
    // if local storage supported
    else if (!state.csr_auth && typeof (Storage) !== "undefined" && localStorage.getItem('csr-jwt')) {
      // get auth token
      dispatch.csrSignInFromCache({
        save:false,
        expired:new Date(localStorage.getItem('csr-jwt-expired')),
        response:JSON.parse(localStorage.getItem('csr-jwt')),
      });
    }
    // if authenticated do not redirect
    else if (!state.csr_auth) {
      // if not auth then redirect to sign-in page
      history.push('/');
    }

    // disable lint dependency checks since we want to run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    <CsrSnackbar vertical="bottom" horizontal="left" />
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: !state.csr_settings_drawer_close,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: !state.csr_settings_drawer_close,
            })}
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.title}>
            {state.csr_customer && // show customer id
            state.csr_customer.first_name + ' ' + state.csr_customer.last_name + ' | ' + state.csr_customer.customer_id + ' | ' + state.csr_customer.status}
          </div>
          {message &&
          <Button variant="outlined" className={REACT_APP_HOST_COLOR === REACT_APP_HOST_COLOR_ENUM.GREEN ? classes.messageGreenContainer : classes.messageBlueContainer}>
            <div className={classes.message}>{message}</div>
          </Button>
          }
          {state.csr_checkout_action && // show if pending action exists
          <Tooltip title="Checkout">
            <IconButton
              aria-label="checkout"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              component={Link}
              to="/checkout"
            >
              <Badge
                className={classes.margin} // TODO: get badge number from redux
                badgeContent={buildTableProducts(state.csr_checkout_product_codes).length-1}
                color="primary"
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          }
          <Switch>
            <Route exact path="/customer/:customer_id/:tab_name/:subtab_name?" render={
              // use render when passing custom function to prevent re-rendering
              // if using component, when page renders this anonymous arrow function
              // will be recreated and considered a new type thereby forcing a re-render
              (props) => (
                <Tooltip title="Reload">
                  <IconButton
                    aria-label="reload"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={dispatch.csrCustomerReload}
                    color="inherit"
                    className={`${(state.csr_customer_requesting || state.csr_devices_requesting || state.csr_notes_requesting || state.csr_deferred_actions_requesting) && classes.iconReload}`}
                  >
                    <RotateLeftIcon />
                  </IconButton>
                </Tooltip>
              )
            } />
          </Switch>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isWidthDown('md', width) ? 'temporary' : 'permanent'}
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: !state.csr_settings_drawer_close,
          [classes.drawerClose]: !!state.csr_settings_drawer_close, // cast to boolean
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: !state.csr_settings_drawer_close,
            [classes.drawerClose]: !!state.csr_settings_drawer_close, // cast to boolean
          }),
        }}
        open={!state.csr_settings_drawer_close}
        onClose={toggleDrawer}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={toggleDrawer}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <Route path="/:page_name?/:customer_id?/:tab_name?/:subtab_name?" component={CsrDrawer} />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route exact path="/" component={CsrSignInPage} />
          <Route path="/customer/:customer_id/:tab_name/:subtab_name?" component={CsrCustomerPage} />
          <Route path="/checkout" component={CsrCheckoutPage} />
          <Route path="/search" component={CsrSearchResultsPage} />
          <Route path="/create-account" component={CsrAccountCreatePage} />
        </Switch>
      </main>
    </div>
    </>
  );
}
// type declaration and enforcement
CsrLayout.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  state: {
    ...state.csrAuthReducer,
    ...state.csrCustomerReducer,
    ...state.csrSettingsReducer,
    ...state.csrCheckoutReducer,
  }
});

const mapDispatchToProps = (dispatch) => ({
  dispatch: {
    csrSignInFromCache: (payload) => dispatch({
      type: ACTION_CSR_SIGN_IN_FROM_CACHE,
      payload
    }),
    csrCustomerReload: (payload) => dispatch({
      type: ACTION_CSR_RELOAD,
      payload: {
        response: null,
      }
    }),
    csrSetDrawerClose: (isClose) => dispatch({
      type: ACTION_CSR_SETTINGS_DRAWER_CLOSE,
      payload: isClose,
    }),
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(withWidth()(CsrLayout)))

// withWidth does not render in jest hence this version below
export const CsrLayoutTestable = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(CsrLayout));