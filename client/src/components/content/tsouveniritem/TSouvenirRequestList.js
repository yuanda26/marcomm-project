import React from "react";
import axios from "axios";
import host from "../../../config/Host_Config";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import Spinner from "../../common/Spinner";

import { Alert } from "reactstrap";
import { TableFooter, TableRow, TablePagination } from "@material-ui/core";
import { Search, Refresh, Create, RemoveRedEye, Add } from "@material-ui/icons";

import {
  getAllTSouvenirItem,
  getAllTSouvenirItemDetil
} from "../../../actions/tsouveniritemAction";

import CreateTsouveniritem from "./CreateTSouvenirRequest";
import ViewTsouveniritem from "./ReadTSouvenirRequest";
import EditTsouveniritem from "./UpdateTSouvenirRequest";
import AdminHandler from "./AdminHandler";
import RequesterHandler from "./RequesterHandler";
import ReactTooltip from "react-tooltip";
import SpinnerTable from "../../common/SpinnerTable";
import Pagination from "../../common/Pagination";

class ListTsouveniritem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateTsouveniritem: false,
      currentTsouveniritem: {},
      alertData: {
        status: 0,
        message: "",
        code: "",
        getitem: ""
      },
      formSearch: {
        code: "",
        request_by: "",
        request_date: "",
        request_due_date: "",
        status: "",
        created_date: "",
        created_by: ""
      },
      tsouveniritem: [null],
      tsouveniritemSearch: [null],
      page: 0,
      rowsPerPage: 5,
      userdata: {},
      search: true
    };
    this.showHandler = this.showHandler.bind(this);
    this.closeHandler = this.closeHandler.bind(this);
    this.viewModalHandler = this.viewModalHandler.bind(this);
    this.editModalHandler = this.editModalHandler.bind(this);
    this.adminButtonHandler = this.adminButtonHandler.bind(this);
    this.closeModalHandler = this.closeModalHandler.bind(this);
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
    const { m_role_id, m_employee_id } = this.props.user;
    if (m_role_id !== undefined && m_employee_id !== undefined) {
      this.props.getAllTSouvenirItem(m_role_id, m_employee_id);
      this.props.getAllTSouvenirItemDetil();
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      tsouveniritem: newProps.tsouveniritemReducer.ts,
      tsouveniritemSearch: newProps.tsouveniritemReducer.ts,
      userdata: newProps.user
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
    this.state.tsouveniritem.forEach(ele => {
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
    this.state.tsouveniritem.forEach(ele => {
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
        url: `${host}/tsouveniritem/${code}`,
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
    this.state.tsouveniritem.forEach(ele => {
      if (tsouveniritemid === ele._id) {
        tmp = {
          _id: ele._id,
          code: ele.code,
          t_event_id: ele.t_event_id,
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

  changeHanlderSearch = event => {
    let tmp = this.state.formSearch;
    if (event.target.name) {
      tmp[event.target.name] = event.target.value;
    }
    this.setState({
      formSearch: tmp
    });
  };

  searchHandler = e => {
    const {
      code,
      request_by,
      request_date,
      request_due_date,
      status,
      created_date,
      created_by
    } = this.state.formSearch;
    const searchCode = new RegExp(code, "i");
    const searchRequestBy = new RegExp(request_by, "i");
    const searchRequestDate =
      request_date === ""
        ? new RegExp("")
        : new RegExp(moment(request_date).format("YYYY-MM-DD"));
    const searchRequestDueDate =
      request_due_date === ""
        ? new RegExp("")
        : new RegExp(moment(request_due_date).format("YYYY-MM-DD"));
    const searchStatus = new RegExp(status, "i");
    const searchCreatedBy = new RegExp(created_by, "i");
    const searchCreatedDate =
      created_date === ""
        ? new RegExp("")
        : new RegExp(moment(created_date).format("YYYY-MM-DD"));
    let temp = [];
    this.state.tsouveniritem.map(ele => {
      if (
        searchCode.test(ele.code.toLowerCase()) &&
        searchRequestBy.test(ele.request_by.toLowerCase()) &&
        searchRequestDate.test(ele.request_date) &&
        searchRequestDueDate.test(ele.request_due_date) &&
        searchStatus.test(this.designStatus(ele.status).toLowerCase()) &&
        searchCreatedDate.test(ele.created_date) &&
        searchCreatedBy.test(ele.created_by.toLowerCase())
      ) {
        temp.push(ele);
      }
      return temp;
    });
    this.setState({
      tsouveniritemSearch: temp,
      search: false
    });
  };

  refreshSearch = () => {
    this.setState({
      tsouveniritemSearch: this.state.tsouveniritem,
      search: true,
      formSearch: {
        code: "",
        request_by: "",
        request_date: "",
        request_due_date: "",
        status: "",
        created_date: "",
        created_by: ""
      }
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
    const { m_role_id, m_employee_id } = this.props.user;
    this.props.getAllTSouvenirItem(m_role_id, m_employee_id);
    this.props.getAllTSouvenirItemDetil();
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
    setTimeout(() => {
      this.setState({
        alertData: {
          status: 0,
          message: "",
          code: ""
        }
      });
    }, 3000);
  }

  changeDateFormat = tanggal => {
    return moment(tanggal).format("DD/MM/YYYY");
  };

  keyHandler = event => {
    if (event.key === "Enter") this.searchHandler();
  };

  designDatatip = status => {
    let datatip = "";
    if (status === 1) {
      datatip = "Edit Souvenir Request";
    } else if (status === 2) {
      datatip = "Receive Souvenir Request";
    } else if (status === 3) {
      datatip = "Settlement Souvenir Request";
    } else if (status === 4) {
      datatip = "Approve Settlement Souvenir Request";
    } else if (status === 5) {
      datatip = "Close Request";
    } else {
      datatip = "Closed Request";
    }
    return datatip;
  };

  render() {
    const columnWidth = { width: "100%" };
    const { m_role_id } = this.props.user;
    if (m_role_id) {
      if (m_role_id === "RO0001") {
        return (
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card border-primary mb-2">
                  <div className="card-header bg-primary text-white lead">
                    Souvenir Request List
                  </div>
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
                        {this.state.alertData.message}
                      </Alert>
                    )}
                    {this.state.alertData.status === 2 && (
                      <Alert color="danger">
                        {this.state.alertData.message}
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
                    <div className="table-responsive">
                      <table className="table table-stripped">
                        <thead>
                          <tr>
                            <td nowrap="true">
                              <input
                                placeholder="Search by Code"
                                name="code"
                                value={this.state.formSearch.code}
                                className="form-control"
                                onChange={this.changeHanlderSearch}
                                onKeyPress={this.keyHandler}
                              />
                            </td>
                            <td nowrap="true">
                              <input
                                placeholder="Search by Requester"
                                name="request_by"
                                value={this.state.formSearch.request_by}
                                className="form-control"
                                onChange={this.changeHanlderSearch}
                                onKeyPress={this.keyHandler}
                              />
                            </td>
                            <td nowrap="true">
                              <input
                                placeholder="Search by Request Date"
                                type="date"
                                name="request_date"
                                value={this.state.formSearch.request_date}
                                className="form-control"
                                onChange={this.changeHanlderSearch}
                                onKeyPress={this.keyHandler}
                              />
                            </td>
                            <td nowrap="true">
                              <input
                                placeholder="Search by Request Due Date"
                                type="date"
                                name="request_due_date"
                                value={this.state.formSearch.request_due_date}
                                className="form-control"
                                onChange={this.changeHanlderSearch}
                                onKeyPress={this.keyHandler}
                              />
                            </td>
                            <td nowrap="true">
                              <input
                                placeholder="Search by Status"
                                name="status"
                                value={this.state.formSearch.status}
                                className="form-control"
                                onChange={this.changeHanlderSearch}
                                onKeyPress={this.keyHandler}
                              />
                            </td>
                            <td nowrap="true">
                              <input
                                placeholder="Search by Create by"
                                name="created_by"
                                value={this.state.formSearch.created_by}
                                className="form-control"
                                onChange={this.changeHanlderSearch}
                                onKeyPress={this.keyHandler}
                              />
                            </td>
                            <td nowrap="true">
                              <input
                                placeholder="Search by Create Date"
                                type="date"
                                name="created_date"
                                value={this.state.formSearch.created_date}
                                className="form-control"
                                onChange={this.changeHanlderSearch}
                                onKeyPress={this.keyHandler}
                              />
                            </td>
                            <td nowrap="true">
                              {this.state.search === true && (
                                <button
                                  className="mr-2 btn btn-primary"
                                  onClick={this.searchHandler}
                                >
                                  <Search />
                                </button>
                              )}
                              {this.state.search === false && (
                                <button
                                  className="mr-2 btn btn-warning"
                                  onClick={this.refreshSearch}
                                >
                                  <Refresh />
                                </button>
                              )}
                              {/* <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={this.showHandler}
                              >
                                Add Souvenir Request
                              </Button> */}
                            </td>
                          </tr>
                          <tr
                            className="text-center font-weight-bold"
                            style={columnWidth}
                          >
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
                          {this.state.tsouveniritemSearch[0] === null ? (
                            <SpinnerTable />
                          ) : this.state.tsouveniritemSearch.length === 0 ? (
                            <tr className="text-center">
                              <td colSpan="8">No Souvenir Request Found</td>
                            </tr>
                          ) : (
                            this.state.tsouveniritemSearch
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
                                  <td component="th">{tsouveniritem.code}</td>
                                  <td nowrap="true">
                                    {tsouveniritem.request_by}
                                  </td>
                                  <td>
                                    {this.changeDateFormat(
                                      tsouveniritem.request_date
                                    )}
                                  </td>
                                  <td nowrap="true">
                                    {this.changeDateFormat(
                                      tsouveniritem.request_due_date
                                    )}
                                  </td>
                                  <td nowrap="true">
                                    {this.designStatus(tsouveniritem.status)}
                                  </td>
                                  <td nowrap="true">
                                    {tsouveniritem.created_by}
                                  </td>
                                  <td nowrap="true">
                                    {this.changeDateFormat(
                                      tsouveniritem.created_date
                                    )}
                                  </td>
                                  <td nowrap="true">
                                    <Link to="#">
                                      <RemoveRedEye
                                        onClick={() => {
                                          this.viewModalHandler(
                                            tsouveniritem._id
                                          );
                                        }}
                                      />
                                    </Link>
                                    <Link to="#">
                                      <Create
                                        onClick={() => {
                                          this.adminButtonHandler(
                                            tsouveniritem._id
                                          );
                                        }}
                                      />
                                    </Link>
                                  </td>
                                </tr>
                              ))
                          )}
                        </tbody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              colSpan={5}
                              count={this.state.tsouveniritemSearch.length}
                              rowsPerPage={this.state.rowsPerPage}
                              page={this.state.page}
                              onChangePage={this.handleChangePage}
                              onChangeRowsPerPage={this.handleChangeRowsPerPage}
                              ActionsComponent={Pagination}
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
      } else if (m_role_id === "RO0002" || "RO0005") {
        return (
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="card border-primary mb-2">
                  <div className="card-header bg-primary text-white lead">
                    Souvenir Request List
                  </div>
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
                        {this.state.alertData.message}
                      </Alert>
                    )}
                    {this.state.alertData.status === 2 && (
                      <Alert color="danger">
                        {this.state.alertData.message}
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
                    <div className="table-responsive">
                      <table className="table table-stripped">
                        <thead>
                          <tr>
                            <td nowrap="true">
                              <input
                                placeholder="Search by Code"
                                name="code"
                                value={this.state.formSearch.code}
                                className="form-control"
                                onChange={this.changeHanlderSearch}
                                onKeyPress={this.keyHandler}
                              />
                            </td>
                            <td nowrap="true">
                              <input
                                placeholder="Search by Requester"
                                name="request_by"
                                value={this.state.formSearch.request_by}
                                className="form-control"
                                onChange={this.changeHanlderSearch}
                                onKeyPress={this.keyHandler}
                              />
                            </td>
                            <td nowrap="true">
                              <input
                                placeholder="Search by Request Date"
                                type="date"
                                name="request_date"
                                value={this.state.formSearch.request_date}
                                className="form-control"
                                onChange={this.changeHanlderSearch}
                                onKeyPress={this.keyHandler}
                              />
                            </td>
                            <td nowrap="true">
                              <input
                                placeholder="Search by Request Due Date"
                                type="date"
                                name="request_due_date"
                                value={this.state.formSearch.request_due_date}
                                className="form-control"
                                onChange={this.changeHanlderSearch}
                                onKeyPress={this.keyHandler}
                              />
                            </td>
                            <td nowrap="true">
                              <input
                                placeholder="Search by Status"
                                value={this.state.formSearch.status}
                                name="status"
                                className="form-control"
                                onChange={this.changeHanlderSearch}
                                onKeyPress={this.keyHandler}
                              />
                            </td>
                            <td nowrap="true">
                              <input
                                placeholder="Search by Create by"
                                value={this.state.formSearch.created_by}
                                name="created_by"
                                className="form-control"
                                onChange={this.changeHanlderSearch}
                                onKeyPress={this.keyHandler}
                              />
                            </td>
                            <td nowrap="true">
                              <input
                                placeholder="Search by Create Date"
                                type="date"
                                name="created_date"
                                value={this.state.formSearch.created_date}
                                className="form-control"
                                onChange={this.changeHanlderSearch}
                                onKeyPress={this.keyHandler}
                              />
                            </td>
                            <td nowrap="true">
                              {this.state.search === true && (
                                <a href="#!" data-tip="Search">
                                  <button
                                    className="mr-2 btn btn-primary"
                                    onClick={this.searchHandler}
                                  >
                                    <Search />
                                  </button>
                                  <ReactTooltip
                                    place="top"
                                    type="dark"
                                    effect="solid"
                                  />
                                </a>
                              )}
                              {this.state.search === false && (
                                <a href="#!" data-tip="Refresh Result">
                                  <button
                                    className="mr-2 btn btn-warning"
                                    onClick={this.refreshSearch}
                                  >
                                    <Refresh />
                                  </button>
                                  <ReactTooltip
                                    place="top"
                                    type="dark"
                                    effect="solid"
                                  />
                                </a>
                              )}
                              <a href="#!" data-tip="Add Souvenir Request">
                                <button
                                  className="mr-2 btn btn-primary"
                                  onClick={this.showHandler}
                                >
                                  <Add />
                                </button>
                                <ReactTooltip
                                  place="top"
                                  type="dark"
                                  effect="solid"
                                />
                              </a>
                            </td>
                          </tr>
                        </thead>
                        <thead>
                          <tr
                            className="text-center font-weight-bold"
                            style={columnWidth}
                          >
                            <td nowrap="true">Transaction Code</td>
                            <td nowrap="true">Request By</td>
                            <td nowrap="true">Request Date</td>
                            <td nowrap="true">Request Due Date</td>
                            <td nowrap="true">Status</td>
                            <td nowrap="true">Created By</td>
                            <td nowrap="true">Created Date</td>
                            <td nowrap="true">Action</td>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.tsouveniritemSearch[0] === null &&
                          this.state.tsouveniritem[0] === null ? (
                            <Spinner />
                          ) : this.state.tsouveniritemSearch.length === 0 ? (
                            <tr className="text-center">
                              <td colSpan="8">No Souvenir Request Found</td>
                            </tr>
                          ) : (
                            this.state.tsouveniritemSearch
                              .slice(
                                this.state.page * this.state.rowsPerPage,
                                this.state.page * this.state.rowsPerPage +
                                  this.state.rowsPerPage
                              )
                              .map((tsouveniritem, index) => (
                                <tr className="text-center" key={index}>
                                  <td component="th" nowrap="true">
                                    {tsouveniritem.code}
                                  </td>
                                  <td nowrap="true">
                                    {tsouveniritem.request_by}
                                  </td>
                                  <td nowrap="true">
                                    {this.changeDateFormat(
                                      tsouveniritem.request_date
                                    )}
                                  </td>
                                  <td nowrap="true">
                                    {this.changeDateFormat(
                                      tsouveniritem.request_due_date
                                    )}
                                  </td>
                                  <td nowrap="true">
                                    {this.designStatus(tsouveniritem.status)}
                                  </td>
                                  <td nowrap="true">
                                    {tsouveniritem.created_by}
                                  </td>
                                  <td nowrap="true">
                                    {this.changeDateFormat(
                                      tsouveniritem.created_date
                                    )}
                                  </td>
                                  <td nowrap="true">
                                    <Link
                                      to="#"
                                      data-tip="View Souvenir Request"
                                    >
                                      <RemoveRedEye
                                        onClick={() => {
                                          this.viewModalHandler(
                                            tsouveniritem._id
                                          );
                                        }}
                                      />
                                      <ReactTooltip
                                        place="top"
                                        type="dark"
                                        effect="solid"
                                      />
                                    </Link>
                                    <Link
                                      to="#"
                                      data-tip={this.designDatatip(
                                        tsouveniritem.status
                                      )}
                                    >
                                      <Create
                                        onClick={() => {
                                          this.editModalHandler(
                                            tsouveniritem.code,
                                            tsouveniritem._id
                                          );
                                        }}
                                      />
                                      <ReactTooltip
                                        place="top"
                                        type="dark"
                                        effect="solid"
                                      />
                                    </Link>
                                  </td>
                                </tr>
                              ))
                          )}
                        </tbody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              colSpan={5}
                              count={this.state.tsouveniritemSearch.length}
                              rowsPerPage={this.state.rowsPerPage}
                              page={this.state.page}
                              onChangePage={this.handleChangePage}
                              onChangeRowsPerPage={this.handleChangeRowsPerPage}
                              ActionsComponent={Pagination}
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
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  { getAllTSouvenirItem, getAllTSouvenirItemDetil }
)(ListTsouveniritem);
