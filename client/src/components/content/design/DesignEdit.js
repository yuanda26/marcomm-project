import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { connect } from "react-redux";
import {
  getDesign,
  getItems,
  getEvent,
  getProduct,
  getRequester,
  getAssignToName,
  createDesign,
  createDesignItem,
  updateDesign,
  updateDesignItem
} from "../../../actions/designAction";
import { CreateOutlined, DeleteOutlined } from "@material-ui/icons";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
// Design Components
import DesignRead from "./DesignRead";
// Form Components
import Spinner from "../../common/Spinner";
import TextFieldGroup from "../../common/TextFieldGroup";
import TextField from "../../common/TextField";
import TextAreaGroup from "../../common/TextAreaGroup";
import SelectList from "../../common/SelectList";
import SelectListGroup from "../../common/SelectListGroup";
import isEmpty from "../../../validation/isEmpty";

class DesignEdit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      code: "",
      eventCode: "",
      designTitle: "",
      note: "",
      request_by: "",
      request_date: "",
      items: [],
      deleted: [],
      deleteModal: false,
      errorEvent: "",
      errorTitle: "",
      errorItem: "",
      employee: [],
      currentItemId: ""
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

  UNSAFE_componentWillReceiveProps(props, state) {
    const newItems = [];
    props.design.items.map(item =>
      newItems.push({
        ...item,
        disabled: true,
        errorProduct: "",
        errorTitle: "",
        errorPIC: "",
        errorDueDate: ""
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
      employee: props.design.assign
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

  handleAddItems = () => {
    this.setState({
      items: this.state.items.concat([
        {
          _id: false,
          m_product_id: "",
          title_item: "",
          request_pic: "",
          request_due_date: "",
          note: "",
          is_delete: false,
          created_by: this.props.user.m_employee_id,
          created_date: moment().format("DD/MM/YYYY"),
          disabled: true,
          errorProduct: "",
          errorTitle: "",
          errorPIC: "",
          errorDueDate: ""
        }
      ])
    });
  };

  handleRemoveModal = itemId => e => {
    e.preventDefault();
    this.setState({ deleteModal: true, currentItemId: itemId });
  };

  closeModal = () => {
    this.setState({
      deleteModal: false
    });
  };

  handleRemoveItems = id => () => {
    // set is_delete property to true
    this.state.items.forEach(item => {
      if (item._id === id) {
        const items = this.state.items;
        items[this.state.currentItemId].is_delete = true;
        // Force Update Items State Property
        this.forceUpdate();
        // replace deleted item from items state to deleted state
        this.setState({
          deleted: this.state.deleted.concat([{ item }])
        });
      }
    });

    // Updating Items State
    this.setState({
      items: this.state.items.filter(item => item.is_delete === false)
    });
    // Close Modal After Removing & Updating State
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

      return { ...item, ...errors, [e.target.name]: e.target.value };
    });

    this.setState({ items: newItems });
  };

  handleDisabled = idx => e => {
    e.preventDefault();
    const newItems = this.state.items.map((item, sidx) => {
      if (idx !== sidx) return item;

      return { ...item, disabled: !item.disabled };
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
        errorItem: "Add Minimal One Item to Update Design Request!"
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
      // contain Original Data before being updated
      const originalData = [];
      this.props.design.items.map(item => originalData.push({ ...item }));

      // contain updated items
      const designItemUpdate = [];
      this.state.items.forEach((item, index) => {
        if (JSON.stringify(item) !== JSON.stringify(originalData[index])) {
          if (item._id !== false) {
            // Delete Some Property
            delete item.disabled;
            delete item.errorDueDate;
            delete item.errorPIC;
            delete item.errorProduct;
            delete item.errorTitle;

            designItemUpdate.push({
              ...item,
              updated_by: this.props.user.m_employee_id,
              updated_date: moment().format("DD/MM/YYYY")
            });
          }
        }
      });

      // contain new added item
      const designItemNew = [];
      this.state.items.forEach(item => {
        if (item._id === false) {
          // Delete Some Property
          delete item.disabled;
          delete item.errorDueDate;
          delete item.errorPIC;
          delete item.errorProduct;
          delete item.errorTitle;
          // push new added item
          designItemNew.push({ ...item, t_design_id: this.state.code });
        }
      });

      // contain deleted items
      const designItemDelete = [];
      this.state.deleted.forEach(rows => {
        designItemDelete.push({
          _id: rows.item._id,
          is_delete: true,
          updated_by: this.props.user.m_employee_id,
          updated_date: moment().format("DD/MM/YYYY")
        });
      });

      // combine deleted item to updated item
      designItemDelete.forEach(item => {
        if (item._id !== false) {
          return designItemUpdate.push({ ...item });
        }
      });

      // contain inputed data from state
      // for design data
      const designData = {
        t_event_id: this.state.eventCode,
        title_header: this.state.designTitle,
        note: this.state.note,
        updated_by: this.props.user.m_employee_id,
        updated_date: moment().format("DD/MM/YYYY")
      };

      // Save Updated Design, Design Item & New Design Item to Database
      // Create new Design Item when it's length greater than 0
      if (designItemNew.length > 0) {
        const newItem = [];
        // remove _id before send it to the database
        designItemNew.forEach(item => {
          delete item._id;
          newItem.push({ ...item });
        });
        // Save New Item to Database
        this.props.createDesignItem(newItem);
      }
      // Update Design Item when it's length greater than 0
      if (designItemUpdate.length > 0) {
        this.props.updateDesignItem(designItemUpdate);
      }
      // Update Design Data
      this.props.updateDesign(this.state.code, designData);
    }
  };

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

  render() {
    const {
      design,
      items,
      event,
      product,
      requester,
      assign,
      designStatus,
      designMessage,
      itemsStatus,
      itemsMessage
    } = this.props.design;
    const user = this.props.user;
    const { code } = this.props.match.params;

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
      Object.keys(design).length === 0 &&
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
      if (design.status === 0 || design.status === 2 || design.status === 3) {
        return (
          <DesignRead
            title={this.pageTitle(design.status)}
            code={code}
            design={design}
            items={items}
            product={product}
            requester={requester}
            employee={assign}
          />
        );
      } else {
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
                      Edit Design Request
                    </li>
                  </ol>
                </nav>
                {/* Alert Messages */}
                {designStatus === 2 && (
                  <div className="alert alert-success">
                    <span className="font-weight-bold">Data Updated! </span>
                    {designMessage}
                  </div>
                )}
                {itemsStatus === 1 && (
                  <div className="alert alert-success">
                    <span className="font-weight-bold">Data Saved! </span>
                    {itemsMessage}
                  </div>
                )}
                <div className="card border-info mb-3">
                  <div className="card-header lead">
                    Edit Design Request: {design.code}
                  </div>
                  <div className="card-body">
                    <form onSubmit={this.onSubmit}>
                      <div className="row">
                        <div className="col-md-6">
                          <TextFieldGroup
                            label="*Transaction Code"
                            name="code"
                            value={this.state.code}
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
                          <TextFieldGroup
                            label="*Status"
                            name="designStatus"
                            value={this.designStatus(design.status)}
                            disabled={true}
                          />
                        </div>
                        <div className="col-md-6">
                          <TextFieldGroup
                            label="*Request By"
                            name="request_by"
                            value={this.assignToName(this.state.request_by)}
                            disabled={true}
                          />
                          <TextFieldGroup
                            label="*Request Date"
                            name="request_date"
                            value={this.state.request_date}
                            disabled={true}
                          />
                          <TextAreaGroup
                            label="Note"
                            rows="3"
                            placeholder="Type Note"
                            name="note"
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
                          <div className="table-responsive">
                            <table className="table table-striped mt-2 mb-2">
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
                                        value={item.m_product_id}
                                        options={productOptions}
                                        disabled={item.disabled}
                                        onChange={this.handleItemChange(idx)}
                                        errors={item.errorProduct}
                                      />
                                    </td>
                                    <td>
                                      <TextField
                                        placeholder={this.getDescription(
                                          item.m_product_id
                                        )}
                                        disabled={true}
                                      />
                                    </td>
                                    <td>
                                      <TextField
                                        placeholder="Type Title"
                                        name="title_item"
                                        value={item.title_item}
                                        disabled={item.disabled}
                                        onChange={this.handleItemChange(idx)}
                                        errors={item.errorTitle}
                                      />
                                    </td>
                                    <td>
                                      <SelectList
                                        placeholder="*Select PIC"
                                        name="request_pic"
                                        value={item.request_pic}
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
                                        disabled={item.disabled}
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
                                        disabled={item.disabled}
                                        onChange={this.handleItemChange(idx)}
                                      />
                                    </td>
                                    <td nowrap="true">
                                      <a href="#!">
                                        <CreateOutlined
                                          color="primary"
                                          onClick={this.handleDisabled(idx)}
                                        />
                                      </a>
                                      <a href="#!">
                                        <DeleteOutlined
                                          color="primary"
                                          onClick={this.handleRemoveModal(idx)}
                                        />
                                      </a>
                                      {/* Delete Design Modal */}
                                      <Modal isOpen={this.state.deleteModal}>
                                        <ModalHeader>
                                          <div className="lead">
                                            Delete Data?
                                          </div>
                                        </ModalHeader>
                                        <ModalBody>
                                          <form>
                                            <div className="form-group text-right">
                                              <button
                                                type="button"
                                                className="btn btn-primary mr-2"
                                                onClick={this.handleRemoveItems(
                                                  item._id
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
                        </div>
                        <div className="col-md-10">
                          <input
                            type="submit"
                            value="Update"
                            className="btn btn-info btn-block mt-1"
                          />
                        </div>
                        <div className="col-md-2">
                          <a href="/design">
                            <button
                              className="btn btn-default btn-block mt-1"
                              type="button"
                            >
                              Cancel
                            </button>
                          </a>
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
}

DesignEdit.propTypes = {
  getDesign: PropTypes.func.isRequired,
  getItems: PropTypes.func.isRequired,
  getEvent: PropTypes.func.isRequired,
  getProduct: PropTypes.func.isRequired,
  getRequester: PropTypes.func.isRequired,
  createDesign: PropTypes.func.isRequired,
  createDesignItem: PropTypes.func.isRequired,
  updateDesign: PropTypes.func.isRequired,
  updateDesignItem: PropTypes.func.isRequired,
  getAssignToName: PropTypes.func.isRequired,
  design: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  design: state.design,
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  {
    getDesign,
    getItems,
    getEvent,
    getProduct,
    getRequester,
    createDesign,
    createDesignItem,
    updateDesign,
    updateDesignItem,
    getAssignToName
  }
)(DesignEdit);
