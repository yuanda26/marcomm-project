import React from "react";
import { Modal, ModalFooter, ModalBody, Button } from "reactstrap";

class ModalClosePromotion extends React.Component {
  render() {
    return (
      <Modal isOpen={this.props.isReject}>
        <ModalBody>
          <strong>Close Request?</strong>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={this.props.submit}
            variant="contained"
            color="danger"
          >
            Close
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

export default ModalClosePromotion;
