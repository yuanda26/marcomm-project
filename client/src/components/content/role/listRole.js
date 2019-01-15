import React from "react";
import { connect } from "react-redux";
import { getAllRoles } from "../../../actions/roleActions";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import EditRole from "./editRole";
import CreateRole from "./createRole";
import { Alert } from "reactstrap";
import DeleteRole from "./deleteRole";
import ViewRole from "./viewRole";
import "react-datepicker/dist/react-datepicker.css";
import SearchIcon from "@material-ui/icons/RemoveRedEye";
import DeleteOutlinedIcon from "@material-ui/icons/Delete";
import CreateOutlinedIcon from "@material-ui/icons/Create";
import moment from "moment";
import { Add, Search, Refresh } from "@material-ui/icons";
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

class ListRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      rowsPerPage: 5,
      number: 0,
      showCreateRole: false,
      roleItem: {
        code: null,
        name: null,
        created_by: null,
        reqDate: null
      },
      role: [],
      dummyRole: [],
      currentRole: {},
      alertData: {
        status: 0,
        message: ""
      }
    };
    this.showHandler = this.showHandler.bind(this);
    this.closeModalHandler = this.closeModalHandler.bind(this);
    this.closeHandler = this.closeHandler.bind(this);
    this.deleteModalHandler = this.deleteModalHandler.bind(this);
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

  //mount before render
  componentDidMount() {
    this.props.getAllRoles();
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({
      role: newProps.getTheRole.rolan,
      dummyRole: newProps.getTheRole.rolan
    });
  }
  //for delete action
  deleteModalHandler(roleid) {
    let tmp = this.state.role.filter(content => roleid === content._id)[0];
    this.setState({
      currentRole: tmp,
      deleteRole: true
    });
  }
  //for view action
  viewModalHandler(roleid) {
    let tmp = this.state.role.filter(content => roleid === content._id)[0];
    this.setState({
      currentRole: tmp,
      viewRole: true
    });
  }
  //for update action
  editModalHandler(roleid) {
    let tmp = this.state.role
      .filter(content => roleid === content._id)
      .map(ele => {
        return {
          _id: ele._id,
          code: ele.code,
          name: ele.name,
          description: ele.description,
          updated_by: ele.updated_by
        };
      })[0];
    this.setState({
      currentRole: tmp,
      editRole: true
    });
  }
  //close pop up for modal (used in update, veiw, delete)
  closeModalHandler() {
    this.setState({
      viewRole: false,
      editRole: false,
      deleteRole: false
    });
  }
  //show pop up for modal (used in update, veiw, delete)
  showHandler() {
    this.setState({ showCreateRole: true });
  }
  //close pop for create
  closeHandler() {
    this.setState({ showCreateRole: false });
  }
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
    let data = this.state.role
      .map(content => {
        if (
          regBy.test(content.created_by) ||
          regCode.test(content.code) ||
          regName.test(content.name) ||
          regDate.test(moment(content.created_date).format("DD/MM/YYYY"))
        )
          return content;
        else return false;
      })
      .filter(a => a !== false);
    this.setState({
      dummyRole: data,
      number: this.state.number + 1
    });
  };
  //Go Back before search
  refresh = () => {
    this.setState({
      dummyRole: this.state.role,
      number: this.state.number + 1
    });
  };

  modalStatus(status, message) {
    setTimeout(() => {
      this.props.getAllRoles();
    }, 0);
    this.setState({
      alertData: {
        status: status,
        message: message
      },
      showCreateRole: false,
      viewRole: false,
      editRole: false,
      deleteRole: false
    });
    setTimeout(() => {
      this.setState({
        alertData: {
          status: 0,
          message: ""
        },
        viewRole: false,
        editRole: false,
        deleteRole: false
      });
    }, 3000);
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card border-primary mb-3">
              <div className="card-header lead bg-primary text-white">
                List Role
              </div>
              <div className="card-body">
                <nav aria-label="breadcrumb mb-4">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      List Role
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
                <div className="table-responsive ">
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
                            placeholder="-Request By-"
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
                            <button
                              className="btn btn-primary btn-block"
                              onClick={this.search}
                            >
                              <Search />
                            </button>
                          ) : (
                            <button
                              onClick={this.refresh}
                              className="btn btn-warning btn-block"
                            >
                              <Refresh />
                            </button>
                          )}
                        </td>
                        <td>
                          <div className="mb-2">
                            <button
                              onClick={this.showHandler}
                              className="btn btn-primary"
                            >
                              <Add />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {this.state.dummyRole.length === 0 &&
                this.state.role.length === 0 ? (
                  <Spinner />
                ) : (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr className="text-center font-weight-bold">
                          <td>Role Code</td>
                          <td>Role Name</td>
                          <td>Created By</td>
                          <td>Created Date</td>
                          <td>Action</td>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.dummyRole
                          .slice(
                            this.state.page * this.state.rowsPerPage,
                            this.state.page * this.state.rowsPerPage +
                              this.state.rowsPerPage
                          )
                          .map(content => (
                            <tr className="text-center" key={content.code}>
                              <td>{content.code}</td>
                              <td>{content.name}</td>
                              <td>{content.created_by}</td>
                              <td>
                                {moment(content.created_date).format(
                                  "DD/MM/YYYY"
                                )}
                              </td>
                              <td>
                                <Link to="#">
                                  <SearchIcon
                                    onClick={() => {
                                      this.viewModalHandler(content._id);
                                    }}
                                  />
                                </Link>
                                <Link to="#">
                                  <CreateOutlinedIcon
                                    onClick={() => {
                                      this.editModalHandler(content._id);
                                    }}
                                  />
                                </Link>
                                <Link to="#">
                                  <DeleteOutlinedIcon
                                    onClick={() => {
                                      this.deleteModalHandler(content._id);
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
                            colSpan={3}
                            count={this.state.dummyRole.length}
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
          <CreateRole
            create={this.state.showCreateRole}
            modalStatus={this.modalStatus}
            closeHandler={this.closeHandler}
          />
          <ViewRole
            view={this.state.viewRole}
            closeModalHandler={this.closeModalHandler}
            role={this.state.currentRole}
          />
          <DeleteRole
            delete={this.state.deleteRole}
            role={this.state.currentRole}
            closeModalHandler={this.closeModalHandler}
            modalStatus={this.modalStatus}
          />
          <EditRole
            edit={this.state.editRole}
            closeModalHandler={this.closeModalHandler}
            roletest={this.state.currentRole}
            modalStatus={this.modalStatus}
          />
        </div>
      </div>
    );
  }
}
ListRole.propTypes = {
  getAllRoles: PropTypes.func.isRequired,
  getTheRole: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  getTheRole: state.roleData
});

let style = withStyles(styles)(ListRole);
export default connect(
  mapStateToProps,
  { getAllRoles }
)(style);
