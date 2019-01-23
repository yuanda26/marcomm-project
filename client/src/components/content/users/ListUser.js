import React from "react";
import { Link } from "react-router-dom";
import { Alert } from "reactstrap";
import { getAllUser } from "../../../actions/userActions";
import { connect } from "react-redux";
import EditUser from "./EditUser";
import CreateUser from "./CreateUser";
import DeleteUser from "./DeleteUser";
import ViewUser from "./ViewUser";
import Add from "@material-ui/icons/Add";
import Eye from "@material-ui/icons/RemoveRedEye";
import Tooltip from "react-tooltip";
import PropTypes from "prop-types";
import Spinner from "../../common/Spinner";
import Refresh from "@material-ui/icons/Refresh";
import {
  withStyles,
  TableRow,
  TableFooter,
  TablePagination,
  IconButton
} from "@material-ui/core";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import SearchIcon from "@material-ui/icons/Search";
import DeleteOutlinedIcon from "@material-ui/icons/Delete";
import CreateOutlinedIcon from "@material-ui/icons/Create";
import moment from "moment";

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

class ListUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: true,
      formSearch: {
        name: /(?:)/,
        role_name: /(?:)/,
        company_name: /(?:)/,
        username: /(?:)/,
        created_date: /(?:)/
      },
      showCreateUser: false,
      allUser: [],
      currentUser: {},
      alertData: {
        status: 0,
        message: "",
        code: ""
      },
      hasil: [],
      page: 0,
      rowsPerPage: 5
    };
    this.showHandler = this.showHandler.bind(this);
    this.closeModalHandler = this.closeModalHandler.bind(this);
    this.closeHandler = this.closeHandler.bind(this);
    this.viewModalHandler = this.viewModalHandler.bind(this);
    this.editModalHandler = this.editModalHandler.bind(this);
    this.modalStatus = this.modalStatus.bind(this);
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  deleteModalHandler(userid) {
    let tmp = {};
    this.state.allUser.map(ele => {
      if (userid === ele._id) {
        tmp = ele;
      }
      return tmp;
    });
    this.setState({
      currentUser: tmp,
      deleteUser: true
    });
  }

  viewModalHandler(userid) {
    let tmp = {};
    this.state.allUser.map(ele => {
      if (userid === ele._id) {
        tmp = ele;
      }
      return tmp;
    });
    this.setState({
      currentUser: tmp,
      viewUser: true
    });
  }

  editModalHandler(userid) {
    let tmp = {};
    this.state.allUser.map(ele => {
      if (userid === ele._id) {
        tmp = {
          _id: ele._id,
          username: ele.username,
          m_role_id: ele.m_role_id,
          m_employee_id: ele.m_employee_id,
          update_by: ele.update_by
        };
        this.setState({
          currentUser: tmp,
          editUser: true
        });
      }
      return tmp;
    });
  }

  changeHandler = event => {
    let tmp = this.state.formSearch;
    if (event.target.name) {
      if (event.target.name === "created_date") {
        tmp[event.target.name] = new RegExp(
          moment(event.target.value).format("DD/MM/YYYY")
        );
      } else {
        tmp[event.target.name] = new RegExp(event.target.value.toLowerCase());
      }
    } else {
      tmp[event.target.name] = event.target.value;
    }
    this.setState({
      formSearch: tmp
    });
  };

  change = () => {
    const {
      name,
      role_name,
      company_name,
      username,
      created_date
    } = this.state.formSearch;
    let temp = [];
    this.state.allUser.map(ele => {
      if (
        name.test(ele.name.toLowerCase()) &&
        role_name.test(ele.role_name.toLowerCase()) &&
        company_name.test(ele.company_name.toLowerCase()) &&
        username.test(ele.username.toLowerCase()) &&
        created_date.test(ele.created_date.toLowerCase())
      ) {
        temp.push(ele);
      }
      return temp;
    });
    this.setState({
      hasil: temp,
      num: false
    });
  };
  enterKey = event => {
    if (event.key === "Enter") this.change();
  };
  closeModalHandler() {
    this.setState({
      viewUser: false,
      editUser: false,
      deleteUser: false
    });
  }

  showHandler() {
    this.setState({ showCreateUser: true });
  }

  closeHandler() {
    this.setState({ showCreateUser: false });
  }

  componentDidMount() {
    this.props.getAllUser();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      allUser: newProps.bujang.userPayload,
      hasil: newProps.bujang.userPayload
    });
  }

  modalStatus(status, message, code) {
    this.setState({
      alertData: {
        status: status,
        message: message,
        code: code
      },
      viewUser: false,
      editUser: false,
      deleteUser: false
    });
  }

  changeDateFormat = tanggal => {
    return moment(tanggal).format("DD/MM/YYYY");
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card border-primary mb-3">
              <div className="card-header lead bg-primary text-white">
                List User
              </div>
              <div className="card-body">
                <nav aria-label="breadcrumb mb-4">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      List User
                    </li>
                  </ol>
                </nav>
                {this.state.alertData.status === 1 ? (
                  <Alert color="success">
                    {" "}
                    {this.state.alertData.message}{" "}
                  </Alert>
                ) : (
                  ""
                )}
                {this.state.alertData.status === 2 ? (
                  <Alert color="danger"> {this.state.alertData.message} </Alert>
                ) : (
                  ""
                )}
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td>
                          <input
                            className="form-control"
                            placeholder="Employee Name"
                            name="name"
                            onKeyPress={this.enterKey}
                            onChange={this.changeHandler}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            placeholder="Role Name"
                            name="role_name"
                            onKeyPress={this.enterKey}
                            onChange={this.changeHandler}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            placeholder="Company Name"
                            name="company_name"
                            onKeyPress={this.enterKey}
                            onChange={this.changeHandler}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            placeholder="Username"
                            name="username"
                            onKeyPress={this.enterKey}
                            onChange={this.changeHandler}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control"
                            placeholder="Created Date"
                            type="date"
                            name="created_date"
                            onKeyPress={this.enterKey}
                            onChange={this.changeHandler}
                          />
                        </td>
                        <td>
                          {this.state.num ? (
                            <a href="#!" data-tip="Search">
                              <button
                                className="btn btn-primary"
                                onClick={this.change}
                              >
                                <SearchIcon />
                              </button>
                              <Tooltip place="top" type="dark" effect="solid" />
                            </a>
                          ) : (
                            <a href="#!" data-tip="Refresh Search">
                              <button
                                className="btn btn-warning"
                                onClick={() => {
                                  this.setState({
                                    hasil: this.state.allUser,
                                    num: true
                                  });
                                }}
                              >
                                <Refresh />
                              </button>
                              <Tooltip place="top" type="dark" effect="solid" />
                            </a>
                          )}
                        </td>
                        <td>
                          <a href="#!" data-tip="Add User">
                            <button
                              className="btn btn-primary"
                              onClick={this.showHandler}
                            >
                              <Add />
                            </button>
                            <Tooltip place="top" type="dark" effect="solid" />
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {this.state.hasil.length === 0 &&
                  this.state.allUser.length === 0 ? (
                    <Spinner />
                  ) : this.state.hasil.length === 0 ? (
                    <div className="text-center font-weight-bold">
                      No Data Found
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr className="text-center font-weight-bold">
                            <td nowrap="true">Employee</td>
                            <td nowrap="true">Role</td>
                            <td nowrap="true">Company</td>
                            <td nowrap="true">Username</td>
                            <td nowrap="true">Created Date</td>
                            <td nowrap="true">Created By</td>
                            <td nowrap="true">Action</td>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.hasil
                            .slice(
                              this.state.page * this.state.rowsPerPage,
                              this.state.page * this.state.rowsPerPage +
                                this.state.rowsPerPage
                            )
                            .map((row, index) => {
                              return (
                                <tr
                                  key={index.toString()}
                                  className="text-center"
                                >
                                  <td nowrap="true">{row.name}</td>
                                  <td nowrap="true">{row.role_name}</td>
                                  <td nowrap="true">{row.company_name}</td>
                                  <td nowrap="true">{row.username}</td>
                                  <td nowrap="true">{row.created_date}</td>
                                  <td nowrap="true">{row.created_by}</td>
                                  <td nowrap="true">
                                    <Link to="#">
                                      <Eye
                                        onClick={() => {
                                          this.viewModalHandler(row._id);
                                        }}
                                      />
                                    </Link>
                                    <Link to="#">
                                      <CreateOutlinedIcon
                                        onClick={() => {
                                          this.editModalHandler(row._id);
                                        }}
                                      />
                                    </Link>
                                    <Link to="#">
                                      <DeleteOutlinedIcon
                                        onClick={() => {
                                          this.deleteModalHandler(row._id);
                                        }}
                                      />
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              colSpan={4}
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
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <CreateUser
              create={this.state.showCreateUser}
              closeHandler={this.closeHandler}
              modalStatus={this.modalStatus}
              allUser={this.state.allUser}
            />
            <ViewUser
              view={this.state.viewUser}
              closeModalHandler={this.closeModalHandler}
              user={this.state.currentUser}
            />
            <EditUser
              edit={this.state.editUser}
              closeModalHandler={this.closeModalHandler}
              currentUser={this.state.currentUser}
              username={this.state.currentUser.username}
              modalStatus={this.modalStatus}
              allUser={this.state.allUser}
            />
            <DeleteUser
              delete={this.state.deleteUser}
              user={this.state.currentUser}
              closeModalHandler={this.closeModalHandler}
              modalStatus={this.modalStatus}
            />
          </div>
        </div>
        {/* <Grid container spacing={8}>
          <Grid item xs={12}>
            <br />
            <ul className="breadcrumb">
              <li>
                <a href="/dashboard">Home</a> <span className="divider">/</span>
              </li>
              <li>
                <a href="/dashboard">Master</a>{" "}
                <span className="divider">/</span>
              </li>
              <li className="active">List User</li>
            </ul>
          </Grid>
          <Grid item xs={12}>
            <h4>List User</h4>
          </Grid>
          <Grid item xs={12}>
            <Input
              placeholder="Employee Name"
              name="name"
              onChange={this.changeHandler}
            />
          </Grid>
          <Grid item xs={2}>
            <Input
              placeholder="Role Name"
              name="role_name"
              onChange={this.changeHandler}
            />
          </Grid>
          <Grid item xs={2}>
            <Input
              placeholder="Company Name"
              name="company_name"
              onChange={this.changeHandler}
            />
          </Grid>
          <Grid item xs={2}>
            <Input
              placeholder="Username"
              name="username"
              onChange={this.changeHandler}
            />
          </Grid>
          <Grid item xs={2}>
            <Input
              placeholder="Created Date"
              type="date"
              name="created_date"
              onChange={this.changeHandler}
            />
          </Grid>
          <Grid item xs={1}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={this.showHandler}
            >
              Add User
            </Button>
          </Grid>
          <Grid item xs={6} />
          

          <Grid item xs={12}>
            <br />
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Username</TableCell>
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
                        <TableRow key={row._id}>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.role_name}</TableCell>
                          <TableCell>{row.company_name}</TableCell>
                          <TableCell>{row.username}</TableCell>
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
                                  this.editModalHandler(row._id);
                                }}
                              />
                            </Link>
                            <Link to="#">
                              <DeleteOutlinedIcon
                                onClick={() => {
                                  this.deleteModalHandler(row._id);
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
                      colSpan={4}
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
            <br />
            {this.state.alertData.status === 1 ? (
              <Alert color="success">
                <b>Data {this.state.alertData.message}</b> Data user with
                referential username{" "}
                <strong>{this.state.alertData.code} </strong>
                has been {this.state.alertData.message}
              </Alert>
            ) : (
              ""
            )}
            {this.state.alertData.status === 2 ? (
              <Alert color="danger">{this.state.alertData.message} </Alert>
            ) : (
              ""
            )}
          </Grid>
        </Grid>
       */}
      </div>
    );
  }
}

ListUser.propTypes = {
  getAllUser: PropTypes.func.isRequired,
  bujang: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  bujang: state.userData
});

export default connect(
  mapStateToProps,
  { getAllUser }
)(ListUser);
