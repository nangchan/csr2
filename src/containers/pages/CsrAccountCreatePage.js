import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { List, ListItem, ListItemText, Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress'

import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-focus';

import { COUNTRIES, GRATIS_PLANS } from '../../constants/default.const';

import { FfmTextField, FfmSelect } from '../../utils/final-form-mui';

import CsrChangePlansSubPage from '../subpages/CsrChangePlansSubPage';

import {
  required, 
  composeValidators, 
  mustBeEmail, 
  mustBeNumber, 
  validCreditCard, 
  mustBeFutureYearAndMonth, 
  minLength
} from "../../validators";

import {
  ACTION_CSR_ACCOUNT_CREATE,
  ACTION_CSR_DUPLICATE_USERNAME_CHECK,
  ACTION_CSR_DUPLICATE_USERNAME_CHECK_CLEAR_ERROR,
} from "../../stores/actions/csr-account-create-actions";
import { WIFI_PRODUCTS } from "../../constants/wifi-products.const";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    padding: theme.spacing(1),
    //minWidth: 300,
    width: '100%',
    ".MuiInputLabel-formControl": {
      color: "#35c0e2"
    }
  },
  createAccountTitle: {
    marginBottom: '25px',
  },
  submitButton: {
    backgroundColor: '#d52b1e',
    color: 'white',
  },
  caption: {
    marginLeft: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  belowSubmitHelperText: {
    color: '#d52b1e'
  }
}));

const focusOnError = createDecorator();

const retailProductsGroupedByCurrency = () => {
  return Object.entries(WIFI_PRODUCTS).reduce((acc, items) => {
    const itm = items[1];
    if (itm.selfcare_title) {
      acc[itm.selfcare_title] = {
        ...acc[itm.selfcare_title],
        [itm.currency]: [
          ...((acc[itm.selfcare_title] && acc[itm.selfcare_title][itm.currency]) 
          || []), 
          itm
        ]
      }
    }
    return acc;
  }, {});
}

/**
 * Account creation page including a dynamic form for creating retail, broadband, and gratis accounts
 * 
 * @param {object} state [required] - Redux state
 * @param {object} dispatch [required] - Redux object that contains dispatch functions
 */

function CsrAccountCreatePage({ state, dispatch, history }) {
  const classes = useStyles();

  const initialState = {
    customer_type: '',
    retail_plan_type: '',
    currency: '',
    product_code: '',
    currencies: [],
    retail_products: [],
  };

  const [dropdownState, setDropdownState] = useState(initialState);

  const broadbandDataInitialState =  {
      base_address: {
        base: '',
        area: '',
        building: '',
        room: ''
      },
      product_codes: [],
  }

  const [broadbandData, passBroadbandData] = useState(broadbandDataInitialState)

  // reset function for areas and buildings called on submit of form
  const resetAreaAndBuilding = () => setDropdownState({
    ...dropdownState,
  })

  // some field names have a nested structures i.e. "base_address.base"
  // this function grabs the value after the dot, if present, and adds it to the state object (flattened)
  const handleDropdownChange = (event) => {
    const nested = event.target.name.split('.');
    const lastIndex = nested.length - 1;
    setDropdownState(dropdown => ({
      ...dropdown,
      [nested[lastIndex]]: event.target.value,
    }));
    passBroadbandData(broadbandDataInitialState);
  }

  const handleRetailPlanChange = (event) => {
    setDropdownState({
      ...dropdownState,
      [event.target.name]: event.target.value,
      currencies: Object.keys(retailProductsGroupedByCurrency()[event.target.value]),
      currency: initialState.currency,
      product_code: initialState.product_code,
    });
  }

  const handleCurrencyChange = (event) => {
    setDropdownState({
      ...dropdownState,
      [event.target.name]: event.target.value,
      retail_products: retailProductsGroupedByCurrency()[dropdownState.retail_plan_type][event.target.value],
      product_code: initialState.product_code,
    });
  }

  const months = [
    '1 - January',
    '2 - February',
    '3 - March',
    '4 - April',
    '5 - May',
    '6 - June',
    '7 - July',
    '8 - August',
    '9 - September',
    '10 - October',
    '11 - November',
    '12 - December'
  ];

  // listen for fulfillment of account creation
  // With payload's response w/ customer id, redirect to customer's page
  useEffect(() => {
    state.csr_account_create && history.push(`/customer/${state.csr_account_create.customer_id}/account`)

    // ignore history dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.csr_account_create])

  return (
    <>
    <Typography variant="h5" component="h5" className={classes.createAccountTitle}>
      Create an Account
    </Typography>
    <Form
      decorators={[focusOnError]}
      validate={values => ({
        exp_year: dropdownState.customer_type !== "gratis" ? mustBeFutureYearAndMonth(values.exp_month - 1, values.exp_year) : undefined,
        username: state.csr_duplicate_username_check_error ? state.csr_duplicate_username_check_error.message : undefined
      })}
      onSubmit={dispatch.csrAccountCreate(state.csr_auth)}
      render={({ handleSubmit, form, values, submitFailed, valid }) => (
        <form onSubmit={async (event) => {
          await handleSubmit(event)
          // only reset on valid form
          if (valid) {
            form.reset()
            resetAreaAndBuilding()
          }
        }} noValidate>
          <Grid container alignItems="flex-start" spacing={5}>
              <Grid item xs={12} sm={12} md={4}>
                <Grid item xs={12} sm={12} md={12}>
                  <FfmSelect
                    name="customer_type"
                    native={true}
                    validate={composeValidators(
                      required(),
                    )}
                    initialValue={dropdownState.customer_type}
                    onChange={handleDropdownChange}
                    FormControlProps={{
                      fullWidth: true,
                      className: classes.formControl,
                    }}
                    TextFieldProps={{
                      variant: "outlined",
                      label: "Select Customer Type",
                    }}
                  >
                    <option value=""></option>
                    <option value="retail">Retail</option>
                    <option value="broadband">Broadband</option>
                    <option value="gratis">Gratis</option>
                  </FfmSelect>
                </Grid>
                {dropdownState.customer_type === 'retail' &&
                  <Grid item xs={12} sm={12} md={12}>
                    <FfmSelect
                      name="retail_plan_type"
                      validate={composeValidators(
                        required(),
                      )}
                      initialValue={dropdownState.retail_plan_type}
                      native={true}
                      onChange={handleRetailPlanChange}
                      FormControlProps={{
                        fullWidth: true,
                        className: classes.formControl,
                      }}
                      TextFieldProps={{
                        variant: 'outlined',
                        margin: 'normal',
                        label: 'Select Retail Plan',
                      }}
                    >
                        <option value=""></option>
                      {Object.keys(retailProductsGroupedByCurrency()).map((product, idx) => {
                        return (
                          <option value={product} key={idx}>
                            {product}
                          </option>
                        )
                      })}
                    </FfmSelect>
                  </Grid>}
                  {dropdownState.customer_type === 'retail' &&
                    <Grid item xs={12} sm={12} md={12}>
                      <FfmSelect
                        name="currency"
                        validate={composeValidators(
                          required(),
                        )}
                        initialValue={dropdownState.currency}
                        native={true}
                        onChange={handleCurrencyChange}
                        FormControlProps={{
                          fullWidth: true,
                          className: classes.formControl,
                        }}
                        TextFieldProps={{
                          variant: 'outlined',
                          margin: 'normal',
                          label: 'Select Currency',
                        }}
                      >
                          <option value=""></option>
                        {dropdownState.currencies.map((currency, idx) => {
                          return (
                            <option value={currency} key={idx}> 
                              {currency} 
                            </option>
                          )
                        })}
                      </FfmSelect> 
                    </Grid>}
                    {dropdownState.customer_type === 'retail' &&
                    <Grid item xs={12} sm={12} md={12}>
                      <FfmSelect
                        name="product_code"
                        validate={composeValidators(
                          required(),
                        )}
                        initialValue={dropdownState.product_code}
                        native={true}
                        onChange={handleDropdownChange}
                        FormControlProps={{
                          fullWidth: true,
                          className: classes.formControl,
                        }}
                        TextFieldProps={{
                          variant: 'outlined',
                          margin: 'normal',
                          label: 'Select Retail Product',
                        }}
                      >
                        <option value=""></option>
                        {dropdownState.retail_products.map((product, i) => {
                          return (
                            <option value={product.product_code} key={i}>
                              {product.name}
                            </option>
                          );
                        })}
                      </FfmSelect>
                    </Grid>}
                    {dropdownState.customer_type === 'gratis' && 
                      <Grid item xs={12} sm={12} md={12}>
                        <FfmSelect
                          name="product_code"
                          initialValue={dropdownState.product_code}
                          validate={composeValidators(
                            required(),
                          )}
                          native={true}
                          FormControlProps={{
                            fullWidth: true,
                            className: classes.formControl,
                          }}
                          TextFieldProps={{
                            variant: 'outlined',
                            margin: 'normal',
                            label: 'Choose Gratis Plan',
                          }}
                        >
                          <option value=""></option>
                          {GRATIS_PLANS.map((plan, idx) => {
                            return <option value={plan.product_code} key={idx}>{plan.product}</option>
                          })}
                        </FfmSelect>
                      </Grid>
                    }
                </Grid>
                {dropdownState.customer_type === 'broadband' && 
                <Grid item xs={12} sm={12} md={12}>
                  <CsrChangePlansSubPage passBroadbandData={passBroadbandData} hide={true} />
                  <Field
                    name="product_code"
                    initialValue={dropdownState.customer_type === "broadband" ? broadbandData.product_codes : ""}
                    component={"input"}
                    hidden
                  />
                  <Field
                    name="base_address.base"
                    initialValue={broadbandData.base_address.base}
                    component={"input"}
                    hidden
                  />
                  <Field
                    name="base_address.area"
                    initialValue={broadbandData.base_address.area}
                    component={"input"}
                    hidden
                  />
                  <Field
                    name="base_address.building"
                    initialValue={broadbandData.base_address.building}
                    component={"input"}
                    hidden
                  />
                  <Field
                    name="base_address.room"
                    initialValue={broadbandData.base_address.room}
                    component={"input"}
                    hidden
                  />
                </Grid>
                }
                <Grid item xs={12} sm={12} md={7}>
                    <Paper elevation={1}>
                      <List>
                        <ListItem>
                          <h3>Enter Customer's Information</h3>
                        </ListItem>
                        <ListItem>
                          <FfmTextField
                            name="username"
                            label="Username"
                            initialValue=""
                            uncontrolled={true}
                            uncontrolledValue={values.username}
                            onBlur={(event, input, meta) => input.value && dispatch.csrDuplicateUsernameCheckIfNotNull(
                              state.csr_auth,
                              input.value,
                            )(event, input)}
                            onFocus={dispatch.csrDuplicateUsernameCheckClearError}
                            validate={composeValidators(
                              required(),
                            )}
                            FormControlProps={{
                              fullWidth: true,
                            }}
                            TextFieldProps={{
                              variant: "outlined",
                              label: "Username",
                              required: true,
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <FfmTextField
                            name="email"
                            variant="outlined"
                            label="Email"
                            initialValue=""
                            uncontrolled={true}
                            uncontrolledValue={values.email}
                            validate={composeValidators(
                              required(),
                              mustBeEmail(),
                            )}
                            FormControlProps={{
                              fullWidth: true,
                            }}
                            TextFieldProps={{
                              variant: "outlined",
                              label: "Email",
                              required: true,
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <FfmTextField
                            name="password"
                            initialValue=""
                            uncontrolled={true}
                            uncontrolledValue={values.password}
                            validate={composeValidators(
                              required(),
                              minLength(6),
                            )}
                            FormControlProps={{
                              fullWidth: true,
                            }}
                            TextFieldProps={{
                              variant: "outlined",
                              label: "Password (must be between 6 - 16 characters long)",
                              required: true,
                            }}
                            inputProps={{
                              maxLength: 16,
                              type: "password",
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <FfmTextField
                            name="first_name"
                            initialValue=""
                            uncontrolled={true}
                            uncontrolledValue={values.first_name}
                            validate={composeValidators(
                              required(),
                            )}
                            FormControlProps={{
                              fullWidth: true,
                            }}
                            TextFieldProps={{
                              variant: "outlined",
                              label: "First Name",
                              required: true,
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <FfmTextField
                            name="last_name"
                            initialValue=""
                            uncontrolled={true}
                            uncontrolledValue={values.last_name}
                            validate={composeValidators(
                              required(),
                            )}
                            FormControlProps={{
                              fullWidth: true,
                            }}
                            TextFieldProps={{
                              variant: "outlined",
                              label: "Last Name",
                              required: true,
                            }}
                          />
                        </ListItem>
                        {dropdownState.customer_type !== "gratis" &&
                        <>
                        <ListItem>
                          <FfmTextField
                            name="payment_cc.credit_card_number"
                            initialValue=""
                            uncontrolled={true}
                            uncontrolledValue={values.payment_cc && values.payment_cc.credit_card_number}
                            validate={composeValidators(
                              required(),
                              validCreditCard(),
                            )}
                            FormControlProps={{
                              fullWidth: true,
                            }}
                            TextFieldProps={{
                              variant: "outlined",
                              label: "Credit Card Number",
                              required: true,
                            }}
                            inputProps={{
                              maxLength: 16,
                            }}
                          />
                        </ListItem>
                        <Grid container>
                          <Grid item xs={12} md={6} sm={6}>
                            <ListItem>
                              <FfmSelect
                                name="exp_month"
                                native={true}
                                validate={composeValidators(
                                  required(),
                                )}
                                FormControlProps={{
                                  fullWidth: true,
                                }}
                                TextFieldProps={{
                                  variant: "outlined",
                                  label: "Expiration Month",
                                  required: true,
                                }}
                              >
                                <option value=""></option>
                                {months.map((month, idx) => {
                                  return <option value={idx + 1} key={idx}>{month}</option>
                                })}
                              </FfmSelect>
                            </ListItem>
                          </Grid>
                          <Grid item xs={12} md={6} sm={6}>
                            <ListItem>
                              <FfmSelect
                                name="exp_year"
                                native={true}
                                validate={composeValidators(
                                  required(),
                                )}
                                FormControlProps={{
                                  fullWidth: true,
                                }}
                                TextFieldProps={{
                                  variant: "outlined",
                                  label: "Expiration Year",
                                  required: true,
                                }}
                              >
                                <option value=""></option>
                                {[...Array(15)].map((val, idx) => {
                                  const year = new Date().getFullYear();
                                  return <option value={year + idx} key={idx}>{year + idx}</option>
                                })}
                              </FfmSelect>
                            </ListItem>
                          </Grid>
                          <Field
                            name="payment_cc.credit_card_expiration"
                            defaultValue={values.exp_month && values.exp_year && (values.exp_month.toString().padStart(2,0) + (values.exp_year + '').substring(2))}
                            component={"input"}
                            hidden
                          />
                        </Grid>
                        <ListItem>
                          <FfmTextField
                            name="cvv2"
                            initialValue=""
                            uncontrolled={true}
                            uncontrolledValue={values.cvv2}
                            validate={composeValidators(
                              required(),
                              mustBeNumber(),
                            )}
                            FormControlProps={{
                              fullWidth: true,
                            }}
                            TextFieldProps={{
                              variant: "outlined",
                              label: "Security Code",
                              required: true,
                            }}
                            inputProps={{
                              maxLength: 4,
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <FfmSelect
                            name="country"
                            initialValue="US"
                            native={true}
                            validate={composeValidators(
                              required(),
                            )}
                            FormControlProps={{
                              fullWidth: true,
                            }}
                            TextFieldProps={{
                              variant: "outlined",
                              label: "Country",
                              required: true,
                            }}
                          >
                            {COUNTRIES.map((country, idx) => (
                              <option value={country.CountryCode} key={idx}>
                                {country.CountryName}
                              </option>
                            ))}
                          </FfmSelect>
                        </ListItem>
                        {values.country === 'BR' &&
                        <ListItem>
                          <FfmTextField
                            name="gru_cpf"
                            initialValue=""
                            uncontrolled={true}
                            uncontrolledValue={values.gru_cpf}
                            validate={composeValidators(
                              mustBeNumber(),
                            )}
                            FormControlProps={{
                              fullWidth: true,
                            }}
                            TextFieldProps={{
                              variant: "outlined",
                              label: "CPF Code",
                            }}
                            inputProps={{
                              maxLength: 10,
                            }}
                          /> 
                        </ListItem>
                        }
                        {values.country === "US" &&
                        <ListItem>
                          <FfmTextField
                            name="postal_code"
                            initialValue=""
                            uncontrolled={true}
                            uncontrolledValue={values.postal_code}
                            validate={composeValidators(
                              required(),
                              mustBeNumber(),
                            )}
                            FormControlProps={{
                              fullWidth: true,
                            }}
                            TextFieldProps={{
                              variant: "outlined",
                              label: "Billing Zip Code",
                              required: true,
                            }}
                            inputProps={{
                              maxLength: 10,
                            }}
                          /> 
                        </ListItem>
                        }
                        </>
                        }
                        <ListItem>
                          <FfmSelect
                            name="locale"
                            initialValue="en_US"
                            native={true}
                            validate={composeValidators(
                              required(),
                            )}
                            FormControlProps={{
                              fullWidth: true,
                            }}
                            TextFieldProps={{
                              variant: "outlined",
                              label: "Locale",
                              required: true,
                            }}
                          >
                            <option value=""></option>
                            <option value="en_US">United States - English</option>
                            <option value="en_UK">United Kingdom - English</option>
                            <option value="fr">French - France</option>
                            <option value="fr_CA">French - Canada</option>
                            <option value="es">Spanish</option>
                            <option value="de">German</option>
                            <option value="it">Italian</option>
                            <option value="ja">Japanese</option>
                            <option value="zh_CN">Simplified Chinese</option>
                            <option value="pt_BR">Portuguese - Brazil</option>
                            <option value="ru">Russian</option>
                            <option value="vi_VN">Vietnamese - Vietname</option>
                            <option value="ms_MY">Malay - Malaysia</option>
                          </FfmSelect>
                        </ListItem>
                        <ListItem>
                          <Button variant="contained" type="submit" className={classes.submitButton} disabled={dropdownState.customer_type === "broadband" && !broadbandData.product_codes.length}>
                              {state.csr_account_create_requesting ? <CircularProgress /> : 'Submit'}
                          </Button>
                          {dropdownState.customer_type === "broadband" && !broadbandData.product_codes.length &&
                          <Typography variant="caption" className={classes.caption}>
                            <p>Please select a plan</p>
                          </Typography>
                          }
                        </ListItem>
                        <ListItem>
                          <ListItemText className={classes.belowSubmitHelperText}>
                            {submitFailed && !valid && "Please fill in required(*) fields"}
                          </ListItemText>
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>
                </Grid>
            </form>
          )}
        >
      </Form>
    </>
  );
}

const mapStateToProps = state => ({
  state: {
    ...state.csrAuthReducer,
    ...state.csrAccountCreateReducer
  }
});

const mapDispatchToProps = dispatch => ({
  dispatch: {
    csrAccountCreate: csr_auth => event => {dispatch({
      type: ACTION_CSR_ACCOUNT_CREATE,
      payload: {
        token: csr_auth.token,
        request: event
    }})},
    csrDuplicateUsernameCheckIfNotNull: (csr_auth) => (event, input) =>
      input.value &&
      dispatch({
        type: ACTION_CSR_DUPLICATE_USERNAME_CHECK,
        payload: {
          token: csr_auth.token,
          request: input.value
        }
      }),
    csrDuplicateUsernameCheckClearError: payload =>
      dispatch({
        type: ACTION_CSR_DUPLICATE_USERNAME_CHECK_CLEAR_ERROR
      })
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CsrAccountCreatePage);