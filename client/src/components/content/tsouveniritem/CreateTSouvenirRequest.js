import React from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Button } from "reactstrap";
import { Alert } from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Delete, Create } from "@material-ui/icons";
import {
  createTSouvenirItem,
  getEvent
} from "../../../actions/tsouveniritemAction";
import { getAllSouvenir } from "../../../actions/souvenirAction";
import moment from "moment";
import SelectList from "../../common/SelectList";
import SelectListGroup from "../../common/SelectListGroup";
import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaGroup from "../../common/TextAreaGroup";
import isEmpty from "../../../validation/isEmpty";

class CreateTsouveniritem extends React.Component {
  componentDidMount() {
    this.props.getAllSouvenir();
    this.props.getEvent();
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      souvenir: newProps.souvenirReducer.souvenirs,
      eventcode: newProps.teventReducer.myEvent,
      status: newProps.tsouveniritemReducer.statusADD,
      userdata: newProps.auth.user
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      code: "",
      event_code: "",
      due_date: "",
      note: "",
      shareholders: [],
      alertData: {
        status: false,
        message: ""
      },
      status: "",
      labelWidth: 0,
      selectedEvent: "",
      eventcode: [], //eventcode get from t_event
      souvenir: [], //souvenir get from m_souvenir
      userdata: {}
    };

    this.submitHandler = this.submitHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
  }

  changeHandler(e) {
    if (e.target.name === "event_code") {
      this.setState({ errorEventCode: "" });
    }
    if (e.target.name === "due_date") {
      this.setState({ errorRequestDueDate: "" });
    }

    if (
      e.target.name === "due_date" &&
      moment(e.target.value) < moment().subtract(1, "day")
    ) {
      this.setState({
        errorRequestDueDate: "Due date must be after request date"
      });
    }

    this.setState({
      [e.target.name]: e.target.value,
      alertData: {
        status: false,
        message: ""
      }
    });
  }

  handleShareholderItemChange = idx => evt => {
    // Clear Error State Message
    const errors = {};
    if (evt.target.name === "m_souvenir_id") {
      errors.errorSouvenir = "";
    }
    if (evt.target.name === "qty") {
      errors.errorQty = "";
    }

    const newShareholders = this.state.shareholders.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return { ...shareholder, ...errors, [evt.target.name]: evt.target.value };
    });
    this.setState({ shareholders: newShareholders });
  };

  handleAddItem = () => {
    this.setState({
      shareholders: this.state.shareholders.concat([
        {
          m_souvenir_id: "",
          qty: "",
          note: "",
          created_by: this.state.userdata.m_employee_id,
          created_date: moment().format("YYYY-MM-DD"),
          is_delete: false,
          readonly: true,
          disable: true,
          errorSouvenir: "",
          errorQty: ""
        }
      ])
    });
  };

  handleRemoveShareholder = idx => () => {
    this.setState({
      shareholders: this.state.shareholders.filter((s, sidx) => idx !== sidx)
    });
    this.closeModalRemoveItem();
  };

  handleEditButtonShareholder = idx => evt => {
    const newShareholders = this.state.shareholders.map((shareholder, sidx) => {
      if (idx !== sidx) return shareholder;
      return {
        ...shareholder,
        readonly: !shareholder.readonly,
        disable: !shareholder.disable
      };
    });

    this.setState({ shareholders: newShareholders });
  };

  handleChange1 = selectedOption => {
    this.setState({
      selectedOption,
      selectedEventCode: selectedOption.value
    });
  };

  handleChange2 = selectedOption2 => {
    this.setState({
      selectedOption2,
      selectedSouvenir: selectedOption2
    });
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
    if (isEmpty(this.state.event_code)) {
      this.setState({ errorEventCode: "This Field is Required" });
    }
    if (isEmpty(this.state.due_date)) {
      this.setState({ errorRequestDueDate: "This Field is Required" });
    }

    // Souvenir Item Form Validation
    // Set Error Counter
    let errorCounter = 0;
    this.state.shareholders.forEach((item, idx) => {
      const items = this.state.shareholders;
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
      if (this.validateDuplicateItem(this.state.shareholders).status === true) {
        let a = this.validateDuplicateItem(this.state.shareholders).index[0];
        let b = this.validateDuplicateItem(this.state.shareholders).index[1];
        errorCounter += 1;
        items[a].errorSouvenir = "Can't Add Same Item Twice!";
        items[b].errorSouvenir = "Can't Add Same Item Twice!";
        this.setState({ items });
      }
    });

    // Validate min one item to added
    if (this.state.shareholders.length === 0) {
      this.setState({
        alertData: {
          status: true,
          message: "Add minimal one item!"
        }
      });
    }

    if (
      !isEmpty(this.state.event_code) &&
      !isEmpty(this.state.due_date) &&
      !moment(this.state.due_date) < moment().subtract(1, "day") &&
      this.state.shareholders.length > 0 &&
      //duplicateItem === false &&
      errorCounter === 0
    ) {
      const formdata = {
        code: this.state.code,
        t_event_id: this.state.event_code,
        request_by: this.state.userdata.m_employee_id,
        request_date: moment().format("YYYY-MM-DD"),
        request_due_date: this.state.due_date,
        status: 1,
        note: this.state.note,
        created_by: this.state.userdata.m_employee_id,
        created_date: moment().format("YYYY-MM-DD")
      };
      let items = this.state.shareholders.map((content, index) => {
        return {
          m_souvenir_id: content.m_souvenir_id,
          qty: parseInt(content.qty),
          note: content.note,
          created_by: content.created_by,
          created_date: content.created_date,
          is_delete: false
        };
      });
      let datas = [formdata, items];
      this.props.createTSouvenirItem(datas, this.props.modalStatus);
      this.props.closeHandler();
      setTimeout(() => {
        this.setState({
          code: "",
          event_code: "",
          due_date: "",
          note: "",
          shareholders: []
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
      event_code: "",
      due_date: "",
      note: "",
      errorEventCode: "",
      errorRequestDate: "",
      errorRequestDueDate: "",
      shareholders: []
    });
  };

  render() {
    const EventOptions = [];
    EventOptions.push({ label: "Select Event Code", value: "" });
    this.state.eventcode.forEach(row => {
      EventOptions.push({
        value: row.code,
        label: row.event_name
      });
    });

    const SouvenirOptions = [];
    SouvenirOptions.push({ label: "Select Souvenir", value: "" });
    this.state.souvenir.forEach(row => {
      SouvenirOptions.push({
        value: row.code,
        label: row.name
      });
    });

    // display and undisplay table design item form
    // based on items state length
    const display =
      this.state.shareholders.length === 0 ? "none" : "table-row-group";
    const style = {
      display: display
    };

    return (
      <Modal
        isOpen={this.props.create}
        className={this.props.className}
        size="lg"
      >
        <ModalHeader> Add Souvenir Request </ModalHeader>
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
              label="*Event Code"
              placeholder="*Select Event Code"
              name="event_code"
              value={this.state.event_code}
              onChange={this.changeHandler}
              options={EventOptions}
              errors={this.state.errorEventCode}
            />
            <TextFieldGroup
              label="*Request By"
              placeholder={this.state.userdata.m_employee_id}
              name="request_by"
              value={this.state.userdata.m_employee_id}
              onChange={this.changeHandler}
              errors={this.state.errorEventCode}
              disabled={true}
            />
            <TextFieldGroup
              label="*Request Date"
              type="text"
              placeholder="Type Request Date"
              name="request_date"
              value={moment().format("DD/MM/YYYY")}
              onChange={this.changeHandler}
              errors={this.state.errorRequestDate}
              disabled={true}
            />
            <TextFieldGroup
              label="*Request Due Date"
              type="date"
              placeholder="Type Request Due Date"
              name="due_date"
              value={this.state.request_due_date}
              onChange={this.changeHandler}
              errors={this.state.errorRequestDueDate}
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
                {this.state.shareholders.map((shareholder, idx) => (
                  <tr>
                    <td>
                      <SelectList
                        name="m_souvenir_id"
                        value={shareholder.m_souvenir_id}
                        onChange={this.handleShareholderItemChange(idx)}
                        disabled={shareholder.disable}
                        options={SouvenirOptions}
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
                        onClick={this.handleEditButtonShareholder(idx)}
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
                                onClick={this.handleRemoveShareholder(idx)}
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
          <Button variant="contained" onClick={this.closeModalCreate}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

CreateTsouveniritem.propTypes = {
  classes: PropTypes.object.isRequired,
  createTSouvenirItem: PropTypes.func.isRequired,
  getAllSouvenir: PropTypes.func.isRequired,
  getEvent: PropTypes.func.isRequired,
  tsouveniritemReducer: PropTypes.object.isRequired,
  souvenir: PropTypes.object.isRequired,
  tevent: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  tsouveniritemReducer: state.tsouveniritemIndexReducer,
  souvenirReducer: state.souvenir,
  teventReducer: state.event,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { createTSouvenirItem, getAllSouvenir, getEvent }
)(CreateTsouveniritem);
