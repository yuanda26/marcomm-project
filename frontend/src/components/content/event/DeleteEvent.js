import React from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap'
import PropTypes from "prop-types"
import { connect } from "react-redux";
import { getEvent } from "../../../actions/event/get_all_act";

class DeleteCompany extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      statusDeleted : null
    }
  }

  componentWillReceiveProps(newProps){
    this.setState({
      statusDeleted : newProps.event.statusDeleted,
    })
  }

  deleteHandler = () => {   
    this.props.deleteEvent(this.props.currentEvent._id)
    this.props.closeModalHandler()
  }

  render(){
    if(this.state.statusDeleted == 200){
      this.props.modalStatus(1, 'Deleted',
        'Data Event with Event ID Number',
        " has been deleted!",
        this.props.currentEvent.event_number)
      this.props.closeModalHandler()
    }else if (this.state.statusDeleted == 403){
      this.props.modalStatus(2, 'Failed',
      'Data Event with Event ID Number',
      " has been Relation With User!",
      this.props.currentEvent.event_number)
    }
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
  getEvent: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  event: state.event,
});

export default connect(
  mapStateToProps, { deleteEvent }
  )(DeleteCompany);