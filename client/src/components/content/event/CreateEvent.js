import React, { Component } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import { createEvent, eraseStatus } from "../../../actions/eventAction";
import { getEmployeeId } from "../../../actions/employeeAction";
// Form Components
import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaGroup from "../../common/TextAreaGroup";
// Form Validation
import isEmpty from "../../../validation/isEmpty";

class CreateEvent extends Component {
  state = {
    code: "",
    eventName: "",
    eventPlace: "",
    startDate: "",
    endDate: "",
    budget: "",
    errorEventName: "",
    errorEventPlace: "",
    errorStartDate: "",
    errorEndDate: "",
    errorBudget: "",
    currentEmployee: "",
    regexBudget: /[0-9]+$/
  };

  componentDidMount() {
    this.props.getEmployeeId(this.props.user.m_employee_id);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    let { employee, statusCreate, modalStatus, tCode } = newProps;
    if (employee !== null) {
      let fullName = employee.first_name + " " + employee.last_name;
      this.setState({
        currentEmployee: fullName
      });
    }
    if (statusCreate) {
      if (statusCreate === 200) {
        modalStatus(1, `Succes, New Employee with code ${tCode} has been add`);
      }
    }
  }

  changeHandler = e => {
    // Clear Error State Message
    const errors = {};
    if (e.target.name === "eventName") {
      errors.errorEventName = "";
    }
    if (e.target.name === "eventPlace") {
      errors.errorEventPlace = "";
    }
    if (e.target.name === "startDate") {
      errors.errorStartDate = "";
    }
    if (e.target.name === "endDate") {
      errors.errorEndDate = "";
    }
    if (e.target.name === "budget" && e.target.value > 0) {
      errors.errorBudget = "";
    }

    this.setState({ [e.target.name]: e.target.value, ...errors });
  };

  cancelHandler = e => {
    e.preventDefault();

    this.setState({
      eventName: "",
      eventPlace: "",
      startDate: "",
      endDate: "",
      budget: "",
      errorEventName: "",
      errorEventPlace: "",
      errorStartDate: "",
      errorEndDate: "",
      errorBudget: ""
    });
    this.props.closeHandler();
  };

  submitHandler = e => {
    e.preventDefault();

    let {
      regexBudget,
      eventName,
      eventPlace,
      startDate,
      endDate,
      budget
    } = this.state;

    // Set Error Counter
    let errorCounter = 0;
    // Validation
    if (isEmpty(eventName)) {
      errorCounter += 1;
      this.setState({ errorEventName: "This Field is Required!" });
    }
    if (isEmpty(eventPlace)) {
      errorCounter += 1;
      this.setState({ errorEventPlace: "This Field is Required!" });
    }
    if (isEmpty(startDate)) {
      errorCounter += 1;
      this.setState({ errorStartDate: "This Field is Required!" });
    }
    if (isEmpty(endDate)) {
      errorCounter += 1;
      this.setState({ errorEndDate: "This Field is Required!" });
    }
    if (isEmpty(budget)) {
      errorCounter += 1;
      this.setState({ errorBudget: "This Field is Required!" });
    }
    if (!regexBudget.test(budget)) {
      errorCounter += 1;
      this.setState({
        errorBudget: "Budget is invalid! Input positif number only."
      });
    }

    if (errorCounter === 0) {
      const formdata = {
        event_name: eventName,
        place: eventPlace,
        start_date: startDate,
        end_date: endDate,
        budget: budget,
        request_by: this.props.user.m_employee_id,
        request_date: moment().format("DD/MM/YYYY"),
        created_by: this.props.user.m_employee_id,
        created_date: moment().format("DD/MM/YYYY")
      };

      // Save Event to Database
      this.props.createEvent(
        formdata,
        this.props.user.m_employee_id,
        this.props.user.m_role_id
      );

      // Close Modal & Clear Form
      this.props.closeHandler();
      this.setState({
        eventName: "",
        eventPlace: "",
        startDate: "",
        endDate: "",
        budget: "",
        note: ""
      });
    }
  };

  render() {
    return (
      <Modal
        isOpen={this.props.create}
        className="modal-dialog modal-lg border-primary card"
      >
        <ModalHeader className="bg-primary text-white card-header">
          Add Event
        </ModalHeader>
        <ModalBody className="card-body">
          <form onSubmit={this.submitHandler}>
            <div className="row">
              <div className="col-md-6">
                <TextFieldGroup
                  label="*Event Code"
                  placeholder="Auto Generated"
                  name="code"
                  disabled={true}
                  value={this.state.code}
                  onChange={this.changeHandler}
                />
                <TextFieldGroup
                  label="*Event Name"
                  placeholder="Type Event Name"
                  name="eventName"
                  value={this.state.eventName}
                  onChange={this.changeHandler}
                  errors={this.state.errorEventName}
                />
                <TextFieldGroup
                  label="*Event Place"
                  placeholder="Type Event Place"
                  name="eventPlace"
                  value={this.state.eventPlace}
                  onChange={this.changeHandler}
                  errors={this.state.errorEventPlace}
                />
                <TextFieldGroup
                  type="date"
                  label="*Start Date"
                  name="startDate"
                  min={moment().format("YYYY-MM-DD")}
                  value={this.state.startDate}
                  onChange={this.changeHandler}
                  errors={this.state.errorStartDate}
                />
                <TextFieldGroup
                  type="date"
                  label="*End Date"
                  name="endDate"
                  min={this.state.startDate}
                  value={this.state.endDate}
                  onChange={this.changeHandler}
                  errors={this.state.errorEndDate}
                />
                <TextFieldGroup
                  type="number"
                  label="*Type Budget"
                  name="budget"
                  min="0"
                  value={this.state.budget}
                  onChange={this.changeHandler}
                  errors={this.state.errorBudget}
                />
              </div>
              <div className="col-md-6">
                <TextFieldGroup
                  label="*Request By"
                  placeholder="Request By"
                  name="request_by"
                  value={this.state.currentEmployee}
                  disabled={true}
                />
                <TextFieldGroup
                  label="*Request Date"
                  placeholder="Request Date"
                  disabled={true}
                />
                <TextAreaGroup
                  label="Note"
                  placeholder="Type Note"
                  name="note"
                  value={this.state.note}
                  onChange={this.changeHandler}
                />
              </div>
            </div>
            <div className="text-right mt-2">
              <input
                type="submit"
                value="Save"
                className="btn btn-primary mr-2"
              />
              <button className="btn btn-warning" onClick={this.cancelHandler}>
                Cancel
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    );
  }
}

CreateEvent.propTypes = {
  createEvent: PropTypes.func.isRequired,
  getEmployeeId: PropTypes.func.isRequired,
  eraseStatus: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  event: state.event,
  statusCreate: state.event.statusCreate,
  user: state.auth.user,
  employee: state.employee.myEmployeeId,
  tCode: state.event.code
});

export default connect(
  mapStateToProps,
  { createEvent, getEmployeeId, eraseStatus }
)(CreateEvent);
