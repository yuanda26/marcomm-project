import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getDesign,
  getItems,
  getEvent,
  getProduct,
  getRequester,
  getAssignToName,
  updateDesign,
  updateDesignItem,
  uploadFiles
} from "../../../actions/designAction";
// Form Components
import Spinner from "../../common/Spinner";
import TextFieldGroup from "../../common/TextFieldGroup";
import TextField from "../../common/TextField";
import TextArea from "../../common/TextArea";
import isEmpty from "../../../validation/isEmpty";

class DesignClose extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      eventCode: "",
      designTitle: "",
      request_by: "",
      request_date: "",
      note: "",
      items: [],
      employee: [],
      requester: []
    };
  }

  componentDidMount() {
    if (this.props.match.params.code) {
      this.props.getDesign(this.props.match.params.code);
      this.props.getItems(this.props.match.params.code);
    }
    this.props.getEvent();
    this.props.getProduct();
    this.props.getRequester();
    this.props.getAssignToName();
  }

  componentWillReceiveProps(props, state) {
    const newItems = [];
    props.design.items.map(item =>
      newItems.push({
        ...item,
        uploads: "",
        errorStartDate: "",
        errorEndDate: "",
        errorUploads: ""
      })
    );

    this.setState({
      items: newItems,
      code: props.design.design.code,
      eventCode: props.design.design.t_event_id,
      designTitle: props.design.design.title_header,
      request_by: props.design.design.request_by,
      request_date: props.design.design.request_date,
      note: props.design.design.note,
      employee: props.design.assign,
      requester: props.design.requester
    });
  }

  // function to get product description
  getDescription(product_id) {
    let description = "";
    if (product_id !== "") {
      this.props.design.product.forEach(rows => {
        if (rows.code === product_id) {
          description = rows.description;
        }
      });
    } else {
      description = "Description";
    }

    return description;
  }

  // function to get design status
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

  // Get Employee Name
  assignToName(employeeNumber) {
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

  // Get Requester Name
  getRequesterName(employeeNumber) {
    let employeeName = "";
    this.state.requester.forEach(staff => {
      if (staff.employee_number === employeeNumber) {
        employeeName = staff.first_name + " " + staff.last_name;
      }
    });

    return employeeName;
  }

  handleItemChange = idx => e => {
    const newItems = this.state.items.map((item, sidx) => {
      if (idx !== sidx) return item;

      // Clear Error State Message
      const errors = {};
      if (e.target.name === "start_date") {
        errors.errorStartDate = "";
      }
      if (e.target.name === "end_date") {
        errors.errorEndDate = "";
      }
      if (e.target.name === "uploads") {
        errors.errorUploads = "";
      }

      return { ...item, ...errors, [e.target.name]: e.target.value };
    });

    this.setState({ items: newItems });
  };

  handleUploadFiles = idx => e => {
    const newItems = this.state.items.map((item, sidx) => {
      if (idx !== sidx) return item;

      return { ...item, [e.target.name]: e.target.files[0] };
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

      // Check for Empty Start Date
      if (isEmpty(item.start_date)) {
        errorCounter += 1;
        items[idx].errorStartDate = "This Field is Required!";
        this.setState({ items });
      }
      // Check for Empty End Date
      if (isEmpty(item.end_date)) {
        errorCounter += 1;
        items[idx].errorEndDate = "This Field is Required!";
        this.setState({ items });
      }
      // Check for Empty Upload File
      if (isEmpty(item.uploads)) {
        errorCounter += 1;
        items[idx].errorUploads = "This Field is Required!";
        this.setState({ items });
      }
    });

    // Final Validation
    // Design Form & Design Item Form
    if (errorCounter !== 0) {
      // contain Original Data before being updated
      const originalData = [];
      this.props.design.items.map(item => originalData.push({ ...item }));

      // contain updated items
      const designItemUpdate = [];
      const uploadItem = [];

      this.state.items.forEach((item, index) => {
        if (JSON.stringify(item) !== JSON.stringify(originalData[index])) {
          if (item.uploads) {
            uploadItem.push(item.uploads);
          }
          // Delete Some Property
          delete item.errorStartDate;
          delete item.errorEndDate;
          delete item.errorUploads;
          delete item.uploads;

          designItemUpdate.push({
            ...item,
            updated_by: this.props.auth.user.m_employee_id,
            updated_date: moment().format("DD/MM/YYYY")
          });
        }
      });

      // contain inputed data from state
      // for design data
      const designData = {
        status: 3,
        updated_by: this.props.auth.user.m_employee_id,
        updated_date: moment().format("DD/MM/YYYY")
      };

      // Upload Files & Close Design Request Data
      const formdata = new FormData();
      const closeData = [];

      uploadItem.forEach(item => {
        formdata.append("uploads", item);
        closeData.push({
          filename: item.name,
          size: item.size,
          extention: item.type,
          is_delete: false,
          created_by: this.props.auth.user.m_employee_id,
          created_date: moment().format("DD/MM/YYYY")
        });
      });

      this.props.uploadFiles(formdata);
      // console.log(formdata);
      console.log(closeData);
      // console.log(designItemUpdate);
      // console.log(designData);

      // Save Updated Design, Design Item & New Design Item to Database
      // this.props.updateDesign(this.state.code, designData, this.props.history);
      // this.props.updateDesignItem(designItemUpdate, this.props.history);
    }
  };

  render() {
    const { design, event, product, requester, assign } = this.props.design;
    const { user } = this.props.auth;

    // display and undisplay table design item form
    // based on items state length
    const display = this.state.items.length === 0 ? "none" : "table-row-group";
    const style = {
      display: display
    };

    let updateForm;

    if (
      design === null &&
      event === null &&
      product === null &&
      requester === null &&
      user === null &&
      assign === null
    ) {
      updateForm = <Spinner />;
    } else {
      updateForm = (
        <form encType="multipart/form-data" onSubmit={this.onSubmit}>
          <div className="row">
            <div className="col-md-6">
              <TextFieldGroup
                label="*Transaction Code"
                value={this.state.code}
                disabled={true}
              />
              <TextFieldGroup
                label="*Event Code"
                value={this.state.eventCode}
                disabled={true}
              />
              <TextFieldGroup
                label="*Design Title"
                value={this.state.designTitle}
                disabled={true}
              />
              <TextFieldGroup
                label="*Status"
                value={this.designStatus(design.status)}
                disabled={true}
              />
            </div>
            <div className="col-md-6">
              <TextFieldGroup
                label="*Request By"
                value={this.assignToName(this.state.request_by)}
                disabled={true}
              />
              <TextFieldGroup
                label="*Request Date"
                value={this.state.request_date}
                disabled={true}
              />
              <TextArea label="Note" value={this.state.note} disabled={true} />
            </div>
            <div className="col-md-12 mb-4 form-inline">
              <table className="table table-responsive mt-2 mb-2">
                <thead style={style}>
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
                        <TextField value={item.m_product_id} disabled={true} />
                      </td>
                      <td>
                        <TextField
                          value={this.getDescription(item.m_product_id)}
                          disabled={true}
                        />
                      </td>
                      <td>
                        <TextField value={item.title_item} disabled={true} />
                      </td>
                      <td>
                        <TextField
                          value={this.getRequesterName(item.request_pic)}
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
                          onChange={this.handleItemChange(idx)}
                          errors={item.errorStartDate}
                        />
                      </td>
                      <td>
                        <TextField
                          type="date"
                          name="end_date"
                          min={moment().format("YYYY-MM-DD")}
                          onChange={this.handleItemChange(idx)}
                          errors={item.errorEndDate}
                        />
                      </td>
                      <td>
                        <TextField value={item.note} disabled={true} />
                      </td>
                      <td nowrap="true">
                        <input
                          type="file"
                          name="uploads"
                          onChange={this.handleUploadFiles(idx)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-md-10">
              <input
                type="submit"
                value="Close Request"
                className="btn btn-info btn-block mt-1"
              />
            </div>
            <div className="col-md-2">
              <Link to="/design">
                <button
                  className="btn btn-default btn-block mt-1"
                  type="button"
                >
                  Cancel
                </button>
              </Link>
            </div>
          </div>
        </form>
      );
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <nav aria-label="breadcrumb mb-4">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/design">List Design</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  Close Request
                </li>
              </ol>
            </nav>
            <div className="card border-info mb-3">
              <div className="card-header lead">
                Close Design Request: {design.code}
              </div>
              <div className="card-body">{updateForm}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DesignClose.propTypes = {
  getDesign: PropTypes.func.isRequired,
  getItems: PropTypes.func.isRequired,
  getEvent: PropTypes.func.isRequired,
  getProduct: PropTypes.func.isRequired,
  getRequester: PropTypes.func.isRequired,
  updateDesign: PropTypes.func.isRequired,
  updateDesignItem: PropTypes.func.isRequired,
  getAssignToName: PropTypes.func.isRequired,
  design: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  uploadFiles: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  design: state.design,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    getDesign,
    getItems,
    getEvent,
    getProduct,
    getRequester,
    getAssignToName,
    updateDesign,
    updateDesignItem,
    uploadFiles
  }
)(DesignClose);
