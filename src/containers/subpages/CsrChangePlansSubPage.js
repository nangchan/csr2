import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux'

import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Button,
  TextField,
  Box,
  CircularProgress
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { updateProductsAction } from '../../stores/actions/csr-change-plans-actions';
import { checkoutAction } from '../../stores/actions/csr-checkout-actions';

import { STUB_EPIC } from '../../settings';

import { BROADBAND_VENUES } from '../../constants/broadband-venues.const';
import { BROADBAND_CATALOG } from '../../constants/broadband-catalog.const';

import {
  durationName,
  newOptionMetadata,
  buildTableProducts,
  priceCatalogLookup,
  choiceRequiredCatalogLookup,
  productCatalogLookup
} from './CsrChangePlansSubPage.helper';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1),
    flexGrow: 1,
  },
  container: {
    alignItems: 'flex-start',
  },
  legend: {
    marginTop: theme.spacing(3),
  },
  paper: {
    margin: theme.spacing(3),
    color: theme.palette.text.secondary,
  },
  caption: {
    marginTop: theme.spacing(3),
  },
  dropdown: {
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(3),
  },
  loading: {
    marginRight: theme.spacing(3),
  },
  label: {
    flexGrow: 1,
    width: 10,
    textAlign: 'center',
  },
  tableRow: {
    '&:nth-child(odd)': { // stripe body rows
      backgroundColor: theme.palette.background.default,
    },
    '&:last-child': { // keep total unchanged
      backgroundColor: theme.palette.background.paper,
    },
  },
  submitButton: {
    float: 'right',
  },
}));

const CsrChangePlansSubPage = ({state, dispatch, passBroadbandData, hide}) => {
  const history = useHistory();
  const classes = useStyles();
  const durationAll = ["1_day", "1_week", "1_month", "monthly"];
  const optionMetadataInitial = {
    // NOTE: nested dependencies need to be in order meaning a child who is dependent on a parent,
    // the parent must appear first before the child in the option list below (ie. core_tv must appear before starz)
    optionChosen: {
      internet___basic_std_exp: '',
      device: '',
      basic_tv: '',
      core_tv: '',
      starz: '',
      movies: '',
      duration: '',
    },
    optionEnabled: {
      internet___basic_std_exp: false,
      device: false,
      basic_tv: false,
      core_tv: false,
      starz: false,
      movies: false,
      duration: false,
    },
    durationAllowed: {
      ...durationName,
      /* sample content
      '1_day': '1 Day',
      '1_week': '1 Week',
      '1_month': '1 Month',
      'monthly': 'Monthly',
      */
    },
    purchasing: [
      /* sample content
      { name: 'Blazing Internet', price: '$54.99'},
      { name: '2 Additional Devices', price: '$20.00'},
      { name: 'Basic TV', price: '$0.00'},
      { name: 'Core TV', price: '$19.95'},
      { name: 'Starz', price: '$14.95'},
      { name: 'Movies', price: '$5.00'},
      */
    ],
    productCodes: [
      /* sample content
      'DL_Basic_Broadband_Internet_[1_Month_Recurring]',
      'DL_Broadband_Additional_Device_[1_Month_Recurring]',
      'DL_Broadband_Additional_Device_[1_Month_Recurring]',
      */
    ],
  }
  const [optionMetadata, setOptionMetadata] = useState(optionMetadataInitial);
  const [baseAddress, setBaseAddress] = useState({
    base: '',
    area: '',
    building: '',
    room: ''
  });
  const [purchased, setPurchased] = useState([])
  const [optionCatalog, setOptionCatalog] = useState();

  const handleChangeOptions = (event) => {
    setOptionMetadata(newOptionMetadata(event, optionMetadata, durationAll, optionCatalog));
  };

  const handleChangeBase = (event) => {
    // reset state back to initial state
    setOptionMetadata(optionMetadataInitial)
    // set target venue
    handleChangeBaseAddress(event);
    // dispatch fetch product catalog by venue id
  };

  /**
   * Set the baseAddress object such that any proceeding value is cleared
   * NOTE: value can never be undefined since this will cause label and text to overlap
   * 
   * @param {object} event [required] - Event object
   */
  const handleChangeBaseAddress = (event) => {
    switch (event.target.name) {
      case 'base': {
        setBaseAddress({
          base: event.target.value,
          area: '',
          building: '',
          room: '',
        });
        break;
      }
      case 'area': {
        setBaseAddress({
          ...baseAddress,
          area: event.target.value,
          building: '',
          room: '',
        });
        break;
      }
      case 'building': {
        setBaseAddress({
          ...baseAddress,
          building: event.target.value,
          room: '',
        });
        break;
      }
      default : {
        setBaseAddress({
          ...baseAddress,
          [event.target.name]: event.target.value,
        });
        break;
      }
    }
  };

  const handleChangePlan = (event) => {
    // update customer products
    // existing products will not change, new products will be added, products not listed will be removed
    dispatch.checkout(state.csr_auth.token, state.csr_customer && state.csr_customer.customer_id, optionMetadata.productCodes, state.csr_customer, baseAddress)
    history.push('/checkout');
  };

  // if product catalog is empty and base exists then fetch catalog by base
  useEffect(()=>{
    if (state.csr_customer && state.csr_customer.base_address) {
      // build purchased table
      if (state.csr_customer.product_codes || state.csr_customer.inactive_purchased_products) {
        setPurchased(buildTableProducts(state.csr_customer.product_codes || state.csr_customer.inactive_purchased_products));
      }

      // set baseAddress based on current settings
      if (state.csr_customer.base_address) {
        setBaseAddress({
          base: state.csr_customer.base_address.base,
          area: state.csr_customer.base_address.area,
          building: state.csr_customer.base_address.building,
          room: state.csr_customer.base_address.room,
        })
      }

      // get list of all internet options and choices
      // const internetOptionsAndChoices = 
      //   Object.keys(BROADBAND_CATALOG).reduce((internetOptionsAndChoices, venueId) => {
      //     const internetOption = BROADBAND_CATALOG[venueId].Room.pages.internet_sales[0];
      //     const internetChoices = Object.keys(BROADBAND_CATALOG[venueId].Room.options[internetOption].choices);
      //     internetOptionsAndChoices.options = new Set([
      //       ...internetOptionsAndChoices.options,
      //       internetOption
      //     ]);
      //     internetOptionsAndChoices.choices = new Set([
      //       ...internetOptionsAndChoices.choices,
      //       ...internetChoices
      //     ]);
      //     return internetOptionsAndChoices;
      //   }, {options: [], choices: []})
      // console.log(internetOptionsAndChoices)
    }
    // disable lint dependency checks to suppress handleChangeBase dependency warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.csr_customer]);

  // show plan options if room filled in
  useEffect(() => {
    if (baseAddress.room) {
      // shown product options based on venue name
      setOptionCatalog(baseAddress.base && baseAddress.room && BROADBAND_CATALOG[baseAddress.base].Room.options);
    } else {
      // clear option catalog so no options are shown
      setOptionCatalog();
      // reset previously chosen options
      setOptionMetadata(optionMetadataInitial)
    }
    // disable lint dependency checks since optionMetadataInitial is static
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseAddress]);

  // if any base address or product code change then pass it to parent
  useEffect(() => {
    if (passBroadbandData) {
      passBroadbandData({
        base_address: baseAddress,
        product_codes: optionMetadata.productCodes,
      });
    }
    // disable lint dependency checks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseAddress, optionMetadata.productCodes]);

  return (
    <Grid className={classes.container} container>
      <Grid container item xs={12} sm={12} md={6}>
        <Grid container item xs={12}>
          <Typography variant="h6">
            Plan Selection
          </Typography>
        </Grid>
        <Grid container item xs={12}>
          <TextField
            name="base"
            className={classes.dropdown}
            value={baseAddress.base}
            select
            fullWidth
            label="Broadband Base"
            SelectProps={{
              native: true,
            }}
            margin="normal"
            variant="outlined"
            onChange={handleChangeBase}
            helperText={!baseAddress.base && 'Please select a base to continue'}
          >
            <option value=""></option>
            {STUB_EPIC && // add bad venue in stub mode
            <option value="invalid">STUB - Fake Stubbed Venue</option>
            }
            {Object.keys(BROADBAND_VENUES).map(venueName => (
              <option key={venueName} value={venueName}>
                {`${BROADBAND_VENUES[venueName].venue_id.toUpperCase()} - ${venueName}`}
              </option>
            ))}
          </TextField>
        </Grid>
        {baseAddress.base &&
        <Grid container item xs={12}>
          <TextField
            name="area"
            className={classes.dropdown}
            value={baseAddress.area}
            select
            fullWidth
            label="Area"
            SelectProps={{
              native: true,
            }}
            margin="normal"
            variant="outlined"
            onChange={handleChangeBaseAddress}
            helperText={!baseAddress.base && 'Please select a base to continue'}
          >
            <option value=""></option>
            {Object.keys(BROADBAND_VENUES[baseAddress.base].areas_and_buildings).map(areaName => (
              <option key={areaName} value={areaName}>
                {areaName}
              </option>
            ))}
          </TextField>
        </Grid>
        }
        {baseAddress.area && BROADBAND_VENUES[baseAddress.base] && BROADBAND_VENUES[baseAddress.base].areas_and_buildings[baseAddress.area] && 
        <Grid container item xs={12}>
          <TextField
            name="building"
            className={classes.dropdown}
            value={baseAddress.building}
            select
            fullWidth
            label="Building"
            SelectProps={{
              native: true,
            }}
            margin="normal"
            variant="outlined"
            onChange={handleChangeBaseAddress}
            helperText={!baseAddress.base && 'Please select a base to continue'}
          >
            <option value=""></option>
            {BROADBAND_VENUES[baseAddress.base].areas_and_buildings[baseAddress.area].map(building => (
              <option key={building} value={building}>
                {building}
              </option>
            ))}
          </TextField>
        </Grid>
        }
        {baseAddress.building &&
        <Grid container item xs={12}>
          <TextField
            name="room"
            className={classes.dropdown}
            value={baseAddress.room}
            fullWidth
            label="Room"
            margin="normal"
            variant="outlined"
            onChange={handleChangeBaseAddress}
          />
        </Grid>
        }
        <Grid container item xs={12}>
          {!optionCatalog ?
            state.csr_product_catalog_requesting &&
            <Box
              className={classes.loading}
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="inherit"
              height="100px"
            >
              <CircularProgress color="primary" />
            </Box>
          :
          <FormControl component="fieldset" className={classes.root}>
            <FormGroup>
              <FormLabel component="legend" className={classes.legend}>
                <Typography variant="h6">
                  Internet
                </Typography>
              </FormLabel>
              <RadioGroup
                aria-label="internet___basic_std_exp"
                name="internet___basic_std_exp"
                value={optionMetadata.optionChosen.internet___basic_std_exp}
                onChange={handleChangeOptions} row
              >
                {optionCatalog.internet___basic_std_exp.choices.internet___basic &&
                <FormControlLabel
                  className={classes.label}
                  value="internet___basic"
                  control={<Radio color="primary" />}
                  label={
                    productCatalogLookup('internet___basic_std_exp', 'internet___basic', optionCatalog, optionMetadata) +
                    ' ' +
                    priceCatalogLookup('internet___basic_std_exp', 'internet___basic', optionCatalog, optionMetadata)
                  }
                  labelPlacement="top"
                />
                }
                {optionCatalog.internet___basic_std_exp.choices.internet___standard &&
                <FormControlLabel
                  className={classes.label}
                  value="internet___standard"
                  control={<Radio color="primary" />}
                  label={
                    productCatalogLookup('internet___basic_std_exp', 'internet___standard', optionCatalog, optionMetadata) +
                    ' ' +
                    priceCatalogLookup('internet___basic_std_exp', 'internet___standard', optionCatalog, optionMetadata)
                  }
                  labelPlacement="top"
                />
                }
                {optionCatalog.internet___basic_std_exp.choices.internet___expanded &&
                <FormControlLabel
                  className={classes.label}
                  value="internet___expanded"
                  control={<Radio color="primary" />}
                  label={
                    productCatalogLookup('internet___basic_std_exp', 'internet___expanded', optionCatalog, optionMetadata) +
                    ' ' +
                    priceCatalogLookup('internet___basic_std_exp', 'internet___expanded', optionCatalog, optionMetadata)
                  }
                  labelPlacement="top"
                />
                }
              </RadioGroup>
            </FormGroup>

            {optionMetadata.optionEnabled.device &&
            <FormGroup>
              <FormLabel component="legend" className={classes.legend}>
                <Typography variant="h6">
                  Additional Device
                </Typography>
              </FormLabel>
              <RadioGroup
                aria-label="device"
                name="device"
                value={optionMetadata.optionChosen.device}
                onChange={handleChangeOptions}
                row
              >
                <FormControlLabel
                  className={classes.label}
                  value=""
                  control={<Radio color="primary" />}
                  label="0 Device Catalog($0.00)"
                  labelPlacement="top"
                />
                <FormControlLabel
                  className={classes.label}
                  value="device___1"
                  control={<Radio color="primary" />}
                  label={`+1 Device ${priceCatalogLookup('device', 'device___1', optionCatalog, optionMetadata)}`}
                  labelPlacement="top"
                />
                <FormControlLabel
                  className={classes.label}
                  value="device___2"
                  control={<Radio color="primary" />}
                  label={`+2 Device ${priceCatalogLookup('device', 'device___2', optionCatalog, optionMetadata)}`}
                  labelPlacement="top"
                />
              </RadioGroup>
            </FormGroup>
            }

            {(optionMetadata.optionEnabled.basic_tv || optionMetadata.optionEnabled.core_tv) &&
            <FormGroup>
              <FormLabel component="legend" className={classes.legend}>
                <Typography variant="h6">
                  TV Add-Ons
                </Typography>
              </FormLabel>
              {optionMetadata.optionEnabled.basic_tv &&
              <FormControlLabel
                label="Basic TV ($0.00)"
                control={
                  <Checkbox
                    name="basic_tv"
                    value="basic_tv___yes"
                    checked={!!optionMetadata.optionChosen.basic_tv} // cast to boolean
                    onChange={handleChangeOptions}
                    color="primary"
                  />
                }
              />
              }
              {optionMetadata.optionEnabled.core_tv &&
              <FormControlLabel
                label={`Core TV ${priceCatalogLookup('core_tv', 'core_tv___yes', optionCatalog, optionMetadata)}`}
                control={
                  <Checkbox
                    name="core_tv"
                    value="core_tv___yes"
                    checked={!!optionMetadata.optionChosen.core_tv} // cast to boolean
                    onChange={handleChangeOptions}
                    color="primary"
                  />
                }
              />
              }
              {optionCatalog.starz &&
              <FormControlLabel
                // make requires caption dynamic
                label={`Starz ${optionMetadata.optionEnabled.starz
                  ? priceCatalogLookup('starz', 'starz___yes', optionCatalog, optionMetadata)
                  : choiceRequiredCatalogLookup('starz', optionCatalog, optionMetadata)}`}
                control={
                  <Checkbox
                    name="starz"
                    value="starz___yes"
                    checked={!!optionMetadata.optionChosen.starz} // cast to boolean
                    onChange={handleChangeOptions}
                    color="primary"
                    disabled={!optionMetadata.optionEnabled.starz} // disable if not enabled
                  />
                }
              />
              }
              {optionCatalog.movies &&
              <FormControlLabel
                // make requires caption dynamic
                label={`Movies ${optionMetadata.optionEnabled.starz
                  ? priceCatalogLookup('movies', 'movies___yes', optionCatalog, optionMetadata)
                  : choiceRequiredCatalogLookup('movies', optionCatalog, optionMetadata)}`}
                control={
                  <Checkbox
                    name="movies"
                    value="movies___yes"
                    checked={!!optionMetadata.optionChosen.movies} // cast to boolean
                    onChange={handleChangeOptions}
                    color="primary"
                    disabled={!optionMetadata.optionEnabled.movies} // disable if not enabled
                  />
                }
              />
              }
            </FormGroup>
            }

            {optionMetadata.optionChosen.internet___basic_std_exp &&
            <FormGroup>
              <FormLabel component="legend" className={classes.legend}>
                <Typography variant="h6">
                  Duration
                </Typography>
              </FormLabel>
              <RadioGroup
                aria-label="duration"
                name="duration"
                value={optionMetadata.optionChosen.duration}
                onChange={handleChangeOptions}
                row
              >
                {optionMetadata.durationAllowed['1_day'] &&
                <FormControlLabel
                  className={classes.label}
                  value="1_day"
                  control={<Radio color="primary" />}
                  label="1 Day"
                  labelPlacement="top"
                />
                }
                {optionMetadata.durationAllowed['1_week'] &&
                <FormControlLabel
                  className={classes.label}
                  value="1_week"
                  control={<Radio color="primary" />}
                  label="1 Week"
                  labelPlacement="top"
                />
                }
                {optionMetadata.durationAllowed['1_month'] &&
                <FormControlLabel
                  className={classes.label}
                  value="1_month"
                  control={<Radio color="primary" />}
                  label="1 Month"
                  labelPlacement="top"
                />
                }
                {optionMetadata.durationAllowed['monthly'] &&
                <FormControlLabel
                  className={classes.label}
                  value="monthly"
                  control={<Radio color="primary" />}
                  label="Monthly"
                  labelPlacement="top"
                />
                }
              </RadioGroup>
            </FormGroup>
            }
            <Typography variant="caption" className={classes.caption}>
              <p>* Pricing varies based on duration</p>
            </Typography>
          </FormControl>
          }
        </Grid>
      </Grid>
      <Grid container item xs={12} sm={12} md={6}>
        {!hide &&
        <>
        <Grid container item xs={12}>
          <Typography variant="h6">
            Current Plans
          </Typography>
        </Grid>
        <Grid container item xs={12}>
          <Paper className={`${classes.root} ${classes.paper}`}>
            <Table aria-label="current plans">
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell align="right">Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchased.map(row => (
                  <TableRow key={row.name} className={classes.tableRow}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        </>
        }
        <Grid container item xs={12}>
          <Typography variant="h6">
            Order Summary
          </Typography>
        </Grid>
        <Grid container item xs={12}>
          <Paper className={`${classes.root} ${classes.paper}`}>
            <Table aria-label="order summary">
              <TableHead>
                <TableRow>
                  <TableCell>Product Name</TableCell>
                  <TableCell align="right">Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {optionMetadata.purchasing.map(row => (
                  <TableRow key={row.name} className={classes.tableRow}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">{row.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        {!hide && <Grid container item xs={12}>
          <Box className={`${classes.root} ${classes.paper}`}>
            <Button
              className={classes.submitButton}
              disabled={!optionMetadata.optionChosen.internet___basic_std_exp}
              variant="contained"
              color="secondary"
              onClick={handleChangePlan}
            >
              Checkout
            </Button>
          </Box>
        </Grid>}
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  state: {
    ...state.csrAuthReducer,
    ...state.csrCustomerReducer,
  }
});

const mapDispatchToProps = (dispatch) => ({
  dispatch: { // create pending action (update products) for checkout page
    checkout: (token, customer_id, product_codes, customer, base_address) => {
      dispatch(checkoutAction({
        action: updateProductsAction({token, customer_id, product_codes, base_address}),
        show_billing: true,
        product_codes,
        base_address,
        //customer, // for testing customer showing up on confirm 
      }
      ));
    },
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CsrChangePlansSubPage);