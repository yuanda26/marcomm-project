import React from "react";
import { Link } from "react-router-dom";
import { Alert } from "reactstrap";
import {
  getAllTsouvenir,
  getListTsouvenirItem
} from "../../../actions/tsouvenirAction";
import host from "../../../config/Host_Config";
import axios from "axios";
import { connect } from "react-redux";
import EditTsouvenir from "./UpdateTsouvenir";
import CreateTsouvenir from "./CreateTsouvenir";
import ViewTsouvenir from "./ReadTsouvenir";
import PropTypes from "prop-types";
import { TableRow, TableFooter, TablePagination } from "@material-ui/core";
import { Add, Search, Create, RemoveRedEye, Refresh } from "@material-ui/icons";
import moment from "moment";
import SpinnerTable from "../../common/SpinnerTable";
import ReactTooltip from "react-tooltip";
import Pagination from "../../common/Pagination";

class ListTsouvenir extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formSearch: {
        code: "",
        received_by: "",
        received_date: "",
        created_date: "",
        created_by: ""
      },
      showCreateTsouvenir: false,
      getitem: "",
      allSouvenirStock: [],
      souvenirStockSearch: [null],
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
    const { m_role_id, m_employee_id } = this.props.user;
    if (m_role_id) {
      this.props.getAllTsouvenir(m_role_id, m_employee_id);
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      allSouvenirStock: newProps.tsouvenirReducer.ts,
      souvenirStockSearch: newProps.tsouvenirReducer.ts,
      userdata: newProps.user
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
      tmp[event.target.name] = event.target.value;
    }
    this.setState({
      formSearch: tmp
    });
  };

  search = e => {
    e.preventDefault();
    const {
      code,
      received_by,
      received_date,
      created_by,
      created_date
    } = this.state.formSearch;
    const searchCode = new RegExp(code, "i");
    const searchReceivedBy = new RegExp(received_by, "i");
    const searchReceivedDate =
      received_date === ""
        ? new RegExp("")
        : new RegExp(moment(received_date).format("YYYY-MM-DD"));
    const searchCreatedBy = new RegExp(created_by, "i");
    const searchCreatedDate =
      created_date === ""
        ? new RegExp("")
        : new RegExp(moment(created_date).format("YYYY-MM-DD"));
    let temp = [];
    this.state.allSouvenirStock.map(ele => {
      if (
        searchCode.test(ele.code.toLowerCase()) &&
        searchReceivedBy.test(ele.received_by.toLowerCase()) &&
        searchReceivedDate.test(ele.received_date) &&
        searchCreatedBy.test(ele.created_by.toLowerCase()) &&
        searchCreatedDate.test(ele.created_date)
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
      search: true,
      formSearch: {
        code: "",
        received_by: "",
        received_date: "",
        created_date: "",
        created_by: ""
      }
    });
  };

  closeModalHandler() {
    this.setState({
      viewTsouvenir: false,
      EditTsouvenir: false
    });
  }

  modalStatus(status, message, code) {
    const { m_role_id, m_employee_id } = this.props.user;
    this.props.getAllTsouvenir(m_role_id, m_employee_id);
    this.props.getListTsouvenirItem();
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

  keyHandler = event => {
    if (event.key === "Enter") this.search();
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
                            value={this.state.formSearch.code}
                            className="form-control"
                            onChange={this.searchHandler}
                            onKeyPress={this.keyHandler}
                          />
                        </td>
                        <td>
                          <input
                            placeholder="Search by Received By"
                            name="received_by"
                            value={this.state.formSearch.received_by}
                            className="form-control"
                            onChange={this.searchHandler}
                            onKeyPress={this.keyHandler}
                          />
                        </td>
                        <td>
                          <input
                            placeholder="Search by Received Date"
                            type="date"
                            name="received_date"
                            value={this.state.formSearch.received_date}
                            className="form-control"
                            onChange={this.searchHandler}
                            onKeyPress={this.keyHandler}
                          />
                        </td>
                        <td>
                          <input
                            placeholder="Search by Create by"
                            name="created_by"
                            value={this.state.formSearch.created_by}
                            className="form-control"
                            onChange={this.searchHandler}
                            onKeyPress={this.keyHandler}
                          />
                        </td>
                        <td>
                          <input
                            placeholder="Search by Create Date"
                            type="date"
                            name="created_date"
                            value={this.state.formSearch.created_date}
                            className="form-control"
                            onChange={this.searchHandler}
                            onKeyPress={this.keyHandler}
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
                          {this.props.user.m_role_id !== "RO0001" && (
                            <a href="#!" data-tip="Add Souvenir Stock">
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
                          )}
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
                      {this.state.souvenirStockSearch[0] === null ? (
                        <SpinnerTable />
                      ) : this.state.souvenirStockSearch.length === 0 ? (
                        <tr className="text-center">
                          <td colSpan="6">
                            No Transaction Souvenir Data Found
                          </td>
                        </tr>
                      ) : (
                        this.state.souvenirStockSearch
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
                                <Link to="#" data-tip="View Souvenir Stock">
                                  <RemoveRedEye
                                    onClick={() => {
                                      this.viewModalHandler(tsouvenir._id);
                                    }}
                                  />
                                  <ReactTooltip
                                    place="top"
                                    type="dark"
                                    effect="solid"
                                  />
                                </Link>
                                <Link to="#" data-tip="Edit Souvenir Stock">
                                  <Create
                                    onClick={() => {
                                      this.editModalHandler(
                                        tsouvenir.code,
                                        tsouvenir._id
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
                          colSpan={4}
                          count={this.state.souvenirStockSearch.length}
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
}

ListTsouvenir.propTypes = {
  getAllTsouvenir: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  tsouvenirReducer: state.tsouvenirIndexReducer,
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  { getAllTsouvenir, getListTsouvenirItem }
)(ListTsouvenir);
