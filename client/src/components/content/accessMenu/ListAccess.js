import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { getAllRoles } from "../../../actions/roleActions";
import { Link } from "react-router-dom";
import { Alert } from "reactstrap";
import apiConfig from "../../../config/Host_Config";
import CreateAccess from "./CreateAccess";
import DeleteAccess from "./DeleteAccess";
import ViewAccess from "./ViewAccess";
import PropTypes from "prop-types";
import {
  withStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  IconButton,
  Paper,
  Hidden,
  Grid
} from "@material-ui/core";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import SearchIcon from "@material-ui/icons/Search";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
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
    this.editModalHandler = this.editModalHandler.bind(this);
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
    this.props.getAllRoles();
  }
  componentWillReceiveProps(newProps) {
    this.setState({
      getAccess: newProps.getTheRole.rolan,
      access: newProps.getTheRole.rolan,
      hasil: newProps.getTheRole.rolan
    });
  }
  deleteModalHandler(accessid) {
    let tmp = {};
    this.state.access.forEach(ele => {
      if (accessid === ele._id) {
        tmp = ele;
      }
    });
    this.setState({
      currentAccess: tmp,
      deleteAccess: true
    });
  }

  viewModalHandler(accessid) {
    let tmp = {};
    this.state.access.forEach(ele => {
      if (accessid === ele._id) {
        tmp = ele;
      }
    });
    this.setState({
      currentAccess: tmp,
      viewAccess: true
    });
  }

  editModalHandler(accessid) {
    let tmp = {};
    this.state.access.forEach(ele => {
      if (accessid === ele._id) {
        tmp = {
          _id: ele._id,
          m_role_id: ele.m_role_id,
          name_role: ele.name_role,
          address: ele.address,
          update_by: ele.update_by
        };
        this.setState({
          currentAccess: tmp,
          editAccess: true
        });
      }
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
    this.setState({ showCreateAccess: false });
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
      editAccess: false,
      deleteAccess: false
    });
  }
  modalStatus2() {
    setTimeout(() => {
      this.closeHandler();
      this.modalStatus(1, "Menu Access has been updated!", 200);
    }, 0);
    setTimeout(() => {
      window.location.href = "/accessmenu";
    }, 1000);
  }
  getTheAccess(code) {
    let token = localStorage.token;
    let option = {
      url: `${apiConfig.host}/access/${code}`,
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
          regDate.test(moment(content.created_date).format("DD/MM/YYYY"))
        )
          return content;
        else return false;
      })
      .filter(a => a !== false);
    this.setState({
      hasil: data
    });
  };
  //Go Back before search
  refresh = () => {
    this.setState({
      hasil: this.state.access
    });
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <ul class="breadcrumb">
                <li>
                  <a href="/dashboard">Home</a> <span class="divider">/</span>
                </li>
                <li>
                  <li class="active">Master/</li>
                </li>
                <li class="active">List Access</li>
              </ul>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <h4>List Access</h4>
          </Grid>
          <br />
          <br />
          <div class="form-row">
            <div class="col-md-2">
              <input
                name="code"
                onKeyPress={this.keyHandler}
                onChange={this.changeHandler}
                class="form-control"
                placeholder="-Role Code-"
              />
            </div>
            <div class="col-md-2">
              <input
                name="name"
                onKeyPress={this.keyHandler}
                onChange={this.changeHandler}
                class="form-control"
                placeholder="-Role Name-"
              />
            </div>
            <div class="col-md-2">
              <input
                name="created_by"
                onKeyPress={this.keyHandler}
                onChange={this.changeHandler}
                class="form-control"
                placeholder="-Request By-"
              />
            </div>
            <div class="col-md-3">
              <input
                name="reqDate"
                onKeyPress={this.keyHandler}
                onChange={this.changeHandler}
                type="date"
                class="form-control"
              />
            </div>
            <div class="col-md-1">
              <button class="btn btn-primary" onClick={this.search}>
                Search
              </button>
            </div>
            <div class="col-md-1">
              <button onClick={this.refresh} class="btn btn-warning">
                Refresh
              </button>
            </div>
          </div>
          <br />
          <br />
          <Grid item xs={6}>
            {this.state.alertData.status === 1 ? (
              <Alert color="success">{this.state.alertData.message}</Alert>
            ) : (
              ""
            )}
            {this.state.alertData.status === 2 ? (
              <Alert color="danger">{this.state.alertData.message} </Alert>
            ) : (
              ""
            )}
          </Grid>
          <br />
          <CreateAccess
            create={this.state.showCreateAccess}
            closeHandler={this.closeHandler}
            modalStatus={this.modalStatus}
            modalStatus2={this.modalStatus2}
            access={this.state.currentAccess}
            theAccess={this.state.theAccess}
          />
          <ViewAccess
            create={this.state.showViewAccess}
            closeHandler={this.closeHandler2}
            modalStatus={this.modalStatus}
            modalStatus2={this.modalStatus2}
            view={this.state.viewAccess}
            closeModalHandler={this.closeModalHandler}
            access={this.state.currentAccess}
            theAccess={this.state.theAccess}
          />
          <DeleteAccess
            delete={this.state.deleteAccess}
            access={this.state.currentAccess}
            getAccess={this.getListAccess}
            closeModalHandler={this.closeModalHandler}
            modalStatus={this.modalStatus}
          />
          <Grid item xs={12}>
            <Hidden>
              <Paper>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Role Code</TableCell>
                      <TableCell>Role Name</TableCell>
                      <TableCell>Created By</TableCell>
                      <TableCell>Created Date</TableCell>
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
                            <TableCell>{row.code}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.created_by}</TableCell>
                            <TableCell>
                              {moment(row.created_date).format("DD/MM/YYYY")}
                            </TableCell>
                            <TableCell>
                              <Link to="#">
                                <SearchIcon
                                  onClick={() => {
                                    this.getTheAccess(row.code);
                                    this.showHandler2(row.name, row.code);
                                  }}
                                />
                              </Link>
                              <Link to="#">
                                <CreateOutlinedIcon
                                  onClick={() => {
                                    this.getTheAccess(row.code);
                                    this.showHandler(row.name, row.code);
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
                </Table>
              </Paper>
            </Hidden>
          </Grid>
        </Grid>
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
  getTheRole: state.roleData
});
let style = withStyles(styles)(ListAccess);
export default connect(
  mapStateToProps,
  { getAllRoles }
)(style);
