import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { Form, Field } from 'react-final-form';
import { TextField } from 'final-form-material-ui';
import createDecorator from 'final-form-focus';

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import LockIcon from '@material-ui/icons/Lock';

import { FfmTextField, FfmSelect } from '../../utils/final-form-mui';
import CsrNotesTable from '../sections/CsrNotesTable'

import { ACTION_CSR_UPDATE_CUSTOMER,  } from '../../stores/actions/csr-customer-actions';
import { ACTION_CSR_ADD_NOTE } from '../../stores/actions/csr-notes-actions';

import { US_STATES } from '../../constants/default.const';
import { BROADBAND_VENUES } from '../../constants/broadband-venues.const';
import { composeValidators, required, mustBeEmail, mustBePhoneUS, mustBePhoneIntl, mustBePostalUS, mustBePostalIntl, mustBeCountry } from '../../validators';

import useDebounce from '../../useDebounce';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    //padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    textAlign: 'end',
  },
  buttonReset: {
    marginLeft:'1em',
  },
  lockIcon: {
    color: theme.palette.getContrastText(theme.palette.secondary.main)
  },
  table: {
    [theme.breakpoints.down('xs')]: {
      '& table th:first-child, & table td:first-child, & table th:last-child, & table td:last-child': {
        display: 'none',
      }
    }
  },
}));

const focusOnError = createDecorator()

/**
 * Account portion of customer page used to display account summary
 * 
 * @param {object} state [required] - Redux state
 * @param {object} dispatch [required] - Redux object that contains dispatch functions
 */
function CsrAccountSubPage({state, dispatch}) {
  const classes = useStyles();

  // used to make sure form.reset fires after native browser reset
  // also used to make sure dispatch occurs after onChange debounce
  const debouncer = useDebounce();

  return (
    !state.csr_customer ? <div>{state.csr_customer_requesting && 'Loading...'}</div> :
    <React.Fragment>
      <Form
        decorators={[focusOnError]}
        onSubmit={debouncer((values, form, complete) => {
          // retrieval of form state must be inside debouncer to ensure
          // event occurs after debounced input (50 milliseconds after typing)
          // form does not exists in jest therefore fallback to values
          dispatch.updateCustomer(state.csr_customer, state.csr_auth)(form ? form.getState().values : values);
        })}
        render={({ handleSubmit, form, values, submitting, dirty }) => (
          <form onSubmit={handleSubmit} noValidate>
            <Paper elevation={/* disable shadows */0} className={classes.paper}>
              <Grid container alignItems="flex-start" spacing={2}>
                <Grid item xs={12}>
                  <List>
                    <ListItem className={classes.buttonContainer} justify="flex-end">
                      <Button
                        variant="contained"
                        color="secondary"
                        type="submit"
                        disabled={submitting || !dirty || state.csr_update_customer_requesting ? true : false}
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="contained"
                        color="default"
                        className={classes.buttonReset}
                        onClick={form.reset}
                        disabled={!dirty}
                      >
                        Reset
                      </Button>
                    </ListItem>
                    <ListItem className={classes.buttonContainer}>
                      Account Creation Date: {state.csr_customer.created_date}
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <List>
                    <ListItem>
                      <h3>Customer Details</h3>
                    </ListItem>
                    <ListItem>
                      <Field
                        fullWidth
                        name="username"
                        initialValue={state.csr_customer.username}
                        component={TextField}
                        variant="outlined"
                        label="Username"
                        disabled
                      />
                    </ListItem>
                    <ListItem>
                      <Field
                        fullWidth
                        name="customer_id"
                        initialValue={state.csr_customer.customer_id}
                        component={TextField}
                        variant="outlined"
                        label="Account Number"
                        disabled
                      />
                    </ListItem>
                    <ListItem>
                      <FfmSelect
                        name="status"
                        initialValue={state.csr_customer.status}
                        native={true}
                        FormControlProps={{
                          fullWidth: true,
                        }}
                        TextFieldProps={{
                          variant:"outlined",
                          label:"Account Status",
                          required: true,
                        }}
                        validate={composeValidators(
                          required(),
                        )}
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="CLOSED">Closed</option>
                      </FfmSelect>
                    </ListItem>
                    <ListItem>
                      <ListItemText/>
                      <Button
                        variant="contained"
                        color="primary"
                        type="button"
                        disabled={submitting || state.csr_update_customer_requesting ? true : false}
                      >
                        <ListItemIcon><LockIcon className={classes.lockIcon}/></ListItemIcon>
                        Change Password
                      </Button>
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <List>
                    <ListItem>
                      <h3>Marketing Profile</h3>
                    </ListItem>
                    <ListItem>
                      <ListItemText primary={`Signup Source: ${state.csr_customer.scc}`} />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <List>
                    <ListItem>
                      <h3>Contact Information</h3>
                    </ListItem>
                    <ListItem>
                      <FfmTextField
                        name="first_name"
                        initialValue={state.csr_customer.first_name}
                        uncontrolled={true}
                        uncontrolledValue={values.first_name}
                        FormControlProps={{
                          fullWidth: true,
                        }}
                        TextFieldProps={{
                          variant: 'outlined',
                          label: 'First Name',
                          required: true,
                        }}
                        validate={composeValidators(
                          required(),
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <FfmTextField
                        name="last_name"
                        initialValue={state.csr_customer.last_name}
                        uncontrolled={true}
                        uncontrolledValue={values.last_name}
                        FormControlProps={{
                          fullWidth: true,
                        }}
                        TextFieldProps={{
                          variant: 'outlined',
                          label: 'Last Name',
                          required: true,
                        }}
                        validate={composeValidators(
                          required(),
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <FfmTextField
                        name="email"
                        initialValue={state.csr_customer.email}
                        uncontrolled={true}
                        uncontrolledValue={values.email}
                        FormControlProps={{
                          fullWidth: true,
                        }}
                        TextFieldProps={{
                          variant: 'outlined',
                          label: 'E-mail',
                          required: true,
                        }}
                        validate={composeValidators(
                          required(),
                          mustBeEmail(),
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <FfmTextField
                        name="phone_number"
                        initialValue={state.csr_customer.phone_number}
                        uncontrolled={true}
                        uncontrolledValue={values.phone_number}
                        FormControlProps={{
                          fullWidth: true,
                        }}
                        TextFieldProps={{
                          variant: 'outlined',
                          label: 'Phone',                          
                        }}
                        inputProps={{
                          maxLength: (values.mailing_address && values.mailing_address.mailing_country === 'US') ? 16 : 25,
                        }}
                        validate={composeValidators(                          
                          (values.mailing_address && values.mailing_address.mailing_country === 'US') ? mustBePhoneUS() : mustBePhoneIntl(),
                        )}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <List>
                    <ListItem>
                      <h3>Mailing Address</h3>
                    </ListItem>
                    <ListItem>
                      <FfmTextField
                        name="mailing_address.mailing_address_line_1"
                        initialValue={state.csr_customer.mailing_address.mailing_address_line_1}
                        uncontrolled={true}
                        uncontrolledValue={values.mailing_address && values.mailing_address.mailing_address_line_1}
                        FormControlProps={{
                          fullWidth: true,
                        }}
                        TextFieldProps={{
                          variant: 'outlined',
                          label: 'Address Line 1',
                        }}
                      />
                    </ListItem>
                    <ListItem>
                      <FfmTextField
                        name="mailing_address.mailing_address_line_2"
                        initialValue={state.csr_customer.mailing_address.mailing_address_line_2}
                        uncontrolled={true}
                        uncontrolledValue={values.mailing_address && values.mailing_address.mailing_address_line_2}
                        FormControlProps={{
                          fullWidth: true,
                        }}
                        TextFieldProps={{
                          variant: 'outlined',
                          label: 'Address Line 2',
                        }}
                      />
                    </ListItem>
                    <ListItem>
                      <FfmTextField
                        name="mailing_address.mailing_city"
                        initialValue={state.csr_customer.mailing_address.mailing_city}
                        uncontrolled={true}
                        uncontrolledValue={values.mailing_address && values.mailing_address.mailing_city}
                        FormControlProps={{
                          fullWidth: true,
                        }}
                        TextFieldProps={{
                          variant: 'outlined',
                          label: 'City',
                        }}
                      />
                    </ListItem>
                    <ListItem>
                      {(values.mailing_address && values.mailing_address.mailing_country === 'US') ? // drop-down for US and text field for intl
                      <FfmSelect
                        name="mailing_address.mailing_state"
                        initialValue={state.csr_customer.mailing_address.mailing_state}
                        native={true}
                        FormControlProps={{
                          fullWidth: true,
                        }}
                        TextFieldProps={{
                          variant:"outlined",
                          label:"US State",
                        }}
                      >
                        <option value=""></option>
                        {US_STATES.map(item => 
                          <option key={item.abbr} value={item.abbr}>{item.name}</option>
                        )}
                      </FfmSelect>
                      :
                      <FfmTextField
                        name="mailing_address.mailing_state"
                        initialValue={state.csr_customer.mailing_address.mailing_state}
                        uncontrolled={true}
                        uncontrolledValue={values.mailing_address && values.mailing_address.mailing_state}
                        FormControlProps={{
                          fullWidth: true,
                        }}
                        TextFieldProps={{
                          variant:"outlined",
                          label:"State",
                        }}
                      />
                      }
                    </ListItem>
                    <ListItem>
                      <FfmTextField
                        name="mailing_address.mailing_postal_code"
                        initialValue={state.csr_customer.mailing_address.mailing_postal_code}
                        uncontrolled={true}
                        uncontrolledValue={values.mailing_address && values.mailing_address.mailing_postal_code}
                        FormControlProps={{
                          fullWidth: true,
                        }}
                        TextFieldProps={{
                          variant:"outlined",
                          label:"Postal Code",
                        }}
                        inputProps={{
                          maxLength:10,
                        }}
                        validate={composeValidators(
                          (values.mailing_address && values.mailing_address.mailing_country === 'US') ? mustBePostalUS() : mustBePostalIntl(),
                        )}
                      />
                    </ListItem>
                    <ListItem>
                      <FfmTextField
                        name="mailing_address.mailing_country"
                        initialValue={state.csr_customer.mailing_address.mailing_country}
                        uncontrolled={true}
                        uncontrolledValue={values.mailing_address && values.mailing_address.mailing_country}
                        FormControlProps={{
                          fullWidth: true,
                        }}
                        TextFieldProps={{
                          variant:"outlined",
                          label:"Country",
                        }}
                        inputProps={{
                          maxLength:2,
                        }}
                        validate={composeValidators(
                          mustBeCountry(),
                        )}
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <List>
                    <ListItem>
                      <h3>Base Address</h3>
                    </ListItem>
                    <ListItem>
                      <FfmSelect
                        name="base_address.base"
                        initialValue={state.csr_customer.base_address.base}
                        native={true}
                        FormControlProps={{
                          fullWidth: true,
                        }}
                        TextFieldProps={{
                          variant:"outlined",
                          label:"Base",
                        }}
                      >
                        <option value=""></option>
                        {Object.keys(BROADBAND_VENUES).map(venueName => 
                          <option key={venueName} value={venueName}>
                            {venueName}
                          </option>
                        )}
                      </FfmSelect>
                    </ListItem>
                    {values.base_address && values.base_address.base && BROADBAND_VENUES[values.base_address.base] &&
                    <ListItem>
                      <FfmSelect
                        name="base_address.area"
                        initialValue={state.csr_customer.base_address.area}
                        native={true}
                        FormControlProps = {{
                          fullWidth: true,
                        }}
                        TextFieldProps = {{
                          variant: 'outlined',
                          label: 'Area',
                        }}
                      >
                        <option value=""></option>
                        {Object.keys(BROADBAND_VENUES[values.base_address.base].areas_and_buildings).map(area => 
                          <option key={area} value={area}>
                            {area}
                          </option>
                        )}
                      </FfmSelect>
                    </ListItem>
                    }
                    {values.base_address && values.base_address.base && values.base_address.area &&
                    BROADBAND_VENUES[values.base_address.base] &&
                    BROADBAND_VENUES[values.base_address.base].areas_and_buildings[values.base_address.area] &&
                    <ListItem>
                      <FfmSelect
                        name="base_address.building"
                        initialValue={values.base_address.base && values.base_address.area && state.csr_customer.base_address.building}
                        native={true}
                        FormControlProps = {{
                          fullWidth: true,
                        }}
                        TextFieldProps = {{
                          variant: 'outlined',
                          label: 'Building',
                        }}
                      >
                      <option value=""></option>
                        {BROADBAND_VENUES[values.base_address.base].areas_and_buildings[values.base_address.area].map(building => 
                          <option key={building} value={building}>
                            {building}
                          </option>
                        )}
                      </FfmSelect>
                    </ListItem>
                    }
                    {values.base_address && values.base_address.base && values.base_address.area &&
                    <ListItem>
                      <FfmTextField
                        name="base_address.room"
                        initialValue={state.csr_customer.base_address.room}
                        uncontrolled={true}
                        uncontrolledValue={values.base_address.room}
                        FormControlProps = {{
                          fullWidth: true,
                        }}
                        TextFieldProps = {{
                          variant: 'outlined',
                          label: 'Room',
                        }}
                      />
                    </ListItem>
                    }
                  </List>
                </Grid>
              </Grid>
            </Paper>
          </form>
        )
      } />
      <Form
        onSubmit={dispatch.addNote(state.csr_customer, state.csr_auth)}
        render={({ handleSubmit, form, values, submitting, valid }) => (
          <form onSubmit={async (event) => {
            await handleSubmit(event);
            if (valid) {
              form.reset(); // only reset on valid form
            }
          }} noValidate>
            <Paper elevation={/* disable shadows */0} className={classes.paper}>
              <Grid container alignItems="flex-start" spacing={2}>
                <Grid item xs={12}>
                  <List>
                    <ListItem>
                      <h3>CsrNotesTable</h3>
                    </ListItem>
                    <ListItem>
                      <FfmTextField
                        name="note"
                        uncontrolled={true}
                        uncontrolledValue={values.note}
                        FormControlProps={{
                          fullWidth: true,
                        }}
                        TextFieldProps={{
                          variant: 'outlined',
                          label: 'Note',
                          multiline: true,
                        }}
                        onKeyDown={(event)=>{
                          // ctrl and enter will submit the form
                          if (event.keyCode === 13 && event.ctrlKey) {
                            console.log('enter');
                            form.submit();
                          }
                        }}
                      />
                    </ListItem>
                    <ListItem>
                      <Field
                        placeholder="User"
                        name="user"
                        component="input"
                        initialValue={state.csr_auth.username}
                        type="hidden"
                      />
                    </ListItem>
                    <ListItem className={classes.buttonContainer}>
                      <Button
                        name="noteSubmit"
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={submitting || state.csr_update_notes_requesting ? true : false}
                        className={classes.button}
                      >
                        Save Note
                      </Button>
                    </ListItem>
                    <ListItem className={classes.table}>
                      <CsrNotesTable csr_notes={state.csr_notes}/>
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Paper>
          </form>
        )
      } />
    </React.Fragment>
  );
}
// type declaration and enforcement
CsrAccountSubPage.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  state: {
    ...state.csrAuthReducer,
    ...state.csrCustomerReducer,
    ...state.csrNotesReducer,
  }
});
const mapDispatchToProps = (dispatch) => ({
  dispatch: {
    updateCustomer: (csr_customer, csr_auth) => (body) => {
      dispatch({
        type: ACTION_CSR_UPDATE_CUSTOMER,
        payload: {
          token: csr_auth.token,
          customer_id: csr_customer.customer_id,
          body: body
        }
      });
    },
    addNote: (csr_customer, csr_auth) => (body) => {
      dispatch({
        type: ACTION_CSR_ADD_NOTE,
        payload: {
          token: csr_auth.token,
          customer_id: csr_customer.customer_id,
          body: body
        }
      });
    },
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CsrAccountSubPage)