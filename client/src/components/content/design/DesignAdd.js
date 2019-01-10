import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  getCode,
  getEvent,
  getProduct,
  getRequester,
  createDesign,
  createDesignItem,
  getAssignToName
} from "../../../actions/designAction";
import { CreateOutlined, DeleteOutlined } from "@material-ui/icons";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

// Form Components
import Spinner from "../../common/Spinner";
import TextFieldGroup from "../../common/TextFieldGroup";
import TextField from "../../common/TextField";
import TextAreaGroup from "../../common/TextAreaGroup";
import SelectListGroup from "../../common/SelectListGroup";
import SelectList from "../../common/SelectList";
// Form Validation
import isEmpty from "../../../validation/isEmpty";

class DesignAdd extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventCode: "",
      designTitle: "",
      note: "",
      items: [],
      deleteModal: false,
      errorEvent: "",
      errorTitle: "",
      employee: [],
      errorItem: ""
    };
  }

  componentDidMount() {
    this.props.getCode();
    this.props.getEvent();
    this.props.getProduct();
    this.props.getRequester();
    this.props.getAssignToName();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      employee: newProps.design.assign
    });
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

  getDescription(product_id) {
    let description = "";
    if (product_id !== "") {
      this.props.design.product.forEach(function(rows) {
        if (rows.code === product_id) {
          description = rows.description;
        }
      });
    } else {
      description = "Description";
    }
    return description;
  }

  handleAddItems = () => {
    this.setState({
      items: this.state.items.concat([
        {
          m_product_id: "",
          title_item: "",
          request_pic: "",
          request_due_date: "",
          note: "",
          readOnly: true,
          disabled: true,
          errorProduct: "",
          errorTitle: "",
          errorPIC: "",
          errorDueDate: ""
        }
      ]),
      errorItem: ""
    });
  };

  handleRemoveItems = index => () => {
    // Delete Items
    this.setState({
      items: this.state.items.filter((item, sidx) => index !== sidx)
    });
    // Close Dete Modal After Deleting it
    this.closeModal();
  };

  handleItemChange = idx => e => {
    const newItems = this.state.items.map((item, sidx) => {
      if (idx !== sidx) return item;

      // Clear Error State Message
      const errors = {};
      if (e.target.name === "m_product_id") {
        errors.errorProduct = "";
      }
      if (e.target.name === "title_item") {
        errors.errorTitle = "";
      }
      if (e.target.name === "request_pic") {
        errors.errorPIC = "";
      }
      if (e.target.name === "request_due_date") {
        errors.errorDueDate = "";
      }

      // Return Updated State
      return { ...item, ...errors, [e.target.name]: e.target.value };
    });

    this.setState({ items: newItems });
  };

  handleReadonly = idx => e => {
    const newItems = this.state.items.map((item, sidx) => {
      if (idx !== sidx) return item;

      return { ...item, readOnly: !item.readOnly, disabled: !item.disabled };
    });

    this.setState({ items: newItems });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    // Clear Error
    if (e.target.name === "eventCode") {
      this.setState({ errorEvent: "" });
    }
    if (e.target.name === "designTitle") {
      this.setState({ errorTitle: "" });
    }
  };

  handleRemoveModal = () => {
    this.setState({ deleteModal: true });
  };

  closeModal = () => {
    this.setState({
      deleteModal: false
    });
  };

  onSubmit = e => {
    e.preventDefault();

    // Design Form Validation
    if (isEmpty(this.state.eventCode)) {
      this.setState({ errorEvent: "This Field is Required!" });
    }
    if (isEmpty(this.state.designTitle)) {
      this.setState({ errorTitle: "This Field is Required!" });
    }

    // Design Item Form Validation
    // Set Error Counter
    let errorCounter = 0;
    this.state.items.forEach((item, idx) => {
      const items = this.state.items;
      // Check for Empty Product Name
      if (isEmpty(item.m_product_id)) {
        errorCounter += 1;
        items[idx].errorProduct = "This Field is Required!";
        this.setState({ items });
      }
      // Check for Empty Title
      if (isEmpty(item.title_item)) {
        errorCounter += 1;
        items[idx].errorTitle = "This Field is Required!";
        this.setState({ items });
      }
      // Check for Empty Request PIC
      if (isEmpty(item.request_pic)) {
        errorCounter += 1;
        items[idx].errorPIC = "This Field is Required!";
        this.setState({ items });
      }
      // Check for Empty Request PIC
      if (isEmpty(item.request_due_date)) {
        errorCounter += 1;
        items[idx].errorDueDate = "This Field is Required!";
        this.setState({ items });
      }
    });

    // Validate min one item to added
    if (this.state.items.length === 0) {
      this.setState({
        errorItem: "Add Minimal One Item to Save Design Request!"
      });
    }

    // Final Validation
    // Design Form & Design Item Form
    if (
      !isEmpty(this.state.eventCode) &&
      !isEmpty(this.state.designTitle) &&
      errorCounter === 0 &&
      this.state.items.length > 0
    ) {
      // contain inputed data  from state
      // for design item data
      const designItemData = [];
      this.state.items.forEach(item => {
        // Delete Some Property
        delete item.readOnly;
        delete item.disabled;
        delete item.errorDueDate;
        delete item.errorPIC;
        delete item.errorProduct;
        delete item.errorTitle;

        designItemData.push({
          ...item,
          t_design_id: this.props.design.code,
          is_delete: false,
          created_by: this.props.auth.user.m_employee_id,
          created_date: moment().format("DD/MM/YYYY")
        });
      });

      // contain inputed data from state
      // for design data
      const designData = {
        code: this.props.design.code,
        t_event_id: this.state.eventCode,
        title_header: this.state.designTitle,
        note: this.state.note,
        request_by: this.props.auth.user.m_employee_id,
        created_by: this.props.auth.user.m_employee_id
      };

      // Save Design & Design Item to Database
      this.props.createDesign(designData, this.props.history);
      if (designItemData.length > 0) {
        this.props.createDesignItem(designItemData, this.props.history);
      }
    }
  };

  render() {
    const { code, event, product, requester, assign } = this.props.design;
    const { user } = this.props.auth;

    // Set PIC Options
    const staffOptions = [];
    staffOptions.push({ label: "*Select PIC", value: "" });
    requester.map(list =>
      staffOptions.push({
        label: `${list.first_name} ${list.last_name}`,
        value: list.employee_number
      })
    );

    // Set Event Options
    const eventOptions = [];
    eventOptions.push({ label: "*Event Code", value: "" });
    event.map(list =>
      eventOptions.push({
        label: list.code,
        value: list.code
      })
    );

    // Set Product Options
    const productOptions = [];
    productOptions.push({ label: "*Select Product", value: "" });
    product.map(list =>
      productOptions.push({
        label: list.name,
        value: list.code
      })
    );

    // display and undisplay table design item form
    // based on items state length
    const display = this.state.items.length === 0 ? "none" : "table-row-group";
    const style = {
      display: display
    };

    if (
      Object.keys(user).length === 0 &&
      code.length === 0 &&
      event.length === 0 &&
      product.length === 0 &&
      requester.length === 0 &&
      assign.length === 0
    ) {
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
              <nav aria-label="breadcrumb mb-4">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/design">List Design</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Add New Design
                  </li>
                </ol>
              </nav>
              <div className="card border-info mb-3">
                <div className="card-header lead">Add New Design Request</div>
                <div className="card-body">
                  <form onSubmit={this.onSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <TextFieldGroup
                          label="*Transaction Code"
                          placeholder="Auto Generated"
                          name="code"
                          disabled={true}
                        />
                        <SelectListGroup
                          label="*Event Code"
                          placeholder="*Select Event"
                          name="eventCode"
                          value={this.state.eventCode}
                          onChange={this.onChange}
                          options={eventOptions}
                          errors={this.state.errorEvent}
                        />
                        <TextFieldGroup
                          label="*Design Title"
                          placeholder="Type Title"
                          name="designTitle"
                          value={this.state.designTitle}
                          onChange={this.onChange}
                          errors={this.state.errorTitle}
                        />
                      </div>
                      <div className="col-md-6">
                        <TextFieldGroup
                          label="*Request By"
                          name="request_by"
                          value={this.assignToName(user.m_employee_id)}
                          disabled={true}
                        />
                        <TextFieldGroup
                          label="*Request Date"
                          name="request_by"
                          placeholder={moment().format("DD/MM/YYYY")}
                          value={moment().format("DD/MM/YYYY")}
                          disabled={true}
                        />
                        <TextAreaGroup
                          label="Note"
                          placeholder="Type Note"
                          name="note"
                          cols="3"
                          value={this.state.note}
                          onChange={this.onChange}
                        />
                      </div>
                      <div className="col-md-12 mb-2 font-weigh-bold">
                        {this.state.errorItem !== "" && (
                          <div className="mt-2 alert alert-danger">
                            {this.state.errorItem}
                          </div>
                        )}
                      </div>
                      <div className="col-md-12 mb-4 form-inline">
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={this.handleAddItems}
                        >
                          Add Item
                        </button>
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
                                  <SelectList
                                    placeholder="*Select Product"
                                    name="m_product_id"
                                    options={productOptions}
                                    disabled={item.disabled}
                                    onChange={this.handleItemChange(idx)}
                                    errors={item.errorProduct}
                                  />
                                </td>
                                <td>
                                  <TextField
                                    className="form-control"
                                    placeholder={this.getDescription(
                                      item.m_product_id
                                    )}
                                    disabled={true}
                                  />
                                </td>
                                <td>
                                  <TextField
                                    name="title_item"
                                    placeholder="Type Title"
                                    value={item.title_item}
                                    readOnly={item.readOnly}
                                    onChange={this.handleItemChange(idx)}
                                    errors={item.errorTitle}
                                  />
                                </td>
                                <td>
                                  <SelectList
                                    name="request_pic"
                                    placeholder="*Select PIC"
                                    options={staffOptions}
                                    disabled={item.disabled}
                                    onChange={this.handleItemChange(idx)}
                                    errors={item.errorPIC}
                                  />
                                </td>
                                <td>
                                  <TextField
                                    type="date"
                                    name="request_due_date"
                                    min={moment().format("YYYY-MM-DD")}
                                    value={item.request_due_date}
                                    readOnly={item.readOnly}
                                    onChange={this.handleItemChange(idx)}
                                    errors={item.errorDueDate}
                                  />
                                </td>
                                <td>
                                  <TextField
                                    placeholder="Start Date"
                                    disabled={true}
                                  />
                                </td>
                                <td>
                                  <TextField
                                    placeholder="End Date"
                                    disabled={true}
                                  />
                                </td>
                                <td>
                                  <TextField
                                    name="note"
                                    placeholder="Note"
                                    value={item.note}
                                    readOnly={item.readOnly}
                                    onChange={this.handleItemChange(idx)}
                                  />
                                </td>
                                <td nowrap="true">
                                  <CreateOutlined
                                    color="primary"
                                    onClick={this.handleReadonly(idx)}
                                  />
                                  <DeleteOutlined
                                    color="primary"
                                    onClick={this.handleRemoveModal}
                                  />
                                  {/* Delete Design Items Modal */}
                                  <Modal isOpen={this.state.deleteModal}>
                                    <ModalHeader>
                                      <div className="lead">Delete Data?</div>
                                    </ModalHeader>
                                    <ModalBody>
                                      <form>
                                        <div className="form-group text-right">
                                          <button
                                            type="button"
                                            className="btn btn-primary mr-2"
                                            onClick={this.handleRemoveItems(
                                              idx
                                            )}
                                          >
                                            Delete
                                          </button>
                                          <button
                                            type="button"
                                            className="btn btn-default"
                                            onClick={this.closeModal}
                                          >
                                            Close
                                          </button>
                                        </div>
                                      </form>
                                    </ModalBody>
                                  </Modal>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="col-md-10">
                        <input
                          type="submit"
                          value="Submit"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

DesignAdd.propTypes = {
  getCode: PropTypes.func.isRequired,
  getEvent: PropTypes.func.isRequired,
  getProduct: PropTypes.func.isRequired,
  getRequester: PropTypes.func.isRequired,
  createDesign: PropTypes.func.isRequired,
  createDesignItem: PropTypes.func.isRequired,
  getAssignToName: PropTypes.func.isRequired,
  design: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  design: state.design,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    getCode,
    getEvent,
    getProduct,
    getRequester,
    createDesign,
    createDesignItem,
    getAssignToName
  }
)(DesignAdd);
