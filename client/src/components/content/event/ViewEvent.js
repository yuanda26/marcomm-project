import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
// Redux Actions
import { connect } from "react-redux";
import {
  approveEvent,
  rejectEvent,
  closeEvent
} from "../../../actions/eventAction";
import { getStaff } from "../../../actions/designAction";
// Form Components
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import TextFieldGroup from "../../common/TextFieldGroup";
import SelectListGroup from "../../common/SelectListGroup";
import TextAreaGroup from "../../common/TextAreaGroup";
import TextArea from "../../common/TextArea";
// Form Validation
import isEmpty from "../../../validation/isEmpty";

class ViewEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      eventId: "",
      assign_to: "",
      reject_reason: "",
      errorAssign: "",
      errorReject: "",
      rejectModal: false
    };
  }

  componentDidMount() {
    this.props.getStaff();
  }

  UNSAFE_componentWillReceiveProps(props, state) {
    this.setState({ 
      eventId: props.currentEvent._id,
      assign_to: props.currentEvent.assign_to
       });
    let { statusApprove, statusReject, statusClose } = props.event
    let { code } = props.currentEvent
    if(statusApprove || statusReject || statusClose ){
      if(statusApprove === 200){
        props.modalStatus(1, `Succes, Event with code ${code} has been Approved`)
      } else if(statusReject === 200){
        props.modalStatus(1, `Succes, Event with code ${code} has been Rejected`)
      } else if(statusClose === 200){
        props.modalStatus(1, `Succes, Event with code ${code} has been Closed`)
      }
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { assign_to, eventId } = this.state;
    const { m_employee_id } = this.props.user;

    if (isEmpty(assign_to)) {
      this.setState({ errorAssign: "This Field is Required!" });
    }

    if (!isEmpty(assign_to)) {
      const approveData = {
        assign_to,
        approved_by: m_employee_id,
        updated_by: m_employee_id
      };

      // Approve Event Request
      this.props.approveEvent(eventId, approveData);
      this.props.closeModalHandler();
    }
  };

  openReject = () => {
    this.setState({ rejectModal: true });
  };

  closeModal = () => {
    this.setState({ rejectModal: false });
  };

  submitReject = e => {
    e.preventDefault();

    const { reject_reason, eventId } = this.state;
    const { m_employee_id } = this.props.user;

    if (isEmpty(reject_reason)) {
      this.setState({ errorReject: "This Field is Required!" });
    }

    if (!isEmpty(reject_reason)) {
      const rejectData = {
        reject_reason,
        updated_by: m_employee_id
      };

      // Reject Event Request
      this.props.rejectEvent(eventId, rejectData);
      this.props.closeModalHandler();
    }
  };

  submitClose = e => {
    e.preventDefault();

    const { eventId } = this.state;
    const { m_employee_id } = this.props.user;
    // Close Event Request
    this.props.closeEvent(eventId, m_employee_id);
    this.props.closeModalHandler();
  };

  render() {
    const {
      event_name,
      code,
      place,
      start_date,
      end_date,
      budget,
      request_by_first_name,
      request_by_last_name,
      request_date,
      note,
      status
    } = this.props.currentEvent;
    const { staff } = this.props.design;

    // Create Assign To Options From Staff
    const options = [{ label: "-Select Employee-", value: "" }];
    staff.forEach(employee =>
      options.push({
        label: employee.first_name + " " + employee.last_name,
        value: employee.employee_number
      })
    );

    return (
      <Fragment>
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
                errors={this.state.errorReject}
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
        <Modal
          isOpen={this.props.view}
          className="modal-dialog modal-lg border-primary card"
        >
          <ModalHeader className="bg-primary text-white card-header">
            View Event - {`${event_name} {${code}}`}
          </ModalHeader>
          <ModalBody className="card-body">
            <form onSubmit={this.onSubmit}>
              <div className="container">
                <div className="row">
                  <div className="col-md-6">
                    <TextFieldGroup
                      label="*Event Id Number"
                      value={code}
                      disabled={true}
                    />
                    <TextFieldGroup
                      label="*Event Name"
                      value={event_name}
                      disabled={true}
                    />
                    <TextFieldGroup
                      label="*Event Place"
                      value={place}
                      disabled={true}
                    />
                    <TextFieldGroup
                      label="*Event Start Date"
                      value={start_date}
                      disabled={true}
                    />
                    <TextFieldGroup
                      label="*Event End Date"
                      value={end_date}
                      disabled={true}
                    />
                    <TextFieldGroup
                      label="*Budget"
                      value={budget}
                      disabled={true}
                    />
                    <SelectListGroup
                      label="*Assign To"
                      name="assign_to"
                      value={this.state.assign_to}
                      onChange={this.onChange}
                      options={options}
                      errors={this.state.errorAssign}
                      disabled={status === "Submitted" ? (false) : (true)}
                    />
                  </div>
                  <div className="col-md-6">
                    <TextFieldGroup
                      label="*Requsted By"
                      value={request_by_first_name + " " + request_by_last_name}
                      disabled={true}
                    />
                    <TextFieldGroup
                      label="*Requsted Date"
                      value={request_date}
                      disabled={true}
                    />
                    <TextAreaGroup label="Note" value={note} disabled={true} />
                    <TextFieldGroup
                      label="Status"
                      value={status}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group text-right">
                {status === "Submitted" && (
                  <Fragment>
                    <button type="submit" className="btn btn-primary mr-1">
                      Approve
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger mr-1"
                      onClick={this.openReject}
                    >
                      Reject
                    </button>
                  </Fragment>
                )}
                {status === "In Progress" && (
                  <button
                    type="button"
                    className="btn btn-primary mr-1"
                    onClick={this.submitClose}
                    disabled = {this.props.user.m_role_id === "RO0006" ? ( false ) : ( true )}
                  >
                    Close Request
                  </button>
                )
              }
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={this.props.closeModalHandler}
                >
                  Cancel
                </button>
              </div>
            </form>
          </ModalBody>
        </Modal>
      </Fragment>
    );
  }
}

ViewEvent.propTypes = {
  user: PropTypes.object.isRequired,
  approveEvent: PropTypes.func.isRequired,
  closeEvent: PropTypes.func.isRequired,
  getStaff: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  design: state.design,
  user: state.auth.user,
  event: state.event
});

export default connect(
  mapStateToProps,
  { approveEvent, rejectEvent, closeEvent, getStaff }
)(ViewEvent);
