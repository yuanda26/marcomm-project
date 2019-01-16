import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
// Form Components
import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaGroup from "../../common/TextAreaGroup";

class ViewUnit extends Component {
  render() {
    const { code, name, description } = this.props.unit;

    return (
      <Modal isOpen={this.props.view}>
        <ModalHeader>View Unit</ModalHeader>
        <ModalBody>
          <form>
            <TextFieldGroup label="*Unit Code" value={code} disabled={true} />
            <TextFieldGroup label="*Unit Name" value={name} disabled={true} />
            <TextAreaGroup
              label="Description"
              rows="3"
              value={description}
              disabled={true}
            />
            <div className="form-group text-right">
              <button
                type="button"
                className="btn btn-warning"
                onClick={this.props.closeModal}
              >
                Close
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    );
  }
}

ViewUnit.propTypes = {
  unit: PropTypes.object.isRequired,
  view: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default ViewUnit;
