import React, { useEffect} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { Form, Field } from 'react-final-form';
import { TextField } from 'final-form-material-ui';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';

import { SITECORE_URL } from '../../settings';
import { ACTION_CSR_SIGN_IN, } from '../../stores/actions/csr-auth-actions';
import { required, composeValidators, } from '../../validators';

//https://final-form.org/docs/final-form/types/FormApi
//https://stackoverflow.com/questions/37949981/call-child-method-from-parent
//https://codesandbox.io/s/1vyvzr7xo3

//const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/* not needed since final-form-html5 library takes care of field change detection
// check if subset is contains within superset
const isSubset = (superset, subset) => 
  // if both objects then recursively check
  // otherwise simple type/value check
  superset !== null && typeof(superset) === 'object' && subset !== null && typeof(subset) === 'object'
    ? Object.keys(superset).reduce((sum, key) => sum && isSubset(superset[key], subset[key]), true)
    : superset === subset;

// check if both sets are equal
const isEqual = (superset, subset) => 
  // if both objects then recursively check
  // otherwise do type and value check
  superset !== null && typeof(superset) === 'object' && subset !== null && typeof(subset) === 'object'
    ? Object.keys(superset).length === Object.keys(subset).length // key-length mismatch then terminate early
      && Object.keys(superset).reduce((sum, key) => sum && isEqual(superset[key], subset[key]), true)
    : superset === subset;
*/

/*
const useStyles = makeStyles(theme => ({
  '@global': {
  },
  inputTypeSearch: {
    '& input': {
      appearance: 'textfield',
    }
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
}));
*/

/* simulate form post
const onSubmit = async values => {
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};
*/

/*
const recordLevelValidators = values => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = 'Required';
  }
  if (!values.lastName) {
    errors.lastName = 'Required';
  }
  if (!values.email) {
    errors.email = 'Required';
  }
  return errors;
};
*/

/**
 * Sign-in page to access CSR
 * 
 * @param {object} state [required] - Redux state
 * @param {object} dispatch [required] - Redux object that contains dispatch functions
 * @param {object} history [required] - React-Router history used to update url
 */
function CsrSignInPage({state, dispatch, history}) {
  //  const classes = useStyles();

  // example of why immutability matters for rendering
  //const [value, setValue] = React.useState({l1:0});

  // if authentication sucessful then redirect to search
  useEffect(() => {
    if (state.csr_auth && new Date() < state.csr_auth_expired) {
      history.push('/search');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[state.csr_auth]);

  return (
    <div style={{ padding: 16, margin: 'auto', maxWidth: 600 }}>
      {/*<button onClick={()=>{value.l1+=1;setValue({...value})}}>{value.l1}</button>*/}
      <CssBaseline />
      <Typography variant="h4" align="center" component="h1" gutterBottom>
        Sign-In
      </Typography>
      <Form
        onSubmit={dispatch.csrSignIn}
        //validate={recordLevelValidators}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit} noValidate>
            <Paper style={{ padding: 16 }}>
              <Grid container alignItems="flex-start" spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field //https://stackoverflow.com/questions/51952889/how-to-override-formhelpertext-styles-in-react-material-ui
                    fullWidth
                    required
                    validate={composeValidators(
                      required(),
                    )}
                    name="partner_id"
                    initialValue=""
                    component={TextField}
                    //InputProps={{ className: classes.inputTypeSearch }}
                    variant="outlined"
                    type="search"
                    label="Username"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    fullWidth
                    required
                    validate={composeValidators(
                      required(),
                    )}
                    name="password"
                    initialValue=""
                    component={TextField}
                    variant="outlined"
                    type="password"
                    label="Password"
                  />
                </Grid>
                <Grid item style={{ marginTop: 16 }}>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={form.reset}
                    disabled={submitting}
                  >
                    Reset
                  </Button>
                </Grid>
                <Grid item style={{ marginTop: 16 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    disabled={submitting}
                  >
                    Submit
                  </Button>
                </Grid>
                <Grid item style={{ marginTop: 16 }}>
                  <Button
                    href={`${SITECORE_URL}/csr/authentication?redirect_back=1`}
                    name="login_to_ad"
                    variant="contained"
                    color="primary"
                    type="button"
                    component="a"
                    disabled={submitting}
                  >
                    Login with AD
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </form>
        )}
      />
    </div>
  );
}
// type declaration and enforcement
CsrSignInPage.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  state: {
    ...state.csrAuthReducer,
  }
});

const mapDispatchToProps = (dispatch) => ({
  dispatch: {
    csrSignIn: (payload) => dispatch({
      type: ACTION_CSR_SIGN_IN,
      payload
    }),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CsrSignInPage))