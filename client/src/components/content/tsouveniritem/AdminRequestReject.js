import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Input,
  FormGroup
} from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { adminRequestReject } from "../../../actions/tsouveniritemAction";

class RejectRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      reject_reason: "",
      status: ""
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      status: newProps.tsouveniritemReducer.statusRR
    });
  }

  changeHandler = e => {
    this.setState({
      [e.target.name]: e.target.value,
      alertData: {
        status: false,
        message: ""
      }
    });
  };

  rejectHandler = () => {
    const formdata = {
      code: this.props.tsouveniritem.code,
      reject_reason: this.state.reject_reason,
      status: 0
    };
    this.props.adminRequestReject(formdata);
    this.props.closeModalHandler();
  };

  render() {
    return (
      <Modal isOpen={this.props.reject} className={this.props.className}>
        <ModalHeader> Reject Reason </ModalHeader>
        <ModalBody>
          <div>
            <FormGroup>
              <Input
                type="text"
                name="reject_reason"
                placeholder="Input Reject Reason"
                value={this.state.reject_reason}
                onChange={this.changeHandler}
              />
            </FormGroup>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.rejectHandler}>
            Reject
          </Button>
          <Button color="warning" onClick={this.props.closeModalHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

RejectRequest.propTypes = {
  classes: PropTypes.object.isRequired,
  adminRequestReject: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  tsouveniritemviewReducer: state.tsouveniritemIndexReducer,
  tsouveniritemReducer: state.tsouveniritemIndexReducer
});

export default connect(
  mapStateToProps,
  { adminRequestReject }
)(RejectRequest);
