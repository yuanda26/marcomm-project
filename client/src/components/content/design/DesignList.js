import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
// Redux Actions
import { connect } from "react-redux";
import {
  getAllDesign,
  getAssignToName,
  getEvent
} from "../../../actions/designAction";
// Form Components
import Spinner from "../../common/Spinner";
import TextField from "../../common/TextField";
import SelectList from "../../common/SelectList";
import ReactTooltip from "react-tooltip";
// Form Validation
import isEmpty from "../../../validation/isEmpty";
// Pagination with Material IU
import Pagination from "../../common/Pagination";
import { TablePagination } from "@material-ui/core";
// Material UI Icons
import { Search, Create, RemoveRedEye, Refresh, Add } from "@material-ui/icons";

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
      event: [],
      page: 0,
      rowsPerPage: 5
    };
  }

  componentDidMount() {
    this.props.getAllDesign();
    this.props.getAssignToName();
    this.props.getEvent();
  }

  UNSAFE_componentWillReceiveProps(props, state) {
    this.setState({
      employee: props.design.assign,
      designs: props.design.designs,
      event: props.design.event
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
    this.setState({ [e.target.name]: e.target.value });
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
      search: false
    });
  };

  // Pagination Handler
  handleChangePage = (e, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = e => {
    this.setState({ rowsPerPage: e.target.value });
  };

  render() {
    const { designs, assign } = this.props.design;

    // Define Options for Assign to Dropdown
    const options = [];
    options.push({ label: "~Assign To~", value: "" });
    assign.forEach(staff =>
      options.push({
        label: staff.first_name + " " + staff.last_name,
        value: staff.employee_number
      })
    );

    let designList;
    let designLabel;

    if (designs.length > 0) {
      designList = this.state.designs
        .slice(
          this.state.page * this.state.rowsPerPage,
          this.state.page * this.state.rowsPerPage + this.state.rowsPerPage
        )
        .map(design => (
          <tr key={design._id} className="text-center">
            <td>{design.code}</td>
            <td>{this.getEmployee(design.request_by)}</td>
            <td>{design.request_date}</td>
            <td>{this.getEmployee(design.assign_to)}</td>
            <td>{this.designStatus(design.status)}</td>
            <td>{design.created_date}</td>
            <td>{this.getEmployee(design.created_by)}</td>
            <td>
              <a href={`/design/view/${design.code}`} data-tip="See Detail">
                <RemoveRedEye />
                <ReactTooltip place="top" type="dark" effect="solid" />
              </a>
              <a
                href={`/design/edit/${design.code}`}
                data-tip="Edit Design Request"
              >
                <Create />
                <ReactTooltip place="top" type="dark" effect="solid" />
              </a>
            </td>
          </tr>
        ));

      designLabel = (
        <Fragment>
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
                    className="btn btn-warning"
                    onClick={this.onRestore}
                    title="Resfresh Result!"
                  >
                    <Refresh />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary"
                    title="Search!"
                  >
                    <Search />
                  </button>
                )}
                <a
                  href="/design/add"
                  title="Request New Design!"
                  data-tip="Add New Unit"
                >
                  <button className="btn btn-primary ml-1" type="button">
                    <Add />
                  </button>
                  <ReactTooltip place="top" type="dark" effect="solid" />
                </a>
              </div>
            </td>
          </tr>
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
        </Fragment>
      );
    } else {
      designList = (
        <tr className="text-center">
          <td>Oops, No Design List Found!</td>
        </tr>
      );
    }

    if (isEmpty(designs) && isEmpty(assign)) {
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
              <div className="card border-primary mb-3">
                <div className="card-header lead bg-primary text-white font-weight-bold">
                  Design List
                </div>
                <div className="card-body">
                  <nav aria-label="breadcrumb mb-4">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <a href="/dashboard">Home</a>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Transaction Design
                      </li>
                    </ol>
                  </nav>
                  <div className="table-responsive">
                    <form onSubmit={this.submitSearch}>
                      <table className="table table-stripped">
                        <thead>{designLabel}</thead>
                        <tbody>{designList}</tbody>
                        <tfoot>
                          <tr className="text-center">
                            <TablePagination
                              count={this.state.designs.length}
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
