import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
// Redux Action
import { connect } from "react-redux";
import { deleteUnit } from "../../../actions/unitAction";

class DeleteUnit extends Component {
  deleteHandler = () => {
    this.props.deleteUnit(this.props.unit.code);
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
            Are You Sure You Want to Delete Unit <b>{this.props.unit.name}</b> ?
          </p>
          <div className="form-group text-right">
            <button
              className="btn btn-danger mr-1"
              onClick={this.deleteHandler}
            >
              Delete
            </button>
            <button className="btn btn-warning" onClick={this.props.closeModal}>
              Cancel
            </button>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

DeleteUnit.propTypes = {
  delete: PropTypes.bool.isRequired,
  unit: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  units: state.units
});

export default connect(
  mapStateToProps,
  { deleteUnit }
)(DeleteUnit);
