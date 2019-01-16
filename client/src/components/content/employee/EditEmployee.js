import React from 'react'
import PropTypes from "prop-types"
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap'
import { connect } from "react-redux";
import { updateEmployee, getAllCompany } from "../../../actions/employeeAction";

class EditEmployee extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      formdata: {
        employee_number: '',
        m_company_id:'',
        first_name:'',
        last_name:'',
        email:'',
        created_by: ''
      },
      currentEmployee: null,
      companyname: null,
      first_name : '',
      last_name: '',
      validate : {
        validateFirsname : "form-control", 
        selectedCompany : "form-control",
        validateEmail : "form-control",
        validateCompany : "form-control"
      },
      regexEmail : /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    }
  }

  componentDidMount=()=>{
    this.props.getAllCompany()
  }

  componentWillReceiveProps(newProps){
    let { currentEmployee, statusUpdated, modalStatus } = newProps
    let formdata = {
      employee_number: currentEmployee.employee_number,
      m_company_id: currentEmployee.m_company_id,
      first_name: currentEmployee.first_name,
      last_name: currentEmployee.last_name,
      email: currentEmployee.email,
      created_by: currentEmployee.created_by
    } 
    this.setState({
      formdata : formdata,
      first_name : currentEmployee.first_name,
      last_name : currentEmployee.last_name
    })
    if (statusUpdated) {
      if(statusUpdated === 200){
        modalStatus(1, `Succes, Employee with code ${currentEmployee.employee_number} has been updated`)
      }
    }
  }

  changeHandler = (e) => {
    let { formdata, validate, regexEmail } = this.state
    let { name, value, id } = e.target
    formdata[name] = value
    if( name==="email" && regexEmail.test(value) && value !== '' ){
      validate[id] = "form-control is-valid"
    }else if(
      ( name==="email" && !regexEmail.test(value) && value !== '' ) ||
      ( name==="m_company_id" && value==="" ) ||
      ( name==="first_name" && value==="" ) ||
      ( name==="first_name" && value===" " )
    ){
      validate[id] = "form-control is-invalid"
    }else{
      validate[id] = "form-control is-valid"
    }
    
    this.setState({
      formdata:formdata,
      validate: validate,
    })
  }

  cancelhandler = () => {
    let validate = {
      validateFirsname : "form-control", 
      selectedCompany : "form-control",
      validateEmail : "form-control",
      validateCompany : "form-control"
    }
    let { currentEmployee } = this.props
    this.setState({validate: validate, formdata: currentEmployee})
    this.props.closeModalHandler()
  }
  
  submitHandler = () => {
    let { formdata, regexEmail, companyName } = this.state
    let { email, first_name, m_company_id } = formdata
    formdata["updated_by"] = this.props.user.m_employee_id
    let emailJikaAda = null
    this.props.employee.myEmployee.forEach((ele)=>{
      if( ele.email === email && ele._id !== this.props.currentEmployee._id && ele.email !== ''){
        emailJikaAda = ele.email
      }
      })
    let arrFirstName = first_name.split(" ")
    if( m_company_id === "" ){
      alert( "Select Company!" )
    }else if( first_name === '' ){
      alert( "Type First Name!" )
    }else if( arrFirstName.length > 0 ){
      alert( "Please Type First Name Without Space!" )
    }else if( email === emailJikaAda) {
      alert( "Email Sudah Ada!" )
    }else if( !regexEmail.test(email) && email !== ''){
      alert( "Email Incorrect!" )
    }else{
      this.props.updateEmployee(formdata._id, formdata, companyName)
      let validate = {
        validateFirsname : "form-control", 
        selectedCompany : "form-control",
        validateEmail : "form-control",
        validateCompany : "form-control"
      }
      this.setState({validate: validate})
      this.props.closeModalHandler()
    }
  }


  render(){
    return(
      <Modal isOpen={this.props.edit} className="modal-dialog modal-lg border-primary card">
        <ModalHeader className="bg-primary text-white card-header"> Edit Employee -
          {" "+this.state.first_name
            +" "+this.state.last_name+" {"+
            this.state.formdata.employee_number+"}"}
        </ModalHeader>
        <ModalBody className="card-body">
          <form className="needs-validation">
              <div className="form-group row">
                <label className="col-sm-2 col-form-label text-right">* Emp ID Number</label>
                <div className="col-sm-4">
                  <input
                    type="text" 
                    className="form-control" 
                    placeholder="" 
                    readOnly
                    name="code" 
                    value={this.state.formdata.employee_number} 
                    onChange={this.changeHandler}
                  />
                </div>
                <label htmlFor="validateCompany" className="col-sm-2 col-form-label text-right">* Company Name</label>
                <div className="col-sm-4">
                  <select
                    id="validateCompany"
                    name="m_company_id"
                    className={this.state.validate.validateCompany}
                    onChange={this.changeHandler}
                    defaultValue={this.state.formdata.m_company_id}
                  >
                  <option value="">Select Company...</option>
                    {this.props.employee.myCompany.map((row,x) => {
                      return (
                        <option key={row._id} value={row.code}>{row.name}</option>
                    )})}
                  </select>
                  <div className="valid-feedback">
                    Looks good!
                  </div>
                  <div className="invalid-feedback">
                    Please Select Company!.
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="validateFirsname" className="col-sm-2 col-form-label text-right">* First Name</label>
                <div className="col-sm-4">
                  <input 
                    type="text"
                    id="validateFirsname"
                    className={this.state.validate.validateFirsname} 
                    placeholder="First Name" 
                    name="first_name" 
                    value={this.state.formdata.first_name} 
                    onChange={this.changeHandler} 
                    required 
                  />
                  <div className="valid-feedback">
                    Looks good!
                  </div>
                  <div className="invalid-feedback">
                    Please Type First Name!.
                  </div>
                </div>
                <label htmlFor="validateEmail" className="col-sm-2 col-form-label text-right">Email</label>
                <div className="col-sm-4">
                  <input 
                    id="validateEmail"
                    type="text" 
                    className={this.state.validate.validateEmail} 
                    placeholder="email" 
                    name="email" 
                    value={this.state.formdata.email} 
                    onChange={this.changeHandler} 
                    required
                  />
                  <div className="valid-feedback">
                    Looks good!
                  </div>
                  <div className="invalid-feedback">
                    Email Is Incorrect!.
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-2 col-form-label text-right">Last Name</label>
                <div className="col-sm-4">
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Last Name" 
                    name="last_name" 
                    value={this.state.formdata.last_name} 
                    onChange={this.changeHandler} 
                    required
                  />
                  <div className="valid-feedback">
                    Looks good!
                  </div>
                </div>
              </div>
            </form>
        </ModalBody>
        <ModalFooter>
          <Button 
            color="primary" 
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

EditEmployee.propTypes = {
  updateEmployee: PropTypes.func.isRequired,
  employee: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  employee: state.employee,
  user: state.auth.user,
  statusUpdated: state.employee.statusUpdated
});

export default connect(
  mapStateToProps,{ updateEmployee, getAllCompany }
  )(EditEmployee);