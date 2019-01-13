import React from "react";
import { Link } from "react-router-dom";
import { Alert } from "reactstrap";
import { getAllTsouvenir } from "../../../actions/tsouvenirAction";
import host from "../../../config/Host_Config";
import axios from "axios";
import { connect } from "react-redux";
import EditTsouvenir from "./UpdateTsouvenir";
import CreateTsouvenir from "./CreateTsouvenir";
import ViewTsouvenir from "./ReadTsouvenir";
import PropTypes from "prop-types";
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
  Create,
  RemoveRedEye,
  Refresh
} from "@material-ui/icons";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import LastPageIcon from "@material-ui/icons/LastPage";
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

class ListTsouvenir extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formSearch: {
        code: /(?:)/,
        received_by: /(?:)/,
        received_date: /(?:)/,
        created_date: /(?:)/,
        created_by: /(?:)/
      },
      showCreateTsouvenir: false,
      getitem: "",
      allSouvenirStock: [],
      souvenirStockSearch: [],
      currentTsouvenir: {},
      alertData: {
        status: 0,
        message: "",
        code: ""
      },
      page: 0,
      rowsPerPage: 5,
      userdata: {},
      search: true
    };
    this.showHandler = this.showHandler.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.closeModalHandler = this.closeModalHandler.bind(this);
    this.closeHandler = this.closeHandler.bind(this);
    this.viewModalHandler = this.viewModalHandler.bind(this);
    this.editModalHandler = this.editModalHandler.bind(this);
    this.modalStatus = this.modalStatus.bind(this);
  }

  componentDidMount() {
    this.props.getAllTsouvenir();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      allSouvenirStock: newProps.tsouvenirReducer.ts,
      souvenirStockSearch: newProps.tsouvenirReducer.ts,
      userdata: newProps.auth.user
    });
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  showHandler() {
    this.setState({ showCreateTsouvenir: true });
  }

  closeHandler() {
    this.setState({ showCreateTsouvenir: false });
  }

  viewModalHandler(tsouvenirID) {
    let tmp = {};
    this.state.allSouvenirStock.forEach(ele => {
      if (tsouvenirID === ele._id) {
        tmp = ele;
      }
    });
    this.setState({
      currentTsouvenir: tmp,
      viewTsouvenir: true
    });
  }

  editModalHandler(dataItem, tsouvenirID) {
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
    this.state.allSouvenirStock.forEach(ele => {
      if (tsouvenirID === ele._id) {
        tmp = {
          _id: ele._id,
          code: ele.code,
          received_by: ele.received_by_id,
          received_date: ele.received_date,
          note: ele.note,
          updated_by: this.state.userdata.m_employee_id
        };
        this.setState({
          getitem: this.state.getitem,
          currentTsouvenir: tmp,
          EditTsouvenir: true
        });
      }
    });
  }

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
    const {
      code,
      received_by,
      received_date,
      created_by,
      created_date
    } = this.state.formSearch;
    let temp = [];
    this.state.allSouvenirStock.map(ele => {
      if (
        code.test(ele.code.toLowerCase()) &&
        received_by.test(ele.received_by.toLowerCase()) &&
        received_date.test(ele.received_date.toLowerCase()) &&
        created_by.test(ele.created_by.toLowerCase()) &&
        created_date.test(ele.created_date.toLowerCase())
      ) {
        temp.push(ele);
      }
      return temp;
    });
    this.setState({
      souvenirStockSearch: temp,
      search: false
    });
  };

  refreshSearch = () => {
    this.setState({
      souvenirStockSearch: this.state.allSouvenirStock,
      search: true
    });
  };

  closeModalHandler() {
    this.setState({
      viewTsouvenir: false,
      EditTsouvenir: false
    });
    this.props.getAllTsouvenir();
  }

  modalStatus(status, message, code) {
    this.props.getAllTsouvenir();
    this.setState({
      alertData: {
        status: status,
        message: message,
        code: code
      },
      viewTsouvenir: false,
      EditTsouvenir: false
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
  }

  changeDateFormat = tanggal => {
    return moment(tanggal).format("DD/MM/YYYY");
  };

  render() {
    const columnWidth = { width: "100%" };
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card border-primary mb-2">
              <div className="card-header bg-primary text-white lead">
                Souvenir Stock List
              </div>
              <div className="card-body">
                <nav aria-label="breadcrumb mb-4">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Transaction Souvenir Stock
                    </li>
                  </ol>
                </nav>
                {this.state.alertData.status === 1 && (
                  <Alert color="success">{this.state.alertData.message}</Alert>
                )}
                {this.state.alertData.status === 2 && (
                  <Alert color="danger">{this.state.alertData.message} </Alert>
                )}
                <CreateTsouvenir
                  create={this.state.showCreateTsouvenir}
                  closeHandler={this.closeHandler}
                  modalStatus={this.modalStatus}
                  closeModalHandler={this.closeModalHandler}
                />
                <ViewTsouvenir
                  view={this.state.viewTsouvenir}
                  closeModalHandler={this.closeModalHandler}
                  item={this.state.currentTsouvenir}
                />
                <EditTsouvenir
                  edit={this.state.EditTsouvenir}
                  closeModalHandler={this.closeModalHandler}
                  tsouvenirTest={this.state.currentTsouvenir}
                  getAllItem={this.state.getitem}
                  modalStatus={this.modalStatus}
                />
                <div className="table-responsive">
                  <table className="table table-stripped">
                    <thead>
                      <tr>
                        <td>
                          <input
                            placeholder="Search by Code"
                            name="code"
                            className="form-control"
                            onChange={this.searchHandler}
                          />
                        </td>
                        <td>
                          <input
                            placeholder="Search by Received By"
                            name="received_by"
                            className="form-control"
                            onChange={this.searchHandler}
                          />
                        </td>
                        <td>
                          <input
                            placeholder="Search by Received Date"
                            type="date"
                            name="received_date"
                            className="form-control"
                            onChange={this.searchHandler}
                          />
                        </td>
                        <td>
                          <input
                            placeholder="Search by Create by"
                            name="created_by"
                            className="form-control"
                            onChange={this.searchHandler}
                          />
                        </td>
                        <td>
                          <input
                            placeholder="Search by Create Date"
                            type="date"
                            name="created_date"
                            className="form-control"
                            onChange={this.searchHandler}
                          />
                        </td>
                        <td nowrap="true">
                          {this.state.search === true && (
                            <button
                              className="mr-2 btn btn-primary"
                              onClick={this.search}
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
                          <button
                            className="mr-2 btn btn-primary"
                            onClick={this.showHandler}
                          >
                            <Add />
                          </button>
                        </td>
                      </tr>
                      <tr
                        className="text-center font-weight-bold"
                        style={columnWidth}
                      >
                        <td>Souvenir Code</td>
                        <td>Received By</td>
                        <td>Received Date</td>
                        <td>Created By</td>
                        <td>Created Date</td>
                        <td>Action</td>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.souvenirStockSearch
                        .slice(
                          this.state.page * this.state.rowsPerPage,
                          this.state.page * this.state.rowsPerPage +
                            this.state.rowsPerPage
                        )
                        .map((tsouvenir, index) => (
                          <tr className="text-center" key={tsouvenir._id}>
                            <td component="th">{tsouvenir.code}</td>
                            <td>{tsouvenir.received_by}</td>
                            <td>
                              {this.changeDateFormat(tsouvenir.received_date)}
                            </td>
                            <td>{tsouvenir.created_by}</td>
                            <td>
                              {this.changeDateFormat(tsouvenir.created_date)}
                            </td>
                            <td>
                              <Link to="#">
                                <RemoveRedEye
                                  onClick={() => {
                                    this.viewModalHandler(tsouvenir._id);
                                  }}
                                />
                              </Link>
                              <Link to="#">
                                <Create
                                  onClick={() => {
                                    this.editModalHandler(
                                      tsouvenir.code,
                                      tsouvenir._id
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
                          colSpan={4}
                          count={this.state.souvenirStockSearch.length}
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

ListTsouvenir.propTypes = {
  getAllTsouvenir: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  tsouvenirReducer: state.tsouvenirIndexReducer,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getAllTsouvenir }
)(ListTsouvenir);
