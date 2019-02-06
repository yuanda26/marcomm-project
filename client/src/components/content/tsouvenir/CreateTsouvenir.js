import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Button } from "reactstrap";
import { Alert } from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createTsouvenir } from "../../../actions/tsouvenirAction";
import { getAllSouvenir } from "../../../actions/souvenirAction";
import { getAllEmployee } from "../../../actions/tsouvenirAction";
import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaGroup from "../../common/TextAreaGroup";
import SelectListGroup from "../../common/SelectListGroup";
import SelectList from "../../common/SelectList";
import isEmpty from "../../../validation/isEmpty";
import { Delete, Create } from "@material-ui/icons";
import moment from "moment";

class CreateTsouvenir extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      received_by: "",
      received_date: "",
      note: "",
      item: [],
      alertData: {
        status: false,
        message: ""
      },
      labelWidth: 0,
      employee: [],
      userdata: {},
      souvenirOptions: []
    };

    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  componentDidMount() {
    this.props.getAllSouvenir();
    this.props.getAllEmployee();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      employee: newProps.employeeReducer.myEmployee,
      status: newProps.tsouvenirReducer.statusADD,
      userdata: newProps.auth.user,
      souvenirOptions: [{ label: "*Select Souvenir", value: "" }].concat(
        newProps.souvenirReducer.souvenirs.map(row => ({
          label: row.name,
          value: row.code
        }))
      )
    });
  }

  changeHandler(e) {
    if (e.target.name === "received_by") {
      this.setState({ errorReceivedBy: "" });
    }
    if (e.target.name === "received_date") {
      this.setState({ errorReceivedDate: "" });
    }

    // if (
    //   e.target.name === "received_date" &&
    //   moment(e.target.value) < moment().subtract(1, "day")
    // ) {
    //   this.setState({
    //     errorReceivedDate: "Received date must be after today"
    //   });
    // }

    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleShareholderItemChange = idx => event => {
    // Clear Error State Message
    const errors = {};
    if (event.target.name === "m_souvenir_id") {
      errors.errorSouvenir = "";
    }
    if (event.target.name === "qty") {
      errors.errorQty = "";
    }

    const newShareholders = this.state.item.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return {
        ...shareholder,
        ...errors,
        [event.target.name]: event.target.value
      };
    });
    this.setState({ item: newShareholders });
  };

  handleAddItem = () => {
    this.setState({
      item: this.state.item.concat([
        {
          m_souvenir_id: "",
          qty: "",
          note: "",
          created_by: this.state.userdata.m_employee_id,
          created_date: moment().format("YYYY-MM-DD"),
          disable: true,
          readOnly: true,
          errorSouvenir: "",
          errorQty: ""
        }
      ]),
      alertData: {
        status: false,
        message: ""
      }
    });
  };

  handleEditItem = idx => () => {
    const newShareholders = this.state.item.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return {
        ...shareholder,
        disable: !shareholder.disable,
        readOnly: !shareholder.readOnly
      };
    });

    this.setState({ item: newShareholders });
  };

  handleRemoveItem = idx => () => {
    this.setState({
      item: this.state.item.filter((s, sidx) => idx !== sidx)
    });
    this.closeModalRemoveItem();
  };

  validateDuplicateItem = input => {
    let duplicate = { status: false, index: null };
    input.forEach((content, i) => {
      input.forEach((element, index) => {
        if (element.m_souvenir_id === content.m_souvenir_id && i !== index)
          duplicate = { status: true, index: [index, i] };
      });
    });
    return duplicate;
  };

  submitHandler() {
    if (isEmpty(this.state.received_by)) {
      this.setState({ errorReceivedBy: "This Field is Required" });
    }
    if (isEmpty(this.state.received_date)) {
      this.setState({ errorReceivedDate: "This Field is Required" });
    }
    // if (moment(this.state.received_date) < moment().subtract(1, "day")) {
    //   this.setState({ errorReceivedDate: "Received date must be after today" });
    // }

    // Souvenir Item Form Validation
    // Set Error Counter
    let errorCounter = 0;
    this.state.item.forEach((item, idx) => {
      const items = this.state.item;
      // Check for Empty Souvenir Name
      if (isEmpty(item.m_souvenir_id)) {
        errorCounter += 1;
        items[idx].errorSouvenir = "This Field is Required!";
        this.setState({ items });
      }
      // Check for Empty Qty
      if (isEmpty(item.qty)) {
        errorCounter += 1;
        items[idx].errorQty = "This Field is Required!";
        this.setState({ items });
      }
      // Check for Positive Qty
      if (!isEmpty(item.qty) && item.qty <= 0) {
        errorCounter += 1;
        items[idx].errorQty = "Qty Must be Positive!";
        this.setState({ items });
      }
      // Check Duplicate Item
      if (this.validateDuplicateItem(this.state.item).status === true) {
        let a = this.validateDuplicateItem(this.state.item).index[0];
        let b = this.validateDuplicateItem(this.state.item).index[1];
        errorCounter += 1;
        items[a].errorSouvenir = "Can't Add Same Item Twice!";
        items[b].errorSouvenir = "Can't Add Same Item Twice!";
        this.setState({ items });
      }
    });

    // Validate min one item to added
    if (this.state.item.length === 0) {
      this.setState({
        alertData: {
          status: true,
          message: "Add minimal one item!"
        }
      });
    }

    if (
      !isEmpty(this.state.received_by) &&
      !isEmpty(this.state.received_date) &&
      //!moment(this.state.received_date) < moment().subtract(1, "day") &&
      this.state.item.length > 0 &&
      //duplicateItem === false &&
      errorCounter === 0
    ) {
      const formdata = {
        code: this.state.code,
        received_by: this.state.received_by,
        received_date: this.state.received_date,
        note: this.state.note,
        created_by: this.state.userdata.m_employee_id
      };
      let dataItem = this.state.item.map((content, index) => {
        return {
          m_souvenir_id: content.m_souvenir_id,
          qty: parseInt(content.qty),
          note: content.note,
          created_by: content.created_by,
          created_date: content.created_date,
          is_delete: false
        };
      });
      let datas = [formdata, dataItem];
      this.props.createTsouvenir(datas, this.props.modalStatus);
      this.props.closeHandler();
      setTimeout(() => {
        this.setState({
          code: "",
          received_by: "",
          received_date: "",
          note: "",
          item: []
        });
      }, 1000);
    }
  }

  handleRemoveModal = () => {
    this.setState({ deleteModal: true });
  };

  closeModalRemoveItem = () => {
    this.setState({
      deleteModal: false
    });
  };

  closeModalCreate = () => {
    this.props.closeHandler();
    this.setState({
      code: "",
      received_by: "",
      received_date: "",
      note: "",
      errorReceivedBy: "",
      errorReceivedDate: "",
      item: []
    });
  };

  render() {
    const employeeOptions = [];
    employeeOptions.push({ label: "*Select Received By", value: "" });
    this.state.employee.forEach(row => {
      employeeOptions.push({
        value: row.employee_number,
        label: row.first_name + " " + row.last_name
      });
    });

    // display and undisplay table design item form
    // based on items state length
    const display = this.state.item.length === 0 ? "none" : "table-row-group";
    const style = {
      display: display
    };
    return (
      <Modal
        isOpen={this.props.create}
        className={this.props.className}
        size="lg"
      >
        <ModalHeader> Add Souvenir</ModalHeader>
        <ModalBody>
          {this.state.alertData.status === true && (
            <Alert color="danger">{this.state.alertData.message} </Alert>
          )}
          <form>
            <TextFieldGroup
              label="*Transaction Code"
              placeholder="Auto Generated"
              name="code"
              disabled={true}
            />
            <SelectListGroup
              label="*Received By"
              placeholder="*Select Received By"
              name="received_by"
              value={this.state.received_by}
              onChange={this.changeHandler}
              options={employeeOptions}
              errors={this.state.errorReceivedBy}
            />
            <TextFieldGroup
              label="*Received Date"
              type="date"
              placeholder="Type Received Date"
              name="received_date"
              value={this.state.received_date}
              onChange={this.changeHandler}
              errors={this.state.errorReceivedDate}
            />
            <TextAreaGroup
              label="Notes"
              placeholder="Type Notes"
              name="note"
              value={this.state.note}
              onChange={this.changeHandler}
              maxLength="255"
            />
          </form>
          <div className="col-md-12 mb-4 form-inline">
            <button
              className="btn btn-primary"
              type="button"
              onClick={this.handleAddItem}
            >
              Add Item
            </button>
            <table className="table table-responsive mt-2 mb-2">
              <thead style={style}>
                <tr className="text-center">
                  <th>Souvenir</th>
                  <th>Qty</th>
                  <th>Note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.item.map((shareholder, idx) => (
                  <tr>
                    <td>
                      <SelectList
                        name="m_souvenir_id"
                        value={shareholder.m_souvenir_id}
                        onChange={this.handleShareholderItemChange(idx)}
                        disabled={shareholder.disable}
                        options={this.state.souvenirOptions}
                        errors={shareholder.errorSouvenir}
                      />
                    </td>
                    <td>
                      <TextFieldGroup
                        type="number"
                        name="qty"
                        min="0"
                        onChange={this.handleShareholderItemChange(idx)}
                        value={shareholder.qty}
                        errors={shareholder.errorQty}
                        disabled={shareholder.disable}
                      />
                    </td>
                    <td>
                      <TextFieldGroup
                        type="text"
                        name="note"
                        onChange={this.handleShareholderItemChange(idx)}
                        value={shareholder.note}
                        readOnly={shareholder.readOnly}
                        disabled={shareholder.disable}
                      />
                    </td>
                    <td>
                      <Create
                        className="mr-1"
                        onClick={this.handleEditItem(idx)}
                        size="small"
                      />
                      <Delete onClick={this.handleRemoveModal} size="small" />
                      {/* Delete Design Items Modal */}
                      <Modal isOpen={this.state.deleteModal}>
                        <ModalHeader>
                          <div className="lead">Delete Item?</div>
                        </ModalHeader>
                        <ModalBody>
                          <form>
                            <div className="form-group text-right">
                              <button
                                type="button"
                                className="btn btn-primary mr-2"
                                onClick={this.handleRemoveItem(idx)}
                              >
                                Delete
                              </button>
                              <button
                                type="button"
                                className="btn btn-default"
                                onClick={this.closeModalRemoveItem}
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
        </ModalBody>
        <ModalFooter>
          <Button
            variant="contained"
            color="primary"
            onClick={this.submitHandler}
          >
            Save
          </Button>
          <Button
            color="warning"
            variant="contained"
            onClick={this.closeModalCreate}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

CreateTsouvenir.propTypes = {
  createTsouvenir: PropTypes.func.isRequired,
  getAllSouvenir: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  souvenirReducer: state.souvenir,
  employeeReducer: state.employee,
  tsouvenirReducer: state.tsouvenirIndexReducer,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    createTsouvenir,
    getAllSouvenir,
    getAllEmployee
  }
)(CreateTsouvenir);
