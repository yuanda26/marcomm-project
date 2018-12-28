import React from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap'
import PropTypes from "prop-types"
import { connect } from "react-redux";
import { getEvent } from "../../../actions/eventAction";

class DeleteCompany extends React.Component {
  deleteHandler = () => {   
    this.props.deleteEvent(this.props.currentEvent._id)
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
  deleteEvent: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  event: state.event,
});

export default connect(
  mapStateToProps, { deleteEvent }
  )(DeleteCompany);