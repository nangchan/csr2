import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form'
import { connect } from 'react-redux'

import MaterialTable, { MTableToolbar } from 'material-table';

import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import { composeValidators, required, mustBeMac } from '../../validators';
import { FfmTextField, FfmSelect } from '../../utils/final-form-mui';

// pull in for material-up
import '../../styles/material-table/font-family-roboto.css';
import '../../styles/material-table/material-icons.css';

import { ACTION_CSR_ADD_DEVICE, ACTION_CSR_EDIT_DEVICE, ACTION_CSR_DELETE_DEVICE, deviceUpdateAction } from '../../stores/actions/csr-devices-actions';

const ChipWithMargin = withStyles({
  root: {
    marginRight: 5,
  },
})(Chip);

/**
 * Define actions executed when editable table is updated
 * Externalized for unit testing
 * 
 * @param {object} form [required] - Final-form form used to submit and show error
 * @param {boolean} valid [required] - Flag to detect form validation errors
 * @param {object} state [required] - Redux state
 * @param {object} dispatch [required] - Redux dispatch
 * 
 * @returns {object} Map of actions to async functions that get executed on row-add, row-update and row-delete
 */
export const materialTableOnEditActions = ({form, valid, state, dispatch}) => ({
  onRowAdd: async (newData) => {
    // if validation errors then block add
    if (valid) {
      dispatch.csrUpdateDevice({
        csr_customer: state.csr_customer,
        csr_auth: state.csr_auth,
        type: ACTION_CSR_ADD_DEVICE,
        data: newData,
      });
    } else {
      form.submit(); // force submit to show error
      throw Error(JSON.stringify({event: 'onRowAdd', error: 'hasValidationErrors'}));
    }
  },
  onRowUpdate: async (newData, oldData) => {
    // if validation errors then block update
    if (valid) {
      dispatch.csrUpdateDevice({
        csr_customer: state.csr_customer,
        csr_auth: state.csr_auth,
        type: ACTION_CSR_EDIT_DEVICE,
        data: newData,
      });
    } else {
      throw Error(JSON.stringify({event: 'onRowUpdate', error: 'hasValidationErrors'}));
    }
  },
  onRowDelete: async (oldData) => {
    dispatch.csrUpdateDevice({
      csr_customer: state.csr_customer,
      csr_auth: state.csr_auth,
      type: ACTION_CSR_DELETE_DEVICE,
      data: oldData,
    });
  }
});
// define argument types for function above
materialTableOnEditActions.propTypes = {
  form: PropTypes.object.isRequired,
  valid: PropTypes.bool.isRequired,
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.object.isRequired,
};

/**
 * Defined toolbar to hide add(+) button (if applicable) and show device limit/purchase additional
 * Externalized for unit testing
 * 
 * @param {object} csr_devices - Redux state devices selection (pulling out current_device_limit and devices.length)
 * 
 * @returns {object} React component used to render toolbar
 */
export const MaterialTableToolbar = (csr_devices) => (props) => {
  const {current_device_limit, devices} = csr_devices || {current_device_limit: 0, devices:{length:0}};

  const slotsMax = 5;
  const slotsPurchasableMax = 2;
  const slotsLimit = current_device_limit;
  const slotsPurchasableNoLimit =  slotsLimit <= slotsMax ? slotsMax - slotsLimit : 0;
  const slotsPurchasable =  slotsPurchasableNoLimit > slotsPurchasableMax ? slotsPurchasableMax : slotsPurchasableNoLimit;
  const slotsUsed = devices.length;

  return (
    <>
      <MTableToolbar {...props} actions={
          slotsLimit > slotsUsed ? props.actions : [] // show add button if not at limit
        }
      />
      <div style={{padding: 12}}>
        <ChipWithMargin icon={<InfoOutlinedIcon />} label={`Device Limit: ${slotsUsed}/${slotsLimit}`} variant="outlined" />
        {[...Array(slotsPurchasable)].map((value, index)=>(
          <ChipWithMargin
            key={index}
            icon={<MonetizationOnOutlinedIcon />}
            label={`Purchase ${index ? 2 : 1} Additional: $${index ? 20 : 10}`} // show $10 for first and $20 for second purchase
            onClick={()=>alert('To Be Added')}
            //onClick={props.actions.filter(action => action.tooltip === 'Add')[0].onClick}
            color="primary"
          />
        ))
        }
      </div>
    </>
  );
};
// define argument types for function above
MaterialTableToolbar.propTypes = {
  csr_devices: PropTypes.object,
};

const FfmTextFieldStyled = withStyles({
  root: {
    '& .MuiInput-formControl': {
      marginBottom: 0,
    },
    '& .MuiInput-formControl:not(.Mui-error)': {
      marginBottom: 20,
    },
  },
})(FfmTextField);

const FfmSelectStyled = withStyles({
  root: {
    '& .MuiInput-formControl': {
      marginBottom: 0,
    },
    '& .MuiInput-formControl:not(.Mui-error)': {
      marginBottom: 20,
    },
  },
})(FfmSelect);

const tableColumns = [
  { title: 'Type', field: 'model',
    lookup: {
      'Smart Phone': 'Mobile',
      'Tablet': 'Tablet',
      'Computer': 'Computer',
      'Gaming': 'Gaming',
      'TV': 'TV',
      'Smart Device': 'Other',
    },
    editComponent: props => (
      <FfmSelectStyled
        name="model" // must name all fields or SetIn() error occurs
        native={true}
        initialValue={props.value || ''} // fallback to empty string or else will pick up last value
        onChange={e => props.onChange(e.target.value)}
        validate={composeValidators(
          required(),
        )}
      >
        {!props.rowData.tableData && // add if in add mode
        <option value=""></option>
        }
        {Object.keys(props.columnDef.lookup).map((value, index) => (
          <option key={value} value={value}>{props.columnDef.lookup[value]}</option>
        ))}
      </FfmSelectStyled>
    )
  },
  { title: 'Name', field: 'name',
    editComponent: props => (
      <FfmTextFieldStyled
        name="name" // must name all fields or SetIn() error occurs
        initialValue={props.value || ''} // fallback to empty string or else will pick up last value
        //TextFieldProps={{value:props.value || ''}} // must be string or will be treated as uncontrolled component
        uncontrolled={true}
        uncontrolledValue={props.value}
        onChange={(event, input, meta)=>props.onChange(event.target.value)}
        validate={composeValidators(
          required(),
        )}
      />
    )
  },
  { title: 'Mac Address', field: 'mac', editable: 'onAdd',
    editComponent: props => (
      <FfmTextFieldStyled
        name="mac" // must name all fields or SetIn() error occurs
        initialValue={props.value || ''} // fallback to empty string or else will pick up last value
        uncontrolled={true}
        uncontrolledValue={props.value}
        onChange={(event, input, meta)=>props.onChange(event.target.value)}
        inputProps={{
          maxLength:17
        }}
        validate={composeValidators(
          required(),
          mustBeMac(),
        )}
      />
    )
  },
  { title: 'Mac Randomized', field: 'mac_randomized', type: 'boolean', editable: 'never' },
  { title: 'Date Added', field: 'created_date', editable: 'never' },
  { title: 'Cost', field: 'cost', editable: 'never' },
];

/**
 * Using Material-Table for editable table functionality
 * Falling back to HTML5 form validation since final-form
 * and material-table are incompatible
 * 
 * NOTE: Material-Table also uses Redux therefore initialize
 * Redux DevTools using another page
 * 
 * @param {object} state [required] - Redux state object
 * @param {object} dispatch [required] - Redux dispatch object
 */
function CsrDevicesSubPage ({state, dispatch}) {
  const [tableData, setTableData] = useState([]);

  const slotsFree = 3;

  // work around since material table doesn't handle redux very well
  useEffect(() => {
    if (state.csr_devices) {
      setTableData( // MaterialTable needs mutable data
        state.csr_devices.devices.map((row, index) => ({
          ...row,
          cost: index+1 > slotsFree ? '$10' : 'Included'
        }))
      );
    }
    // suppress warning regarding table
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.csr_devices]);

  return (
    <Form
      onSubmit={{}}
      render={({ form, handleSubmit, reset, submitting, pristine, values, valid }) => (
        <form onSubmit={handleSubmit}>
          <MaterialTable
            title="Devices"
            columns={tableColumns}
            data={tableData}
            editable={materialTableOnEditActions({form, valid, state, dispatch})}
            components={{
              Toolbar: MaterialTableToolbar(state.csr_devices)
            }}
          />
        </form>
      )}
    />
  );
}
// define argument types for function above
CsrDevicesSubPage.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  state: {
    ...state.csrAuthReducer,
    ...state.csrCustomerReducer,
    ...state.csrDevicesReducer,
  }
});
const mapDispatchToProps = (dispatch) => ({
  dispatch: {
    csrUpdateDevice: (payload) => {
      dispatch(deviceUpdateAction(payload));
    }
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CsrDevicesSubPage)