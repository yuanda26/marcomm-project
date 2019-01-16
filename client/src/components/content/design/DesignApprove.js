import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
// Redux Actions
import { connect } from "react-redux";
import { approveDesign, rejectDesign } from "../../../actions/designAction";
// Forms Components
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import TextFieldGroup from "../../common/TextFieldGroup";
import SelectListGroup from "../../common/SelectListGroup";
import TextArea from "../../common/TextArea";
import TextAreaGroup from "../../common/TextAreaGroup";
// Form Validation
import isEmpty from "../../../validation/isEmpty";

class DesignApprove extends Component {
  state = {
    assign_to: "",
    reject_reason: "",
    rejectModal: false,
    errorAssign: "",
    errorReason: ""
  };

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

  // Function to Get Page Title
  pageTitle(status) {
    switch (status) {
      case 0:
        return "Rejected Design Request";
      case 1:
        return "Approve Design Request";
      case 2:
        return "Close Design Request";
      default:
        return "Done Design Request";
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onApprove = () => {
    if (isEmpty(this.state.assign_to)) {
      this.setState({ errorAssign: "This Field is Required!" });
    }

    if (!isEmpty(this.state.assign_to)) {
      this.props.approveDesign(this.props.code, {
        status: 2,
        assign_to: this.state.assign_to,
        approved_by: this.props.user.m_employee_id,
        approved_date: moment().format("DD/MM/YYYY"),
        updated_by: this.props.user.m_employee_id,
        updated_date: moment().format("DD/MM/YYYY")
      });
    }
  };

  onReject = () => {
    this.setState({ rejectModal: true });
  };

  submitReject = e => {
    e.preventDefault();

    if (isEmpty(this.state.reject_reason)) {
      this.setState({ errorReason: "This Field is Required!" });
    }

    if (!isEmpty(this.state.reject_reason)) {
      this.props.rejectDesign(this.props.code, {
        status: 0,
        reject_reason: this.state.reject_reason,
        updated_by: this.props.user.m_employee_id,
        updated_date: moment().format("DD/MM/YYYY")
      });
    }
  };

  onCancel = () => {
    window.location.href = "/design";
  };

  closeModal = () => {
    this.setState({ rejectModal: false, reject_reason: "", errorReason: "" });
  };

  render() {
    const { design, items, staff, code, title } = this.props;

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
                <Modal isOpen={this.state.rejectModal}>
                  <ModalHeader>
                    <div className="lead">Reject Design Request?</div>
                  </ModalHeader>
                  <ModalBody>
                    <form onSubmit={this.submitReject}>
                      <TextArea
                        label="Reject Reason"
                        name="reject_reason"
                        placeholder="Input Reject Reason"
                        onChange={this.onChange}
                        value={this.state.reject_reason}
                        errors={this.state.errorReason}
                      />
                      <div className="form-group text-right">
                        <input
                          type="submit"
                          className="btn btn-danger mr-2"
                          value="Reject"
                        />
                        <button
                          type="button"
                          className="btn btn-warning"
                          onClick={this.closeModal}
                        >
                          Close
                        </button>
                      </div>
                    </form>
                  </ModalBody>
                </Modal>
                <form>
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
                      <SelectListGroup
                        label="*Assign to"
                        placeholder="*Assign to"
                        name="assign_to"
                        value={this.state.assign_to}
                        options={staffOptions}
                        onChange={this.onChange}
                        errors={this.state.errorAssign}
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
                          {items.map((item, idx) => (
                            <tr key={idx}>
                              <td>
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="*Select Product"
                                    name="m_product_id"
                                    value={this.getProductName(
                                      item.m_product_id
                                    )}
                                    disabled={true}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder={this.getDescription(
                                      item.m_product_id
                                    )}
                                    disabled={true}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="form-group">
                                  <input
                                    type="text"
                                    name="title_item"
                                    value={item.title_item}
                                    className="form-control"
                                    placeholder="Type Title"
                                    disabled={true}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="form-group">
                                  <input
                                    type="text"
                                    placeholder="*Select PIC"
                                    className="form-control"
                                    name="request_pic"
                                    value={this.getRequester(item.request_pic)}
                                    disabled={true}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="form-group">
                                  <input
                                    type="date"
                                    className="form-control"
                                    placeholder="Due Date"
                                    name="request_due_date"
                                    value={item.request_due_date}
                                    disabled={true}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Start Date"
                                    disabled={true}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="End Date"
                                    disabled={true}
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="form-group">
                                  <input
                                    type="text"
                                    name="note"
                                    className="form-control"
                                    placeholder="Note"
                                    value={item.note}
                                    disabled={true}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="col-md-12 text-right">
                      <div className="form-group">
                        <button
                          type="button"
                          onClick={this.onApprove}
                          className="btn btn-primary mr-2"
                        >
                          Approved
                        </button>
                        <button
                          type="button"
                          onClick={this.onReject}
                          className="btn btn-danger  mr-2"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={this.onCancel}
                          className="btn btn-warning mr-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
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

DesignApprove.propTypes = {
  title: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  design: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  employee: PropTypes.array.isRequired,
  product: PropTypes.array.isRequired,
  staff: PropTypes.array.isRequired,
  requester: PropTypes.array.isRequired,
  approveDesign: PropTypes.func.isRequired,
  rejectDesign: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  { approveDesign, rejectDesign }
)(DesignApprove);
