import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Link } from "react-router-dom";
// Redux Actions
import { connect } from "react-redux";
import {
  getAllSouvenir,
  getUnits,
  clearAlert
} from "../../../actions/souvenirAction";
import { getAssignToName } from "../../../actions/designAction";
// Souvenir Components
import CreateSouvenir from "./CreateSouvenir";
import ReadSouvenir from "./ReadSouvenir";
import UpdateSouvenir from "./UpdateSouvenir";
import DeleteSouvenir from "./DeleteSouvenir";
// Search Form Components
import Spinner from "../../common/Spinner";
import TextField from "../../common/TextField";
import SelectList from "../../common/SelectList";
import Alert from "../../common/Alert";
import ReactTooltip from "react-tooltip";
// Pagination with Material IU
import Pagination from "../../common/Pagination";
import { TablePagination } from "@material-ui/core";
// Material UI Icons
import {
  Search,
  Create,
  Delete,
  RemoveRedEye,
  Refresh,
  Add
} from "@material-ui/icons";

class SouvenirList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showCreate: false,
      viewModal: false,
      editModal: false,
      deleteModal: false,
      currentSouvenir: {},
      units: [],
      souvenirs: [],
      errorName: "",
      errorUnit: "",
      searchCode: "",
      searchName: "",
      searchUnit: "",
      searchDate: "",
      searchCreated: "",
      search: false,
      employee: [],
      page: 0,
      rowsPerPage: 5
    };
  }

  componentDidMount() {
    this.props.getAllSouvenir();
    this.props.getUnits();
    this.props.getAssignToName();
  }

  UNSAFE_componentWillReceiveProps(props, state) {
    this.setState({
      units: props.souvenir.units,
      souvenirs: props.souvenir.souvenirs,
      employee: props.design.assign
    });
  }

  // Function to Show Create Menu Form Modal
  showHandler = () => {
    this.setState({ showCreate: true });
  };

  // Function to Close Create Menu Form Modal
  closeHandler = () => {
    this.setState({ showCreate: false });
  };

  // Function to Edit Single Souvenir
  onEditModal = souvenirId => {
    let singleSouvenir = {};
    this.state.souvenirs.forEach(souvenir => {
      if (souvenirId === souvenir._id) {
        singleSouvenir = souvenir;
      }
    });

    this.setState({
      currentSouvenir: singleSouvenir,
      editModal: true
    });
  };

  // Function to View Single Souvenir
  onViewModal = souvenirId => {
    let singleSouvenir = {};
    this.state.souvenirs.forEach(souvenir => {
      if (souvenirId === souvenir._id) {
        singleSouvenir = souvenir;
      }
    });

    this.setState({
      currentSouvenir: singleSouvenir,
      viewModal: true
    });
  };

  // Function to Show Delete Modal Confirmation
  onDeleteModal = code => {
    let singleSouvenir = {};
    this.state.souvenirs.forEach(souvenir => {
      if (code === souvenir.code) {
        singleSouvenir = souvenir;
      }
    });

    this.setState({
      currentSouvenir: singleSouvenir,
      deleteModal: true
    });
  };

  // Function to Get Units Name
  getUnits = code => {
    let name = "";

    this.state.units.forEach(unit => {
      if (unit.code === code) {
        name = unit.name;
      }
    });

    return name;
  };

  getEmployee(employeeNumber) {
    let employeeName = "";
    if (employeeNumber !== null) {
      this.state.employee.forEach(staff => {
        if (staff.employee_number === employeeNumber) {
          employeeName = staff.first_name + " " + staff.last_name;
        }
      });
    } else {
      employeeName = "-";
    }

    return employeeName;
  }

  closeModal = () => {
    this.setState({
      showCreate: false,
      viewModal: false,
      editModal: false,
      deleteModal: false,
      errorName: "",
      errorUnit: ""
    });
  };

  // Handler Search Change
  onSearch = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Search Handler
  submitSearch = e => {
    e.preventDefault();

    const {
      searchCode,
      searchName,
      searchUnit,
      searchDate,
      searchCreated
    } = this.state;

    const code = new RegExp(searchCode, "i");
    const name = new RegExp(searchName, "i");
    const unit = new RegExp(searchUnit);
    const created_date =
      searchDate === ""
        ? new RegExp("")
        : new RegExp(moment(searchDate, "YYYY-MM-DD").format("DD/MM/YYYY"));
    const created_by = new RegExp(searchCreated, "i");

    const filtered = [];
    this.state.souvenirs.forEach(souvenir => {
      if (
        code.test(souvenir.code) &&
        name.test(souvenir.name) &&
        unit.test(souvenir.m_unit_id) &&
        created_date.test(souvenir.created_date) &&
        created_by.test(this.getEmployee(souvenir.created_by))
      ) {
        filtered.push({ ...souvenir });
      }
    });

    // Update Souvenirs State
    // According by Search Keyword
    this.setState({
      souvenirs: filtered,
      search: true
    });
  };

  // Restore Souvenirs Data
  onRestore = e => {
    e.preventDefault();
    this.setState({
      souvenirs: this.props.souvenir.souvenirs,
      search: false
    });
  };

  // Clear Alert
  onClearAlert = e => {
    e.preventDefault();
    this.props.clearAlert();
  };

  // Pagination Handler
  handleChangePage = (e, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = e => {
    this.setState({ rowsPerPage: e.target.value });
  };

  render() {
    const { souvenirs, units, status, message, data } = this.props.souvenir;
    const { user } = this.props.auth;

    const options = [];
    options.push({ label: "~Select Unit Name~", value: "" });
    units.forEach(unit =>
      options.push({
        label: unit.name,
        value: unit.code
      })
    );

    // Table Vars
    let souvenirLabel;
    let souvenirList;

    // Inline Table Style]
    const capitalize = { textTransform: "capitalize" };

    if (souvenirs.length > 0) {
      souvenirList = this.state.souvenirs
        .slice(
          this.state.page * this.state.rowsPerPage,
          this.state.page * this.state.rowsPerPage + this.state.rowsPerPage
        )
        .map(souvenir => (
          <tr key={souvenir._id} className="text-center">
            <td>{souvenir.code}</td>
            <td style={capitalize}>{souvenir.name}</td>
            <td>{this.getUnits(souvenir.m_unit_id)}</td>
            <td>{souvenir.created_date}</td>
            <td>{this.getEmployee(souvenir.created_by)}</td>
            <td nowrap="true">
              <Link to="#" data-tip="See Detail">
                <RemoveRedEye
                  onClick={() => {
                    this.onViewModal(souvenir._id);
                  }}
                />
                <ReactTooltip place="top" type="dark" effect="solid" />
              </Link>
              <Link to="#" data-tip="Edit Souvenir">
                <Create
                  onClick={() => {
                    this.onEditModal(souvenir._id);
                  }}
                />
                <ReactTooltip place="top" type="dark" effect="solid" />
              </Link>
              <Link to="#" data-tip="Delete Souvenir">
                <Delete
                  onClick={() => {
                    this.onDeleteModal(souvenir.code);
                  }}
                />
                <ReactTooltip place="top" type="dark" effect="solid" />
              </Link>
            </td>
          </tr>
        ));

      souvenirLabel = (
        <Fragment>
          {/* Search Form */}
          <tr>
            <td>
              <TextField
                className="search-form"
                placeholder="Souvenir Code"
                name="searchCode"
                value={this.state.searchCode}
                onChange={this.onSearch}
              />
            </td>
            <td>
              <TextField
                className="search-form"
                placeholder="Souvenir Name"
                name="searchName"
                value={this.state.searchName}
                onChange={this.onSearch}
              />
            </td>
            <td>
              <SelectList
                className="search-form"
                placeholder="~Select Unit Name~"
                name="searchUnit"
                value={this.state.searchUnit}
                onChange={this.onSearch}
                options={options}
              />
            </td>
            <td>
              <TextField
                className="search-form"
                type="date"
                min="2018-01-01"
                name="searchDate"
                value={this.state.searchDate}
                onChange={this.onSearch}
              />
            </td>
            <td>
              <TextField
                className="search-form"
                placeholder="Created By"
                name="searchCreated"
                value={this.state.searchCreated}
                onChange={this.onSearch}
              />
            </td>
            <td nowrap="true">
              <div className="form-group">
                {this.state.search === true ? (
                  <a href="#!" data-tip="Refresh Result!">
                    <button
                      className="btn btn-warning"
                      onClick={this.onRestore}
                    >
                      <Refresh />
                    </button>
                    <ReactTooltip place="top" type="dark" effect="solid" />
                  </a>
                ) : (
                  <button type="submit" className="btn btn-primary">
                    <Search />
                  </button>
                )}
                <Fragment>
                  <Link to="#" data-tip="Add New Souvenir">
                    <button
                      onClick={this.showHandler}
                      type="button"
                      className="btn btn-primary ml-1"
                    >
                      <Add />
                    </button>
                  </Link>
                  <ReactTooltip place="top" type="dark" effect="solid" />
                </Fragment>
              </div>
            </td>
          </tr>
          <tr className="text-center font-weight-bold">
            <td>Souvenir Code</td>
            <td>Souvenir Name</td>
            <td>Unit</td>
            <td>Created Date</td>
            <td>Created By</td>
            <td>Action</td>
          </tr>
        </Fragment>
      );
    } else {
      souvenirLabel = (
        <tr className="text-center">
          <td>Oops, No Souvenir List Found!</td>
        </tr>
      );
    }

    if (souvenirs.length === 0 && units.length === 0) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Spinner />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {/* Create Souvenir Modal */}
              <CreateSouvenir
                m_employee_id={user.m_employee_id}
                units={units}
                create={this.state.showCreate}
                closeHandler={this.closeHandler}
                closeModal={this.closeModal}
                errorName={this.state.errorName}
                errorUnit={this.state.errorUnit}
              />
              {/* Update Souvenir Modal */}
              <UpdateSouvenir
                m_employee_id={user.m_employee_id}
                units={units}
                update={this.state.editModal}
                souvenir={this.state.currentSouvenir}
                closeModal={this.closeModal}
                errorName={this.state.errorName}
                errorUnit={this.state.errorUnit}
              />
              {/* View Souvenir Modal */}
              <ReadSouvenir
                units={units}
                view={this.state.viewModal}
                souvenir={this.state.currentSouvenir}
                closeModal={this.closeModal}
              />
              {/* Delete Souvenir Modal */}
              <DeleteSouvenir
                m_employee_id={user.m_employee_id}
                delete={this.state.deleteModal}
                souvenir={this.state.currentSouvenir}
                closeModal={this.closeModal}
              />

              <div className="card border-primary mb-2">
                <div className="card-header lead bg-primary text-white font-weight-bold">
                  List Souvenir
                </div>
                <div className="card-body">
                  <nav aria-label="breadcrumb mb-4">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="/">Home</a>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Master Souvenir
                      </li>
                    </ol>
                  </nav>
                  {/* Alert Messages */}
                  {status === 1 && (
                    <Alert
                      action="Data Saved!"
                      message={message}
                      data={data}
                      onClick={this.onClearAlert}
                    />
                  )}
                  {status === 2 && (
                    <Alert
                      action="Data Updated!"
                      message={message}
                      data={data}
                      onClick={this.onClearAlert}
                    />
                  )}
                  {status === 3 && (
                    <Alert
                      action="Action Error!"
                      message={message}
                      onClick={this.onClearAlert}
                    />
                  )}
                  <div>
                    <form onSubmit={this.submitSearch}>
                      <div className="table-responsive">
                        <table className="table table-stripped">
                          <thead>{souvenirLabel}</thead>
                          <tbody>{souvenirList}</tbody>
                          <tfoot>
                            <tr className="text-center">
                              <TablePagination
                                count={this.state.souvenirs.length}
                                rowsPerPage={this.state.rowsPerPage}
                                page={this.state.page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={
                                  this.handleChangeRowsPerPage
                                }
                                ActionsComponent={Pagination}
                              />
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

SouvenirList.propTypes = {
  getAssignToName: PropTypes.func.isRequired,
  getAllSouvenir: PropTypes.func.isRequired,
  getUnits: PropTypes.func.isRequired,
  souvenir: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  clearAlert: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  souvenir: state.souvenir,
  auth: state.auth,
  design: state.design
});

export default connect(
  mapStateToProps,
  { getAllSouvenir, getUnits, getAssignToName, clearAlert }
)(SouvenirList);
