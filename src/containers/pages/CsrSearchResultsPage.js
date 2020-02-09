import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";

import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Box from '@material-ui/core/Box';

import CircularProgress from '@material-ui/core/CircularProgress';

import { ACTION_CSR_SEARCH } from '../../stores/actions/csr-search-actions';

const columns = [
  {
    id: 'first_name',
    label: 'First Name',
    minWidth: 80
  },
  {
    id: 'last_name',
    label: 'Last Name',
    minWidth: 80
  },
  {
    id: 'username',
    label: 'User Name',
    minWidth: 100
  },
  {
    id: 'customer_id',
    label: 'Account Number',
    minWidth: 120,
    align: 'right',
    //format: value => value.toLocaleString(),
  },
  {
    id: 'email',
    label: 'Email',
    minWidth: 120,
    align: 'right',
    format: value => value.toLocaleString(),
  },
  {
    id: 'status',
    label: 'Account Status',
    minWidth: 50,
    align: 'right',
    format: value => value.toFixed(2),
  },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  tableWrapper: {
    overflow: 'auto',
  },
  tableRows: {
    cursor: 'pointer',
  },
  anchor: {
    textDecoration: 'none',
  },
  createAccountButton: {
    floatRight: {
      '&.MuiGrid-item': {
        marginLeft: 'auto',
      }
    },
    '&.MuiButtonBase-root': {
      backgroundColor: '#35c0e3',
      marginBottom: '15px',
    }
  }
});

/**
 * Search results used in conjuction with search form
 * 
 * @param {object} state [required] - Redux state
 * @param {object} dispatch [required] - Redux object that contains dispatch functions
 */
function CsrSearchResultsPage({state, dispatch, history}) {
  const classes = useStyles();

  function handleChangePage(event, newPage) {
    if (state.csr_auth && state.csr_search_requested) {
      dispatch.csrSearch({
        csr_auth: state.csr_auth,
        page_size: state.csr_search_page_size,
        page_index: newPage,
        payload: state.csr_search_requested,
      });
    }
  }

  function handleChangeRowsPerPage(event) {
    if (state.csr_auth && state.csr_search_requested) {
      dispatch.csrSearch({
        csr_auth: state.csr_auth,
        page_size: +event.target.value,
        page_index: 0,
        payload: state.csr_search_requested,
      });
    }
  }

  return (
    <Paper className={classes.root}>
      {state.csr_search_requesting
      ?
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="inherit"
        height="100px"
      >
        <List>
          <ListItem>
            <ListItemIcon><CircularProgress color="primary"/></ListItemIcon>
          </ListItem>
        </List>
      </Box>
      :
      <React.Fragment>
      <div className={classes.tableWrapper}>
        <Table stickyHeader component="article">
          <TableHead component="header">
            <TableRow component="section">
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  component="div"
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className={classes.tableRows} component="main">
            {state.csr_search && (state.csr_search.total > state.csr_search_page_size ? state.csr_search.results : state.csr_search.results.slice(state.csr_search_page_index * state.csr_search_page_size, state.csr_search_page_index * state.csr_search_page_size + state.csr_search_page_size)).map(row => (
              <TableRow
                hover
                role="checkbox"
                tabIndex={-1}
                key={row.customer_id}
                className={classes.anchor}
                component={Link}
                to={`/customer/${row.customer_id}/account`}
              >
                  {columns.map(column => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align} component="div">
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          name="tablePagination"
          rowsPerPageOptions={[12, 25, 50, 100]}
          component="div"
          count={(state.csr_search && (state.csr_search.total > state.csr_search_page_size ? state.csr_search.total : state.csr_search.results.length)) || 0}
          rowsPerPage={state.csr_search_page_size}
          page={state.csr_search_page_index}
          backIconButtonProps={{
            'aria-label': 'previous page',
          }}
          nextIconButtonProps={{
            'aria-label': 'next page',
          }}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        </React.Fragment>
        }
      </Paper>
  );
}
// type declaration and enforcement
CsrSearchResultsPage.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  state: {
    ...state.csrAuthReducer,
    ...state.csrSearchReducer,
  }
});
 
const mapDispatchToProps = (dispatch) => ({
  dispatch: {
    csrSearch: ({csr_auth, page_size, page_index, payload}) => dispatch({
      type: ACTION_CSR_SEARCH,
      payload: {
        token: csr_auth.token,
        page_size: page_size,
        page_index: page_index,
        request: payload,
      }
    }),
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CsrSearchResultsPage)