import React, { Component } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import { updateEvent } from "../../../actions/eventAction";
// Form Components
import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaGroup from "../../common/TextAreaGroup";
// Form Validation
import isEmpty from "../../../validation/isEmpty";

class EditEvent extends Component {
  // Initial State
  state = {
    eventId: "",
    code: "",
    eventName: "",
    eventPlace: "",
    startDate: "",
    endDate: "",
    budget: "",
    note: "",
    requestDate: "",
    status: "",
    errorEventName: "",
    errorEventPlace: "",
    errorStartDate: "",
    errorEndDate: "",
    errorBudget: "",
    currentEmployee: "",
    regexBudget: /^[1-9]\d*$/
  };

  UNSAFE_componentWillReceiveProps(props) {
    let { event, statusUpdate, modalStatus } = props;

    // Set readOnly form by Event Status
    let readOnly;
    if (event.status === "Submitted") {
      readOnly = false;
    } else {
      readOnly = true;
    }

    // set state to current event data
    this.setState({
      eventId: event._id,
      code: event.code,
      eventName: event.event_name,
      startDate: event.start_date,
      endDate: event.end_date,
      place: event.place,
      budget: event.budget,
      requestBy: event.request_by,
      requestDate: event.request_date,
      note: event.note,
      status: event.status,
      currentEmployee:
        event.request_by_first_name + " " + event.request_by_last_name,
      readOnly
    });

    if (statusUpdate) {
      if (statusUpdate === 200) {
        modalStatus(
          1,
          `Success, Event with Code ${event.code} Has Been Updated!`
        );
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

  cancelhandler = e => {
    e.preventDefault();

    // Reset State
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
    // Close Edit Event Modal
    this.props.closeHandler();
  };

  submitHandler = e => {
    e.preventDefault();

    // Destructuring Form State
    let {
      regexBudget,
      eventName,
      place,
      startDate,
      endDate,
      budget,
      note
    } = this.state;

    // Initiate Error Counter
    let errorCounter = 0;

    // Form Validation
    if (isEmpty(eventName)) {
      errorCounter += 1;
      this.setState({ errorEventName: "This Field is Required!" });
    }
    if (isEmpty(place)) {
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
    if (!isEmpty(budget) && !regexBudget.test(budget)) {
      errorCounter += 1;
      this.setState({
        errorBudget: "Budget is Invalid! Input Positif Number Only."
      });
    }

    // Final Validation
    if (errorCounter === 0) {
      // Set Updated Event Data
      const updatedEvent = {
        event_name: eventName,
        place: place,
        start_date: startDate,
        end_date: endDate,
        budget: budget,
        note: note,
        updated_by: this.props.user.m_employee_id,
        updated_date: moment().format("DD/MM/YYYY")
      };

      // Update Event to Database
      this.props.updateEvent(
        this.state.eventId,
        updatedEvent,
        this.props.user.m_employee_id,
        this.props.user.m_role_id
      );

      // Reset State After Updating Data
      this.setState({
        eventName: "",
        eventPlace: "",
        startDate: "",
        endDate: "",
        budget: "",
        note: ""
      });
      // Close Edit Event Modal
      this.props.closeHandler();
    }
  };

  render() {
    return (
      <Modal
        isOpen={this.props.edit}
        className="modal-dialog modal-lg border-primary card"
      >
        <ModalHeader className="bg-primary text-white card-header">
          {" Edit Event - " + this.state.code}
        </ModalHeader>
        <ModalBody className="card-body">
          <div className="container">
            <form onSubmit={this.submitHandler}>
              <div className="row">
                <div className="col-md-6">
                  <TextFieldGroup
                    label="*Event Code"
                    value={this.state.code}
                    disabled={true}
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
                    name="place"
                    value={this.state.place}
                    readOnly={this.state.readOnly}
                    onChange={this.changeHandler}
                    errors={this.state.errorEventPlace}
                  />
                  <TextFieldGroup
                    type="date"
                    label="*Event Start Date"
                    name="startDate"
                    value={this.state.startDate}
                    min={moment().format("YYYY-MM-DD")}
                    readOnly={this.state.readOnly}
                    onChange={this.changeHandler}
                    errors={this.state.errorStartDate}
                  />
                  <TextFieldGroup
                    type="date"
                    label="*Event End Date"
                    name="endDate"
                    value={this.state.endDate}
                    min={this.state.startDate}
                    readOnly={this.state.readOnly}
                    onChange={this.changeHandler}
                    errors={this.state.errorEndDate}
                  />
                  <TextFieldGroup
                    type="number"
                    label="*Budget (Rp)"
                    name="budget"
                    value={this.state.budget}
                    readOnly={this.state.readOnly}
                    onChange={this.changeHandler}
                    errors={this.state.errorBudget}
                  />
                </div>
                <div className="col-md-6">
                  <TextFieldGroup
                    label="*Request By"
                    value={this.state.currentEmployee}
                    disabled={true}
                  />
                  <TextFieldGroup
                    label="*Request Date"
                    value={this.state.requestDate}
                    disabled={true}
                  />
                  <TextAreaGroup
                    label="Note"
                    name="note"
                    value={this.state.note}
                    onChange={this.changeHandler}
                    readOnly={this.state.readOnly}
                  />
                  <TextFieldGroup
                    label="Status"
                    value={this.state.status}
                    disabled={true}
                  />
                </div>
              </div>
              <div className="form-group mt-4 text-right">
                {this.props.event.status === "Submitted" && (
                  <input
                    type="submit"
                    className="btn btn-primary mr-1"
                    value="Save"
                  />
                )}
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={this.cancelhandler}
                >
                  cancel
                </button>
              </div>
            </form>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

EditEvent.propTypes = {
  updateEvent: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(
  mapStateToProps,
  { updateEvent }
)(EditEvent);
