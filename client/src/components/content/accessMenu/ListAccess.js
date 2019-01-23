import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { getAllRoles } from "../../../actions/roleActions";
import { Link } from "react-router-dom";
import { Alert } from "reactstrap";
import HostConfig from "../../../config/Host_Config";
import CreateAccess from "./EditAccess";
import AddAccess from "./CreateAccess";
import DeleteAccess from "./DeleteAccess";
import ViewAccess from "./ViewAccess";
import PropTypes from "prop-types";
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
import SearchIcon from "@material-ui/icons/RemoveRedEye";
import DeleteOutlinedIcon from "@material-ui/icons/Delete";
import CreateOutlinedIcon from "@material-ui/icons/Create";
import Add from "@material-ui/icons/Add";
import moment from "moment";
import Spinner from "../../common/Spinner";
import { Search, Refresh } from "@material-ui/icons";
import Tooltip from "react-tooltip";
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

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700,
    hidden: true
  },
  button: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  }
});

class ListAccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: [],
      number: 0,
      getAccess: "",
      search: "",
      roleItem: {
        code: null,
        name: null,
        created_by: null,
        reqDate: null
      },
      showCreateAccess: false,
      showViewAccess: false,
      showMakeAccess: false,
      access: [],
      theAccess: [],
      currentAccess: {},
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
    this.showHandler2 = this.showHandler2.bind(this);
    this.closeModalHandler = this.closeModalHandler.bind(this);
    this.closeHandler = this.closeHandler.bind(this);
    this.closeHandler2 = this.closeHandler2.bind(this);
    this.deleteModalHandler = this.deleteModalHandler.bind(this);
    this.viewModalHandler = this.viewModalHandler.bind(this);
    this.modalStatus = this.modalStatus.bind(this);
    this.modalStatus2 = this.modalStatus2.bind(this);
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
  componentDidMount() {
    this.test();
    this.props.getAllRoles("access");
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({
      getAccess: newProps.getTheRole.rolan,
      access: newProps.getTheRole.rolan,
      hasil: newProps.getTheRole.rolan
    });
  }
  deleteModalHandler(accessid) {
    let tmp = this.state.access.filter(content => accessid === content._id)[0];
    this.setState({
      currentAccess: tmp,
      deleteAccess: true
    });
  }

  viewModalHandler(accessid) {
    let tmp = this.state.access.filter(content => accessid === content._id)[0];
    this.setState({
      currentAccess: tmp,
      deleteAccess: true
    });
  }

  closeModalHandler() {
    this.setState({
      viewAccess: false,
      editAccess: false,
      deleteAccess: false
    });
  }
  showHandler2(name, code) {
    this.setState({
      currentAccess: [name, code],
      showViewAccess: true
    });
  }
  closeHandler2() {
    this.setState({ showViewAccess: false });
  }
  showHandler(name, code) {
    this.setState({
      currentAccess: [name, code],
      showCreateAccess: true
    });
  }
  closeHandler() {
    this.setState({ showCreateAccess: false, showMakeAccess: false });
  }

  modalStatus(status, message, code) {
    this.props.getAllRoles();
    this.setState({
      alertData: {
        status: status,
        message: message,
        code: code
      },
      viewAccess: false,
      showMakeAccess: false,
      editAccess: false,
      deleteAccess: false
    });
    setTimeout(() => {
      this.setState({
        alertData: {
          status: 0,
          message: "",
          code: ""
        }
      });
    }, 4000);
  }
  modalStatus2() {
    setTimeout(() => {
      this.closeHandler();
      this.modalStatus(1, "Menu Access has been updated!", 200);
    }, 0);
  }
  getTheAccess(code) {
    let token = localStorage.token;
    let option = {
      url: `${HostConfig}/access/${code}`,
      method: "get",
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      }
    };
    axios(option)
      .then(response => {
        this.setState({
          theAccess: response.data.message
            .map(a => a.controller)
            .filter(b => b !== false)
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  test = () => {
    axios({
      url: `${HostConfig}/access`,
      method: "get",
      headers: {
        Authorization: localStorage.token,
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        this.setState({
          temp: res.data.message
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  //handler Change for search
  changeHandler = event => {
    let temp = this.state.roleItem;
    if (event.target.name === "reqDate") {
      temp[event.target.name] = moment(event.target.value).format("DD/MM/YYYY");
    } else {
      temp[event.target.name] = event.target.value;
    }
    this.setState({
      roleItem: temp
    });
  };
  // handle keypress
  keyHandler = event => {
    if (event.key === "Enter") this.search();
  };
  //Search Handler
  search = () => {
    const func = input => {
      if (input === "") return null;
      else return input;
    };
    let regCode = new RegExp(func(this.state.roleItem.code), "i");
    let regName = new RegExp(func(this.state.roleItem.name), "i");
    let regBy = new RegExp(func(this.state.roleItem.created_by), "i");
    let regDate = new RegExp(this.state.roleItem.reqDate);
    let data = this.state.access
      .map(content => {
        if (
          regBy.test(content.created_by) ||
          regCode.test(content.code) ||
          regName.test(content.name) ||
          regDate.test(content.created_date)
        )
          return content;
        else return false;
      })
      .filter(a => a !== false);
    this.setState({
      hasil: data,
      number: this.state.number + 1
    });
  };
  //Go Back before search
  refresh = () => {
    this.setState({
      hasil: this.state.access,
      number: this.state.number + 1
    });
  };
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card border-primary mb-3">
              <div className="card-header lead bg-primary text-white">
                List Menu Access
              </div>
              <div className="card-body">
                <nav aria-label="breadcrumb mb-4">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      List Menu Access
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
                            name="code"
                            onKeyPress={this.keyHandler}
                            onChange={this.changeHandler}
                            className="form-control"
                            placeholder="-Role Code-"
                          />
                        </td>
                        <td>
                          <input
                            name="name"
                            onKeyPress={this.keyHandler}
                            onChange={this.changeHandler}
                            className="form-control"
                            placeholder="-Role Name-"
                          />
                        </td>
                        <td>
                          <input
                            name="created_by"
                            onKeyPress={this.keyHandler}
                            onChange={this.changeHandler}
                            className="form-control"
                            placeholder="-Created By-"
                          />
                        </td>
                        <td>
                          <input
                            name="reqDate"
                            onKeyPress={this.keyHandler}
                            onChange={this.changeHandler}
                            type="date"
                            className="form-control"
                          />
                        </td>
                        <td>
                          {this.state.number % 2 === 0 ? (
                            <a href="#!" data-tip="Search">
                              <button
                                className="btn btn-primary"
                                onClick={this.search}
                              >
                                <Search />
                              </button>
                              <Tooltip place="top" type="dark" effect="solid" />
                            </a>
                          ) : (
                            <a href="#!" data-tip="Refresh Search">
                              <button
                                onClick={this.refresh}
                                className="btn btn-warning"
                              >
                                <Refresh />
                              </button>
                              <Tooltip place="top" type="dark" effect="solid" />
                            </a>
                          )}
                        </td>

                        <td>
                          <a href="#!" data-tip="Add Acess">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                this.setState({
                                  showMakeAccess: true
                                });
                              }}
                            >
                              <Add />
                            </button>

                            <Tooltip place="top" type="dark" effect="solid" />
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {this.state.hasil.length === 0 &&
                this.state.access.length === 0 ? (
                  <Spinner />
                ) : (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr className="text-center font-weight-bold">
                          <td nowrap="true">Role Code</td>
                          <td nowrap="true">Role Name</td>
                          <td nowrap="true">Created By</td>
                          <td nowrap="true">Created Date</td>
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
                          .map(row => {
                            return (
                              <tr key={row._id} className="text-center">
                                <td nowrap="true">{row.code}</td>
                                <td nowrap="true">{row.name}</td>
                                <td nowrap="true">{row.created_by}</td>
                                <td nowrap="true">{row.created_date}</td>
                                <td nowrap="true">
                                  <Link to="#" data-tip="View Access">
                                    <SearchIcon
                                      onClick={() => {
                                        this.setState({
                                          temp: this.state.temp
                                            .map(a => {
                                              if (a.m_role_id === row.code)
                                                return a.m_menu_id;
                                              else return false;
                                            })
                                            .filter(b => b !== false)
                                        });
                                        this.getTheAccess(row.code);
                                        this.showHandler2(row.name, row.code);
                                      }}
                                    />

                                    <Tooltip
                                      place="top"
                                      type="dark"
                                      effect="solid"
                                    />
                                  </Link>
                                  <Link to="#" data-tip="Edit Access">
                                    <CreateOutlinedIcon
                                      onClick={() => {
                                        this.setState({
                                          temp: this.state.temp
                                            .map(a => {
                                              if (a.m_role_id === row.code)
                                                return a.m_menu_id;
                                              else return false;
                                            })
                                            .filter(b => b !== false)
                                        });
                                        this.getTheAccess(row.code);
                                        this.showHandler(row.name, row.code);
                                      }}
                                    />

                                    <Tooltip
                                      place="top"
                                      type="dark"
                                      effect="solid"
                                    />
                                  </Link>
                                  <Link to="#" data-tip="Delete Role">
                                    <DeleteOutlinedIcon
                                      onClick={() => {
                                        this.deleteModalHandler(row._id);
                                      }}
                                    />

                                    <Tooltip
                                      place="top"
                                      type="dark"
                                      effect="solid"
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
                            colSpan={3}
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
        <CreateAccess
          create={this.state.showCreateAccess}
          closeHandler={this.closeHandler}
          modalStatus={this.modalStatus}
          modalStatus2={this.modalStatus2}
          access={this.state.currentAccess}
          theAccess={this.state.theAccess}
          test={this.state.temp}
        />
        <AddAccess
          create={this.state.showMakeAccess}
          closeHandler={this.closeHandler}
          modalStatus={this.modalStatus}
        />
        <ViewAccess
          create={this.state.showViewAccess}
          modalStatus={this.modalStatus2}
          closeHandler={this.closeHandler2}
          access={this.state.currentAccess}
          theAccess={this.state.theAccess}
          test={this.state.temp}
        />
        <DeleteAccess
          delete={this.state.deleteAccess}
          access={this.state.currentAccess}
          getAccess={this.getListAccess}
          closeModalHandler={this.closeModalHandler}
          modalStatus={this.modalStatus}
        />
      </div>
    );
  }
}
ListAccess.propTypes = {
  getAllRoles: PropTypes.func.isRequired,
  getTheRole: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  getTheRole: state.roleData,
  data: state.auth
});
let style = withStyles(styles)(ListAccess);
export default connect(
  mapStateToProps,
  { getAllRoles }
)(style);
