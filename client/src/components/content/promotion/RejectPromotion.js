import React from "react";
import {
  Modal,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Button,
  Alert
} from "reactstrap";
import PropTypes from "prop-types";
import { putPromotion } from "../../../actions/promotionActions";
import { connect } from "react-redux";

class RejectPromotion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reject_reason: "",
      alertData: {
        status: false,
        message: ""
      }
    };
  }
  change = event => {
    this.setState({
      reject_reason: event.target.value
    });
  };
  submit = () => {
    if (this.state.reject_reason === "") {
      this.setState({
        alertData: {
          status: true,
          message: `Please type reject reason!`
        }
      });
    } else {
      this.props.putPromotion(
        {
          marketHeader: {
            title: this.props.marketHeader.title,
            reject_reason: this.state.reject_reason,
            status: 0,
            _id: this.props.marketHeader._id,
            code: this.props.marketHeader.code
          }
        },
        this.props.modalStatus,
        true,
        true,
        true
      );
      this.props.closeHandler();
    }
  };
  render() {
    return (
      <Modal isOpen={this.props.isReject}>
        <ModalHeader>Reject Reason</ModalHeader>
        <ModalBody>
          <div className="col-md-12">
            <textarea
              className="form-control"
              value={this.state.reject_reason}
              onChange={this.change}
            />
          </div>
        </ModalBody>

        <ModalFooter>
          {this.state.alertData.status === true ? (
            <Alert color="danger">
              <strong>{this.state.alertData.message} </strong>
            </Alert>
          ) : (
            ""
          )}
          <Button onClick={this.submit} variant="contained" color="danger">
            Reject
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={this.props.closeHandler}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
RejectPromotion.propTypes = {
  putPromotion: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  ambil: state.promot
});

export default connect(
  mapStateToProps,
  { putPromotion }
)(RejectPromotion);
