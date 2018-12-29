import React from "react";
import axios from "axios";
import ApiConfig from "../../../config/Host_Config";
import { Link } from "react-router-dom";
import { Alert, FormGroup, Input, Form, Button } from "reactstrap";
import { getAllTSouvenirItem } from "../../../actions/tsouveniritemAction";
import { connect } from "react-redux";

import CreateTsouveniritem from "./CreateTSouvenirRequest";
import EditTsouveniritem from "./UpdateTSouvenirRequest";
import ViewTsouveniritem from "./ViewTSouvenirRequest";
import AdminApproveRequest from "./AdminRequestApprove";
import AdminApproveSettlement from "./AdminSettlementApprove";
//import AdminRejectRequest from "./AdminRejectRequest";
import ReceivedSouvenirRequest from "./ReceivedSouvenirItem";
import SettlementSouvenir from "./SettlementSouvenirItem";
import CloseOrder from "./CloseOrder";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import Paper from "@material-ui/core/Paper";
import Hidden from "@material-ui/core/Hidden";
import SearchIcon from "@material-ui/icons/Search";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import Spinner from "../../common/Spinner";

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
        adminApprove: true
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
        approveSettlement: true
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
            receivedSouvenir: true
          });
        } else if (tmp.status === 3) {
          this.setState({
            currentTsouveniritem: tmp,
            settlementSouvenir: true
          });
        } else if (tmp.status === 4) {
          this.modalStatus(2, "Settlement not yet approved by admin");
        } else if (tmp.status === 5) {
          this.setState({
            currentTsouveniritem: tmp,
            closeOrderSouvenir: true
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
      deleteTsouveniritem: false,
      adminApprove: false,
      rejectRequest: false,
      receivedSouvenir: false,
      approveSettlement: false,
      closeOrderSouvenir: false,
      settlementSouvenir: false
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
      deleteTsouveniritem: false,
      adminApprove: false,
      approveSettlement: false
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
    const { m_role_id } = this.props.auth.user;
    if (m_role_id) {
      if (m_role_id === "RO0001") {
        return (
          <div>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <Paper>
                  <ul class="breadcrumb">
                    <li>
                      <a href="/company">Home</a> <span class="divider">/</span>
                    </li>
                    <li>
                      <a href="#">Transaction</a> <span class="divider">/</span>
                    </li>
                    <li class="active">List Souvenir Request</li>
                  </ul>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <h4>List Souvenir Request</h4>
                {this.state.alertData.status === 1 ? (
                  <Alert color="success">
                    <b>Data {this.state.alertData.message} ! </b> Transaction
                    souvenir request with code{" "}
                    <strong>{this.state.alertData.code} </strong>
                    has been {this.state.alertData.message} !
                  </Alert>
                ) : (
                  console.log("")
                )}
                {this.state.alertData.status === 2 ? (
                  <Alert color="danger">{this.state.alertData.message} </Alert>
                ) : (
                  console.log("")
                )}
              </Grid>
              <Form inline>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Input
                    style={{ width: 170 }}
                    type="text"
                    placeholder="Search by Code"
                    name="code"
                    onChange={this.changeHandler}
                  />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Input
                    style={{ width: 170 }}
                    type="text"
                    placeholder="Search by Requester"
                    name="request_by"
                    onChange={this.changeHandler}
                  />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Input
                    style={{ width: 170 }}
                    type="date"
                    placeholder="Search"
                    name="request_date"
                    onChange={this.changeHandler}
                  />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Input
                    style={{ width: 170 }}
                    type="date"
                    placeholder="Date Search"
                    name="request_due_date"
                    onChange={this.changeHandler}
                  />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Input
                    style={{ width: 170 }}
                    type="text"
                    placeholder="Search by status"
                    name="status"
                    onChange={this.changeHandler}
                  />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Input
                    style={{ width: 170 }}
                    type="date"
                    placeholder="Date Search"
                    name="created_date"
                    onChange={this.changeHandler}
                  />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Input
                    style={{ width: 170 }}
                    type="text"
                    placeholder="Search by Created by"
                    name="created_by"
                    onChange={this.changeHandler}
                  />
                </FormGroup>
              </Form>
              <Grid item xs={3} justify="flex-end" />
              <ViewTsouveniritem
                view={this.state.viewTsouveniritem}
                closeModalHandler={this.closeModalHandler}
                tsouveniritem={this.state.currentTsouveniritem}
              />
              <AdminApproveRequest
                approve={this.state.adminApprove}
                closeModalHandler={this.closeModalHandler}
                tsouveniritem={this.state.currentTsouveniritem}
                modalStatus={this.modalStatus}
                getlist={this.props.getAllTSouvenirItem}
              />
              {/* <AdminRejectRequest
                closeModalHandler1={this.closeModalHandler}
                tsouveniritem={this.state.currentTsouveniritem}
                modalStatus={this.modalStatus}
                getlist={this.props.getAllTSouvenirItem}
              /> */}
              <AdminApproveSettlement
                approve={this.state.approveSettlement}
                closeModalHandler={this.closeModalHandler}
                tsouveniritem={this.state.currentTsouveniritem}
                modalStatus={this.modalStatus}
                getlist={this.props.getAllTSouvenirItem}
              />
              <Grid item xs={12}>
                <Grid>
                  <h5>
                    {" "}
                    Terdapat{" "}
                    <b>
                      {
                        this.state.result.filter(notif => notif.status === 1)
                          .length
                      }
                    </b>{" "}
                    request submitted yang belum di approve/reject.
                  </h5>
                </Grid>
                <Hidden>
                  <br />
                  <Paper>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>No</TableCell>
                          <TableCell>Transaction Code</TableCell>
                          <TableCell>Request By</TableCell>
                          <TableCell>Request Date</TableCell>
                          <TableCell>Due Date</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Created Date</TableCell>
                          <TableCell>Created By</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.hasil
                          .slice(
                            this.state.page * this.state.rowsPerPage,
                            this.state.page * this.state.rowsPerPage +
                              this.state.rowsPerPage
                          )
                          .map((row, index) => {
                            return (
                              <TableRow key={row.id}>
                                <TableCell>
                                  {index +
                                    1 +
                                    this.state.page * this.state.rowsPerPage}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {row.code}
                                </TableCell>
                                <TableCell>{row.request_by}</TableCell>
                                <TableCell>
                                  {this.changeDateFormat(row.request_date)}
                                </TableCell>
                                <TableCell>
                                  {this.changeDateFormat(row.request_due_date)}
                                </TableCell>
                                <TableCell>
                                  {this.designStatus(row.status)}
                                </TableCell>
                                <TableCell>
                                  {this.changeDateFormat(row.created_date)}
                                </TableCell>
                                <TableCell>{row.created_by}</TableCell>
                                <TableCell>
                                  <Link to="#">
                                    <SearchIcon
                                      onClick={() => {
                                        this.viewModalHandler(row._id);
                                      }}
                                    />
                                  </Link>
                                  <Link to="#">
                                    <CreateOutlinedIcon
                                      onClick={() => {
                                        this.adminButtonHandler(row._id);
                                      }}
                                    />
                                  </Link>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TablePagination
                            colSpan={5}
                            count={this.state.hasil.length}
                            rowsPerPage={this.state.rowsPerPage}
                            page={this.state.page}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActionsWrapped}
                          />
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </Paper>
                </Hidden>
              </Grid>
            </Grid>
            <br />
          </div>
        );
      } else if (m_role_id === "RO0002") {
        return (
          <div>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <Paper>
                  <ul class="breadcrumb">
                    <li>
                      <a href="/company">Home</a> <span class="divider">/</span>
                    </li>
                    <li>
                      <a href="#">Transaction</a> <span class="divider">/</span>
                    </li>
                    <li class="active">List Souvenir Request</li>
                  </ul>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <h4>List Souvenir Request</h4>
                {this.state.alertData.status === 1 ? (
                  <Alert color="success">
                    <b>Data {this.state.alertData.message} ! </b> Transaction
                    souvenir request with code{" "}
                    <strong>{this.state.alertData.code} </strong>
                    has been {this.state.alertData.message} !
                  </Alert>
                ) : (
                  console.log("")
                )}
                {this.state.alertData.status === 2 ? (
                  <Alert color="danger">{this.state.alertData.message} </Alert>
                ) : (
                  console.log("")
                )}
              </Grid>
              <Form inline>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Input
                    style={{ width: 170 }}
                    type="text"
                    placeholder="Search by Code"
                    name="code"
                    onChange={this.changeHandler}
                  />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Input
                    style={{ width: 170 }}
                    type="text"
                    placeholder="Search by Requester"
                    name="request_by"
                    onChange={this.changeHandler}
                  />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Input
                    style={{ width: 170 }}
                    type="date"
                    placeholder="Search"
                    name="request_date"
                    onChange={this.changeHandler}
                  />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Input
                    style={{ width: 170 }}
                    type="date"
                    placeholder="Date Search"
                    name="request_due_date"
                    onChange={this.changeHandler}
                  />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Input
                    style={{ width: 170 }}
                    type="text"
                    placeholder="Search by status"
                    name="status"
                    onChange={this.changeHandler}
                  />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Input
                    style={{ width: 170 }}
                    type="date"
                    placeholder="Date Search"
                    name="created_date"
                    onChange={this.changeHandler}
                  />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Input
                    style={{ width: 170 }}
                    type="text"
                    placeholder="Search by Created by"
                    name="created_by"
                    onChange={this.changeHandler}
                  />
                </FormGroup>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={this.showHandler}
                >
                  Add Request
                </Button>
              </Form>
              <Grid item xs={3} justify="flex-end" />
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
              <ReceivedSouvenirRequest
                approve={this.state.receivedSouvenir}
                closeModalHandler={this.closeModalHandler}
                tsouveniritem={this.state.currentTsouveniritem}
                modalStatus={this.modalStatus}
                getlist={this.props.getAllTSouvenirItem}
              />
              <SettlementSouvenir
                approve={this.state.settlementSouvenir}
                closeModalHandler={this.closeModalHandler}
                tsouveniritem={this.state.currentTsouveniritem}
                modalStatus={this.modalStatus}
                getlist={this.props.getAllTSouvenirItem}
              />
              <CloseOrder
                approve={this.state.closeOrderSouvenir}
                closeModalHandler={this.closeModalHandler}
                tsouveniritem={this.state.currentTsouveniritem}
                modalStatus={this.modalStatus}
              />
              <Grid item xs={12}>
                <Hidden>
                  <br />
                  <Paper>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>No</TableCell>
                          <TableCell>Transaction Code</TableCell>
                          <TableCell>Request By</TableCell>
                          <TableCell>Request Date</TableCell>
                          <TableCell>Due Date</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Created Date</TableCell>
                          <TableCell>Created By</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.hasil
                          .slice(
                            this.state.page * this.state.rowsPerPage,
                            this.state.page * this.state.rowsPerPage +
                              this.state.rowsPerPage
                          )
                          .map((row, index) => {
                            return (
                              <TableRow key={row.id}>
                                <TableCell>
                                  {index +
                                    1 +
                                    this.state.page * this.state.rowsPerPage}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {row.code}
                                </TableCell>
                                <TableCell>{row.request_by}</TableCell>
                                <TableCell>
                                  {this.changeDateFormat(row.request_date)}
                                </TableCell>
                                <TableCell>
                                  {this.changeDateFormat(row.request_due_date)}
                                </TableCell>
                                <TableCell>
                                  {this.designStatus(row.status)}
                                </TableCell>
                                <TableCell>
                                  {this.changeDateFormat(row.created_date)}
                                </TableCell>
                                <TableCell>{row.created_by}</TableCell>
                                <TableCell>
                                  <Link to="#">
                                    <SearchIcon
                                      onClick={() => {
                                        this.viewModalHandler(row._id);
                                      }}
                                    />
                                  </Link>
                                  <Link to="#">
                                    <CreateOutlinedIcon
                                      onClick={() => {
                                        this.editModalHandler(
                                          row.code,
                                          row._id
                                        );
                                      }}
                                    />
                                  </Link>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TablePagination
                            colSpan={5}
                            count={this.state.hasil.length}
                            rowsPerPage={this.state.rowsPerPage}
                            page={this.state.page}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActionsWrapped}
                          />
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </Paper>
                </Hidden>
              </Grid>
            </Grid>
            <br />
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
