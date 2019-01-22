import React from 'react'
import moment from 'moment'
import PropTypes from "prop-types"
import {
  Modal, ModalBody, ModalFooter, ModalHeader, Button
} from 'reactstrap'
import { connect } from "react-redux";
import { updateEvent } from "../../../actions/eventAction";

class EditEvent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      formdata : {},
      readOnly : false,
      currentEmployee : '',
      startDate : null,
      endDate : null,
      validate : {
        validateEventName : "form-control",
        validateEventPlace : "form-control",
        validateEventStartDate : "form-control",
        validateEventEndDate : "form-control",
        validateBudget : "form-control",
      },
      regexBudget : /[0-9]+$/
    }
  }

  componentWillReceiveProps(newProps){
    let { currentEvent, statusUpdate, modalStatus } = newProps
    let formdata = {
      _id: currentEvent._id,
      code          : currentEvent.code,
      event_name    : currentEvent.event_name,
      start_date    : currentEvent.start_date,
      end_date      : currentEvent.end_date,
      place         : currentEvent.place,
      budget        : currentEvent.budget,
      request_by    : currentEvent.request_by,
      request_date  : currentEvent.request_date,
      approved_by   : currentEvent.approved_by,
      approved_date : currentEvent.approved_date,
      assign_to     : currentEvent.assign_to,
      closed_date   : currentEvent.closed_date,
      note          : currentEvent.note,
      status        : currentEvent.status,
      reject_reason : currentEvent.reject_reason,
      is_delete     : currentEvent.is_delete,
      created_by    : currentEvent.created_by,
      created_date  : currentEvent.created_date,
      updated_by    : currentEvent.updated_by,
      updated_date  : currentEvent.updated_date
    }
    let { readOnly } = this.state
    let { request_by_first_name, request_by_last_name } = currentEvent
    if( currentEvent.status === "Submitted" ){
      readOnly = false
    }else{
      readOnly = true
    }
    this.setState({
      formdata : formdata,
      readOnly: readOnly,
      currentEmployee : request_by_first_name + " " + request_by_last_name
    })
    if(statusUpdate){
      if(statusUpdate === 200){
        modalStatus(1, `Succes, Event with code ${currentEvent.code} has been updated`)
      }
    }
  }

  changeHandler = (e) => {
    let { formdata, regexBudget, validate } = this.state
    let { name, value, id } = e.target
    formdata[name] = value
    if( name ===  "budget" && regexBudget.test(value) ){
      validate[id] = "form-control is-valid"
    }else if( 
      ( name === "budget" && !regexBudget.test(value) ) ||
      ( value === '' ) ||
      ( ( name === "start_date" || name === "end_date" ) &&
        moment(value) < moment().subtract(1,'days') ) ||
      moment(formdata.end_date) < moment(formdata.start_date)  
     ){
      validate[id] = "form-control is-invalid"
    }else{
      validate[id] = "form-control is-valid"
    }
    this.setState({
      formdata : formdata
    })
  }

  cancelhandler = () => {
    let validate = {
      validateEventName : "form-control",
      validateEventPlace : "form-control",
      validateEventStartDate : "form-control",
      validateEventEndDate : "form-control",
      validateBudget : "form-control",
    }
    this.setState({validate: validate, formdata: this.props.currentEvent})
    this.props.closeModalHandler()
  }
  
  submitHandler = () => {
    let { formdata, regexBudget } = this.state
    let { 
      event_name, place, start_date, end_date, budget 
    } = formdata;
    formdata["updated_by"] = this.props.user.m_employee_id
    formdata["status"] = "1"
    if(event_name === ''){
      alert("Please Type Name!")
    }else if(place === ''){
      alert("Please Type Place!")
    }else if(start_date === ''){
      alert("Please Type Start Date!")
    }else if(moment(start_date) < moment().subtract(1,'days')){
      alert("Date Is Invalid, Date Expired!")
    }else if(end_date === ''){
      alert("Please Type End Date!")
    }else if(moment(end_date) < moment(start_date)){
      alert("Date Is Invalid, Select Date After " 
        + moment(start_date).format("DD/MM/YYYY"))
    }else if(budget === ''){
      alert("Please Type Budget!")
    }else if(!regexBudget.test(budget)){
      alert("Budget Is Invalid!")
    }else{
      this.props.updateEvent(formdata._id, formdata, this.props.user.m_employee_id, this.props.user.m_role_id)
      let validate = {
        validateEventName : "form-control",
        validateEventPlace : "form-control",
        validateEventStartDate : "form-control",
        validateEventEndDate : "form-control",
        validateBudget : "form-control",
      }
      let newFormdata = {
        code : '',
        event_name : '',
        place : '',
        start_date : '',
        end_date : '',
        budget : '',
        request_by : '',
        request_date : '',
        created_by : ''
      }
      this.setState({validate: validate, formdata: newFormdata})
      this.props.closeModalHandler()
    }
  }


  render(){
    return(
      <Modal isOpen={this.props.edit} className="modal-dialog modal-lg border-primary card">
        <ModalHeader className="bg-primary text-white card-header">{" Edit Event - " + this.state.formdata.code }
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
                        value={this.state.formdata.code} 
                        onChange={this.changeHandler} 
                      />
                    </div>
                    <br/><br/>
                    <label htmlFor="validateEventName" className="col-sm-5 col-form-label text-right">* Event Name</label>
                    <div>
                      <input
                        id="validateEventName"
                        type="text" 
                        className={
                          this.state.validate.validateEventName
                        } 
                        placeholder="Type Event Name" 
                        readOnly={this.state.readOnly}
                        name="event_name" 
                        value={this.state.formdata.event_name} 
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
                        className={this.state.validate.validateEventPlace}
                        placeholder="Type Event Place" 
                        name="place" 
                        value={this.state.formdata.place} 
                        onChange={this.changeHandler} 
                        readOnly={this.state.readOnly}
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
                        className={this.state.validate.validateEventStartDate}
                        placeholder="Event Start Date" 
                        name="start_date"
                        value={
                          moment(this.state.formdata.start_date).format("YYYY-MM-DD")
                        }
                        onChange={this.changeHandler}
                        readOnly={this.state.readOnly}
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
                        className={
                          this.state.validate.validateEventEndDate
                        }
                        placeholder="Event End Date"
                        readOnly={this.state.readOnly}
                        name="end_date"
                        value={
                          moment(this.state.formdata.end_date).format("YYYY-MM-DD")
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
                        className={this.state.validate.validateBudget}
                        placeholder="Type Event Budget" 
                        name="budget" 
                        value={this.state.formdata.budget} 
                        onChange={this.changeHandler} 
                        readOnly={this.state.readOnly}
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
                        value={this.state.currentEmployee} 
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
                        value={this.state.formdata.request_date} 
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
                        value={this.state.formdata.note} 
                        onChange={this.changeHandler} 
                        readOnly={this.state.readOnly}
                      />
                    </div>
                    <br/><br/><br/><br/><br/><br/>
                    <label className="col-sm-5 col-form-label text-right">Status</label>
                    <div>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={this.state.formdata.status} 
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
            color="primary"
            disabled={this.state.readOnly}
            onClick ={this.submitHandler}
          >Save</Button>
          <Button 
            color="warning"
            onClick={this.cancelhandler}
          >Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

EditEvent.propTypes = {
  updateEvent: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  event: state.event,
  user: state.auth.user,
  statusUpdate: state.event.statusUpdate
});

export default connect(
  mapStateToProps,{ updateEvent }
  )(EditEvent);