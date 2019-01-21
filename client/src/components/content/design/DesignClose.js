import React, { Component } from "react";
import moment from "moment";
import PropTypes from "prop-types";
// Redux Actions
import { connect } from "react-redux";
import {
  clearAlert,
  updateDesign,
  updateDesignItem,
  closeDesign,
  uploadDesign
} from "../../../actions/designAction";
// Forms Components
import TextField from "../../common/TextField";
import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaGroup from "../../common/TextAreaGroup";
import isEmpty from "../../../validation/isEmpty";

class DesignClose extends Component {
  constructor(props) {
    super(props);

    this.state = {
      assign_to: "",
      items: []
    };
  }

  UNSAFE_componentWillReceiveProps(props, state) {
    const newItems = [];
    props.items.map(item =>
      newItems.push({
        ...item,
        start_date: "",
        end_date: "",
        uploads: {
          name: "",
          type: "",
          size: 0
        },
        errorStartDate: "",
        errorEndDate: "",
        errorUpload: ""
      })
    );

    this.setState({ items: newItems });
  }

  // Function to Get User with 'Requester' Role
  getRequester(request_pic) {
    let name = "";
    if (request_pic !== "") {
      this.props.requester.forEach(rows => {
        if (rows.employee_number === request_pic) {
          name = rows.first_name + " " + rows.last_name;
        }
      });
    }
    return name;
  }

  // Function to Get Product Description
  getDescription(product_id) {
    let description = "";
    if (product_id !== "") {
      this.props.product.forEach(rows => {
        if (rows.code === product_id) {
          description = rows.description;
        }
      });
    }
    return description;
  }

  // Function to Get Product Name
  getProductName(product_id) {
    let name = "";
    if (product_id !== "") {
      this.props.product.forEach(rows => {
        if (rows.code === product_id) {
          name = rows.name;
        }
      });
    }
    return name;
  }

  // Function to Get Assigned Employee Name
  assignToName(employeeNumber) {
    let employeeName = "";
    if (employeeNumber !== null) {
      this.props.employee.forEach(staff => {
        if (staff.employee_number === employeeNumber) {
          employeeName = staff.first_name + " " + staff.last_name;
        }
      });
    } else {
      employeeName = "-";
    }

    return employeeName;
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

  handleItemChange = idx => e => {
    const newItems = this.state.items.map((item, sidx) => {
      if (idx !== sidx) return item;

      // Clear Error Message State
      const errors = {};
      if (e.target.name === "start_date") {
        errors.errorStartDate = "";
      }
      if (e.target.name === "end_date") {
        errors.errorEndDate = "";
      }

      return { ...item, ...errors, [e.target.name]: e.target.value };
    });

    this.setState({ items: newItems });
  };

  handleItemUpload = idx => e => {
    const newItems = this.state.items.map((item, sidx) => {
      if (idx !== sidx) return item;

      // Clear Error Message State
      const error = {};
      if (e.target.name === "uploads") {
        error.errorUpload = "";
      }
      return { ...item, ...error, [e.target.name]: e.target.files[0] };
    });

    this.setState({ items: newItems });
  };

  onSubmit = e => {
    e.preventDefault();

    // Design Item Form Validation
    // Set Error Counter
    let errorCounter = 0;
    this.state.items.forEach((item, idx) => {
      const items = this.state.items;
      // Check for Empty Start Date Field
      if (isEmpty(item.start_date)) {
        errorCounter += 1;
        items[idx].errorStartDate = "This Field is Required!";
        this.setState({ items });
      }
      // Check for Empty End Date Field
      if (isEmpty(item.end_date)) {
        errorCounter += 1;
        items[idx].errorEndDate = "This Field is Required!";
        this.setState({ items });
      }
      // Check for Empty Upload Field
      if (isEmpty(item.uploads.name)) {
        errorCounter += 1;
        items[idx].errorUpload = "This Field is Required!";
        this.setState({ items });
      }
    });

    // Final Validation
    // Design Form & Design Item Form
    if (errorCounter !== 0) {
      // Container Updated Design Request Data
      const designData = {
        status: 3,
        updated_by: this.props.user.m_employee_id,
        updated_date: moment().format("DD/MM/YYYY")
      };

      // Contain Updated Design Items Data
      const designItemUpdate = [];
      this.state.items.map(item =>
        designItemUpdate.push({
          _id: item._id,
          start_date: item.start_date,
          end_date: item.end_date,
          updated_by: this.props.user.m_employee_id,
          created_date: moment().format("DD/MM/YYYY")
        })
      );

      // Contain Design Item File Data
      const designFileData = [];
      const formdata = new FormData();

      this.state.items.forEach(item => {
        // Append Formdata Instance
        formdata.append("uploads", item.uploads);

        designFileData.push({
          t_design_item_id: item._id,
          filename: item.uploads.name,
          size: item.uploads.size,
          extention: item.uploads.type,
          is_delete: false,
          created_by: this.props.user.m_employee_id,
          created_date: moment().format("DD/MM/YYYY")
        });
      });

      // Close Design Request & Upload Data
      this.props.updateDesign(this.props.design.code, designData);
      this.props.updateDesignItem(designItemUpdate);
      this.props.closeDesign(designFileData);
      this.props.uploadDesign(formdata);
    }
  };

  onCancel = e => {
    e.preventDefault();
    window.location.href = "/design";
  };

  // Clear Alert
  onClearAlert = e => {
    e.preventDefault();
    this.props.clearAlert();
  };

  render() {
    const { design, staff, code, title } = this.props;

    // Set Assign to Options
    const staffOptions = [];
    staffOptions.push({ label: "*Select Employee", value: "" });
    staff.map(list =>
      staffOptions.push({
        label: `${list.first_name} ${list.last_name}`,
        value: list.employee_number
      })
    );

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <nav aria-label="breadcrumb mb-4">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <a href="/">Home</a>
                </li>
                <li className="breadcrumb-item">
                  <a href="/design">Transaction Design</a>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {title}
                </li>
              </ol>
            </nav>
            <div className="card border-info mb-3">
              <div className="card-header lead">
                {title}: {code}
              </div>
              <div className="card-body">
                <form encType="multipart/form-data">
                  <div className="row">
                    <div className="col-md-6">
                      <TextFieldGroup
                        label="*Transaction Code"
                        value={code}
                        disabled={true}
                      />
                      <TextFieldGroup
                        label="*Event Code"
                        value={design.t_event_id}
                        disabled={true}
                      />
                      <TextFieldGroup
                        label="*Design Title"
                        value={design.title_header}
                        disabled={true}
                      />
                      <TextFieldGroup
                        label="Status"
                        value={this.designStatus(design.status)}
                        disabled={true}
                      />
                      <TextFieldGroup
                        label="Assign to"
                        value={this.assignToName(design.assign_to)}
                        disabled={true}
                      />
                    </div>
                    <div className="col-md-6">
                      <TextFieldGroup
                        label="*Request By"
                        value={this.assignToName(design.request_by)}
                        disabled={true}
                      />
                      <TextFieldGroup
                        label="*Request Date"
                        value={design.request_date}
                        disabled={true}
                      />
                      <TextAreaGroup
                        label="Note"
                        value={design.note}
                        disabled={true}
                      />
                    </div>
                    <div className="col-md-12 mt-4 form-inline">
                      <table className="table table-responsive mt-2 mb-2">
                        <thead>
                          <tr className="text-center">
                            <td>Product Name</td>
                            <td>Product Description</td>
                            <td>Title</td>
                            <td>Request PIC</td>
                            <td>Due Date</td>
                            <td>Start Date</td>
                            <td>End Date</td>
                            <td>Note</td>
                            <td />
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.items.map((item, idx) => (
                            <tr key={idx}>
                              <td>
                                <TextField
                                  value={this.getProductName(item.m_product_id)}
                                  disabled={true}
                                />
                              </td>
                              <td>
                                <TextField
                                  value={this.getDescription(item.m_product_id)}
                                  disabled={true}
                                />
                              </td>
                              <td>
                                <TextField
                                  value={item.title_item}
                                  disabled={true}
                                />
                              </td>
                              <td>
                                <TextField
                                  value={this.getRequester(item.request_pic)}
                                  disabled={true}
                                />
                              </td>
                              <td>
                                <TextField
                                  value={item.request_due_date}
                                  disabled={true}
                                />
                              </td>
                              <td>
                                <TextField
                                  type="date"
                                  name="start_date"
                                  min={moment().format("YYYY-MM-DD")}
                                  value={item.start_date}
                                  onChange={this.handleItemChange(idx)}
                                  errors={item.errorStartDate}
                                />
                              </td>
                              <td>
                                <TextField
                                  type="date"
                                  name="end_date"
                                  min={item.start_date}
                                  value={item.end_date}
                                  onChange={this.handleItemChange(idx)}
                                  errors={item.errorEndDate}
                                />
                              </td>
                              <td>
                                <TextField value={item.note} disabled={true} />
                              </td>
                              <td>
                                <TextField
                                  type="file"
                                  name="uploads"
                                  onChange={this.handleItemUpload(idx)}
                                  errors={item.errorUpload}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="mt-2 text-right">
                    <input
                      type="submit"
                      value="Close Request"
                      className="btn btn-primary mr-1"
                      onClick={this.onSubmit}
                    />
                    <button
                      className="btn btn-warning"
                      type="button"
                      onClick={this.onCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DesignClose.propTypes = {
  title: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  design: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  employee: PropTypes.array.isRequired,
  product: PropTypes.array.isRequired,
  staff: PropTypes.array.isRequired,
  requester: PropTypes.array.isRequired,
  clearAlert: PropTypes.func.isRequired,
  updateDesign: PropTypes.func.isRequired,
  updateDesignItem: PropTypes.func.isRequired,
  closeDesign: PropTypes.func.isRequired,
  uploadDesign: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  { clearAlert, updateDesign, updateDesignItem, closeDesign, uploadDesign }
)(DesignClose);
