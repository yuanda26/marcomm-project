import React, { Component } from "react";
import PropTypes from "prop-types";
// Redux Actions
import { connect } from "react-redux";
// Forms Components
import TextFieldGroup from "../../common/TextFieldGroup";

class DesignRead extends Component {
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

  render() {
    const {
      design: { design },
      items,
      code,
      title
    } = this.props;
    const { status, message } = this.props.design;

    return (
      <div className="design-read">
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
                        <TextFieldGroup
                          label="*Assign to"
                          name="assign_to"
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
                        <TextFieldGroup
                          label="Note"
                          value={design.note}
                          disabled={true}
                        />
                      </div>
                      <div className="col-md-12">
                        {design.status === 0 && (
                          <div className="alert alert-danger">
                            <span className="font-weight-bold">
                              Reject Reason:{" "}
                            </span>
                            {design.reject_reason}
                          </div>
                        )}
                      </div>
                      <div className="col-md-12 form-inline">
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
                                      value={this.getRequester(
                                        item.request_pic
                                      )}
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

DesignRead.propTypes = {
  title: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  design: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  employee: PropTypes.array.isRequired,
  product: PropTypes.array.isRequired,
  requester: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  design: state.design
});

export default connect(
  mapStateToProps,
  {}
)(DesignRead);
