import React from 'react'
import moment from 'moment'
import PropTypes from "prop-types"
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap'
import { connect } from "react-redux";
import { createEvent, eraseStatus } from "../../../actions/eventAction";
import { getEmployeeId } from "../../../actions/employeeAction";

class CreateEvent extends React.Component{
  constructor (props){
    super(props)
    this.state={
      formdata : {
        code : '',
        event_name : '',
        place : '',
        start_date : '',
        end_date : '',
        budget : '',
        asign_to: '',
        request_by : this.props.user.m_employee_id,
        request_date : moment().format("DD/MM/YYYY"),
        created_by : this.props.user.m_employee_id
      },
      request_date : moment().format("DD/MM/YYYY"),
      status : null,
      startDate : null,
      endDate : null,
      currentEmployee : null,
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

  componentDidMount(){
    this.props.getEmployeeId(this.props.user.m_employee_id)
  }

  componentWillReceiveProps(newProps){
    let { employee, statusCreate, modalStatus, tCode } = newProps
    if( employee !== null ){
      let fullName = employee.first_name + " " + employee.last_name
      this.setState({
        currentEmployee: fullName
      })
    }
    if(statusCreate){
      if(statusCreate === 200){
        modalStatus(1, `Succes, New Employee with code ${tCode} has been add`)
      }
    }
  }

  changeHandler = (e) => {
    let { formdata, regexBudget, validate } = this.state
    let { name, value, id } = e.target
    formdata[name] = value
    if( name === "budget" && regexBudget.test(value) ){
      validate[id] = "form-control is-valid"
    }else if( 
      ( name === "budget" && !regexBudget.test(value) ) ||
      ( value === '' ) ||
      ( ( name === "start_date" || name === "end_date" ) &&
        moment(value) < moment().subtract(1,'days') ) ||
      moment(formdata.end_date) < moment(formdata.start_date )  
     ){
      validate[id] = "form-control is-invalid"
    }else{
      validate[id] = "form-control is-valid"
    }
    this.setState({
      formdata:formdata
    })
  }

  cancelHandler = () => {
    let formdata = {
      code : '',
      event_name : '',
      place : '',
      start_date : '',
      end_date : '',
      budget : '',
      request_by : this.props.user.m_employee_id,
      request_date : moment().format("DD/MM/YYYY"),
      created_by : this.props.user.m_employee_id
    }
    let validate = {
      validateEventName : "form-control",
      validateEventPlace : "form-control",
      validateEventStartDate : "form-control",
      validateEventEndDate : "form-control",
      validateBudget : "form-control",
    }
    this.setState({validate: validate, formdata: formdata})
    this.props.closeHandler()
  }

  submitHandler = () => {
    let { formdata, regexBudget } = this.state
    let {
      event_name, place, start_date, end_date, budget
    } = formdata;

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
      this.props.createEvent(formdata, this.props.user.m_employee_id, this.props.user.m_role_id)
      this.props.closeHandler() 
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
        request_by : this.props.user.m_employee_id,
        request_date : moment().format("DD/MM/YYYY"),
        created_by : this.props.user.m_employee_id,
        note : ''
      }
      this.setState({validate: validate, formdata: newFormdata})       
    }
  }

  render(){
    return(
      <Modal isOpen={this.props.create} className="modal-dialog modal-lg border-primary card">
        <ModalHeader className="bg-primary text-white card-header"> Add Event</ModalHeader>
        <ModalBody className="card-body">
          <div>
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
                        className={this.state.validate.validateEventName} 
                        placeholder="Type Event Name" 
                        name="event_name" 
                        value={this.state.formdata.event_name} 
                        onChange={this.changeHandler} 
                        required 
                      />
                      <div className="valid-feedback">
                        Looks good!
                      </div>
                      <div className="invalid-feedback">
                        Please Type Event Name!
                      </div>
                    </div>
                    <br/><br/>
                    <label htmlFor="validateEventPlace" className="col-sm-5 col-form-label text-right">* Event Place</label>
                    <div className=" float-right">
                      <input
                        id="validateEventPlace"
                        type="text" 
                        className={
                          this.state.validate.validateEventPlace
                        }
                        placeholder="Type Event Place" 
                        name="place" 
                        value={this.state.formdata.place} 
                        onChange={this.changeHandler} 
                        required
                      />
                      <div className="valid-feedback">
                        Looks good!
                      </div>
                      <div className="invalid-feedback">
                        Please Type Event Place!
                      </div>
                    </div>
                    <br/><br/>
                    <label htmlFor="validateEventStartDate" className="col-sm-5 col-form-label text-right">* Event Start Date</label>
                    <div>
                      <input
                        type="date"
                        id="validateEventStartDate"
                        className={this.state.validate.validateEventStartDate}
                        name="start_date"
                        value={this.state.formdata.start_date}
                        onChange={this.changeHandler}
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
                        name="end_date"
                        value={this.state.formdata.end_date}
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
                        placeholder="Type Budget"
                        className={this.state.validate.validateBudget}
                        name="budget" 
                        value={this.state.formdata.budget} 
                        onChange={this.changeHandler} 
                        required
                      />
                      <div className="valid-feedback">
                        Looks good!
                      </div>
                      <div className="invalid-feedback">
                        Please Type Budget!
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
                        value={this.state.request_date} 
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
                        rows="7"
                        value={this.state.formdata.note} 
                        onChange={this.changeHandler} 
                        required
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
            onClick ={this.submitHandler}
          >Save</Button>
          <Button 
            color="warning"
            onClick={this.cancelHandler}
          >Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

CreateEvent.propTypes = {
  createEvent: PropTypes.func.isRequired,
  getEmployeeId: PropTypes.func.isRequired,
  eraseStatus: PropTypes.func.isRequired,
  event: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  event: state.event,
  statusCreate : state.event.statusCreate,
  user: state.auth.user,
  employee: state.employee.myEmployeeId,
  tCode: state.event.code
});

export default connect(
  mapStateToProps,{ createEvent, getEmployeeId, eraseStatus }
  )(CreateEvent);