import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { connect } from "react-redux";
import { deleteSouvenir } from "../../../actions/souvenirAction";

class DeleteSouvenir extends Component {
  onSubmit = e => {
    e.preventDefault();

    const deleteData = {
      is_delete: true,
      updated_by: this.props.m_employee_id
    };

    // Delete Souvenir from Database
    this.props.deleteSouvenir(this.props.souvenir.code, deleteData);
    this.props.closeModal();
  };

  render() {
    return (
      <Modal isOpen={this.props.delete}>
        <ModalHeader>
          <div className="lead font-weight-bold">Delete Data?</div>
        </ModalHeader>
        <ModalBody>
          <div className="mb-4">
            Are you sure want to Delete{" "}
            <span className="font-weight-bold text-capitalize">
              Souvenir {this.props.souvenir.name}
            </span>
            ?
          </div>
          <form onSubmit={this.onSubmit}>
            <div className="form-group text-right">
              <input
                type="submit"
                className="btn btn-danger mr-1"
                value="Delete"
              />
              <button
                type="button"
                className="btn btn-warning"
                onClick={this.props.closeModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    );
  }
}

DeleteSouvenir.propTypes = {
  deleteSouvenir: PropTypes.func.isRequired,
  delete: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  souvenir: PropTypes.object.isRequired,
  m_employee_id: PropTypes.string.isRequired
};

export default connect(
  null,
  { deleteSouvenir }
)(DeleteSouvenir);
