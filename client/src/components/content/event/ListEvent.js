import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Alert } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";

import EditEvent from "./EditEvent";
import CreateEvent from "./CreateEvent";
import ViewEvent from "./ViewEvent";
import SpinnerTable from "../../common/SpinnerTable";
import ReactTooltip from "react-tooltip";

import {
  getAllEvent,
  searchEvent,
  eraseStatus
} from "../../../actions/eventAction";

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
  CreateOutlined,
  RemoveRedEyeOutlined,
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

class ListEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: null,
      initialSearch: {
        code: "",
        request_by: "",
        request_date: "",
        status: "",
        created_date: "",
        created_by: ""
      },
      created_date: null,
      request_date: null,
      showCreateEvent: false,
      currentEvent: {},
      alertData: {
        status: 0,
        message: "bebas"
      },
      createdDate: null,
      search: false,
      status: [
        { _id: "4sv8e%7qjhd6", name: "Submitted", code: "1" },
        { _id: "tgsr62%fdsd1", name: "In Progress", code: "2" },
        { _id: "byw235%3bhty", name: "Done", code: "3" },
        { _id: "sdf64%fgre3#", name: "Rejected", code: "0" }
      ],
      page: 0,
      rowsPerPage: 5
    };
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  viewModalHandler = eventid => {
    let tmp = {};
    this.props.event.myEvent.forEach(ele => {
      if (eventid === ele._id) {
        tmp = ele;
      }
    });
    this.setState({
      currentEvent: tmp,
      viewEvent: true
    });
  };

  editModalHandler = eventid => {
    let tmp = {};
    this.props.event.myEvent.forEach(ele => {
      if (eventid === ele._id) {
        tmp = ele;
        this.setState({
          currentEvent: tmp,
          editEvent: true
        });
      }
    });
  };

  approvalModalHandler = eventid => {
    let tmp = {};
    this.props.event.myEvent.forEach(ele => {
      if (eventid === ele._id) {
        tmp = ele;
        this.setState({
          currentEvent: tmp,
          approveEvent: true
        });
      }
    });
  };

  closeRequestModalHandler = eventid => {
    let tmp = {};
    this.props.event.myEvent.forEach(ele => {
      if (eventid === ele._id) {
        tmp = ele;
        this.setState({
          currentEvent: tmp,
          closeRequest: true
        });
      }
    });
  };

  handleChangeCreatedDate = date => {
    let { initialSearch } = this.state;
    if (date) {
      initialSearch["created_date"] = moment(date).format("YYYY-MM-DD");
    } else {
      initialSearch["created_date"] = "";
    }
    this.setState({
      initialSearch: initialSearch,
      created_date: date
    });
  };

  handleChangeRequestDate = date => {
    let { initialSearch } = this.state;
    if (date) {
      initialSearch["request_date"] = moment(date).format("YYYY-MM-DD");
    } else {
      initialSearch["request_date"] = "";
    }
    this.setState({
      initialSearch: initialSearch,
      request_date: date
    });
  };

  changeHandler = event => {
    let { value, name } = event.target;
    let { initialSearch } = this.state;
    initialSearch[name] = value;
    this.setState({
      initialSearch: initialSearch
    });
  };

  SearchHandler = () => {
    let {
      code,
      request_by,
      request_date,
      status,
      created_date,
      created_by
    } = this.state.initialSearch;
    this.props.searchEvent(
      code,
      request_by,
      request_date,
      status,
      created_date,
      created_by
    );
    this.setState({search: true, loading: null})
  };

  onRestore = () => {
    let restore = {
      code : "",
      request_by : "",
      request_date : "",
      status : "",
      created_date : "",
      created_by : ""
    }
    this.props.searchEvent(
      "", "", "", "", "", "" 
    )
    this.setState({
      search: false,
      initialSearch: restore,
      loading: null
   })
  }

  closeModalHandler = () => {
    this.props.eraseStatus();
    this.setState({
      viewEvent: false,
      editEvent: false,
      deleteEvent: false,
      approveEvent  : false,
      closeRequest: false
    });
  };

  showHandler = () => {
    this.setState({ showCreateEvent: true });
  };

  closeHandler = () => {
    this.props.eraseStatus();
    this.setState({ showCreateEvent: false });
  };

  componentDidMount = () => {
    this.props.getAllEvent(
      this.props.user.m_employee_id,
      this.props.user.m_role_id
    );
  };

  modalStatus = (status, message) => {
    this.props.eraseStatus();
    this.setState({
      alertData: {
        status: status,
        message: message
      }
    });
    setTimeout(() => {
      this.setState({
        alertData: {
          status: 0,
          message: ""
        }
      });
    }, 3000);
  };

  closeAlert = () => {
    this.setState({
      alertData: {
        status: 0,
        message: ""
      }
    });
  };

  UNSAFE_componentWillReceiveProps = ( newProps ) => {
    if (newProps.event.myEvent.length > 0) {
      this.setState({ loading: newProps.event.myEvent })
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card border-primary">
              <div className="card-header bg-primary text-white">
                <h4>List Event</h4>
              </div>
              <div className="card-body">
                <div className="col">
                  <nav aria-label="breadcrumb">
                    <ul className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="/dashboard">Home</a>
                      </li>
                      <li className="breadcrumb-item">
                        <a href="/dashboard">Transaction</a>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        List Event
                      </li>
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
                        aria-label="Close"
                      >
                        <span>&times;</span>
                      </button>
                    </Alert>
                  ) : (
                    ""
                  )}
                  {this.state.alertData.status === 2 ? (
                    <Alert className="alert alert-danger alert-dismissible fade show">
                      <b>{this.state.alertData.message}</b>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                        aria-label="Close"
                        onClick={this.closeAlert}
                      >
                        <span>&times;</span>
                      </button>
                    </Alert>
                  ) : (
                    ""
                  )}
                  <CreateEvent
                    event={this.state.event}
                    create={this.state.showCreateEvent}
                    closeHandler={this.closeHandler}
                    modalStatus={this.modalStatus}
                  />
                  <ViewEvent
                    view={this.state.viewEvent}
                    closeModalHandler={this.closeModalHandler}
                    currentEvent={this.state.currentEvent}
                  />
                  <EditEvent
                    edit={this.state.editEvent}
                    closeModalHandler={this.closeModalHandler}
                    currentEvent={this.state.currentEvent}
                    modalStatus={this.modalStatus}
                  />
                  <div className="table-responsive">
                    <table id="mytable" className="table table-hover">
                      <thead>
                        <tr>
                          <td className='text-nowrap text-centered'>
                            <input
                              placeholder="Transaction Code"
                              className="form-control"
                              name="code"
                              onChange={this.changeHandler}
                            />
                          </td>
                          <td className='text-nowrap text-centered'>
                            <input
                              placeholder="Request By"
                              className="form-control"
                              name="request_by"
                              onChange={this.changeHandler}
                            />
                          </td>
                          <td className='text-nowrap text-centered' >
                            <DatePicker
                              className="form-control"
                              placeholderText="Request Date"
                              name="request_date"
                              selected={this.state.request_date}
                              onChange={this.handleChangeRequestDate}
                            />
                          </td>
                          <td className='text-nowrap text-centered'>
                            <select
                              name="status"
                              className="form-control"
                              onChange={this.changeHandler}
                              defaultValue=""
                            >
                              <option value="">Status...</option>
                              {this.state.status.map((row, x) => {
                                return (
                                  <option key={row._id} value={row.code}>
                                    {row.name}
                                  </option>
                                );
                              })}
                            </select>
                          </td>
                          <td className='text-nowrap text-centered'>
                            <DatePicker
                              className="form-control"
                              placeholderText="Created"
                              name="created_date"
                              selected={this.state.created_date}
                              onChange={this.handleChangeCreatedDate}
                            />
                          </td>
                          <td className='text-nowrap text-centered'>
                            <input
                              placeholder="Created By"
                              name="created_by"
                              className="form-control"
                              onChange={this.changeHandler}
                            />
                          </td>
                          <td className='text-nowrap text-centered'>
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
                            <a href="#!" data-tip="Search Event!">
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
                            <Link to="#" data-tip="Add New Event">
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
                          <th className='text-nowrap text-centered'>Transaction Code</th>
                          <th className='text-nowrap text-centered'>Request By</th>
                          <th className='text-nowrap text-centered'>Request Date</th>
                          <th className='text-nowrap text-centered'>Status</th>
                          <th className='text-nowrap text-centered'>Created Date</th>
                          <th className='text-nowrap text-centered'>Created By</th>
                          <th className='text-nowrap text-centered'>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                        this.state.loading === null ? (
                          <SpinnerTable/>
                        ) : (
                        this.props.event.myEvent
                          .slice(
                            this.state.page * this.state.rowsPerPage,
                            this.state.page * this.state.rowsPerPage +
                              this.state.rowsPerPage
                          )
                          .map((row, x) => (
                            <tr key={row._id}>
                              <td className='text-nowrap text-centered'>{row.code}</td>
                              <td className='text-nowrap text-centered'>
                                {row.request_by_first_name +
                                  " " +
                                  row.request_by_last_name}
                              </td>
                              <td className='text-nowrap text-centered'>{row.request_date}</td>
                              <td className='text-nowrap text-centered'>{row.status}</td>
                              <td className='text-nowrap text-centered'>{row.created_date}</td>
                              <td className='text-nowrap text-centered'>{row.created_by_employee}</td>
                              <td className='text-nowrap text-centered'>
                                <Link to="#" data-tip="View Event">
                                <RemoveRedEyeOutlined
                                  onClick={() => {
                                  this.viewModalHandler(row._id);
                                  }}
                                />
                                <ReactTooltip place="top" type="dark" effect="solid" />
                                </Link>
                                <Link to="#" data-tip="Edit Event">
                                  <CreateOutlined
                                    onClick={() => {
                                    this.editModalHandler(row._id);
                                    }}
                                  />
                                  <ReactTooltip place="top" type="dark" effect="solid" />
                                </Link>
                              </td>
                            </tr>
                          )))}
                      </tbody>
                      <TableFooter>
                        <TableRow>
                          <TablePagination
                            count={this.props.event.myEvent.length}
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
      </div>
    );
  }
}

ListEvent.propTypes = {
  getAllEvent: PropTypes.func.isRequired,
  searchEvent: PropTypes.func.isRequired,
  eraseStatus: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  event: state.event,
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  { getAllEvent, searchEvent, eraseStatus }
)(ListEvent);
