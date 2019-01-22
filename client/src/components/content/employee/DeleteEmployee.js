import React from 'react'
import PropTypes from "prop-types"

import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button
} from 'reactstrap'

import { connect } from "react-redux";
import { deleteEmployee } from "../../../actions/employeeAction";

class DeleteCompany extends React.Component {
  UNSAFE_componentWillReceiveProps = ( newProps) => {
    if ( newProps.statusDeleted ) {
      if ( newProps.statusDeleted === 200 ){
        newProps.modalStatus(1, "Deleted")
      } else if ( newProps.statusDeleted === 403 ){
        newProps.modalStatus(2, `Failed, Data Employee with Employee ID  ${newProps.currentEmployee.employee_number} has been Relation With User!`)
      }
    }
  }

  deleteHandler = () => {   
    this.props.deleteEmployee(this.props.currentEmployee._id)
    this.props.closeModalHandler()
  }

  render(){
    return(
      <Modal isOpen={this.props.delete} className={this.props.className}>
        <ModalHeader> Delete Company </ModalHeader>
        <ModalBody >
          <p> Delete Data </p>
        </ModalBody>
        <ModalFooter>
        <Button 
          color="primary" 
          onClick={this.deleteHandler}
        >Yes</Button>
        <Button 
          color="danger" 
          onClick={this.props.closeModalHandler}
        >No</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

DeleteCompany.propTypes = {
  deleteEmployee: PropTypes.func.isRequired,
  employee: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  employee: state.employee,
  statusDeleted: state.employee.statusDeleted
});

export default connect(
  mapStateToProps,{ deleteEmployee }
  )(DeleteCompany);