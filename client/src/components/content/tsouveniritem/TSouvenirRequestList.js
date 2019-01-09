import React from "react";
import axios from "axios";
import ApiConfig from "../../../config/Host_Config";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import Spinner from "../../common/Spinner";

import { Alert, Button } from "reactstrap";
import {
  TableFooter,
  TableRow,
  TablePagination,
  IconButton
} from "@material-ui/core";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import SearchIcon from "@material-ui/icons/Search";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import { withStyles } from "@material-ui/core/styles";

import { getAllTSouvenirItem } from "../../../actions/tsouveniritemAction";

import CreateTsouveniritem from "./CreateTSouvenirRequest";
import ViewTsouveniritem from "./ReadTSouvenirRequest";
import EditTsouveniritem from "./UpdateTSouvenirRequest";
import AdminHandler from "./AdminHandler";
import RequesterHandler from "./RequesterHandler";

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
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
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
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
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

class ListTsouveniritem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      showCreateTsouveniritem: false,
      currentTsouveniritem: {},
      alertData: {
        status: 0,
        message: "",
        code: "",
        getitem: ""
      },
      formSearch: {
        code: /(?:)/,
        request_by: /(?:)/,
        request_date: /(?:)/,
        request_due_date: /(?:)/,
        status: /(?:)/,
        created_date: /(?:)/,
        created_by: /(?:)/
      },
      hasil: [],
      result: [],
      page: 0,
      rowsPerPage: 5,
      userdata: {}
    };
    this.showHandler = this.showHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.closeModalHandler = this.closeModalHandler.bind(this);
    this.closeHandler = this.closeHandler.bind(this);
    this.viewModalHandler = this.viewModalHandler.bind(this);
    this.editModalHandler = this.editModalHandler.bind(this);
    this.adminButtonHandler = this.adminButtonHandler.bind(this);
    this.modalStatus = this.modalStatus.bind(this);
  }

  designStatus = status => {
    switch (status) {
      case 0:
        return "Rejected";
      case 2:
        return "In Progress";
      case 3:
        return "Recieved by Requester";
      case 4:
        return "Settlement";
      case 5:
        return "Approved Settlement";
      case 6:
        return "Closed Request";
      default:
        return "Submitted";
    }
  };

  componentDidMount() {
    this.props.getAllTSouvenirItem();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      result: newProps.tsouveniritemReducer.ts,
      hasil: newProps.tsouveniritemReducer.ts,
      userdata: newProps.auth.user
    });
  }

  showHandler() {
    this.setState({ showCreateTsouveniritem: true });
  }

  closeHandler() {
    this.setState({ showCreateTsouveniritem: false });
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  viewModalHandler(tsouveniritemid) {
    let tmp = {};
    this.state.result.forEach(ele => {
      if (tsouveniritemid === ele._id) {
        tmp = ele;
      }
    });
    this.setState({
      currentTsouveniritem: tmp,
      viewTsouveniritem: true
    });
  }

  adminButtonHandler(tsouveniritemid) {
    let tmp = {};
    this.state.result.forEach(ele => {
      if (tsouveniritemid === ele._id) {
        tmp = ele;
      }
    });
    if (tmp.status === 0) {
      this.modalStatus(
        2,
        "Transaction souvenir with code " +
          tmp.code +
          " has been rejected, can't continue."
      );
    } else if (tmp.status === 1) {
      this.setState({
        currentTsouveniritem: tmp,
        adminHandler: true
      });
    } else if (tmp.status === 2) {
      this.modalStatus(2, "Request Approved, not received by requester yet");
    } else if (tmp.status === 3) {
      this.modalStatus(
        2,
        "Souvenir has been received by Requester but settlement not yet inputed"
      );
    } else if (tmp.status === 4) {
      this.setState({
        currentTsouveniritem: tmp,
        adminHandler: true
      });
    } else if (tmp.status === 5) {
      this.modalStatus(2, "Settlement already approved");
    } else {
      this.modalStatus(2, "Request Closed");
    }
  }

  editModalHandler(dataItem, tsouveniritemid) {
    const getOldFile = code => {
      let option = {
        url: `${ApiConfig.host}/tsouveniritem/${code}`,
        method: "get",
        headers: {
          Authorization: localStorage.token
        }
      };
      axios(option)
        .then(response => {
          this.setState({
            getitem: response.data.message
          });
        })
        .catch(error => {
          console.log(error);
        });
    };
    getOldFile(dataItem);
    localStorage.setItem("Code T SOUVENIR", JSON.stringify(dataItem));
    let tmp = {};
    this.state.result.forEach(ele => {
      if (tsouveniritemid === ele._id) {
        tmp = {
          _id: ele._id,
          t_event_id: ele.t_event_id,
          code: ele.code,
          request_by: ele.request_by,
          request_date: ele.request_date,
          request_due_date: ele.request_due_date,
          status: ele.status,
          note: ele.note,
          created_by: ele.created_by,
          created_date: ele.created_date,
          updated_by: this.state.userdata.m_employee_id,
          updated_date: moment().format("YYYY-MM-DD")
        };
        if (tmp.status === 0) {
          this.modalStatus(
            2,
            "Transaction souvenir with code " +
              tmp.code +
              " has been rejected, can't continue."
          );
        } else if (tmp.status === 1) {
          this.setState({
            getitem: this.state.getitem,
            currentTsouveniritem: tmp,
            editTsouveniritem: true
          });
        } else if (tmp.status === 2) {
          this.setState({
            currentTsouveniritem: tmp,
            requesterHandler: true
          });
        } else if (tmp.status === 3) {
          this.setState({
            currentTsouveniritem: tmp,
            requesterHandler: true
          });
        } else if (tmp.status === 4) {
          this.modalStatus(2, "Settlement not yet approved by admin");
        } else if (tmp.status === 5) {
          this.setState({
            currentTsouveniritem: tmp,
            requesterHandler: true
          });
        } else {
          this.modalStatus(2, "Request Closed");
        }
      }
    });
  }

  changeHandler = event => {
    let tmp = this.state.formSearch;
    if (event.target.name) {
      tmp[event.target.name] = new RegExp(event.target.value.toLowerCase());
    } else {
      tmp[event.target.name] = event.target.value;
    }
    this.setState({
      formSearch: tmp
    });
    this.change();
  };

  change = () => {
    const {
      code,
      request_by,
      request_date,
      request_due_date,
      status,
      created_date,
      created_by
    } = this.state.formSearch;
    let temp = [];
    this.state.result.map(ele => {
      if (
        code.test(ele.code.toLowerCase()) &&
        request_by.test(ele.request_by.toLowerCase()) &&
        request_date.test(ele.request_date) &&
        request_due_date.test(ele.request_due_date) &&
        status.test(this.designStatus(ele.status).toLowerCase()) &&
        created_date.test(ele.created_date) &&
        created_by.test(ele.created_by.toLowerCase())
      ) {
        temp.push(ele);
      }
      return temp;
    });
    this.setState({
      hasil: temp
    });
  };

  closeModalHandler() {
    this.setState({
      viewTsouveniritem: false,
      editTsouveniritem: false,
      rejectRequest: false,
      adminHandler: false,
      requesterHandler: false
    });
  }

  modalStatus(status, message, code) {
    this.setState({
      alertData: {
        status: status,
        message: message,
        code: code
      },
      viewTsouveniritem: false,
      editTsouveniritem: false,
      adminHandler: false,
      requesterHandler: false
    });
    this.props.getAllTSouvenirItem();
    setTimeout(() => {
      window.location.href = "/tsouveniritem";
    }, 3000);
  }

  changeDateFormat = tanggal => {
    return moment(tanggal).format("DD/MM/YYYY");
  };

  render() {
    const columnWidth = { width: "100%" };
    const { m_role_id } = this.props.auth.user;
    if (m_role_id) {
      if (m_role_id === "RO0001") {
        return (
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card border-primary mb-2">
                  <div className="card-header lead">Souvenir Request List</div>
                  <div className="card-body">
                    <nav aria-label="breadcrumb mb-4">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                          <Link to="/">Home</Link>
                        </li>
                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
                          Transaction Souvenir Request Item
                        </li>
                      </ol>
                    </nav>
                    {this.state.alertData.status === 1 && (
                      <Alert color="success">
                        <b>Data {this.state.alertData.message} ! </b>
                        Transaction souvenir request with code{" "}
                        <strong>{this.state.alertData.code} </strong>
                        has been {this.state.alertData.message} !
                      </Alert>
                    )}
                    {this.state.alertData.status === 2 && (
                      <Alert color="danger">
                        {this.state.alertData.message}{" "}
                      </Alert>
                    )}
                    <ViewTsouveniritem
                      view={this.state.viewTsouveniritem}
                      closeModalHandler={this.closeModalHandler}
                      tsouveniritem={this.state.currentTsouveniritem}
                    />
                    <AdminHandler
                      adminHandler={this.state.adminHandler}
                      closeModalHandler={this.closeModalHandler}
                      tsouveniritem={this.state.currentTsouveniritem}
                      modalStatus={this.modalStatus}
                      getlist={this.props.getAllTSouvenirItem}
                    />
                    <div className="form-row">
                      <div className="col-md-2">
                        <input
                          placeholder="Search by Code"
                          name="code"
                          className="form-control"
                          onChange={this.changeHandler}
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          placeholder="Search by Requester"
                          name="request_by"
                          className="form-control"
                          onChange={this.changeHandler}
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          placeholder="Search by Request Date"
                          type="date"
                          name="request_date"
                          className="form-control"
                          onChange={this.changeHandler}
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          placeholder="Search by Request Due Date"
                          type="date"
                          name="request_due_date"
                          className="form-control"
                          onChange={this.changeHandler}
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          placeholder="Search by Status"
                          name="status"
                          className="form-control"
                          onChange={this.changeHandler}
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          placeholder="Search by Create by"
                          name="created_by"
                          className="form-control"
                          onChange={this.changeHandler}
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          placeholder="Search by Create Date"
                          type="date"
                          name="created_date"
                          className="form-control"
                          onChange={this.changeHandler}
                        />
                      </div>
                      {/* <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={this.showHandler}
                      >
                        Add Souvenir Request
                      </Button> */}
                    </div>
                    <br />
                    <div className="table responsive">
                      <table className="table  table-stripped">
                        <thead>
                          <tr
                            className="text-center font-weight-bold"
                            style={columnWidth}
                          >
                            <td>No.</td>
                            <td>Transaction Code</td>
                            <td>Request By</td>
                            <td>Request Date</td>
                            <td>Request Due Date</td>
                            <td>Status</td>
                            <td>Created By</td>
                            <td>Created Date</td>
                            <td>Action</td>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.hasil
                            .slice(
                              this.state.page * this.state.rowsPerPage,
                              this.state.page * this.state.rowsPerPage +
                                this.state.rowsPerPage
                            )
                            .map((tsouveniritem, index) => (
                              <tr
                                className="text-center"
                                key={tsouveniritem._id}
                              >
                                <td>
                                  {index +
                                    1 +
                                    this.state.page * this.state.rowsPerPage}
                                </td>
                                <td component="th">{tsouveniritem.code}</td>
                                <td>{tsouveniritem.request_by}</td>
                                <td>
                                  {this.changeDateFormat(
                                    tsouveniritem.request_date
                                  )}
                                </td>
                                <td>
                                  {this.changeDateFormat(
                                    tsouveniritem.request_due_date
                                  )}
                                </td>
                                <td>
                                  {this.designStatus(tsouveniritem.status)}
                                </td>
                                <td>{tsouveniritem.created_by}</td>
                                <td>
                                  {this.changeDateFormat(
                                    tsouveniritem.created_date
                                  )}
                                </td>
                                <td>
                                  <Link to="#">
                                    <SearchIcon
                                      onClick={() => {
                                        this.viewModalHandler(
                                          tsouveniritem._id
                                        );
                                      }}
                                    />
                                  </Link>
                                  <Link to="#">
                                    <CreateOutlinedIcon
                                      onClick={() => {
                                        this.adminButtonHandler(
                                          tsouveniritem._id
                                        );
                                      }}
                                    />
                                  </Link>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              colSpan={6}
                              count={this.state.hasil.length}
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
        );
      } else if (m_role_id === "RO0002") {
        return (
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card border-primary mb-2">
                  <div className="card-header lead">Souvenir Request List</div>
                  <div className="card-body">
                    <nav aria-label="breadcrumb mb-4">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                          <Link to="/">Home</Link>
                        </li>
                        <li
                          className="breadcrumb-item active"
                          aria-current="page"
                        >
                          Transaction Souvenir Request Item
                        </li>
                      </ol>
                    </nav>
                    {this.state.alertData.status === 1 && (
                      <Alert color="success">
                        <b>Data {this.state.alertData.message} ! </b>
                        Transaction souvenir request with code{" "}
                        <strong>{this.state.alertData.code} </strong>
                        has been {this.state.alertData.message} !
                      </Alert>
                    )}
                    {this.state.alertData.status === 2 && (
                      <Alert color="danger">
                        {this.state.alertData.message}{" "}
                      </Alert>
                    )}
                    <ViewTsouveniritem
                      view={this.state.viewTsouveniritem}
                      closeModalHandler={this.closeModalHandler}
                      tsouveniritem={this.state.currentTsouveniritem}
                    />
                    <CreateTsouveniritem
                      create={this.state.showCreateTsouveniritem}
                      closeHandler={this.closeHandler}
                      modalStatus={this.modalStatus}
                      getlist={this.props.getAllTSouvenirItem}
                    />
                    <EditTsouveniritem
                      edit={this.state.editTsouveniritem}
                      closeModalHandler={this.closeModalHandler}
                      tsouveniritemtest={this.state.currentTsouveniritem}
                      modalStatus={this.modalStatus}
                      getlist={this.props.getAllTSouvenirItem}
                      getAllItem={this.state.getitem}
                    />
                    <RequesterHandler
                      requesterHandler={this.state.requesterHandler}
                      closeModalHandler={this.closeModalHandler}
                      tsouveniritem={this.state.currentTsouveniritem}
                      modalStatus={this.modalStatus}
                      getlist={this.props.getAllTSouvenirItem}
                    />
                    <div className="form-row">
                      <div className="col-md-2">
                        <input
                          placeholder="Search by Code"
                          name="code"
                          className="form-control"
                          onChange={this.changeHandler}
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          placeholder="Search by Requester"
                          name="request_by"
                          className="form-control"
                          onChange={this.changeHandler}
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          placeholder="Search by Request Date"
                          type="date"
                          name="request_date"
                          className="form-control"
                          onChange={this.changeHandler}
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          placeholder="Search by Request Due Date"
                          type="date"
                          name="request_due_date"
                          className="form-control"
                          onChange={this.changeHandler}
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          placeholder="Search by Status"
                          name="status"
                          className="form-control"
                          onChange={this.changeHandler}
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          placeholder="Search by Create by"
                          name="created_by"
                          className="form-control"
                          onChange={this.changeHandler}
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          placeholder="Search by Create Date"
                          type="date"
                          name="created_date"
                          className="form-control"
                          onChange={this.changeHandler}
                        />
                      </div>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={this.showHandler}
                      >
                        Add Souvenir Request
                      </Button>
                    </div>
                    <br />
                    <div className="table responsive">
                      <table className="table  table-stripped">
                        <thead>
                          <tr
                            className="text-center font-weight-bold"
                            style={columnWidth}
                          >
                            <td>No.</td>
                            <td>Transaction Code</td>
                            <td>Request By</td>
                            <td>Request Date</td>
                            <td>Request Due Date</td>
                            <td>Status</td>
                            <td>Created By</td>
                            <td>Created Date</td>
                            <td>Action</td>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.hasil
                            .slice(
                              this.state.page * this.state.rowsPerPage,
                              this.state.page * this.state.rowsPerPage +
                                this.state.rowsPerPage
                            )
                            .map((tsouveniritem, index) => (
                              <tr
                                className="text-center"
                                key={tsouveniritem._id}
                              >
                                <td>
                                  {index +
                                    1 +
                                    this.state.page * this.state.rowsPerPage}
                                </td>
                                <td component="th">{tsouveniritem.code}</td>
                                <td>{tsouveniritem.request_by}</td>
                                <td>
                                  {this.changeDateFormat(
                                    tsouveniritem.request_date
                                  )}
                                </td>
                                <td>
                                  {this.changeDateFormat(
                                    tsouveniritem.request_due_date
                                  )}
                                </td>
                                <td>
                                  {this.designStatus(tsouveniritem.status)}
                                </td>
                                <td>{tsouveniritem.created_by}</td>
                                <td>
                                  {this.changeDateFormat(
                                    tsouveniritem.created_date
                                  )}
                                </td>
                                <td>
                                  <Link to="#">
                                    <SearchIcon
                                      onClick={() => {
                                        this.viewModalHandler(
                                          tsouveniritem._id
                                        );
                                      }}
                                    />
                                  </Link>
                                  <Link to="#">
                                    <CreateOutlinedIcon
                                      onClick={() => {
                                        this.editModalHandler(
                                          tsouveniritem.code,
                                          tsouveniritem._id
                                        );
                                      }}
                                    />
                                  </Link>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              colSpan={6}
                              count={this.state.hasil.length}
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
        );
      }
    } else {
      return <Spinner />;
    }
  }
}

ListTsouveniritem.propTypes = {
  getAllTSouvenirItem: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  tsouveniritemReducer: state.tsouveniritemIndexReducer,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getAllTSouvenirItem }
)(ListTsouveniritem);
