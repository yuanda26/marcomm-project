import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Alert } from "reactstrap";
import { Search, CreateOutlined, DeleteOutlined } from "@material-ui/icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// Redux actions
import { getUnits } from "../../../actions/unitAction";
import { getStaff, getEmployee } from "../../../actions/designAction";
// Unit Components
import UnitView from "./UnitView";
import UnitEdit from "./UnitEdit";
import UnitDelete from "./UnitDelete";
import UnitAdd from "./UnitAdd";
// Form Components
import Spinner from "../../common/Spinner";

class UnitList extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      alertData: {
        status: 0,
        message: "",
        code: "",
        action: "",
        optional: ""
      },
      employee: []
    };
  }

  componentDidMount() {
    this.props.getUnits();
    this.props.getStaff();
    this.props.getEmployee();
  }

  componentWillReceiveProps(newProps) {
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

  modalStatus = (status, action, message, optional, code) => {
    this.setState({
      alertData: {
        status: status,
        action: action,
        message: message,
        optional: optional,
        code: code
      },
      viewUnit: false,
      editUnit: false,
      deleteUnit: false,
      addUnit: false
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

  SearchHandler = () => {
    let { code, name, created_by, created_date } = this.state.initialSearch;

    code = new RegExp(code, "i");
    name = new RegExp(name, "i");
    created_date = new RegExp(created_date, "i");
    created_by = new RegExp(created_by, "i");
    let test = [];
    this.state.unit.forEach(ele => {
      if (
        code.test(ele.code.toLowerCase()) &&
        name.test(ele.name.toLowerCase()) &&
        created_by.test(this.rename(ele.created_by).toLowerCase()) &&
        created_date.test(ele.created_date.toLowerCase())
      ) {
        test.push(ele);
      }
    });
    this.setState({
      coba: test
    });
  };

  handleChangeCreatedDate = date => {
    let { initialSearch } = this.state;
    if (date) {
      let dd = date.getDate();
      let mm = date.getMonth() + 1;
      let yy = date
        .getFullYear()
        .toString()
        .substr(2, 2);
      let newDate = dd + "/" + mm + "/" + yy;
      initialSearch["created_date"] = new RegExp(newDate);
      this.setState({
        initialSearch: initialSearch,
        created_date: date
      });
    } else {
      initialSearch["created_date"] = /(?:)/;
      this.setState({
        initialSearch: initialSearch,
        created_date: new Date()
      });
    }
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
    let { initialSearch } = this.state;
    initialSearch[e.target.name] = new RegExp(e.target.value, "i");
    e.preventDefault();
    this.setState({
      initialSearch: initialSearch
    });
  };

  render() {
    const { user } = this.props.auth;
    const {
      unitData,
      code,
      message1,
      message2,
      message3,
      status
    } = this.props.units;
    let { unit, coba, hasil } = this.state;

    let unitList;
    let unitLabel;
    let result;
    if (coba === null) {
      result = hasil;
    } else {
      result = coba;
    }

    if (unitData.length > 0) {
      unitList = result.map((row, index) => (
        <tr key={row._id} className="text-center">
          <td>{index + Date.now()}</td>
          <td>{row.code}</td>
          <td>{row.name}</td>
          <td>{row.created_date}</td>
          <td>{this.rename(row.created_by)}</td>
          <td nowrap="true">
            <Link to="#">
              <Search
                onClick={() => {
                  this.viewModalHandler(row.code);
                }}
              />
            </Link>
            <Link to="#">
              <CreateOutlined
                onClick={() => {
                  this.editModalHandler(row.code);
                }}
              />
            </Link>
            <Link to="#">
              <DeleteOutlined
                onClick={() => {
                  this.deleteModalHandler(row.code);
                }}
              />
            </Link>
          </td>
        </tr>
      ));

      unitLabel = (
        <tr className="text-center text-bold">
          <td>No</td>
          <td>Unit Code</td>
          <td>Unit Name</td>
          <td>Created Date</td>
          <td>Created By</td>
          <td>Action</td>
        </tr>
      );
    } else {
      unitList = (
        <tr className="text-center">
          <td>Oops, Unit Not Found!</td>
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
                modalStatus={this.modalStatus}
              />
              <UnitAdd
                userdata={user}
                create={this.state.addUnit}
                alertData={this.state.alertData}
                closeModal={this.closeModalHandler}
                modalStatus={this.modalStatus}
              />
              <UnitEdit
                edit={this.state.editUnit}
                unit={this.state.currentData}
                alertData={this.state.alertData}
                closeModal={this.closeModalHandler}
                modalStatus={this.modalStatus}
              />
              <UnitDelete
                delete={this.state.deleteUnit}
                unit={this.state.currentData}
                closeModal={this.closeModalHandler}
                modalStatus={this.modalStatus}
              />
              <div className="card border-primary mb-3">
                <div className="card-header lead">Unit List</div>
                <div className="card-body ">
                  {/* Breadcrumb Navigation */}
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item active">
                        <Link to="/">Home </Link>
                      </li>
                      <li className="breadcrumb-item ">Unit</li>
                    </ol>
                  </nav>
                  {/* Search Form */}
                  <form>
                    <div className="form-group col-md-3">
                      <select
                        name="code"
                        className="form-control "
                        onChange={this.changeHandler}
                      >
                        <option key="empty" value="">
                          -Select Unit Code-
                        </option>
                        {unit.map(row => {
                          return (
                            <option key={row.code} value={row.code}>
                              {row.code}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="form-group col-md-3">
                      <select
                        name="name"
                        className="form-control "
                        onChange={this.changeHandler}
                      >
                        <option key="empty" value="">
                          -Select Unit Name-
                        </option>
                        {unit.map(row => {
                          return (
                            <option key={row.code} value={row.name}>
                              {row.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="col-md-2">
                      <DatePicker
                        className="form-control"
                        placeholderText="Created"
                        name="created_date"
                        selected={this.state.created_date}
                        onChange={this.handleChangeCreatedDate}
                      />
                    </div>
                    <div className="col-md-2">
                      <input
                        placeholder="Created By"
                        name="created_by"
                        className="form-control"
                        onChange={this.changeHandler}
                      />
                    </div>
                    <Link to="#">
                      <button
                        onClick={this.SearchHandler}
                        className="btn btn-primary col-md-auto"
                        type="button"
                      >
                        Search
                      </button>
                    </Link>
                  </form>
                  <div className="text-left mb-4">
                    <Link to="#">
                      <button
                        onClick={this.addModalHandler}
                        className="btn btn-warning ml-2 col-md-auto"
                        type="button"
                      >
                        Add Unit
                      </button>
                    </Link>
                  </div>
                  {status === 1 && (
                    <Alert color="success">
                      <b>{message1}</b>
                      {message2}
                      <b>{code}</b>
                      {message3}
                    </Alert>
                  )}
                  {status === 2 && (
                    <Alert color="danger">
                      <b>{message1}</b>
                      {message2}
                      <b>{code}</b>
                      {message3}
                    </Alert>
                  )}
                  <div className="table-responsive">
                    <table className="table table-stripped ">
                      <thead>{unitLabel}</thead>
                      <tbody>{unitList}</tbody>
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
}

UnitList.propTypes = {
  getUnits: PropTypes.func.isRequired,
  getStaff: PropTypes.func.isRequired,
  getEmployee: PropTypes.func.isRequired,
  units: PropTypes.object.isRequired,
  design: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  units: state.units,
  design: state.design,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getUnits, getStaff, getEmployee }
)(UnitList);
