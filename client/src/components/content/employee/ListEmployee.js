import React from 'react'
import PropTypes from "prop-types"
import moment from "moment"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactTooltip from "react-tooltip";

import { Alert } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";

import { 
  getAllEmployee, 
  searchEmployee, 
  getAllCompany,
  eraseStatus 
} from "../../../actions/employeeAction";

import EditEmployee from './EditEmployee'
import CreateEmployee from './CreateEmployee'
import DeleteEmployee from './DeleteEmployee'
import ViewEmployee from './ViewEmployee'
import Spinner from "../../common/Spinner";

import {
  TableRow,
  TableFooter,
  TablePagination,
  IconButton
} from "@material-ui/core";

import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
  Search,
  Add,
  Create,
  Delete,
  RemoveRedEye,
  RefreshOutlined
} from "@material-ui/icons";
const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === "rtl" ? <LastPage /> : <FirstPage />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === "rtl" ? <FirstPage /> : <LastPage />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, {
  withTheme: true
})(TablePaginationActions);

class ListEmployee extends React.Component {
  constructor(props){
    super(props)
    this.state={
      loading: null,
      initialSearch:{
        employee_id : '',
        employee_name : '',
        company : '',
        created_date : '',
        created_by : ''
      },
      showCreateEmployee:false,
      currentEmployee:{},
      search: false,
      alertData : {
        status : 0,
        message : ""
      },
      created_date : null,
      page: 0,
      rowsPerPage: 5
    }
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  deleteModalHandler = (employeeid) => {
    let tmp = {};
    this.props.employee.myEmployee.forEach(ele => {
      if (employeeid === ele._id) {
      tmp = ele;
    }
    });
    this.setState({
      currentEmployee: tmp,
      deleteEmployee: true
    });
  }

  viewModalHandler = (employeeid) => {
    let tmp = {};
    this.props.employee.myEmployee.forEach(ele => {
      if (employeeid === ele._id) {
        tmp = ele;
      }
    });
    this.setState({
      currentEmployee: tmp,
      viewEmployee: true
    });
  }

  editModalHandler = (employeeid) => {
    let tmp = {};
    this.props.employee.myEmployee.forEach(ele => {
      if (employeeid === ele._id) {
        tmp = ele
      }
    });
    this.setState({
      currentEmployee: tmp,
      editEmployee: true
    });
  }

  handleChangeCreatedDate = date => {
    let { initialSearch } = this.state
    if(date){
      initialSearch["created_date"] = moment(date).format("YYYY-MM-DD")
    }else{
      initialSearch["created_date"] = ''
    }
    this.setState({
      initialSearch: initialSearch,
      created_date: date
    });
  }
  
  changeHandler = event => {
    let { initialSearch } = this.state
    let { name, value } = event.target
    initialSearch[name] = value
    this.setState({
      initialSearch : initialSearch,
    });
  };

  SearchHandler = () => {
    let {
      employee_id, 
      employee_name,
      company, 
      created_date,
      created_by
    } = this.state.initialSearch
    this.props.searchEmployee(
      employee_id, employee_name, company, created_date, created_by 
    )
    this.setState({search: true, loading: null })
  }

  onRestore = () => {
    let restore = {
      employee_id : "", 
      employee_name : "",
      company : "", 
      created_date : "",
      created_by : ""
    }
    this.props.searchEmployee(
      "", "", "", "", "" 
    )
    this.setState({
      search: false,
      initialSearch: restore,
      loading: null
    })
  }

  closeModalHandler = () => {
    this.props.eraseStatus()
    this.setState({
      viewEmployee: false,
      editEmployee: false,
      deleteEmployee: false
    });
  }

  showHandler = () => {
    this.setState({ showCreateEmployee: true});
  }

  closeHandler = () => {
    this.props.eraseStatus()
    this.setState({ showCreateEmployee: false });
  }

  componentDidMount = () => {
    this.props.getAllEmployee();
    this.props.getAllCompany();
  }

  modalStatus = (status, message) => {
    this.props.eraseStatus()
    this.setState({
      alertData: {
        status: status,
        message: message
      }
    });
    setTimeout(()=>{
      this.setState({
      alertData: {
        status: 0,
        message: ""
      }
    });
    }, 3000)
  }

  closeAlert=()=>{
    this.setState({
      alertData: {
        status: 0,
        message: ""
      }
    });
  }

  UNSAFE_componentWillReceiveProps = ( newProps ) => {
    if (newProps.employee.myEmployee.length > 0) {
      this.setState({ loading: newProps.employee.myEmployee })
    }
  }

  render() {
    let { employee } = this.props
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className='card border-primary'>
              <div className="card-header bg-primary text-white"><h4>List Employee</h4></div>
              <div className="card-body">
                <div className="col">
                  <nav aria-label="breadcrumb">
                    <ul className="breadcrumb">
                      <li className="breadcrumb-item"><a href="/dashboard" >Home</a></li>
                      <li className="breadcrumb-item"><a href="/dashboard">Master</a></li>
                      <li className="breadcrumb-item active" aria-current="page">List Employee</li>
                    </ul>
                  </nav>
                </div>
                <div>
                  {this.state.alertData.status === 1 ? (
                    <Alert className="alert alert-succes alert-dismissible fade show">
                      <b>{this.state.alertData.message}</b>
                      <button 
                        type="button" 
                        className="close" 
                        data-dismiss="alert"
                        onClick={this.closeAlert} 
                        aria-label="Close">
                        <span>&times;</span>
                      </button>
                    </Alert>
                  ) : ("")
                  }
                  {this.state.alertData.status === 2 ? (
                    <Alert className="alert alert-danger alert-dismissible fade show">
                      <b>{this.state.alertData.message}</b>
                      <button 
                        type="button" 
                        className="close" 
                        data-dismiss="alert" 
                        aria-label="Close"
                        onClick={this.closeAlert}>
                      <span>&times;</span>
                    </button>
                    </Alert>
                  ) : ("")
                  }
                  <CreateEmployee
                    create={this.state.showCreateEmployee}
                    closeHandler={this.closeHandler}
                    modalStatus={this.modalStatus}
                  />
                  <ViewEmployee
                    view={this.state.viewEmployee}
                    closeModalHandler={this.closeModalHandler}
                    currentEmployee={this.state.currentEmployee}
                  />
                  <DeleteEmployee
                    delete={this.state.deleteEmployee}
                    currentEmployee={this.state.currentEmployee}
                    closeModalHandler={this.closeModalHandler}
                    modalStatus={this.modalStatus}
                  />
                  <EditEmployee
                    edit={this.state.editEmployee}
                    closeModalHandler={this.closeModalHandler}
                    currentEmployee={this.state.currentEmployee}
                    modalStatus={this.modalStatus}
                  />
                  <br/>
                  <table id="mytable" className="table table table-hover table-responsive">
                    <thead>
                      <tr>
                        <td className='text-nowrap'>
                          <input 
                            placeholder="Employee ID" 
                            className="form-control" 
                            name="employee_id"
                            onChange={this.changeHandler}
                          />
                        </td>
                        <td className='text-nowrap'>
                          <input 
                            placeholder="Employee Name" 
                            className="form-control" 
                            name="employee_name"
                            onChange={this.changeHandler}
                          />
                        </td>
                        <td className='text-nowrap'>
                          <select
                            name="company"
                            className="form-control"
                            onChange={this.changeHandler}
                            defaultValue=""
                          >
                          <option value="" >Select Company...</option>
                            {employee.myCompany.map((row,x) => {
                              return (
                                this.state.search === false ? (
                                  <option key={row._id} value={row.code}>{row.name}</option>
                                ):(""
                              ))
                            })}
                          </select>
                        </td>
                        <td className='text-nowrap'>
                          <DatePicker
                            className="form-control"
                            placeholderText="Created" 
                            name="created_date"
                            selected={this.state.created_date}
                            onChange={this.handleChangeCreatedDate}
                          />
                        </td>
                        <td className='text-nowrap'>
                          <input 
                            placeholder="Created By" 
                            name="created_by"
                            className="form-control" 
                            onChange={this.changeHandler}
                          />
                        </td>
                        <td className='text-nowrap'>
                          {this.state.search === true ? (
                            <a href="#!" data-tip="Refresh Result!">
                              <button 
                                type="button" 
                                className="btn mr-2 btn-warning"
                                onClick ={this.onRestore}
                              ><RefreshOutlined/>
                              </button>
                              <ReactTooltip
                                place="top"
                                type="dark"
                                effect="solid"
                              />
                            </a>
                            ):(
                            <a href="#!" data-tip="Search Employee!">
                              <button 
                                type="button" 
                                className="btn mr-2 btn-primary"
                                onClick ={this.SearchHandler}
                              ><Search/>
                              </button>
                              <ReactTooltip
                                place="top"
                                type="dark"
                                effect="solid"
                              />
                            </a>
                            )}
                          <Link to="#" data-tip="Add New Employee">
                            <button 
                              type="button" 
                              className="btn btn-primary"
                              onClick ={this.showHandler}
                            >
                              <Add/>  
                            </button>
                          </Link>
                          <ReactTooltip
                            place="top"
                            type="dark"
                            effect="solid"
                          />
                        </td>
                      </tr>
                    </thead>
                    <thead>
                      <tr>
                        <th className="text-nowrap text-center">Employee Id</th>
                        <th className="text-nowrap text-center">Employee Name</th>
                        <th className="text-nowrap text-center">Company Name</th>
                        <th className="text-nowrap text-center">Created Date</th>
                        <th className="text-nowrap text-center">Created By</th>
                        <th className="text-nowrap text-center">Action</th>
                      </tr>
                    </thead>
                      <tbody>
                      {
                        this.state.loading === null ? (
                          <div className="container justify-content-center">
                            <Spinner/>
                          </div>
                        ) : (
                        employee.myEmployee
                        .slice(
                          this.state.page * this.state.rowsPerPage,
                          this.state.page * this.state.rowsPerPage +
                            this.state.rowsPerPage
                        )
                        .map((row,x)=>
                        <tr key={row._id}>
                          <td className="text-nowrap text-center">{row.employee_number}</td>
                          <td className="text-nowrap text-center">{row.first_name + " " + row.last_name}</td>
                          <td className="text-nowrap text-center">{row.m_company_name}</td>
                          <td className="text-nowrap text-center">{row.created_date}</td>
                          <td className="text-nowrap text-center">{row.created_by}</td>
                          <td className="text-nowrap text-center">
                          <Link to="#" data-tip="View Employee">
                            <RemoveRedEye
                              onClick={() => {
                              this.viewModalHandler(row._id);
                              }}
                            />
                            <ReactTooltip place="top" type="dark" effect="solid" />
                          </Link>
                          <Link to="#" data-tip="Edit Employee">
                            <Create
                              onClick={() => {
                              this.editModalHandler(row._id);
                              }}
                            />
                            <ReactTooltip place="top" type="dark" effect="solid" />
                          </Link>
                          <Link to="#" data-tip="Delete Employee">
                            <Delete
                              onClick={() => {
                              this.deleteModalHandler(row._id);
                              }}
                            />
                            <ReactTooltip place="top" type="dark" effect="solid" />
                            </Link>
                          </td>
                        </tr>
                      )
                    )
                  }
                     </tbody>
                     <TableFooter>
                      <TableRow>
                        <TablePagination
                          count={employee.myEmployee.length}
                          rowsPerPage={this.state.rowsPerPage}
                          page={this.state.page}
                          onChangePage={this.handleChangePage}
                          onChangeRowsPerPage={this.handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActionsWrapped}
                        />
                      </TableRow>
                    </TableFooter>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
     )
  }
}

ListEmployee.propTypes = {
  getAllEmployee: PropTypes.func.isRequired,
  getAllCompany: PropTypes.func.isRequired,
  searchEmployee: PropTypes.func.isRequired,
  eraseStatus: PropTypes.func.isRequired,
  employee: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  employee: state.employee
});

export default connect(
  mapStateToProps,{ getAllEmployee, searchEmployee, getAllCompany, eraseStatus }
  )(ListEmployee);