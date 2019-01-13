import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
// Form Components
import TextFieldGroup from "../../common/TextFieldGroup";
import TextAreaGroup from "../../common/TextAreaGroup";

class ViewSouvenir extends Component {
  // Function to Get Units Name
  getUnits = code => {
    let name = "";
    if (code !== "") {
      this.props.units.forEach(unit => {
        if (unit.code === code) {
          name = unit.name;
        }
      });
    } else {
      name = code;
    }

    return name;
  };

  render() {
    return (
      <Modal isOpen={this.props.view}>
        <ModalHeader>
          <div className="lead font-weight-bold text-capitalize">
            View Souvenir -{" "}
            {`${this.props.souvenir.name} (${this.props.souvenir.code})`}
          </div>
        </ModalHeader>
        <ModalBody>
          <form>
            <TextFieldGroup
              label="Souvenir Code"
              value={this.props.souvenir.code}
              disabled={true}
            />
            <TextFieldGroup
              label="Souvenir Name"
              value={this.props.souvenir.name}
              disabled={true}
            />
            <TextFieldGroup
              label="Unit Name"
              value={this.getUnits(this.props.souvenir.m_unit_id)}
              disabled={true}
            />
            <TextAreaGroup
              label="Description"
              placeholder="Description"
              rows="3"
              value={this.props.souvenir.description}
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

ViewSouvenir.propTypes = {
  closeModal: PropTypes.func.isRequired,
  souvenir: PropTypes.object.isRequired,
  units: PropTypes.array.isRequired,
  view: PropTypes.bool.isRequired
};

export default ViewSouvenir;
