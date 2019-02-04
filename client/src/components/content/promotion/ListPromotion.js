import React from "react";
import { Link } from "react-router-dom";
import { getAllPromotion } from "../../../actions/promotionActions";
import { connect } from "react-redux";
import CreatePromotion from "./createPromotion";
import PropTypes from "prop-types";
import { TableRow, TableFooter, TablePagination } from "@material-ui/core";
import Gavel from "@material-ui/icons/Gavel";
import Assignment from "@material-ui/icons/Assignment";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import moment from "moment";
import Spinner from "../../common/Spinner";
import Search from "@material-ui/icons/Search";
import Refresh from "@material-ui/icons/Refresh";
import Create from "@material-ui/icons/Add";
import ReactTooltip from "react-tooltip";
import Pagination from "../../common/Pagination";

class ListPromotion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: {
        code: "",
        request_by: "",
        request_date: "",
        assign_to: "",
        status: "",
        created_date: "",
        created_by: ""
      },
      showCreatePromotion: false,
      allPromotion: [],
      currentPromotion: {},
      alertData: {
        status: 0,
        message: "",
        code: ""
      },
      hasil: [null],
      number: true,
      page: 0,
      rowsPerPage: 5
    };
    this.showHandler = this.showHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
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

  componentDidMount() {
    this.props.getAllPromotion();
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({
      allPromotion: newProps.ambil.promotion,
      hasil: newProps.ambil.promotion
    });
  }

  deleteModalHandler(promotionid) {
    let tmp = {};
    this.state.allPromotion.map(ele => {
      if (promotionid === ele._id) {
        tmp = ele;
      }
      return tmp;
    });
    this.setState({
      currentPromotion: tmp,
      deletePromotion: true
    });
  }

  viewModalHandler(promotionid) {
    let tmp = {};
    this.state.allPromotion.map(ele => {
      if (promotionid === ele._id) {
        tmp = ele;
      }
      return tmp;
    });
    this.setState({
      currentPromotion: tmp,
      viewPromotion: true
    });
  }

  editModalHandler(data) {
    localStorage.setItem("MARKETING-HEADER-PROMOTION", JSON.stringify(data));
    if (data.flag_design === 1) {
      window.location.href = "/editpromot-d";
    } else if (data.flag_design === 0) {
      window.location.href = "/editpromot-nd";
    }
  }
  approval = data => {
    localStorage.setItem("MARKETING-HEADER-PROMOTION", JSON.stringify(data));
    if (data.flag_design === 1) {
      window.location.href = "/approvepromot-d";
    } else if (data.flag_design === 0) {
      window.location.href = "/approvepromot-nd";
    }
  };
  closePromot = data => {
    localStorage.setItem("MARKETING-HEADER-PROMOTION", JSON.stringify(data));
    if (data.flag_design === 1) {
      window.location.href = "/closepromot-d";
    } else if (data.flag_design === 0) {
      window.location.href = "/closepromot-nd";
    }
  };
  changeHandler(e) {
    let temp = this.state.search;
    if (e.target.name) {
      temp[e.target.name] = e.target.value;
    }
    this.setState({
      search: temp
    });
  }
  keyHandler = event => {
    if (event.key === "Enter") this.search();
  };
  search = () => {
    const {
      code,
      request_date,
      request_by,
      assign_to,
      created_date,
      created_by,
      status
    } = this.state.search;
    const searchCode = new RegExp(code, "i");
    const searchRequestDate =
      request_date === ""
        ? new RegExp("")
        : new RegExp(moment(request_date).format("DD/MM/YYYY"));
    const searchRequestBy = new RegExp(request_by, "i");
    const searchAssignTo = new RegExp(assign_to, "i");
    const searchStatus = new RegExp(status, "i");
    const searchCreatedDate =
      created_date === ""
        ? new RegExp("")
        : new RegExp(moment(created_date).format("DD/MM/YYYY"));
    const searchCreatedBy = new RegExp(created_by, "i");
    let newResult = [];
    this.state.allPromotion.map(content => {
      if (
        searchCode.test(content.code) &&
        searchRequestBy.test(content.request_by) &&
        searchCreatedBy.test(content.created_by) &&
        searchCreatedDate.test(content.created_date) &&
        searchRequestDate.test(content.request_date) &&
        searchAssignTo.test(this.showAssign(content.assign_to)) &&
        searchStatus.test(this.showstatus(content.status))
      ) {
        newResult.push(content);
      }
      return newResult;
    });
    this.setState({
      hasil: newResult,
      number: false
    });
  };

  closeModalHandler() {
    this.setState({
      viewPromotion: false,
      editPromotion: false,
      deletePromotion: false
    });
  }

  showHandler() {
    this.setState({ showCreatePromotion: true });
  }

  closeHandler() {
    this.setState({ showCreatePromotion: false });
  }

  showstatus(code) {
    if (parseInt(code) === 1) return "Submitted";
    else if (parseInt(code) === 2) return "In Progress";
    else if (parseInt(code) === 3) return "Done";
    else if (parseInt(code) === 0) return "Rejected";
  }
  modalStatus(status, message, code) {
    this.setState({
      alertData: {
        status: status,
        message: message,
        code: code
      },
      viewPromotion: false,
      editPromotion: false,
      deletePromotion: false
    });
  }
  showAssign(code) {
    if (code == null) return "None";
    else return code;
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card border-primary mb-3">
              <div className="card-header lead bg-primary text-white">
                List Marketing Promotion
              </div>
              <div className="card-body">
                <nav aria-label="breadcrumb mb-4">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      List Promotion
                    </li>
                  </ol>
                </nav>
                {this.state.hasil[0] === null ? (
                  <Spinner />
                ) : (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <td>
                            <input
                              className="form-control"
                              placeholder="Transaction Code"
                              name="code"
                              value={this.state.search.code}
                              onChange={this.changeHandler}
                              onKeyPress={this.keyHandler}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              placeholder="Request By"
                              name="request_by"
                              value={this.state.search.request_by}
                              onChange={this.changeHandler}
                              onKeyPress={this.keyHandler}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              placeholder="Request Date"
                              name="request_date"
                              type="date"
                              value={this.state.search.request_date}
                              onChange={this.changeHandler}
                              onKeyPress={this.keyHandler}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              placeholder="Assign to"
                              name="assign_to"
                              value={this.state.search.assign_to}
                              onChange={this.changeHandler}
                              onKeyPress={this.keyHandler}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              placeholder="Status"
                              name="status"
                              value={this.state.search.status}
                              onChange={this.changeHandler}
                              onKeyPress={this.keyHandler}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              placeholder="Created Date"
                              type="date"
                              name="created_date"
                              value={this.state.search.created_date}
                              onChange={this.changeHandler}
                              onKeyPress={this.keyHandler}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              placeholder="Created By"
                              type="text"
                              name="created_by"
                              value={this.state.search.created_by}
                              onChange={this.changeHandler}
                              onKeyPress={this.keyHandler}
                            />
                          </td>
                          <td nowrap="true">
                            {this.state.number ? (
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
                            ) : (
                              <a href="#!" data-tip="Refresh Search">
                                <button
                                  className="mr-2 btn btn-warning"
                                  onClick={() => {
                                    this.setState({
                                      hasil: this.state.allPromotion,
                                      number: true,
                                      search: {
                                        code: "",
                                        request_by: "",
                                        request_date: "",
                                        assign_to: "",
                                        status: "",
                                        created_date: "",
                                        created_by: ""
                                      }
                                    });
                                  }}
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
                            {this.props.data.user.m_role_id !== "RO0001" && (
                              <a href="#!" data-tip="Add Promotion">
                                <button
                                  className="mr-2 btn btn-primary"
                                  onClick={this.showHandler}
                                >
                                  <Create />
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
                      </thead>
                      <thead>
                        <tr className="text-center font-weight-bold">
                          <td nowrap="true">Transaction Code</td>
                          <td nowrap="true">Request By</td>
                          <td nowrap="true">Request Date</td>
                          <td nowrap="true">Assign To</td>
                          <td nowrap="true">Status</td>
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
                              <tr key={row._id} className="text-center">
                                <td>{row.code}</td>
                                <td>{row.request_by}</td>
                                <td>{row.request_date}</td>
                                <td>{this.showAssign(row.assign_to)}</td>
                                <td>{this.showstatus(row.status)}</td>
                                <td>{row.created_date}</td>
                                <td>{row.created_by}</td>
                                <td>
                                  {this.props.data.user.m_employee_id ===
                                    row.created_by && row.status === 1 ? (
                                    <Link to="#" data-tip="Edit Promotion">
                                      <CreateOutlinedIcon
                                        onClick={() => {
                                          this.editModalHandler(row);
                                        }}
                                      />

                                      <ReactTooltip
                                        place="top"
                                        type="dark"
                                        effect="solid"
                                      />
                                    </Link>
                                  ) : (
                                    <div />
                                  )}
                                  {this.props.data.user.m_role_id ===
                                    "RO0001" && parseInt(row.status) === 1 ? (
                                    <Link to="#" data-tip="Approval Promotion">
                                      <Gavel
                                        onClick={() => {
                                          this.approval(row);
                                        }}
                                      />

                                      <ReactTooltip
                                        place="top"
                                        type="dark"
                                        effect="solid"
                                      />
                                    </Link>
                                  ) : (
                                    <div />
                                  )}
                                  {this.props.data.user.m_role_id ===
                                    "RO0006" && parseInt(row.status) === 2 ? (
                                    <Link to="#" data-tip="Close Promotion">
                                      <Assignment
                                        onClick={() => {
                                          this.closePromot(row);
                                        }}
                                      />

                                      <ReactTooltip
                                        place="top"
                                        type="dark"
                                        effect="solid"
                                      />
                                    </Link>
                                  ) : (
                                    <div />
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                      <TableFooter>
                        <TableRow>
                          <TablePagination
                            colSpan={5}
                            count={this.state.hasil.length}
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
                )}
              </div>
            </div>
          </div>
        </div>
        <div>
          <CreatePromotion
            create={this.state.showCreatePromotion}
            closeHandler={this.closeHandler}
            modalStatus={this.modalStatus}
          />
        </div>
      </div>
    );
  }
}

ListPromotion.propTypes = {
  getAllPromotion: PropTypes.func.isRequired,
  ambil: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  ambil: state.promot,
  data: state.auth
});

export default connect(
  mapStateToProps,
  { getAllPromotion }
)(ListPromotion);
