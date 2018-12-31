import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Search, CreateOutlined } from "@material-ui/icons";
// Redux Actions
import {
  getAllDesign,
  getAssignToName,
  getEvent
} from "../../../actions/designAction";

// Form Components
import Spinner from "../../common/SpinnerTable";
import TextField from "../../common/TextField";
import SelectList from "../../common/SelectList";

class DesignList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchCode: "",
      searchRequestBy: "",
      searchRequestDate: "",
      searchStatus: "",
      searchAssign: "",
      searchCreatedDate: "",
      searchCreatedBy: "",
      search: false,
      employee: [],
      designs: [],
      event: []
    };
  }

  componentDidMount() { 
    this.props.getAllDesign();
    this.props.getAssignToName();
    this.props.getEvent();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      employee: newProps.design.assign,
      designs: newProps.design.designs,
      event: newProps.design.event
    });
  }

  // Function to Get Design Status
  designStatus(status) {
    switch (status) {
      case 0:
        return "Rejected";
      case 2:
        return "In Progress";
      case 3:
        return "Done!";
      default:
        return "Submitted";
    }
  }

  // Function to Get Employee Name
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

  // Get Event Name & Code
  getEvent(code) {
    let event = "";

    this.state.event.forEach(row => {
      if (row.code === code) {
        event = `${row.code} - ${row.event_name}`;
      }
    });

    return event;
  }

  // Handle Search Change
  onSearch = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // Handle Submit Search
  submitSearch = e => {
    e.preventDefault();

    const {
      searchCode,
      searchAssign,
      searchRequestBy,
      searchRequestDate,
      searchCreatedBy,
      searchCreatedDate,
      searchStatus
    } = this.state;

    const code = new RegExp(searchCode, "i");
    const assign = new RegExp(searchAssign);
    const request_by = new RegExp(searchRequestBy, "i");
    const request_date =
      searchRequestDate === ""
        ? new RegExp("")
        : new RegExp(
            moment(searchRequestDate, "YYYY-MM-DD").format("DD/MM/YYYY")
          );
    const created_date =
      searchCreatedDate === ""
        ? new RegExp("")
        : new RegExp(
            moment(searchCreatedDate, "YYYY-MM-DD").format("DD/MM/YYYY")
          );
    const created_by = new RegExp(searchCreatedBy, "i");
    const status = new RegExp(searchStatus, "i");

    const filtered = [];
    this.state.designs.forEach(design => {
      if (
        code.test(design.code) &&
        assign.test(design.employee_number) &&
        request_by.test(this.getEmployee(design.request_by)) &&
        request_date.test(design.request_date) &&
        created_date.test(design.created_date) &&
        created_by.test(this.getEmployee(design.created_by)) &&
        status.test(this.designStatus(design.status))
      ) {
        filtered.push({ ...design });
      }
    });

    // Update Souvenirs State
    // According by Search Keyword
    this.setState({
      search: true,
      designs: filtered
    });
  };

  // Restore Souvenirs Data
  onRestore = e => {
    e.preventDefault();
    this.setState({
      designs: this.props.design.designs,
      search: false,
      searchCode: "",
      searchRequestBy: "",
      searchRequestDate: "",
      searchStatus: "",
      searchAssign: "",
      searchCreatedDate: "",
      searchCreatedBy: ""
    });
  };

  render() {
    const { designs, assign, status, message } = this.props.design;

    // Define Options for Assign to Dropdown
    const options = [];
    options.push({ label: "~Assign To~", value: "" });
    this.state.employee.forEach(staff =>
      options.push({
        label: staff.first_name + " " + staff.last_name,
        value: staff.employee_number
      })
    );

    let designList;
    let designLabel;
    // Inline Table Style
    const columnWidth = { width: "100%" };

    if (designs === null || assign === null) {
      return (designList = <Spinner />);
    } else {
      if (this.state.designs.length > 0) {
        designList = this.state.designs.map((design, index) => (
          <tr key={design._id} className="text-center">
            <td>{index + 1}</td>
            <td>{design.code}</td>
            <td>{this.getEvent(design.t_event_id)}</td>
            <td>{this.getEmployee(design.request_by)}</td>
            <td>{design.request_date}</td>
            <td>{this.getEmployee(design.assign_to)}</td>
            <td nowrap="true">{this.designStatus(design.status)}</td>
            <td>{design.created_date}</td>
            <td>{this.getEmployee(design.created_by)}</td>
            <td nowrap="true">
              <Link to={`/design/view/${design.code}`}>
                <Search />
              </Link>
              <Link to={`/design/edit/${design.code}`}>
                <CreateOutlined />
              </Link>
            </td>
          </tr>
        ));

        designLabel = (
          <tr className="text-center font-weight-bold" style={columnWidth}>
            <td>No</td>
            <td>Transaction Code</td>
            <td>Event Name</td>
            <td>Request By</td>
            <td nowrap="true">Request Date</td>
            <td nowrap="true">Assign To</td>
            <td>Status</td>
            <td nowrap="true">Created Date</td>
            <td nowrap="true">Created By</td>
            <td>Action</td>
          </tr>
        );
      } else {
        designList = (
          <tr className="text-center">
            <td>Oops, No Design List Found!</td>
          </tr>
        );
      }

      return (
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="card border-primary mb-3">
                <div className="card-header lead">Design List</div>
                <div className="card-body">
                  <nav aria-label="breadcrumb mb-4">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to="/">Home</Link>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        List Design
                      </li>
                    </ol>
                  </nav>
                  <div className="text-left">
                    <Link to="/design/add">
                      <button className="btn btn-primary" type="button">
                        Add
                      </button>
                    </Link>
                  </div>
                  {/* Search Form */}
                  <div className="mt-3">
                    <form onSubmit={this.submitSearch}>
                      <table>
                        <tbody>
                          <tr>
                            <td>
                              <TextField
                                placeholder="Transaction Code"
                                name="searchCode"
                                value={this.state.searchCode}
                                onChange={this.onSearch}
                              />
                            </td>
                            <td>
                              <TextField
                                placeholder="Request By"
                                name="searchRequestBy"
                                value={this.state.searchRequestBy}
                                onChange={this.onSearch}
                              />
                            </td>
                            <td>
                              <TextField
                                type="date"
                                min="2018-01-01"
                                max={moment().format("YYYY-MM-DD")}
                                name="searchRequestDate"
                                value={this.state.searchRequestDate}
                                onChange={this.onSearch}
                              />
                            </td>
                            <td>
                              <SelectList
                                name="searchAssign"
                                value={this.state.searchAssign}
                                onChange={this.onSearch}
                                options={options}
                              />
                            </td>
                            <td>
                              <TextField
                                placeholder="Status"
                                name="searchStatus"
                                value={this.state.searchStatus}
                                onChange={this.onSearch}
                              />
                            </td>
                            <td>
                              <TextField
                                type="date"
                                min="2018-01-01"
                                max={moment().format("YYYY-MM-DD")}
                                name="searchCreatedDate"
                                value={this.state.searchCreatedDate}
                                onChange={this.onSearch}
                              />
                            </td>
                            <td>
                              <TextField
                                placeholder="Created By"
                                name="searchCreatedBy"
                                value={this.state.searchCreatedBy}
                                onChange={this.onSearch}
                              />
                            </td>
                            <td nowrap="true">
                              <div className="form-group">
                                {this.state.search === true ? (
                                  <button
                                    className="btn btn-block btn-default"
                                    onClick={this.onRestore}
                                  >
                                    Go Back!
                                  </button>
                                ) : (
                                  <input
                                    type="submit"
                                    value="Search"
                                    className="btn btn-block btn-warning"
                                  />
                                )}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </form>
                  </div>
                  {/* Alert Messages */}
                  {status === 1 && (
                    <div className="mt-2 alert alert-success">{message}</div>
                  )}
                  {status === 2 && (
                    <div className="mt-2 alert alert-primary">{message}</div>
                  )}
                  <table className="table table-responsive table-stripped">
                    <thead>{designLabel}</thead>
                    <tbody>{designList}</tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

DesignList.propTypes = {
  getAllDesign: PropTypes.func.isRequired,
  getAssignToName: PropTypes.func.isRequired,
  getEvent: PropTypes.func.isRequired,
  design: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  design: state.design
});

export default connect(
  mapStateToProps,
  { getAllDesign, getAssignToName, getEvent }
)(DesignList);
