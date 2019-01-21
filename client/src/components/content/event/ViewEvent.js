import React from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap'
import moment from 'moment'

class ViewEvent extends React.Component {
  render(){
    return(
      <Modal isOpen={this.props.view} className="modal-dialog modal-lg border-primary card">
        <ModalHeader className="bg-primary text-white card-header"> View Event
        </ModalHeader>
        <ModalBody className="card-body">
          <div className="container">
            <form className="needs-validation">
              <div className="row">
                <div className="col-sm-6">
                  <div className="row">
                    <label className="col-sm-5 col-form-label text-right">* Transac. Code</label>
                    <div>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="" 
                        readOnly
                        name="code" 
                        value={this.props.currentEvent.code} 
                        onChange={this.changeHandler} 
                      />
                    </div>
                    <br/><br/>
                    <label htmlFor="validateEventName" className="col-sm-5 col-form-label text-right">* Event Name</label>
                    <div>
                      <input
                        id="validateEventName"
                        type="text" 
                        className="form-control" 
                        placeholder="Type Event Name" 
                        readOnly
                        name="event_name" 
                        value={this.props.currentEvent.event_name} 
                        onChange={this.changeHandler}
                      />
                      <div className="valid-feedback">
                        Looks good!
                      </div>
                      <div className="invalid-feedback">
                        Please Type Event Name!.
                      </div>
                    </div>
                    <br/><br/>
                    <label htmlFor="validateEventPlace" className="col-sm-5 col-form-label text-right">* Event Place</label>
                    <div className=" float-right">
                      <input
                        id="validateEventPlace"
                        type="text" 
                        className="form-control" 
                        placeholder="Type Event Place" 
                        name="place" 
                        value={this.props.currentEvent.place} 
                        onChange={this.changeHandler} 
                        readOnly
                      />
                      <div className="valid-feedback">
                        Looks good!
                      </div>
                      <div className="invalid-feedback">
                        Please Type Event Place!.
                      </div>
                    </div>
                    <br/><br/>
                    <label htmlFor="validateEventStartDate" className="col-sm-5 col-form-label text-right">* Event Start Date</label>
                    <div>
                      <input
                        type="date"
                        id="validateEventStartDate"
                        className="form-control" 
                        placeholder="Event Start Date" 
                        name="start_date"
                        value={
                          moment(this.props.currentEvent.start_date).format("YYYY-MM-DD")
                        }
                        onChange={this.changeHandler}
                        readOnly
                      />
                      <div className="valid-feedback">
                        Looks good!
                      </div>
                      <div className="invalid-feedback">
                        Please Select Event Start Date!
                      </div>
                    </div>
                    <br/><br/>
                    <label htmlFor="validateEventEndDate" className="col-sm-5 col-form-label text-right">* Event End Date</label>
                    <div>
                      <input
                        type="date"
                        id="validateEventEndDate"
                        className="form-control" 
                        placeholder="Event End Date"
                        readOnly
                        name="end_date"
                        value={
                          moment(this.props.currentEvent.end_date).format("YYYY-MM-DD")
                        }
                        onChange={this.changeHandler}
                      />
                      <div className="valid-feedback">
                        Looks good!
                      </div>
                      <div className="invalid-feedback">
                        Please Select Event End date!
                      </div>
                    </div>
                    <br/><br/>
                    <label htmlFor="validateBudget" className="col-sm-5 col-form-label text-right">* Budget (Rp)</label>
                    <div>
                      <input
                        type="number"
                        id="validateBudget"
                        className="form-control" 
                        placeholder="Type Event Budget" 
                        name="budget" 
                        value={this.props.currentEvent.budget} 
                        onChange={this.changeHandler} 
                        readOnly
                      />
                      <div className="valid-feedback">
                        Looks good!
                      </div>
                      <div className="invalid-feedback">
                        Please Type Budget!.
                      </div>
                    </div>
                  </div>
                  <br/> <br/>
                </div>
                <div className="col-sm-6">
                  <div className="row">
                    <label className="col-sm-5 col-form-label text-right">* Request By</label>
                    <div>
                      <input
                        type="text" 
                        className="form-control" 
                        placeholder="Request By" 
                        name="request_by" 
                        value={this.props.currentEvent.request_by} 
                        onChange={this.changeHandler} 
                        readOnly
                      />
                    </div>
                    <br/><br/>
                    <label className="col-sm-5 col-form-label text-right">* Request Date</label>
                    <div>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Request Date" 
                        name="request_date" 
                        value={this.props.currentEvent.request_date} 
                        onChange={this.changeHandler} 
                        readOnly 
                      />
                    </div>
                    <br/><br/>
                    <label className="col-sm-5 col-form-label text-right">Note</label>
                    <div>
                      <textarea
                        type="text-area" 
                        className="form-control" 
                        placeholder="Type Note" 
                        name="note" 
                        cols="21"
                        rows="5"
                        value={this.props.currentEvent.note} 
                        onChange={this.changeHandler} 
                        readOnly
                      />
                    </div>
                    <br/><br/><br/><br/><br/><br/>
                    <label className="col-sm-5 col-form-label text-right">Status</label>
                    <div>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={this.props.currentEvent.status} 
                        readOnly 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
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