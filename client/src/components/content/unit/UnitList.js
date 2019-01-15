import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
// Redux actions
import { connect } from "react-redux";
import { getUnits, clearAlert } from "../../../actions/unitAction";
import { getStaff, getEmployee } from "../../../actions/designAction";
// Unit Components
import UnitView from "./UnitView";
import UnitEdit from "./UnitEdit";
import UnitDelete from "./UnitDelete";
import UnitAdd from "./UnitAdd";
// Form Components
import TextField from "../../common/TextField";
import SelectList from "../../common/SelectList";
import Spinner from "../../common/Spinner";
import Alert from "../../common/Alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

class UnitList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: false,
      searchResult: true,
      initialSearch: {
        code: "",
        name: "",
        created_date: "",
        created_by: ""
      },
      unit: [],
      currentData: {},
      hasil: [],
      coba: null,
      viewUnit: false,
      editUnit: false,
      deleteUnit: false,
      addUnit: false,
      employee: [],
      page: 0,
      rowsPerPage: 5
    };
  }

  componentDidMount() {
    this.props.getUnits();
    this.props.getStaff();
    this.props.getEmployee();
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    this.setState({
      unit: newProps.units.unitData,
      hasil: newProps.units.unitData,
      employee: newProps.design.employee
    });
  }

  viewModalHandler = unitid => {
    let tmp = {};
    this.state.unit.forEach(ele => {
      if (unitid === ele.code) {
        tmp = ele;
      }
    });
    this.setState({
      currentData: tmp,
      viewUnit: true
    });
  };

  addModalHandler = () => {
    this.setState({ addUnit: true });
  };

  editModalHandler = unitid => {
    let tmp = {};
    this.state.unit.forEach(ele => {
      if (unitid === ele.code) {
        tmp = {
          _id: ele._id,
          code: ele.code,
          name: ele.name,
          description: ele.description,
          updated_by: ele.updated_by
        };
        this.setState({
          currentData: tmp,
          editUnit: true
        });
      }
    });
  };

  deleteModalHandler = unitid => {
    let tmp = {};
    this.state.unit.forEach(ele => {
      if (unitid === ele.code) {
        tmp = ele;
      }
    });
    this.setState({
      currentData: tmp,
      deleteUnit: true
    });
  };

  closeModalHandler = () => {
    this.setState({
      viewUnit: false,
      editUnit: false,
      deleteUnit: false,
      addUnit: false
    });
  };

  SearchHandler = e => {
    e.preventDefault();

    let { code, name, created_by, created_date } = this.state.initialSearch;

    code = new RegExp(code, "i");
    name = new RegExp(name, "i");
    created_date =
      created_date === ""
        ? new RegExp("")
        : new RegExp(moment(created_date, "YYYY-MM-DD").format("DD/MM/YYYY"));
    created_by = new RegExp(created_by, "i");

    let result = [];
    this.state.unit.forEach(row => {
      if (
        code.test(row.code.toLowerCase()) &&
        name.test(row.name.toLowerCase()) &&
        created_by.test(this.rename(row.created_by).toLowerCase()) &&
        created_date.test(row.created_date)
      ) {
        result.push(row);
      }
    });

    this.setState({
      hasil: result,
      search: true
    });
  };

  rename = param => {
    let data = "";
    this.state.employee.forEach(row => {
      if (param === row.employee_number) {
        data = row.first_name + " " + row.last_name;
      }
    });
    return data;
  };

  changeHandler = e => {
    e.preventDefault();

    let { initialSearch } = this.state;
    initialSearch[e.target.name] = e.target.value;

    this.setState({ initialSearch: initialSearch });
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

  // Restore Units Data
  onRestore = e => {
    e.preventDefault();
    this.setState({
      hasil: this.props.units.unitData,
      search: false
    });
  };

  render() {
    const { user } = this.props.auth;
    const { unitData, status, data, message } = this.props.units;
    const { unit, hasil } = this.state;

    let unitList;
    let unitLabel;

    let optionsCode = [];
    optionsCode.push({ label: "~Select Unit Code~", value: "" });
    unit.forEach(row =>
      optionsCode.push({
        label: row.code,
        value: row.code
      })
    );

    let optionsName = [];
    optionsName.push({ label: "~Select Unit Name~", value: "" });
    unit.forEach(row =>
      optionsName.push({
        label: row.name,
        value: row.name
      })
    );

    if (unitData.length > 0) {
      unitList = hasil
        .slice(
          this.state.page * this.state.rowsPerPage,
          this.state.page * this.state.rowsPerPage + this.state.rowsPerPage
        )
        .map(row => (
          <tr key={row._id} className="text-center">
            <td>{row.code}</td>
            <td>{row.name}</td>
            <td>{row.created_date}</td>
            <td>{this.rename(row.created_by)}</td>
            <td nowrap="true">
              <Link to="#" data-tip="See Detail">
                <RemoveRedEye
                  onClick={() => {
                    this.viewModalHandler(row.code);
                  }}
                />
                <ReactTooltip place="top" type="dark" effect="solid" />
              </Link>
              <Link to="#" data-tip="Edit Unit">
                <Create
                  onClick={() => {
                    this.editModalHandler(row.code);
                  }}
                />
                <ReactTooltip place="top" type="dark" effect="solid" />
              </Link>
              <Link to="#" data-tip="Delete Unit">
                <Delete
                  onClick={() => {
                    this.deleteModalHandler(row.code);
                  }}
                />
                <ReactTooltip place="top" type="dark" effect="solid" />
              </Link>
            </td>
          </tr>
        ));

      unitLabel = (
        <Fragment>
          {/* Search Form */}
          <tr>
            <td>
              <SelectList
                className="search-form"
                name="code"
                value={this.state.initialSearch.code}
                onChange={this.changeHandler}
                options={optionsCode}
              />
            </td>
            <td>
              <SelectList
                className="search-form"
                name="name"
                value={this.state.initialSearch.name}
                onChange={this.changeHandler}
                options={optionsName}
              />
            </td>
            <td>
              <TextField
                className="search-form"
                type="date"
                min="2018-01-01"
                name="created_date"
                value={this.state.created_date}
                onChange={this.changeHandler}
              />
            </td>
            <td>
              <TextField
                className="search-form"
                placeholder="Created By"
                name="created_by"
                value={this.state.initialSearch.created_by}
                onChange={this.changeHandler}
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
                <Link to="#" data-tip="Add New Unit">
                  <button
                    onClick={this.addModalHandler}
                    className="btn btn-primary ml-1"
                    type="button"
                  >
                    <Add />
                  </button>
                  <ReactTooltip place="top" type="dark" effect="solid" />
                </Link>
              </div>
            </td>
          </tr>
          <tr className="text-center font-weight-bold">
            <td>Unit Code</td>
            <td>Unit Name</td>
            <td>Created Date</td>
            <td>Created By</td>
            <td>Action</td>
          </tr>
        </Fragment>
      );
    } else {
      unitList = (
        <tr className="text-center">
          <td>Oops, Unit Data Not Found!</td>
        </tr>
      );
    }

    if (unitData.length === 0) {
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
              <UnitView
                view={this.state.viewUnit}
                unit={this.state.currentData}
                closeModal={this.closeModalHandler}
              />
              <UnitAdd
                userdata={user}
                create={this.state.addUnit}
                closeModal={this.closeModalHandler}
              />
              <UnitEdit
                userdata={user}
                edit={this.state.editUnit}
                unit={this.state.currentData}
                closeModal={this.closeModalHandler}
              />
              <UnitDelete
                delete={this.state.deleteUnit}
                unit={this.state.currentData}
                closeModal={this.closeModalHandler}
              />
              <div className="card border-primary mb-3">
                <div className="card-header lead bg-primary text-white font-weight-bold">
                  Unit List
                </div>
                <div className="card-body ">
                  {/* Breadcrumb Navigation */}
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item active">
                        <a href="/">Home </a>
                      </li>
                      <li className="breadcrumb-item ">Master Unit</li>
                    </ol>
                  </nav>
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
                      action="Data Deleted!"
                      message={message}
                      data={data}
                      onClick={this.onClearAlert}
                    />
                  )}

                  <div className="table-responsive mt-4">
                    <form onSubmit={this.SearchHandler}>
                      <table className="table table-stripped ">
                        <thead>{unitLabel}</thead>
                        <tbody>{unitList}</tbody>
                        <tfoot>
                          <tr className="text-center">
                            <TablePagination
                              count={this.state.hasil.length}
                              rowsPerPage={this.state.rowsPerPage}
                              page={this.state.page}
                              onChangePage={this.handleChangePage}
                              onChangeRowsPerPage={this.handleChangeRowsPerPage}
                              ActionsComponent={Pagination}
                            />
                          </tr>
                        </tfoot>
                      </table>
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

UnitList.propTypes = {
  getUnits: PropTypes.func.isRequired,
  getStaff: PropTypes.func.isRequired,
  getEmployee: PropTypes.func.isRequired,
  units: PropTypes.object.isRequired,
  design: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  clearAlert: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  units: state.units,
  design: state.design,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getUnits, getStaff, getEmployee, clearAlert }
)(UnitList);
