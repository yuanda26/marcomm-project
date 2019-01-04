import React from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap'

class ViewEvent extends React.Component {
  render(){
    return(
      <Modal isOpen={this.props.view} className={this.props.className}>
        <ModalHeader> View Event -
          {" "+this.props.currentEvent.first_name
            +" "+this.props.currentEvent.last_name+" {"+
            this.props.currentEvent.event_number+"}"}
        </ModalHeader>
        <ModalBody >
          <form class="form-inline">
            <div class ="input-group mb-3 input-group-sm">
              <label for="text"> * Event ID Number </label>
              <input 
                type="text" 
                class="form-control" 
                readOnly
                name="code" 
                value={this.props.currentEvent.event_number} 
                onChange={this.changeHandler}
              />
            </div>
          </form>
          <form>
            <div>
              <label for="text"> * Company Name </label>
              <input 
                type="text" 
                class="form-control" 
                placeholder="Type Unit Name" 
                readOnly
                name="name" 
                value={this.props.currentEvent.m_company_name} 
                onChange={this.changeHandler}
              />
            </div>
          </form>
          <form>
            <div>
            <label for="text"> * First Name </label>
            <input 
              type="text" 
              class="form-control" 
              placeholder="email" 
              readOnly
              name="email" 
              value={this.props.currentEvent.first_name} 
              onChange={this.changeHandler}
            />
            </div>
          </form>
          <form>
            <div>
              <label for="text"> Last Name </label>
              <input 
                type="text" 
                class="form-control" 
                placeholder="Last Name" readOnly
                name="last_name" 
                value={this.props.currentEvent.last_name} 
                onChange={this.changeHandler}/>
            </div>
          </form>
          <form>
            <div>
              <label for="text"> Email </label>
              <input 
                type="text" 
                class="form-control" 
                placeholder="Type address" 
                readOnly
                name="address" 
                value={this.props.currentEvent.email} 
                onChange={this.changeHandler}
              />
            </div>
          </form>
          </ModalBody>
        <ModalFooter>
          <Button
            color="danger"
            onClick={this.props.closeModalHandler}
          >Close</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default ViewEvent