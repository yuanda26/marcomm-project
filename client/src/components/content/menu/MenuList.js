import React from "react";
import { Link } from "react-router-dom";
import { Alert } from "reactstrap";
import { getAllMenu } from "../../../actions/menuActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";
import {
  TableRow,
  TableFooter,
  TablePagination,
  IconButton
} from "@material-ui/core";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Add,
  Search,
  Delete,
  Create,
  RemoveRedEye,
  Refresh
} from "@material-ui/icons";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";
// Master Menu Components
import EditMenu from "./UpdateMenu";
import CreateMenu from "./CreateMenu";
import DeleteMenu from "./DeleteMenu";
import ViewMenu from "./ReadMenu";
import SpinnerTable from "../../common/SpinnerTable";
import ReactTooltip from "react-tooltip";

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

class ListMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formSearch: {
        code: /(?:)/,
        name: /(?:)/,
        created_date: /(?:)/,
        created_by: /(?:)/
      },
      showCreateMenu: false,
      allMenu: [],
      menuSearch: [null],
      currentMenu: {},
      alertData: {
        status: 0,
        message: "",
        code: ""
      },
      page: 0,
      rowsPerPage: 5,
      startDate: new Date(),
      created_date: "",
      search: true
    };
  }

  componentDidMount() {
    this.props.getAllMenu();
  }

  componentWillReceiveProps(newProps) {
    let menu = newProps.menuIndexReducer.menuArr.filter(
      row => row.parent_id !== false
    );
    this.setState({
      allMenu: newProps.menuIndexReducer.menuArr,
      menuSearch: menu
    });
  }

  showHandler = () => {
    this.setState({ showCreateMenu: true });
  };

  closeHandler = () => {
    this.setState({ showCreateMenu: false });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  viewModalHandler = menuid => {
    let tmp = {};
    this.state.allMenu.forEach(ele => {
      if (menuid === ele._id) {
        tmp = ele;
      }
    });
    this.setState({
      currentMenu: tmp,
      viewMenu: true
    });
  };

  editModalHandler = menuid => {
    let tmp = {};
    this.state.allMenu.forEach(ele => {
      if (menuid === ele._id) {
        tmp = {
          _id: ele._id,
          code: ele.code,
          name: ele.name,
          controller: ele.controller,
          parent_id: ele.parent_id,
          updated_by: ele.updated_by
        };
        this.setState({
          currentMenu: tmp,
          editMenu: true
        });
      }
    });
  };

  deleteModalHandler = menuid => {
    let tmp = {};
    this.state.allMenu.forEach(ele => {
      if (menuid === ele._id) {
        tmp = ele;
      }
    });
    this.setState({
      currentMenu: tmp,
      deleteMenu: true
    });
  };

  searchHandler = event => {
    let tmp = this.state.formSearch;
    if (event.target.name) {
      tmp[event.target.name] = new RegExp(event.target.value.toLowerCase());
    } else {
      tmp[event.target.name] = event.target.value;
    }
    this.setState({
      formSearch: tmp
    });
  };

  search = () => {
    const { code, name, created_date, created_by } = this.state.formSearch;
    let temp = [];
    this.state.allMenu.map(ele => {
      if (
        code.test(ele.code.toLowerCase()) &&
        name.test(ele.name.toLowerCase()) &&
        created_date.test(ele.created_date.toLowerCase()) &&
        created_by.test(ele.created_by.toLowerCase())
      ) {
        temp.push(ele);
      }
      return temp;
    });
    this.setState({
      menuSearch: temp,
      search: false
    });
  };

  refreshSearch = () => {
    this.setState({
      menuSearch: this.state.allMenu,
      search: true
    });
  };

  closeModalHandler = () => {
    this.setState({
      viewMenu: false,
      editMenu: false,
      deleteMenu: false
    });
  };

  modalStatus = (status, message, code) => {
    this.props.getAllMenu();
    this.setState({
      alertData: {
        status: status,
        message: message,
        code: code
      },
      viewMenu: false,
      editMenu: false,
      deleteMenu: false
    });
    setTimeout(() => {
      this.setState({
        alertData: {
          status: 0,
          message: "",
          code: ""
        }
      });
    }, 2500);
  };

  changeDateFormat = date => {
    return moment(date).format("DD/MM/YYYY");
  };

  render() {
    const columnWidth = { width: "100%" };
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card border-primary mb-2">
              <div className="card-header bg-primary text-white lead">
                Menu List
              </div>
              <div className="card-body">
                <nav aria-label="breadcrumb mb-4">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Master Menu
                    </li>
                  </ol>
                </nav>
                {this.state.alertData.status === 1 && (
                  <Alert color="success">{this.state.alertData.message}</Alert>
                )}
                {this.state.alertData.status === 2 && (
                  <Alert color="danger">{this.state.alertData.message}</Alert>
                )}
                <CreateMenu
                  create={this.state.showCreateMenu}
                  closeHandler={this.closeHandler}
                  modalStatus={this.modalStatus}
                  menu={this.state.allMenu}
                />
                <ViewMenu
                  view={this.state.viewMenu}
                  closeModalHandler={this.closeModalHandler}
                  menu={this.state.currentMenu}
                />
                <EditMenu
                  edit={this.state.editMenu}
                  closeModalHandler={this.closeModalHandler}
                  menutest={this.state.currentMenu}
                  modalStatus={this.modalStatus}
                  menu={this.state.allMenu}
                />
                <DeleteMenu
                  delete={this.state.deleteMenu}
                  menu={this.state.currentMenu}
                  closeModalHandler={this.closeModalHandler}
                  modalStatus={this.modalStatus}
                />
                <div className="table-responsive">
                  <table className="table table-stripped">
                    <thead>
                      <tr>
                        <td nowrap="true">
                          <input
                            placeholder="Search by Code"
                            name="code"
                            className="form-control"
                            onChange={this.searchHandler}
                          />
                        </td>
                        <td nowrap="true">
                          <input
                            placeholder="Search by Name"
                            name="name"
                            className="form-control"
                            onChange={this.searchHandler}
                          />
                        </td>
                        <td nowrap="true">
                          <input
                            placeholder="Search by Created by"
                            name="created_by"
                            className="form-control"
                            onChange={this.searchHandler}
                          />
                        </td>
                        <td nowrap="true">
                          <input
                            placeholder="Search by Created Date"
                            type="date"
                            name="created_date"
                            className="form-control"
                            onChange={this.searchHandler}
                          />
                        </td>
                        <td nowrap="true">
                          {this.state.search === true && (
                            <a href="#!" data-tip="Search">
                            <button
                              className="mr-2 btn btn-primary"
                              onClick={this.search}
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
                            <a href="#!" data-tip="Search">
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
                          <a href="#!" data-tip="Add Menu">
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
                      <tr
                        className="text-center font-weight-bold"
                        style={columnWidth}
                      >
                        <td nowrap="true">Menu Code</td>
                        <td nowrap="true">Menu Name</td>
                        <td nowrap="true">Created By</td>
                        <td nowrap="true">Created Date</td>
                        <td nowrap="true">Action</td>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.menuSearch[0] === null ? (
                        <SpinnerTable />
                      ) : this.state.menuSearch.length === 0 ? (
                        <tr>
                          <td colSpan="3">No Menu Data Found</td>
                        </tr>
                      ) : (
                        this.state.menuSearch
                          .slice(
                            this.state.page * this.state.rowsPerPage,
                            this.state.page * this.state.rowsPerPage +
                              this.state.rowsPerPage
                          )
                          .map((menu, index) => (
                            <tr className="text-center" key={menu._id}>
                              <td component="th">{menu.code}</td>
                              <td>{menu.name}</td>
                              <td>{menu.created_by}</td>
                              <td>
                                {this.changeDateFormat(menu.created_date)}
                              </td>
                              <td nowrap="true">
                                <Link to="#" data-tip="View Menu">
                                  <RemoveRedEye
                                    onClick={() => {
                                      this.viewModalHandler(menu._id);
                                    }}
                                  />
                                  <ReactTooltip
                                    place="top"
                                    type="dark"
                                    effect="solid"
                                  />
                                </Link>
                                <Link to="#" data-tip="Update Menu">
                                  <Create
                                    onClick={() => {
                                      this.editModalHandler(menu._id);
                                    }}
                                  />
                                  <ReactTooltip
                                    place="top"
                                    type="dark"
                                    effect="solid"
                                  />
                                </Link>
                                <Link to="#" data-tip="Delete Menu">
                                  <Delete
                                    onClick={() => {
                                      this.deleteModalHandler(menu._id);
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
                          colSpan={3}
                          count={this.state.menuSearch.length}
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
}

ListMenu.propTypes = {
  getAllMenu: PropTypes.func.isRequired,
  menuIndexReducer: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  menuIndexReducer: state.menu
});

export default connect(
  mapStateToProps,
  { getAllMenu }
)(ListMenu);
