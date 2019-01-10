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
  IconButton,
  Button
} from "@material-ui/core";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import SearchIcon from "@material-ui/icons/Search";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
// Master Menu Components
import EditMenu from "./UpdateMenu";
import CreateMenu from "./CreateMenu";
import DeleteMenu from "./DeleteMenu";
import ViewMenu from "./ReadMenu";

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
      search: "",
      showCreateMenu: false,
      allMenu: [],
      currentMenu: {},
      alertData: {
        status: 0,
        message: "",
        code: ""
      },
      hasil: [],
      page: 0,
      rowsPerPage: 5,
      startDate: new Date(),
      created_date: ""
    };
  }

  componentDidMount() {
    this.props.getAllMenu();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      allMenu: newProps.take.menuArr,
      hasil: newProps.take.menuArr
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

  changeHandler = e => {
    let temp = [];
    let search = e.target.value;
    let patt = new RegExp(search.toLowerCase());

    this.state.allMenu.forEach(ele => {
      if (
        patt.test(ele.code.toLowerCase()) ||
        patt.test(ele.name.toLowerCase()) ||
        patt.test(ele.created_by.toLowerCase()) ||
        patt.test(ele.created_date)
      ) {
        temp.push(ele);
      }
    });
    this.setState({
      hasil: temp
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
    // this.getListUnit();
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
              <div className="card-header lead">Menu List</div>
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
                  <Alert color="success">
                    <b>Data {this.state.alertData.message} ! </b>
                    Data menu with referential code{" "}
                    <strong>{this.state.alertData.code} </strong>
                    has been {this.state.alertData.message} !
                  </Alert>
                )}
                {this.state.alertData.status === 2 && (
                  <Alert color="danger">{this.state.alertData.message} </Alert>
                )}
                <CreateMenu
                  create={this.state.showCreateMenu}
                  closeHandler={this.closeHandler}
                  modalStatus={this.modalStatus}
                  menu={this.state.allMenu}
                  getlist={this.props.getAllMenu}
                />
                <ViewMenu
                  view={this.state.viewMenu}
                  closeModalHandler={this.closeModalHandler}
                  menu={this.state.currentMenu}
                  getlist={this.props.getAllMenu}
                />
                <EditMenu
                  edit={this.state.editMenu}
                  closeModalHandler={this.closeModalHandler}
                  menutest={this.state.currentMenu}
                  modalStatus={this.modalStatus}
                  getlist={this.props.getAllMenu}
                />
                <DeleteMenu
                  delete={this.state.deleteMenu}
                  menu={this.state.currentMenu}
                  closeModalHandler={this.closeModalHandler}
                  modalStatus={this.modalStatus}
                  getlist={this.props.getAllMenu}
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
                      placeholder="Search by Name"
                      name="name"
                      className="form-control"
                      onChange={this.changeHandler}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      placeholder="Search by Created by"
                      name="created_by"
                      className="form-control"
                      onChange={this.changeHandler}
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      placeholder="Search by Created Date"
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
                    Add Menu
                  </Button>
                </div>
                <br />
                <div className="table-responsive">
                  <table className="table table-stripped">
                    <thead>
                      <tr
                        className="text-center font-weight-bold"
                        style={columnWidth}
                      >
                        <td>No.</td>
                        <td>Menu Code</td>
                        <td>Menu Name</td>
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
                        .map((menu, index) => (
                          <tr className="text-center" key={menu._id}>
                            <td>
                              {index +
                                1 +
                                this.state.page * this.state.rowsPerPage}
                            </td>
                            <td component="th">{menu.code}</td>
                            <td>{menu.name}</td>
                            <td>{menu.created_by}</td>
                            <td>{this.changeDateFormat(menu.created_date)}</td>
                            <td nowrap>
                              <Link to="#">
                                <SearchIcon
                                  onClick={() => {
                                    this.viewModalHandler(menu._id);
                                  }}
                                />
                              </Link>
                              <Link to="#">
                                <CreateOutlinedIcon
                                  onClick={() => {
                                    this.editModalHandler(menu._id);
                                  }}
                                />
                              </Link>
                              <Link to="#">
                                <DeleteOutlinedIcon
                                  onClick={() => {
                                    this.deleteModalHandler(menu._id);
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
  take: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  take: state.menu
});

export default connect(
  mapStateToProps,
  { getAllMenu }
)(ListMenu);
