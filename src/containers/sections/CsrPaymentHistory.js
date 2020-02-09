import React, { useState, useEffect } from 'react';

import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import Grid from '@material-ui/core/Grid';
import TablePagination from '@material-ui/core/TablePagination';

import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';

import { makeStyles } from '@material-ui/styles';

import MaterialTable, { MTableToolbar, MTableHeader } from 'material-table';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import useDebounce from '../../useDebounce';

const useStyles = makeStyles(theme => ({
  datePicker: {
    margin: 0,
  },
  dateRange: {
    width: 100,
  },
  header: {
    borderBottom: 'none',
  },
  cancelChanges: {
    minWidth: '16em',
  }
}));

const CsrPaymentHistory = () => {
  const classes = useStyles();

  const [paymentData, setPaymentData] = useState([
    {
      id: 0,
      description: 'PAYMENT:(MON/DD - MON/DD) TRANS_ID:0000000000000000001',
      amount_payment: '$68.98',
      amount_refunded: '$25.40',
      status: 'PENDING',
      pro_rated: '$22.50',
      total: '$24.50',
      reason: 'Wifi down at base',
      credit: false,
      refund: false,
    },
    {
      id: 1,
      description: 'Internet Blazing',
      amount_payment: '$49.95',
      pro_rated: '',
      adjusted: null,
      total: '',
      reason: '',
      credit: false,
      refund: false,
      parentId: 0,
    },
    {
      id: 2,
      description: 'TV Add-On',
      amount_payment: '$19.95',
      pro_rated: '',
      adjusted: null,
      total: '',
      reason: '',
      credit: false,
      refund: false,
      parentId: 0,
    },
    {
      id: 3,
      description: 'PAYMENT:(MON/DD - MON/DD) TRANS_ID:0000000000000000002',
      amount_payment: '$58.98',
      amount_refunded: '$1.00',
      status: 'PROCESSED',
      pro_rated: '$22.50',
      adjusted: 1.00,
      total: '$1.00',
      reason: 'Extra day',
      credit: false,
      refund: false,
    },
    {
      id: 4,
      description: 'Internet Extra',
      amount_payment: '$39.95',
      pro_rated: '',
      adjusted: null,
      total: '',
      reason: '',
      credit: false,
      refund: false,
      parentId: 3,
    },
    {
      id: 5,
      description: 'TV Add-On',
      amount_payment: '$19.95',
      pro_rated: '',
      adjusted: null,
      total: '',
      reason: '',
      credit: false,
      refund: false,
      parentId: 3,
    },
  ]);

  // clone of paymentData used to restore old value when cancelling
  const [refundData, setRefundData] = useState();
  // NOTE: useEffect will run in its own closure updated based on the dependency list
  useEffect(()=>{
    // keep refund in-sync with payment but not the other way around for one-way dependency
    setRefundData(paymentData.map(data => ({
      adjusted:data.adjusted,
      reason:data.reason
    })));
  }, [paymentData])

  const debouncer = useDebounce();

  /**
   * onChange event handler with debounce
   * 
   * @param {object} row [required] - paymentData row used to set new state
   * 
   * @returns {function} Handler for input change
   */
  const handleInputChangeWithDebounce = (row) => debouncer((event) => {
    refundData[row.id][event.target.name] = event.target.type === 'number'
      ? +event.target.value // cast to number if applicable
      : event.target.value;
    // set state properly to notify React
    setRefundData([...refundData]);
  });

  const [hasSelection, setHasSelection] = useState(false);
  const handleSelectionChange = (rows, row) => {
    setHasSelection(rows.length ? true : false);
    // notify React of update (not yet needed)
    //setPaymentData([...paymentData]);
  };

  const handleRadioChange = (row) => (event) => {
    paymentData[row.id].credit = event.target.value === 'credit';
    paymentData[row.id].refund = event.target.value === 'refund';

    setPaymentData([...paymentData]);
  };

  const [editable, setEditable] = useState(false);
  const handleRefundsOrCancel = (event) => {
    // turn edit off
    setEditable(!editable);

    // restore saved value
    paymentData.filter(data => data.tableData.checked).map(data => {
      refundData[data.id].adjusted = data.adjusted;
      refundData[data.id].reason = data.reason;
      // return data for map
      return data;
    });

    // set state properly to notify React
    setRefundData([...refundData]);
  };

  const [selectedDate, setSelectedDate] = React.useState({
    fromDate: null,
    toDate: null,
  });
  const handleDateChange = (field) => (date) => {
    console.log('datePicker');
    setSelectedDate({
      ...selectedDate,
      [field]:date}
    );
  };

  const DATE_RANGE_MIN = 10;
  const [selectedDateRange, setSelectedDateRange] = React.useState(DATE_RANGE_MIN);
  const handleDateRangeChange = event => {
    console.log('dateRange');
    setSelectedDateRange(event.target.value);
  };

  const handleSaveChanges = (event) => {
    // turn off editability
    setEditable(false);

    // print out selected rows
    console.log(paymentData.filter(data => data.tableData.checked))

    // deselect all
    paymentData.filter(data => data.tableData.checked).map(data => {
      // turn off checked
      data.tableData.checked = false;

      // update paymentData
      data.adjusted = refundData[data.id].adjusted;
      data.reason = refundData[data.id].reason;

      // return data for map
      return data;
    });

    // set hasSelection to false
    setHasSelection(false);

    // set state properly to notify React
    setPaymentData([...paymentData]);
  };

  return (
    <MaterialTable
      title="Payment History"
      data={paymentData}
      columns={[
        { title: 'Description', field: 'description' },
        { title: 'Payment Amount', field: 'amount_payment' },
        { title: 'Refunded Amount', field: 'amount_refunded', hidden: editable },
        { title: 'Status', field: 'status', hidden: editable },
        { title: 'Pro-rated', field: 'pro_rated', hidden: !editable },
        { title: 'Adjusted', field: 'reason', type: 'numeric', hidden: !editable,
          render: (row)=>(typeof(row.parentId) === 'undefined' && editable && row.tableData.checked
            ? <TextField name="adjusted" type="number" defaultValue={refundData[row.id].adjusted} onChange={handleInputChangeWithDebounce(row)} />
            : row.adjusted)
        },
        { title: 'Total', field: 'total', hidden: !editable },
        { title: 'Reason', field: 'reason',
          render: (row)=>(typeof(row.parentId) === 'undefined' && editable && row.tableData.checked
            ? <TextField name="reason" defaultValue={refundData[row.id].reason} onChange={handleInputChangeWithDebounce(row)}/>
            : row.reason)
        },
        { title: 'Credit', field: 'credit', hidden: !editable,
          render: (row)=>(typeof(row.parentId) === 'undefined'
            ? <Radio
                checked={!!(editable && row.tableData.checked && row.credit)} // cast to boolean
                onChange={handleRadioChange(row)}
                value="credit"
                name="credit"
                inputProps={{ 'aria-label': 'Credit' }}
                disabled={!editable}
              />
            : row.credit
          )
        },
        { title: 'Refund', field: 'refund', hidden: !editable,
          render: (row)=>(typeof(row.parentId) === 'undefined'
            ? <Radio
                checked={!!(editable && row.tableData.checked && row.refund)} // cast to boolean
                onChange={handleRadioChange(row)}
                value="refund"
                name="refund"
                inputProps={{ 'aria-label': 'Refund' }}
                disabled={!editable}
              />
            : row.refund
          )
        }
      ]}
      onSelectionChange={handleSelectionChange}
      parentChildData={(row, rows) => rows.find(a => a.id === row.parentId)}
      options={{
        selection: true,
        selectionProps: (row) => ({
          disabled: typeof(row.parentId) === 'undefined' ? false : true,
          color: 'primary',
          style: {display: typeof(row.parentId) === 'undefined' ? null : 'none'},
        }),
        showSelectAllCheckbox: false,
        showTextRowsSelected: false,
        defaultExpanded: false,
      }}
      components={{
        Header: props => <MTableHeader {...props} classes={{...props.classes, header: classes.header}}/>,
        Toolbar: props => (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <MTableToolbar {...props} />
            <Grid container spacing={1}>
              <Grid container item justify="space-around" alignItems="center" xs={6} sm={6} lg={6} xl={6}>
                <Grid item>
                  <TextField name="searchCriteria" select label="Date Range" className={classes.dateRange} SelectProps={{native:true}} value={selectedDateRange} onChange={handleDateRangeChange} onBlur={()=>console.log('drop-down')}>
                    <option value={DATE_RANGE_MIN}>{`${DATE_RANGE_MIN} Days`}</option>
                    <option value={30}>30 Days</option>
                    <option value={60}>60 Days</option>
                    <option value={90}>90 Days</option>
                  </TextField>
                </Grid>
                <Grid item>
                  <KeyboardDatePicker
                    disableToolbar
                    name="fromDate"
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    label="From"
                    value={selectedDate.fromDate}
                    onChange={handleDateChange('fromDate')}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    className={classes.datePicker}
                  />
                </Grid>
                <Grid item>
                  <KeyboardDatePicker
                    disableToolbar
                    name="toDate"
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    label="To"
                    value={selectedDate.toDate}
                    onChange={handleDateChange('toDate')}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                    className={classes.datePicker}
                  />
                </Grid>
              </Grid>
              <Grid container item justify="space-around" alignItems="center" xs={6} sm={6} lg={6} xl={6}>
                <Grid item>
                  <Button variant="contained" onClick={()=>alert('To be added')}>
                    Send Receipts
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" className={classes.cancelChanges} disabled={!editable && !hasSelection} onClick={handleRefundsOrCancel}>
                    {editable ? 'Cancel Change' : 'Refunds & Adjustments'}
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" disabled={!editable} color={editable ? 'secondary' : 'default'} onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </MuiPickersUtilsProvider>
        ),
        Pagination: props => (
          <TablePagination {...props} />
        ),
      }}
    />
  );
};

/*
import Chip from '@material-ui/core/Chip';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import InfoIcon from '@material-ui/icons/Info';
import { withStyles } from '@material-ui/styles';

const ChipClickable = withStyles(theme => ({
  root: {
    margin: 10,

    '& svg': {
      margin: 5,
    },

    '& svg:first-child': {
      display: 'none',
    },

    '&:hover': {
      backgroundColor: theme.palette.type === 'light' ? 'lightgrey' : 'darkgrey',
    },

    '&:focus': {
      backgroundColor: theme.palette.type === 'light' ? '#79d5ec' : 'red',

      '& svg:first-child': {
        display: 'inline',
      },
      '& svg:nth-child(2)': {
        display: 'none',
      },
    },
  },
}))(Chip);

const CsrPlayGround = () => (
  <div>
    <ChipClickable
      icon={<><CheckCircleOutlineIcon/><RadioButtonUncheckedIcon/></>}
      label="Basic: Free"
      clickable
      onDelete={()=>alert(1)}
      deleteIcon={<InfoIcon/>}
    />
    <ChipClickable
      icon={<><CheckCircleOutlineIcon/><RadioButtonUncheckedIcon/></>}
      label="Extra: $34.99"
      clickable
      onDelete={()=>alert(1)}
      deleteIcon={<InfoIcon/>}
    />
    <ChipClickable
      icon={<><CheckCircleOutlineIcon/><RadioButtonUncheckedIcon/></>}
      label="Blazing: $54.99"
      clickable
      onDelete={()=>alert(1)}
      deleteIcon={<InfoIcon/>}
    />
  </div>
);
*/

export default CsrPaymentHistory;