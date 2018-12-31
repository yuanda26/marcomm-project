import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import { connect } from "react-redux";
// Redux Action
import { deleteUnit } from "../../../actions/unitAction";

class DeleteUnit extends Component {
  deleteHandler = () => {
    this.props.deleteUnit(this.props.unit._id);
    this.props.closeModal();
  };

  render() {
    return (
      <Modal isOpen={this.props.delete} className={this.props.className}>
        <ModalHeader>
          Delete Unit <b>{this.props.unit.code}</b>
        </ModalHeader>
        <ModalBody>
          <p>
            Are you sure you want to delete <b>{this.props.unit.name}</b> ?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.deleteHandler}>
            Delete
          </Button>
          <Button color="warning" onClick={this.props.closeModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

DeleteUnit.propTypes = {
  delete: PropTypes.bool.isRequired,
  unit: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  modalStatus: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  units: state.units
});

export default connect(
  mapStateToProps,
  { deleteUnit }
)(DeleteUnit);
